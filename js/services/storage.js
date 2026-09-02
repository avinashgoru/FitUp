/**
 * Storage Boundary
 * Wraps localStorage and sessionStorage to prevent scattered raw access.
 */
export const storage = {
    setLocal(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage is not available', e);
        }
    },
    
    getLocal(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    }
};
