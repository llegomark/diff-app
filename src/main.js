import { debounce } from './utils.js';
import { DEBOUNCE_DELAY } from './constants.js';
// import { diffCache } from './cache.js'; // Cache is used internally by diffProcessor
import { performDiffAsync } from './diffProcessor.js';
import {
    elements,
    setInitialText,
    updateCounts,
    displayDiffResults,
    updateDiffStats,
    showLoading,
    hideLoading,
    handleSwapInputs,
    handleClearInputs,
    getSelectedDiffType,
    updateCopyrightYear // Ensure this is imported
} from './ui.js';


/**
 * Main handler for input changes or diff type selection.
 * Orchestrates fetching inputs, performing diff, and updating UI.
 */
async function handleInputOrTypeChange() {
    // Ensure elements exist before proceeding
    if (!elements.input1 || !elements.input2 || !elements.result) {
        console.error("Core UI elements not found. Aborting diff.");
        return;
    }

    const diffType = getSelectedDiffType();
    const input1Value = elements.input1.value;
    const input2Value = elements.input2.value;

    showLoading();
    displayDiffResults(''); // Clear previous results immediately

    try {
        // Perform the diff calculation (includes caching logic within)
        const { diffHTML, stats, error } = await performDiffAsync(input1Value, input2Value, diffType);

        if (error) {
            // Display error message in the result area
            displayDiffResults(`<span class="text-red-600 font-semibold">Error: ${error}</span>`);
            updateDiffStats(null, error); // Update stats area to reflect error
        } else {
            // Display the results and update stats
            displayDiffResults(diffHTML);
            updateDiffStats(stats);
        }
    } catch (err) {
        // Catch unexpected errors during the async process
        console.error("Unexpected error in handleInputOrTypeChange:", err);
        const errorMsg = 'An unexpected error occurred.';
        displayDiffResults(`<span class="text-red-600 font-semibold">Error: ${errorMsg}</span>`);
        updateDiffStats(null, errorMsg);
    } finally {
        hideLoading(); // Always hide loading indicator
    }
}

// --- Debounced Handlers ---
const debouncedPerformDiff = debounce(handleInputOrTypeChange, DEBOUNCE_DELAY);
const debouncedUpdateCounts = debounce(updateCounts, DEBOUNCE_DELAY);

// --- Event Listeners ---

// Add listeners only if elements exist
if (elements.input1) {
    elements.input1.addEventListener('input', () => {
        debouncedPerformDiff();
        debouncedUpdateCounts();
    });
}

if (elements.input2) {
    elements.input2.addEventListener('input', () => {
        debouncedPerformDiff();
        debouncedUpdateCounts();
    });
}

if (elements.diffTypeRadios) {
    elements.diffTypeRadios.forEach((radio) =>
        radio.addEventListener('change', debouncedPerformDiff)
    );
}

if (elements.swapButton) {
    elements.swapButton.addEventListener('click', () => {
        handleSwapInputs(); // Swap content
        updateCounts(); // Update counts immediately
        handleInputOrTypeChange(); // Trigger diff immediately (no debounce needed for button click)
    });
}

if (elements.clearButton) {
    elements.clearButton.addEventListener('click', () => {
        handleClearInputs(); // Clear content
        updateCounts(); // Update counts immediately
        handleInputOrTypeChange(); // Trigger diff immediately
    });
}


// --- Initial Load ---
function initializeApp() {
    console.log("Initializing Diff App...");
    setInitialText();
    updateCounts(); // Initial count calculation
    updateCopyrightYear(); // Set the correct year on load
    handleInputOrTypeChange(); // Perform initial diff without debounce
    console.log("Diff App Initialized.");
}

// Run initialization when the DOM is ready
if (document.readyState === 'loading') {
    // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // `DOMContentLoaded` has already fired
    initializeApp();
}