/**
 * DOM Utilities
 * Common helpers for DOM querying and manipulation.
 */

export function select(selector, context = document) {
    return context.querySelector(selector);
}

export function selectAll(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Future event listener wrappers can go here
