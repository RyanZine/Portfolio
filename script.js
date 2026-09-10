/* Portfólio Ryan Zinedine — interações da página.
   Cada bloco checa se o elemento existe: assim, mexer no HTML não derruba o
   resto do arquivo. */

(function () {
    'use strict';

    /* ------------------------------------------------------ menu mobile -- */
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        const fechar = () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', () => {
            const aberto = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('open', aberto);
            menuToggle.setAttribute('aria-expanded', String(aberto));
        });

        // no celular o menu cobre a tela: qualquer link precisa fechá-lo
        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', fechar);
        });

        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && navMenu.classList.contains('active')) {
                fechar();
                menuToggle.focus();
            }
        });

        document.addEventListener('click', (evento) => {
            if (!navMenu.classList.contains('active')) return;
            if (navMenu.contains(evento.target) || menuToggle.contains(evento.target)) return;
            fechar();
        });
    }

    /* ------------------------------------------- seções que aparecem ---- */
    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length) {
        const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // só a partir daqui o CSS pode esconder as seções — assim, se este
        // arquivo não carregar, a página continua legível.
        document.documentElement.classList.add('js');

        if (semAnimacao || !('IntersectionObserver' in window)) {
            reveals.forEach((secao) => secao.classList.add('active'));
        } else {
            const observador = new IntersectionObserver((entradas, obs) => {
                entradas.forEach((entrada) => {
                    if (!entrada.isIntersecting) return;
                    entrada.target.classList.add('active');
                    obs.unobserve(entrada.target); // uma vez visível, fica visível
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

            reveals.forEach((secao) => observador.observe(secao));
        }
    }

    /* --------------------------------------- pílula do topo ao rolar ----- */
    const cabecalho = document.querySelector('.site-header');

    if (cabecalho && 'IntersectionObserver' in window) {
        // uma sentinela invisível no topo evita ficar ouvindo o scroll
        const sentinela = document.createElement('div');
        sentinela.setAttribute('aria-hidden', 'true');
        sentinela.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px';
        document.body.prepend(sentinela);

        new IntersectionObserver(([entrada]) => {
            cabecalho.classList.toggle('rolou', !entrada.isIntersecting);
        }, { threshold: 0 }).observe(sentinela);
    }

    /* ------------------------------- brilho que acompanha o cursor ------- */
    const comHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const semAnimacaoGlobal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (comHover && !semAnimacaoGlobal) {
        document.querySelectorAll('.spot').forEach((cartao) => {
            cartao.addEventListener('pointermove', (evento) => {
                const caixa = cartao.getBoundingClientRect();
                // só propriedades customizadas: o CSS cuida do resto
                cartao.style.setProperty('--mx', ((evento.clientX - caixa.left) / caixa.width * 100) + '%');
                cartao.style.setProperty('--my', ((evento.clientY - caixa.top) / caixa.height * 100) + '%');
            });
        });
    }
})();
