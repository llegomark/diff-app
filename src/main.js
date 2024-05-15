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
  
  Finally, Lina tried line-level diffs. This mode compared the text line by line, ignoring minor differences within the lines. It was perfect for comparing larger chunks of text or code.
  
  Lina was amazed by the power and flexibility of diff. She realized that diff is an essential tool for tracking changes, collaborating with others, and maintaining version control. From that day on, Lina embraced diff and used it to enhance her development workflow.
  
  But wait, there's more! Feel free to erase this story and unleash your own creativity. Start typing and let the diff magic begin!`;

const INITIAL_TEXT_2 = `Once upon a time, there was a curious developer named Lina who discovered the magic of diff. She learned that diff is a powerful tool that compares two pieces of text and highlights the differences between them.
  
  Lina experimented with various types of diffs. She began with character-level diffs, which compare the text character by character. She noticed that even the tiniest change, like adding or removing a single letter, would be detected and emphasized.
  
  Next, Lina explored word-level diffs. This time, diff compared the text word by word. It identified added, removed, or modified words, making it easier to spot significant changes in the text.
  
  Lastly, Lina tried line-level diffs. This mode compared the text line by line, ignoring minor differences within the lines. It was perfect for comparing larger chunks of text or code.
  
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

async function performDiff() {
    const diffType = [...diffTypeRadios].find((radio) => radio.checked).value;
    const input1Value = input1.value;
    const input2Value = input2.value;

    const cacheKey = `${diffType}-${input1Value}-${input2Value}`;
    if (diffCache.has(cacheKey)) {
        result.innerHTML = diffCache.get(cacheKey);
        return;
    }

    const { diffChars, diffWords, diffLines } = await loadDiffLibrary();

    const diffFunctions = {
        diffChars,
        diffWords,
        diffLines,
    };

    const diff = diffFunctions[diffType](input1Value, input2Value);

    let diffHTML = '';
    diff.forEach((part) => {
        const className = part.added ? 'added' : part.removed ? 'removed' : '';
        diffHTML += `<span class="${className}">${part.value}</span>`;
    });

    result.innerHTML = diffHTML;

    diffCache.set(cacheKey, diffHTML);
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