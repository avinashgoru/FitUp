import { mealService } from '../../services/meals.js';
import { mealLogService } from '../../services/meal-logs.js';
import { globalState } from '../../app/app-state.js';
import { router } from '../../app/router.js';

export async function renderMealDetail(slug) {
    const detailShell = document.getElementById('meal-detail-shell');
    detailShell.innerHTML = `
        <div class="meal-detail-container loading-skeleton">
            <div class="meal-detail-hero">
                <h1>Loading Meal...</h1>
            </div>
        </div>
    `;

    try {
        const meal = await mealService.getMealDetail(slug);
        globalState.set('currentMeal', meal);
        renderDetailContent(detailShell, meal);
    } catch (error) {
        detailShell.innerHTML = `
            <div class="meal-detail-container">
                <div class="meal-detail-hero">
                    <h2>Meal not found.</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-outline" onclick="window.history.back()">Go Back</button>
                </div>
            </div>
        `;
    }
}

function renderDetailContent(container, meal) {
    const ingredientsHtml = meal.ingredients.map(ing => `
        <div class="ingredient-item">
            <span class="ingredient-name">${ing.name}</span>
            <span class="ingredient-qty">${ing.quantity} ${ing.unit}</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="meal-detail-container">
            <button class="btn btn-outline" id="btn-back-library" style="margin-bottom: var(--spacing-md)">← Back to Meals</button>
            
            <div class="meal-detail-hero">
                <div class="meal-card-meta">
                    <span class="meal-tag">${meal.mealType}</span>
                    <span class="meal-tag">${meal.dietaryType.replace('_', ' ')}</span>
                    ${meal.goals.map(g => `<span class="meal-tag primary">${g.replace('_', ' ')}</span>`).join('')}
                </div>
                <h1>${meal.name}</h1>
                <p style="color: var(--color-text-light);">${meal.description}</p>
                <p style="color: var(--color-text-light); margin-top: var(--spacing-sm); font-size: var(--text-sm);">Prep Time: ${meal.preparationTimeMinutes} min</p>
            </div>

            <div class="macro-grid">
                <div class="macro-box">
                    <span class="macro-value">${meal.calories}</span>
                    <span class="macro-label">Calories</span>
                </div>
                <div class="macro-box">
                    <span class="macro-value">${meal.protein}g</span>
                    <span class="macro-label">Protein</span>
                </div>
                <div class="macro-box">
                    <span class="macro-value">${meal.carbohydrates}g</span>
                    <span class="macro-label">Carbs</span>
                </div>
                <div class="macro-box">
                    <span class="macro-value">${meal.fats}g</span>
                    <span class="macro-label">Fats</span>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3xl); margin-bottom: var(--spacing-3xl)">
                <div>
                    <h3 class="meal-section-title">Ingredients</h3>
                    <div class="ingredient-list">
                        ${ingredientsHtml}
                    </div>
                </div>
                <div>
                    <h3 class="meal-section-title">Preparation</h3>
                    <div class="meal-instructions">${meal.instructions || 'No instructions provided.'}</div>
                </div>
            </div>

            <div class="meal-logging-card" id="meal-logging-section">
                <h3>Log this Meal</h3>
                <p style="color: var(--color-text-light); margin-bottom: var(--spacing-md)">Track your nutrition to hit your goals.</p>
                <div class="meal-logging-controls">
                    <label for="serving-count">Servings:</label>
                    <input type="number" id="serving-count" value="${meal.servings}" min="0.5" max="10" step="0.5" class="form-input" style="padding: 8px;">
                </div>
                <button class="btn btn-primary" id="btn-log-meal">Log Meal</button>
            </div>
        </div>
    `;

    document.getElementById('btn-back-library').addEventListener('click', () => {
        router.navigate('/app/meals');
    });

    document.getElementById('btn-log-meal').addEventListener('click', async (e) => {
        const btn = e.target;
        const servingInput = document.getElementById('serving-count');
        const servingCount = parseFloat(servingInput.value);

        if (isNaN(servingCount) || servingCount <= 0) {
            alert('Please enter a valid serving amount.');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Logging...';

        try {
            await mealLogService.logMeal(meal.id, servingCount);
            
            const logSection = document.getElementById('meal-logging-section');
            logSection.innerHTML = `
                <h3 style="color: var(--color-primary); margin-bottom: var(--spacing-sm)">Meal Logged Successfully!</h3>
                <p style="color: var(--color-text-light);">You logged ${servingCount} serving(s) of ${meal.name}.</p>
            `;
            
        } catch (err) {
            alert(err.message);
            btn.disabled = false;
            btn.textContent = 'Log Meal';
        }
    });
}
