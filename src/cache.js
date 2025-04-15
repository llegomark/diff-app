import { MAX_CACHE_SIZE } from './constants.js';

/**
 * Simple Least Recently Used (LRU) Cache implementation.
 */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    /**
     * Retrieves an item from the cache. Updates its position to most recently used.
     * @param {string} key The key of the item to retrieve.
     * @returns {*} The cached value or undefined if not found.
     */
    get(key) {
        if (!this.cache.has(key)) {
            return undefined;
        }

        const value = this.cache.get(key);
        // Move to end (most recently used)
        this.cache.delete(key);
        this.cache.set(key, value);

        return value;
    }

    /**
     * Adds or updates an item in the cache. Evicts the least recently used item if capacity is exceeded.
     * @param {string} key The key of the item to set.
     * @param {*} value The value to cache.
     */
    set(key, value) {
        // If key exists, delete it first to update its position later
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        // Check capacity before adding new item
        else if (this.cache.size >= this.capacity) {
            // Evict the least recently used item (first item in map iteration)
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        // Add the new item or updated item to the end (most recently used)
        this.cache.set(key, value);
    }
}

// Export a singleton instance of the cache
export const diffCache = new LRUCache(MAX_CACHE_SIZE);