/**
 * Reusable states UI primitives (Loading, Empty, Error, Success).
 * Intended for use in future data-driven application features.
 */

export function showLoading(containerElement) {
    // Scaffold boundary for loading state
    containerElement.setAttribute('aria-busy', 'true');
    // e.g., containerElement.innerHTML = `<div class="skeleton-loader"></div>`;
}

export function showEmptyState(containerElement, message, actionLabel) {
    // Scaffold boundary for empty state
    // e.g., containerElement.innerHTML = `<div class="empty-state">...</div>`;
}

export function showErrorState(containerElement, message, retryCallback) {
    // Scaffold boundary for error state
}
