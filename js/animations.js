export function initAnimations() {
    // Respect user's motion preferences natively
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const revealElements = document.querySelectorAll('.reveal');
    
    if (!revealElements.length) return;

    const observerOptions = {
        root: null,
        // Trigger reveal when the element is 15% above the bottom of the viewport
        rootMargin: '0px 0px -15% 0px', 
        threshold: 0
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
                // Unobserve after triggering once to avoid continuous looping
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}
