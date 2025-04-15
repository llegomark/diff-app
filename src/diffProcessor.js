import { diffCache } from './cache.js';
import { AI_KEYWORDS, DIFF_TYPES, ADDED_CLASS, REMOVED_CLASS } from './constants.js';
import { normalizeText, tokenize } from './utils.js';

let diffLibrary = null;

/**
 * Asynchronously loads the 'diff' library.
 * @returns {Promise<object|null>} The diff library module or null if loading fails.
 */
async function loadDiffLibrary() {
    if (!diffLibrary) {
        try {
            diffLibrary = await import('diff');
            console.log('Diff library loaded successfully.');
        } catch (error) {
            console.error('Failed to load diff library:', error);
            diffLibrary = null; // Ensure it's null if loading fails
        }
    }
    return diffLibrary;
}

// --- Similarity Calculation (Dice-Sørensen Coefficient) ---

/**
 * Creates a set of bigrams (adjacent token pairs) from a list of tokens.
 * @param {string[]} tokens Array of tokens.
 * @returns {Set<string>} Set of bigram strings.
 */
function createBigrams(tokens) {
    const bigrams = new Set();
    if (!tokens || tokens.length < 2) {
        return bigrams;
    }
    for (let i = 0; i < tokens.length - 1; i++) {
        // Ensure tokens are defined before creating bigram string
        if (tokens[i] !== undefined && tokens[i+1] !== undefined) {
            bigrams.add(`${tokens[i]} ${tokens[i + 1]}`);
        }
    }
    return bigrams;
}

/**
 * Calculates the Dice-Sørensen coefficient between two sets.
 * Formula: (2 * |Intersection|) / (|Set1| + |Set2|)
 * @param {Set<any>} set1 First set.
 * @param {Set<any>} set2 Second set.
 * @returns {number} Similarity score between 0 and 1.
 */
function calculateSetSimilarity(set1, set2) {
    // Ensure inputs are Sets
    if (!(set1 instanceof Set) || !(set2 instanceof Set)) {
        console.warn("calculateSetSimilarity received non-Set arguments");
        return 0.0;
    }
    if (set1.size === 0 && set2.size === 0) return 1.0; // Both empty, identical
    if (set1.size === 0 || set2.size === 0) return 0.0; // One empty, completely different

    const intersection = new Set([...set1].filter(item => set2.has(item)));
    return (2 * intersection.size) / (set1.size + set2.size);
}

/**
 * Calculates text similarity using Dice-Sørensen coefficient based on diff type.
 * For Chars: Uses the set of unique characters.
 * For Words/Lines: Uses word bigrams for better contextual similarity, with a fallback to word sets.
 * @param {string} text1 First text.
 * @param {string} text2 Second text.
 * @param {string} diffType The type of diff ('diffChars', 'diffWords', 'diffLines').
 * @returns {number} Similarity score between 0 and 1.
 */
function calculateSimilarity(text1, text2, diffType) {
    if (text1 === text2) return 1.0; // Identical texts

    const normalized1 = normalizeText(text1);
    const normalized2 = normalizeText(text2);

    if (diffType === DIFF_TYPES.CHARS) {
        // Based on unique characters present
        const charSet1 = new Set(normalized1.split(''));
        const charSet2 = new Set(normalized2.split(''));
        return calculateSetSimilarity(charSet1, charSet2);
    } else { // For Words and Lines, use word bigrams as primary method
        const words1 = tokenize(normalized1);
        const words2 = tokenize(normalized2);
        const bigrams1 = createBigrams(words1);
        const bigrams2 = createBigrams(words2);

        // If no bigrams can be formed (e.g., text has 0 or 1 word), fall back to using sets of individual words
        if (bigrams1.size === 0 && bigrams2.size === 0) {
            // Fallback for very short texts based on word sets
            const wordSet1 = new Set(words1);
            const wordSet2 = new Set(words2);
            // Apply Dice-Sørensen directly on the word sets
            return calculateSetSimilarity(wordSet1, wordSet2); // *** FIXED FALLBACK ***
        }

        // Otherwise, use the bigram similarity
        return calculateSetSimilarity(bigrams1, bigrams2);
    }
}


// --- Diff Calculation ---

/**
 * Calculates the difference between two strings based on the specified type.
 * @param {string} input1Value Text from input 1.
 * @param {string} input2Value Text from input 2.
 * @param {string} diffType Type of diff ('diffChars', 'diffWords', 'diffLines').
 * @param {object} loadedDiffLibrary The loaded 'diff' library module.
 * @returns {Array<object>} Array of diff parts from the library.
 */
