import {
    INITIAL_TEXT_1,
    INITIAL_TEXT_2,
    HIDDEN_CLASS,
    SIMILARITY_THRESHOLD
} from './constants.js';
import { tokenize } from './utils.js';

// --- DOM Element Selection ---
export const elements = {
    input1: document.getElementById('input1'),
    input2: document.getElementById('input2'),
    result: document.getElementById('result'),
    diffTypeRadios: document.getElementsByName('diff_type'),
    input1CharCount: document.getElementById('input1CharCount'),
    input1WordCount: document.getElementById('input1WordCount'),
    input2CharCount: document.getElementById('input2CharCount'),
    input2WordCount: document.getElementById('input2WordCount'),
    addedCount: document.getElementById('addedCount'),
    removedCount: document.getElementById('removedCount'),
    unchangedCount: document.getElementById('unchangedCount'),
    totalCount: document.getElementById('totalCount'),
    similarityPercentage: document.getElementById('similarityPercentage'),
    similarityMessage: document.getElementById('similarityMessage'),
    aiKeywordsMessage1: document.getElementById('aiKeywordsMessage1'),
    aiKeywordsMessage2: document.getElementById('aiKeywordsMessage2'),
    aiKeywords1Element: document.getElementById('aiKeywords1'),
    aiKeywords2Element: document.getElementById('aiKeywords2'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    swapButton: document.getElementById('swapButton'),
    clearButton: document.getElementById('clearButton'),
    currentYear: document.getElementById('currentYear'), // Added for copyright year
};

// --- Initial State & Content ---

/**
 * Sets the initial placeholder text in the input fields if they are empty.
 */
export function setInitialText() {
    if (elements.input1 && elements.input2 && !elements.input1.value && !elements.input2.value) {
         elements.input1.value = INITIAL_TEXT_1;
         elements.input2.value = INITIAL_TEXT_2;
    }
}

/**
 * Updates the copyright year in the footer to the current year.
 */
export function updateCopyrightYear() {
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear().toString();
    }
}

// --- Count Updates ---

/**
 * Counts characters in a string.
 * @param {string} text
 * @returns {number}
 */
function countChars(text) {
    return text ? text.length : 0;
}

/**
 * Counts words in a string using the tokenizer.
 * @param {string} text
 * @returns {number}
 */
function countWords(text) {
    return text ? tokenize(text).length : 0;
}

/**
 * Updates the character and word count displays for both inputs.
 */
export function updateCounts() {
    const counts = [
        { elemChar: elements.input1CharCount, elemWord: elements.input1WordCount, text: elements.input1?.value },
        { elemChar: elements.input2CharCount, elemWord: elements.input2WordCount, text: elements.input2?.value },
    ];

    counts.forEach(({ elemChar, elemWord, text }) => {
        if (!elemChar || !elemWord) return; // Guard against missing elements
        const charCount = countChars(text);
        const wordCount = countWords(text);
        elemChar.textContent = `${charCount} ${charCount === 1 ? 'character' : 'characters'}`;
        elemWord.textContent = `${wordCount} ${wordCount === 1 ? 'word' : 'words'}`;
    });
}

// --- Diff Result Display ---

/**
 * Displays the generated diff HTML in the result panel.
 * Handles potential null element.
 * @param {string} diffHTML HTML string of the diff result.
 */
export function displayDiffResults(diffHTML) {
    if (elements.result) {
        elements.result.innerHTML = diffHTML;
    }
}

/**
 * Updates the statistics display area (counts, similarity, AI keywords).
 * Handles potential null elements.
 * @param {object | null} stats Statistics object from performDiffAsync or null on error.
 * @param {string|null} error Optional error message.
 */
