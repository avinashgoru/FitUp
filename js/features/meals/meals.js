export function initMeals() {
    const tabs = document.querySelectorAll('.meals__tab');
    if (!tabs.length) return;

    // Meal data structure
    const mealData = {
        'non-vegan': {
            calories: '620 kcal',
            protein: '45g Protein',
            carbs: '60g Carbs'
        },
        'vegan': {
            calories: '480 kcal',
            protein: '35g Protein',
            carbs: '75g Carbs'
        }
    };

    const visual = document.getElementById('meal-image');
    const imageContainer = document.getElementById('meal-image-container');
    const caloriesValue = document.getElementById('meal-calories');
    const proteinValue = document.getElementById('meal-protein');
    const carbsValue = document.getElementById('meal-carbs');

    const updateMealData = (type) => {
        const data = mealData[type];
        if (!data) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Apply transition states
        if (!prefersReducedMotion) {
            imageContainer.classList.add('is-transitioning');
            caloriesValue.classList.add('is-transitioning');
        }

        // Wait for fade out to complete before swapping content
        setTimeout(() => {
            if (visual) {
                if (type === 'vegan') {
                    visual.classList.add('vegan-active');
                } else {
                    visual.classList.remove('vegan-active');
                }
            }
            if (caloriesValue) caloriesValue.textContent = data.calories;
            if (proteinValue) proteinValue.textContent = data.protein;
            if (carbsValue) carbsValue.textContent = data.carbs;

            if (!prefersReducedMotion) {
                // Remove transition states to fade in
                imageContainer.classList.remove('is-transitioning');
                caloriesValue.classList.remove('is-transitioning');
            }
        }, prefersReducedMotion ? 0 : 250);
    };

    const handleTabClick = (e) => {
        const selectedTab = e.currentTarget;
        const type = selectedTab.getAttribute('data-meal');

        // Ignore if already selected
        if (selectedTab.getAttribute('aria-selected') === 'true') {
            return;
        }

        // Update aria-selected states
        tabs.forEach(tab => tab.setAttribute('aria-selected', 'false'));
        selectedTab.setAttribute('aria-selected', 'true');

        // Update data
        updateMealData(type);
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
        
        // Keyboard navigation for tabs
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick(e);
            }
        });
    });
}
