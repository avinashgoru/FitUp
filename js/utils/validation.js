/**
 * Validation Boundary
 * Centralizes rules for Phase 8 authentication and Phase 9 personalization.
 */

export const validators = {
    isRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    isEmail(value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value);
    }
};