export function updateDiffStats(stats, error = null) {
    // Safely access elements, providing default values if stats object is null/missing keys
    const safeGet = (key, defaultValue) => (stats && stats[key] !== undefined) ? stats[key] : defaultValue;

    const addedCount = safeGet('addedCount', '-');
    const removedCount = safeGet('removedCount', '-');
    const unchangedCount = safeGet('unchangedCount', '-');
    const totalCount = safeGet('totalCount', '-');
    const similarityPercentage = safeGet('similarityPercentage', '-');
    const similarityScore = safeGet('similarityScore', 0);
    const aiKeywords1 = safeGet('aiKeywords1', []);
    const aiKeywords2 = safeGet('aiKeywords2', []);

    if (elements.addedCount) elements.addedCount.textContent = addedCount.toString();
    if (elements.removedCount) elements.removedCount.textContent = removedCount.toString();
    if (elements.unchangedCount) elements.unchangedCount.textContent = unchangedCount.toString();
    if (elements.totalCount) elements.totalCount.textContent = totalCount.toString();
    if (elements.similarityPercentage) elements.similarityPercentage.textContent = `${similarityPercentage}%`;

    // Similarity Message
    if (elements.similarityMessage) {
        if (!error && stats && similarityScore >= SIMILARITY_THRESHOLD) {
            elements.similarityMessage.innerHTML = `Texts are highly similar (${similarityPercentage}%) based on the <a href="https://en.wikipedia.org/wiki/Dice%E2%80%93S%C3%B8rensen_coefficient" target="_blank" rel="noopener noreferrer" class="similarity-link">Dice-Sørensen coefficient</a>.`;
            elements.similarityMessage.classList.remove(HIDDEN_CLASS);
        } else {
            elements.similarityMessage.classList.add(HIDDEN_CLASS);
        }
    }

    // AI Keywords Messages
    updateAIKeywordsDisplay(elements.aiKeywordsMessage1, elements.aiKeywords1Element, aiKeywords1);
    updateAIKeywordsDisplay(elements.aiKeywordsMessage2, elements.aiKeywords2Element, aiKeywords2);

    if (error) {
        console.error("Updating stats UI with error:", error);
    }
}

/**
 * Helper to update the display for AI keywords.
 * Handles potential null elements.
 * @param {HTMLElement | null} messageContainer The container element for the message.
 * @param {HTMLElement | null} keywordsElement The span element to list keywords.
 * @param {string[]} keywords Array of found keywords.
 */
function updateAIKeywordsDisplay(messageContainer, keywordsElement, keywords) {
     if (!messageContainer || !keywordsElement) return; // Guard against missing elements

     if (keywords && keywords.length > 0) {
        keywordsElement.textContent = keywords.join(', ');
        messageContainer.classList.remove(HIDDEN_CLASS);
    } else {
        messageContainer.classList.add(HIDDEN_CLASS);
        keywordsElement.textContent = ''; // Clear content when hidden
    }
}


// --- UI State & Interaction ---

/**
 * Shows the loading indicator. Handles potential null element.
 */
export function showLoading() {
    elements.loadingIndicator?.classList.remove(HIDDEN_CLASS);
}

/**
 * Hides the loading indicator. Handles potential null element.
 */
export function hideLoading() {
    elements.loadingIndicator?.classList.add(HIDDEN_CLASS);
}

/**
 * Swaps the content of the two input textareas.
 * Handles potential null elements.
 * @returns {{input1Value: string, input2Value: string}} The new values after swapping.
 */
export function handleSwapInputs() {
    if (!elements.input1 || !elements.input2) {
        return { input1Value: '', input2Value: '' };
    }
    const temp = elements.input1.value;
    elements.input1.value = elements.input2.value;
    elements.input2.value = temp;
    // Return new values so the main handler can trigger updates
    return { input1Value: elements.input1.value, input2Value: elements.input2.value };
}

/**
 * Clears the content of both input textareas.
 * Handles potential null elements.
 * @returns {{input1Value: string, input2Value: string}} Empty strings.
 */
export function handleClearInputs() {
     if (elements.input1) elements.input1.value = '';
     if (elements.input2) elements.input2.value = '';
     // Return new values so the main handler can trigger updates
    return { input1Value: '', input2Value: '' };
}

/**
 * Gets the currently selected diff type value from radio buttons.
 * Handles potential null elements.
 * @returns {string} The value of the selected diff type radio button ('diffChars', 'diffWords', 'diffLines').
 */
export function getSelectedDiffType() {
    if (!elements.diffTypeRadios) return 'diffWords'; // Default if radios not found

    const checkedRadio = [...elements.diffTypeRadios].find((radio) => radio.checked);
    return checkedRadio ? checkedRadio.value : 'diffWords'; // Default to words if none selected
}