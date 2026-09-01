export function initYoga() {
    const toggleBtn = document.getElementById('yoga-toggle-btn');
    const hiddenCards = document.querySelectorAll('.yoga-card--hidden');
    
    if (!toggleBtn || !hiddenCards.length) return;
    
    const handleToggle = () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            // Collapse
            hiddenCards.forEach(card => {
                card.classList.remove('reveal', 'reveal--visible');
                card.style.transitionDelay = '';
                card.classList.add('yoga-card--hidden');
            });
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.textContent = 'Check All';
        } else {
            // Expand
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            hiddenCards.forEach((card, index) => {
                card.classList.remove('yoga-card--hidden');
                
                if (!prefersReducedMotion) {
                    card.classList.add('reveal');
                    card.style.transitionDelay = `${index * 50}ms`;
                    
                    // Request animation frame to ensure display:none is removed before triggering transition
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.classList.add('reveal--visible');
                        });
                    });
                }
            });
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.textContent = 'Show Less';
        }
    };
    
    toggleBtn.addEventListener('click', handleToggle);
}
