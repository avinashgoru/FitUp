import { mealService } from '../../services/meals.js';
import { globalState } from '../../app/app-state.js';
import { router } from '../../app/router.js';

export async function renderMealLibrary() {
    const libraryShell = document.getElementById('meal-library-shell');
    libraryShell.innerHTML = `
        <div class="meal-app-container loading-skeleton">
            <div class="meal-header">
                <h2>Loading Meals...</h2>
            </div>
        </div>
    `;

    try {
        const [recommendations, allMeals] = await Promise.all([
            mealService.getRecommendations().catch(() => []), // gracefully handle missing profile
            mealService.getLibrary()
        ]);

        globalState.set('recommendedMeals', recommendations);
        globalState.set('meals', allMeals.data || []);

        renderLibraryContent(libraryShell, recommendations, allMeals.data);
    } catch (error) {
        libraryShell.innerHTML = `
            <div class="meal-app-container">
                <div class="meal-header">
                    <h2>Unable to load meals.</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-outline" onclick="window.location.reload()">Retry</button>
                </div>
            </div>
        `;
    }
}

function renderLibraryContent(container, recommended, all) {
    let recommendedHtml = '';
    
    if (recommended && recommended.length > 0) {
        recommendedHtml = `
            <h3 class="meal-section-title">Recommended For You</h3>
            <p style="color: var(--color-text-light); margin-bottom: var(--spacing-lg)">Matched to your fitness goal and dietary preference.</p>
            <div class="meal-grid">
                ${recommended.map(m => createMealCard(m, true)).join('')}
            </div>
        `;
    }

    const allHtml = `
        <h3 class="meal-section-title">All Meals</h3>
        <div class="meal-grid">
            ${(all || []).map(m => createMealCard(m)).join('')}
        </div>
    `;

    container.innerHTML = `
        <div class="meal-app-container">
            <div class="meal-header">
                <h2>Nutrition & Meals</h2>
                <p>Fuel your body with meals designed for your routine.</p>
            </div>
            ${recommendedHtml}
            ${allHtml}
        </div>
    `;

    // Attach listeners
    container.querySelectorAll('.view-meal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const slug = e.target.dataset.slug;
            router.navigate(`/app/meals/${slug}`);
        });
    });
}

function createMealCard(meal, isRecommended = false) {
    return `
        <div class="meal-card">
            <div class="meal-card-meta">
                ${isRecommended ? '<span class="meal-tag primary">Match</span>' : ''}
                <span class="meal-tag">${meal.mealType}</span>
                <span class="meal-tag">${meal.dietaryType.replace('_', ' ')}</span>
            </div>
            <h3>${meal.name}</h3>
            <p>${meal.description}</p>
            <div class="meal-card-macros">
                <span>${meal.calories} kcal</span>
                <span>${meal.protein}g Protein</span>
                <span>${meal.preparationTimeMinutes} min</span>
            </div>
            <button class="btn btn-outline view-meal-btn" data-slug="${meal.slug}">View Meal</button>
        </div>
    `;
}
