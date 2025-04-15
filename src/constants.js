export const DEBOUNCE_DELAY = 300;
export const MAX_CACHE_SIZE = 100;
export const SIMILARITY_THRESHOLD = 0.8; // 80%

// CSS Classes
export const HIDDEN_CLASS = 'hidden';
export const ADDED_CLASS = 'added';
export const REMOVED_CLASS = 'removed';

// Initial Text (Optional - can be empty strings)
export const INITIAL_TEXT_1 = `Welcome to Diff App!
This tool helps you compare two pieces of text.

Enter your original text in this box (Input 1).
Differences will be highlighted in the result box.
Try changing this text or the text in Input 2.`;

export const INITIAL_TEXT_2 = `Welcome to the Diff App!
This tool helps you compare two pieces of text easily.

Enter your modified text in this box (Input 2).
Choose Characters, Words, or Lines to compare.
The results appear instantly below!`;

// Keywords potentially associated with AI generation (use with caution)
export const AI_KEYWORDS = [
    "Delve", "Harnessing", "At the heart of", "In essence", "Facilitating",
    "Intrinsic", "Integral", "Core", "Facet", "Nuance", "Culmination",
    "Manifestation", "Inherent", "Confluence", "Underlying", "Intricacies",
    "Epitomize", "Embodiment", "Iteration", "Synthesize", "Amplify",
    "Impetus", "Catalyst", "Synergy", "Cohesive", "Paradigm", "Dynamics",
    "Implications", "Prerequisite", "Fusion", "Holistic", "Quintessential",
    "Cohesion", "Symbiosis", "Integration", "Encompass", "Unveil", "Unravel",
    "Emanate", "Illuminate", "Reverberate", "Augment", "Infuse", "Extrapolate",
    "Embody", "Unify", "Inflection", "Instigate", "Embark", "Envisage",
    "Elucidate", "Substantiate", "Resonate", "Catalyze", "Resilience",
    "Evoke", "Pinnacle", "Evolve", "Digital Bazaar", "Tapestry", "Leverage",
    "Centerpiece", "Subtlety", "Immanent", "Exemplify", "Blend",
    "Comprehensive", "Archetypal", "Unity", "Harmony", "Conceptualize",
    "Reinforce", "Mosaic"
];

// Diff types
export const DIFF_TYPES = {
    CHARS: 'diffChars',
    WORDS: 'diffWords',
    LINES: 'diffLines',
};