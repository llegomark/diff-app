function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const result = document.getElementById('result');
const diffTypeRadios = document.getElementsByName('diff_type');
const input1CharCount = document.getElementById('input1CharCount');
const input1WordCount = document.getElementById('input1WordCount');
const input2CharCount = document.getElementById('input2CharCount');
const input2WordCount = document.getElementById('input2WordCount');

const INITIAL_TEXT_1 = `Once upon a time, there was a curious developer named Lina who discovered the power of diff. She learned that diff is a tool that compares two pieces of text and highlights the differences between them.
  
  Lina experimented with different types of diffs. She started with character-level diffs, which compare the text character by character. She noticed that even the slightest change, like adding or removing a single letter, would be detected and highlighted.
  
  Next, Lina explored word-level diffs. This time, diff compared the text word by word. It identified added, removed, or modified words, making it easier to spot meaningful changes in the text.
  
  Lina was amazed by the power and flexibility of diff. She realized that diff is an essential tool for tracking changes, collaborating with others, and maintaining version control. From that day on, Lina embraced diff and used it to enhance her development workflow.
  
  But wait, there's more! Feel free to erase this story and unleash your own creativity. Start typing and let the diff magic begin!`;

const INITIAL_TEXT_2 = `Once upon a time, there was a curious developer named Lina who discovered the magic of diff. She learned that diff is a powerful tool that compares two pieces of text and highlights the differences between them.
  
  Lina experimented with various types of diffs. She began with character-level diffs, which compare the text character by character. She noticed that even the tiniest change, like adding or removing a single letter, would be detected and emphasized.
  
  Next, Lina explored word-level diffs. This time, diff compared the text word by word. It identified added, removed, or modified words, making it easier to spot significant changes in the text.
  
  Lina was fascinated by the power and versatility of diff. She realized that diff is a crucial tool for tracking changes, collaborating with others, and maintaining version control. From that day forward, Lina embraced diff and used it to streamline her development workflow.
  
  But don't just take Lina's word for it! Go ahead and erase this tale, and let your own story unfold. The diff is waiting to highlight your brilliance!`;

function setInitialText() {
    input1.value = INITIAL_TEXT_1;
    input2.value = INITIAL_TEXT_2;
}

const diffCache = new Map();

let diffLibrary = null;

async function loadDiffLibrary() {
    if (!diffLibrary) {
        diffLibrary = await import('diff');
    }
    return diffLibrary;
}

function tokenizeChars(text) {
    return text.split('');
}

function tokenizeWords(text) {
    return text.split(/\s+/);
}

function createBigrams(tokens) {
    const bigrams = new Set();
    for (let i = 0; i < tokens.length - 1; i++) {
        bigrams.add(`${tokens[i]} ${tokens[i + 1]}`);
    }
    return bigrams;
}

function calculateDiceSorensenCoefficient(text1, text2, diffType) {
    let tokens1, tokens2;

    switch (diffType) {
        case 'diffChars':
            tokens1 = tokenizeChars(text1);
            tokens2 = tokenizeChars(text2);
            break;
        case 'diffWords':
            { tokens1 = tokenizeWords(text1);
            tokens2 = tokenizeWords(text2);
            // Only calculate bigrams for word-level comparisons
            const bigrams1 = createBigrams(tokens1);
            const bigrams2 = createBigrams(tokens2);
            const intersection = new Set([...bigrams1].filter(bigram => bigrams2.has(bigram)));
            const union = new Set([...bigrams1, ...bigrams2]);
            return (2 * intersection.size) / union.size; }
        default:
            throw new Error(`Unsupported diff type: ${diffType}`);
    }

    // For character comparisons, directly compare the tokens:
    const intersection = new Set([...tokens1].filter(token => tokens2.includes(token)));
    const union = new Set([...tokens1, ...tokens2]);

    return (2 * intersection.size) / union.size;
}

async function performDiffAsync(input1Value, input2Value, diffType) {
    const { diffChars, diffWords } = await loadDiffLibrary();

    const diffFunctions = {
        diffChars,
        diffWords,
    };

    const diff = diffFunctions[diffType](input1Value, input2Value);

    let diffHTML = '';
    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;

    diff.forEach((part) => {
        if (part.added) {
            addedCount++;
            diffHTML += `<span class="added">${part.value}</span>`;
        } else if (part.removed) {
            removedCount++;
            diffHTML += `<span class="removed">${part.value}</span>`;
        } else {
            unchangedCount++;
            diffHTML += part.value;
        }
    });

    const totalCount = addedCount + removedCount + unchangedCount;
    const similarityPercentage = (calculateDiceSorensenCoefficient(input1Value, input2Value, diffType) * 100).toFixed(2);

    const similarityThreshold = 0.8;

    if (similarityPercentage >= similarityThreshold * 100) {
        diffHTML += `<div class="similarity-message">The texts are highly similar (${similarityPercentage}% similarity) according to the <a href="https://en.wikipedia.org/wiki/Dice-S%C3%B8rensen_coefficient" target="_blank" rel="noopener noreferrer" class="similarity-link">Dice-Sørensen coefficient</a>.</div>`;
    }

    const stats = {
        addedCount,
        removedCount,
        unchangedCount,
        totalCount,
        similarityPercentage: Math.min(similarityPercentage, 100),
    };

    return { diffHTML, stats };
}

function displayDiffResults(diffHTML) {
    result.innerHTML = diffHTML;
}

function updateDiffStats(stats) {
    const { addedCount, removedCount, unchangedCount, totalCount, similarityPercentage } = stats;

    document.getElementById('addedCount').textContent = addedCount;
    document.getElementById('removedCount').textContent = removedCount;
    document.getElementById('unchangedCount').textContent = unchangedCount;
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('similarityPercentage').textContent = `${similarityPercentage}%`;
}

async function performDiff() {
    const diffType = [...diffTypeRadios].find((radio) => radio.checked).value;
    const input1Value = input1.value;
    const input2Value = input2.value;

    const cacheKey = `${diffType}-${input1Value}-${input2Value}`;
    if (diffCache.has(cacheKey)) {
        const { diffHTML, stats } = diffCache.get(cacheKey);
        displayDiffResults(diffHTML);
        updateDiffStats(stats);
        return;
    }

    const { diffHTML, stats } = await performDiffAsync(input1Value, input2Value, diffType);

    diffCache.set(cacheKey, { diffHTML, stats });
    displayDiffResults(diffHTML);
    updateDiffStats(stats);
}

function countChars(text) {
    return text.length;
}

function countWords(text) {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function updateCounts() {
    const counts = [
        { element: input1CharCount, count: countChars(input1.value), singular: 'character' },
        { element: input1WordCount, count: countWords(input1.value), singular: 'word' },
        { element: input2CharCount, count: countChars(input2.value), singular: 'character' },
        { element: input2WordCount, count: countWords(input2.value), singular: 'word' }
    ];

    counts.forEach(({ element, count, singular }) => {
        element.textContent = `${count} ${count === 1 || count === 0 ? singular : singular + 's'}`;
    });
}

const debouncedPerformDiff = debounce(performDiff, 300);
const debouncedUpdateCounts = debounce(updateCounts, 300);

input1.addEventListener('input', () => {
    debouncedPerformDiff();
    debouncedUpdateCounts();
});

input2.addEventListener('input', () => {
    debouncedPerformDiff();
    debouncedUpdateCounts();
});

diffTypeRadios.forEach((radio) =>
    radio.addEventListener('change', debouncedPerformDiff)
);

setInitialText();
performDiff();
updateCounts();