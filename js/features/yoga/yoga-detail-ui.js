import { router } from '../../app/router.js';
import { yogaService } from '../../services/yoga.js';

export async function renderYogaDetail(slug) {
    const container = document.getElementById('yoga-detail-shell');
    container.innerHTML = `
        <div class="yoga-detail-container">
            <button id="yoga-back-btn" class="btn btn-outline" style="margin-bottom: var(--spacing-lg);">← Back to Library</button>
            <div id="yoga-detail-content">Loading...</div>
        </div>
    `;

    document.getElementById('yoga-back-btn').addEventListener('click', () => {
        router.navigate('/app/yoga');
    });

    try {
        const res = await yogaService.getDetail(slug);
        if (res.status === 'success') {
            renderContent(container.querySelector('#yoga-detail-content'), res.data);
        } else {
            throw new Error('Not found');
        }
    } catch (e) {
        container.querySelector('#yoga-detail-content').innerHTML = `<p style="color:var(--color-error);">Failed to load practice details.</p>`;
    }
}

function renderContent(el, practice) {
    const defaultImg = 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328185/c898683ceb741a858a49065e9617c794.jpg';
    
    let posesHtml = '';
    if (practice.poses && practice.poses.length > 0) {
        posesHtml = practice.poses.map((p, i) => `
            <div class="yoga-sequence-item">
                <div class="yoga-sequence-item__order">${i + 1}</div>
                <div class="yoga-sequence-item__info">
                    <div class="yoga-sequence-item__name">${p.pose.name}</div>
                    <div class="yoga-sequence-item__cue">${p.cue || p.pose.description}</div>
                </div>
                <div class="yoga-sequence-item__duration">${p.durationSeconds}s</div>
            </div>
        `).join('');
    }

    el.innerHTML = `
        <div class="yoga-detail-hero">
            <img class="yoga-detail-hero__img" src="${practice.coverImage || defaultImg}" alt="${practice.name}">
            <div class="yoga-detail-hero__overlay">
                <span class="yoga-app-eyebrow" style="color:white; opacity:0.8;">${practice.style} YOGA</span>
                <h1 class="yoga-detail-hero__title">${practice.name}</h1>
            </div>
        </div>

        <div class="yoga-detail-stats">
            <div class="yoga-detail-stat">
                <span class="yoga-stat-val">${practice.durationMinutes}</span>
                <span class="yoga-stat-lbl">Minutes</span>
            </div>
            <div class="yoga-detail-stat">
                <span class="yoga-stat-val">${practice.level}</span>
                <span class="yoga-stat-lbl">Level</span>
            </div>
            <div class="yoga-detail-stat">
                <span class="yoga-stat-val">${practice.poses ? practice.poses.length : 0}</span>
                <span class="yoga-stat-lbl">Poses</span>
            </div>
        </div>

        <div style="margin-bottom: var(--spacing-3xl);">
            <p style="font-size: var(--text-lg); line-height: 1.6; color: var(--color-text-dark);">
                ${practice.introduction || practice.description}
            </p>
        </div>

        <div style="display:flex; justify-content:center; margin-bottom: var(--spacing-3xl);">
            <button id="start-session-btn" class="btn btn-primary" style="font-size: var(--text-lg); padding: var(--spacing-md) var(--spacing-2xl);">Begin Practice</button>
        </div>

        <h2 style="font-family: var(--font-heading); margin-bottom: var(--spacing-lg);">Sequence Outline</h2>
        <div class="yoga-sequence-list">
            ${posesHtml}
        </div>
    `;

    document.getElementById('start-session-btn').addEventListener('click', () => {
        router.navigate(`/app/yoga/${practice.slug}/session`);
    });
}
