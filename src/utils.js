/**
 * Debounce function: delays invoking a function until after 'wait' milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @returns {Function} The debounced function.
 */
export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Basic text normalization (lowercase, remove punctuation).
 * @param {string} text - Input text.
 * @returns {string} Normalized text.
 */
export function normalizeText(text) {
    if (!text) return '';
    let normalized = text.toLowerCase();
    normalized = normalized.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '); // Keep whitespace, remove punctuation
    return normalized.trim();
}

/**
 * Tokenizes text based on a pattern (default: whitespace).
 * Handles empty strings gracefully.
 * @param {string} text - Input text.
 * @param {RegExp} [pattern=/\s+/] - Pattern to split by.
 * @returns {string[]} Array of tokens.
 */
export function tokenize(text, pattern = /\s+/) {
    const normalizedText = normalizeText(text);
    if (normalizedText === '') {
        return [];
    }
    // Split and filter empty strings that might result from multiple spaces
    return normalizedText.split(pattern).filter(token => token.length > 0);
}