async function calculateDiff(input1Value, input2Value, diffType, loadedDiffLibrary) {
    if (!loadedDiffLibrary) {
        throw new Error("Diff library is not loaded.");
    }

    const diffFunctions = {
        [DIFF_TYPES.CHARS]: loadedDiffLibrary.diffChars,
        [DIFF_TYPES.WORDS]: loadedDiffLibrary.diffWordsWithSpace, // Use diffWordsWithSpace to preserve spaces
        [DIFF_TYPES.LINES]: loadedDiffLibrary.diffLines,
    };

    const diffFunction = diffFunctions[diffType];
    if (!diffFunction) {
        throw new Error(`Invalid diff type: ${diffType}`);
    }

    // Add trailing newline for line diff if inputs don't have one, helps diff library
    let text1 = input1Value;
    let text2 = input2Value;
    if (diffType === DIFF_TYPES.LINES) {
       // Ensure inputs are strings before checking endsWith
       text1 = typeof text1 === 'string' ? text1 : '';
       text2 = typeof text2 === 'string' ? text2 : '';
       if (text1 && !text1.endsWith('\n')) text1 += '\n';
       if (text2 && !text2.endsWith('\n')) text2 += '\n';
    }


    return diffFunction(text1, text2);
}

/**
 * Generates HTML representation of the diff parts.
 * @param {Array<object>} diff The array of diff parts.
 * @returns {string} HTML string representing the diff.
 */
function generateDiffHTML(diff) {
    if (!diff) return '';
    let diffHTML = '';
    diff.forEach((part) => {
        // Basic HTML escaping for content
        const value = part.value.replace(/</g, '<').replace(/>/g, '>');
        const tag = part.added ? 'ins' : part.removed ? 'del' : 'span';
        const cssClass = part.added ? ADDED_CLASS : part.removed ? REMOVED_CLASS : '';
        const role = part.added ? 'insertion' : part.removed ? 'deletion' : null; // Use semantic roles

        diffHTML += `<${tag}${cssClass ? ` class="${cssClass}"` : ''}${role ? ` role="${role}"` : ''}>${value}</${tag}>`;
    });
    return diffHTML;
}

/**
 * Calculates statistics (added, removed, unchanged counts) from diff parts.
 * @param {Array<object>} diff Array of diff parts.
 * @returns {{addedCount: number, removedCount: number, unchangedCount: number}} Object with counts.
 */
function calculateDiffStats(diff) {
    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;

    if (diff) {
        diff.forEach((part) => {
            if (part.added) {
                addedCount++;
            } else if (part.removed) {
                removedCount++;
            } else {
                unchangedCount++;
            }
        });
    }

    return { addedCount, removedCount, unchangedCount };
}

// --- AI Keyword Detection ---

/**
 * Detects specific keywords in text (case-insensitive).
 * @param {string} text The text to scan.
 * @returns {string[]} Array of found keywords.
 */
function detectAIText(text) {
    if (!text) return [];
    const lowercaseText = text.toLowerCase();
    // Use a Set for faster lookups if keyword list becomes very large
    // const keywordSet = new Set(AI_KEYWORDS.map(k => k.toLowerCase()));
    return AI_KEYWORDS.filter(keyword => lowercaseText.includes(keyword.toLowerCase()));
}

// --- Main Async Diff Processor ---

/**
 * Performs the entire diff process: calculation, HTML generation, stats, AI check, similarity.
 * Uses caching.
 * @param {string} input1Value Text from input 1.
 * @param {string} input2Value Text from input 2.
 * @param {string} diffType Type of diff.
 * @returns {Promise<{diffHTML: string, stats: object, error?: string}>} Object containing results or an error message.
 */
export async function performDiffAsync(input1Value, input2Value, diffType) {
    const cacheKey = `${diffType}-${input1Value}-${input2Value}`;
    const cachedResult = diffCache.get(cacheKey);

    if (cachedResult) {
        // console.log("Cache hit!");
        return cachedResult;
    }
    // console.log("Cache miss, calculating diff...");

    const loadedDiffLibrary = await loadDiffLibrary();
    if (!loadedDiffLibrary) {
        return { diffHTML: '', stats: {}, error: 'Diff library failed to load.' };
    }

    try {
        const diff = await calculateDiff(input1Value, input2Value, diffType, loadedDiffLibrary);
        const diffHTML = generateDiffHTML(diff);
        const { addedCount, removedCount, unchangedCount } = calculateDiffStats(diff);
        const totalCount = addedCount + removedCount + unchangedCount;

        // Calculate similarity (can be computationally intensive, consider caching separately if needed)
        const similarityScore = calculateSimilarity(input1Value, input2Value, diffType);
        // Round similarity percentage to 1 decimal place for display
        const similarityPercentage = (similarityScore * 100).toFixed(1);

        const aiKeywords1 = detectAIText(input1Value);
        const aiKeywords2 = detectAIText(input2Value);

        const stats = {
            addedCount,
            removedCount,
            unchangedCount,
            totalCount,
            // Ensure percentage doesn't exceed 100 due to potential floating point nuances
            similarityPercentage: Math.min(parseFloat(similarityPercentage), 100),
            similarityScore, // Raw score 0-1, useful internally or for thresholds
            aiKeywords1,
            aiKeywords2,
        };

        const result = { diffHTML, stats };
        diffCache.set(cacheKey, result); // Cache the successful result
        return result;

    } catch (error) {
        console.error("Error during diff calculation:", error);
        // Return a structured error object
        return { diffHTML: '', stats: {}, error: `Error performing diff: ${error.message}` };
    }
}