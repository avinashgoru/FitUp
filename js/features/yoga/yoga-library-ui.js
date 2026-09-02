import { router } from '../../app/router.js';
import { yogaService } from '../../services/yoga.js';
import { StateStore } from '../../state/store.js';

export async function renderYogaLibrary() {
    const container = document.getElementById('yoga-library-shell');
    container.innerHTML = `
        <div class="yoga-app-container">
            <header class="yoga-app-header">
                <span class="yoga-app-eyebrow">Find Your Flow</span>
                <h1 class="yoga-app-title">Yoga & Mobility</h1>
                <p class="yoga-app-desc">Restore balance, build stability, and connect with your breath through guided practices.</p>
            </header>
            
            <div id="yoga-recommended-section" style="display:none;">
                <h2 style="font-family: var(--font-heading); margin-bottom: var(--spacing-lg);">Recommended for You</h2>
                <div id="yoga-recommended-grid" class="yoga-library-grid"></div>
            </div>

            <h2 style="font-family: var(--font-heading); margin-bottom: var(--spacing-lg);">All Practices</h2>
            <div id="yoga-all-grid" class="yoga-library-grid"></div>
        </div>
    `;

    try {
        const [recommendedRes, allRes] = await Promise.all([
            yogaService.getRecommended(),
            yogaService.getLibrary()
        ]);

        if (recommendedRes.status === 'success' && recommendedRes.data.length > 0) {
            document.getElementById('yoga-recommended-section').style.display = 'block';
            document.getElementById('yoga-recommended-grid').innerHTML = recommendedRes.data.map(p => createPracticeCard(p, true)).join('');
        }

        if (allRes.status === 'success') {
            document.getElementById('yoga-all-grid').innerHTML = allRes.data.map(p => createPracticeCard(p)).join('');
        }
        
        attachCardListeners(container);
    } catch (e) {
        console.error('Failed to load yoga library', e);
        container.innerHTML += `<p style="color:var(--color-error); text-align:center;">Failed to load library. Please try again later.</p>`;
    }
}

function createPracticeCard(practice, isRecommended = false) {
    const defaultImg = 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328185/c898683ceb741a858a49065e9617c794.jpg';
    return `
        <div class="yoga-library-card" data-slug="${practice.slug}" role="button" tabindex="0">
            <div class="yoga-library-card__image-container">
                <img src="${practice.coverImage || defaultImg}" alt="${practice.name}" style="width: 100%; height: 100%; object-fit: cover;">
                ${isRecommended ? `<div style="position:absolute; top:8px; right:8px; background:var(--color-primary); color:white; padding:4px 8px; border-radius:4px; font-size:10px; font-weight:bold; text-transform:uppercase;">Match</div>` : ''}
            </div>
            <div class="yoga-library-card__content">
                <div class="yoga-card-meta">
                    <span class="yoga-tag">${practice.level}</span>
                    <span class="yoga-tag">${practice.durationMinutes} MIN</span>
                </div>
                <h3 class="yoga-library-card__title">${practice.name}</h3>
                <p class="yoga-library-card__desc">${practice.description}</p>
            </div>
        </div>
    `;
}

function attachCardListeners(container) {
    const cards = container.querySelectorAll('.yoga-library-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            router.navigate(`/app/yoga/${card.dataset.slug}`);
        });
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') router.navigate(`/app/yoga/${card.dataset.slug}`);
        });
    });
}
