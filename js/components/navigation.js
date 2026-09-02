export function initNavigation() {
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.getElementById('mobile-navigation');
    const links = document.querySelectorAll('.navbar__link');

    if (!toggle || !menu) return;

    const closeMenu = () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('data-state', 'closed');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        toggle.setAttribute('aria-expanded', 'true');
        menu.setAttribute('data-state', 'open');
        document.body.style.overflow = 'hidden';
    };

    const toggleMenu = () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    // Toggle button click
    toggle.addEventListener('click', toggleMenu);

    // Link clicks close menu
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            toggle.focus();
        }
    });

    // Handle resize - close menu if resizing to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767 && toggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        }
    });
}
