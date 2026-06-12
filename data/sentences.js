export const DIFFICULTY_TIERS = {
  easy: {
    label: "Easy",
    color: "#22C55E",
    bg: "#F0FDF4",
    description: "Common sounds, simple rhythm",
  },
  medium: {
    label: "Medium",
    color: "#F5A623",
    bg: "#FFFBF0",
    description: "Mixed consonant clusters, moderate speed",
  },
  hard: {
    label: "Hard",
    color: "#E8622A",
    bg: "#FFF7F4",
    description: "Complex phonemes, tongue twisters",
  },
};

export const SENTENCES = [
  // Easy
  {
    id: "e1",
    tier: "easy",
    text: "She sells seashells by the seashore.",
    focus: "S and SH sounds",
  },
  {
    id: "e2",
    tier: "easy",
    text: "Please place the blue plate on the plain wooden table.",
    focus: "PL blends and vowel contrasts",
  },
  {
    id: "e3",
    tier: "easy",
    text: "The big black bear sat on a brown bench.",
    focus: "B sounds and short vowels",
  },
  {
    id: "e4",
    tier: "easy",
    text: "Can you carry the carefully wrapped carton to the car?",
    focus: "C/K sounds and R",
  },
  {
    id: "e5",
    tier: "easy",
    text: "Five fat frogs float freely on the fresh water.",
    focus: "F sounds and short vowels",
  },

  // Medium
  {
    id: "m1",
    tier: "medium",
    text: "Whether the weather is warm or whether the weather is cold, we'll weather the weather whatever the weather.",
    focus: "W and WH contrast",
  },
  {
    id: "m2",
    tier: "medium",
    text: "Specific statistics are especially tricky to explain precisely.",
    focus: "ST, SP, and -LY endings",
  },
  {
    id: "m3",
    tier: "medium",
    text: "The sixth sick sheik's sixth sheep's sick.",
    focus: "SH, SK, and blended consonants",
  },
  {
    id: "m4",
    tier: "medium",
    text: "Rubber baby buggy bumpers bounce brilliantly.",
    focus: "B and R clusters",
  },
  {
    id: "m5",
    tier: "medium",
    text: "Around the rough and rugged rocks the ragged rascal ran.",
    focus: "R in varied positions",
  },

  // Hard
  {
    id: "h1",
    tier: "hard",
    text: "The thirty-three thieves thought that they thrilled the throne throughout Thursday.",
    focus: "TH voiced and unvoiced",
  },
  {
    id: "h2",
    tier: "hard",
    text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    focus: "W, CH, and vowel length",
  },
  {
    id: "h3",
    tier: "hard",
    text: "Red lorry, yellow lorry; red leather, yellow leather.",
    focus: "L and R distinction, vowel pairs",
  },
  {
    id: "h4",
    tier: "hard",
    text: "The very verbose virtuoso vividly voiced various vivacious verses.",
    focus: "V sounds and multi-syllable stress",
  },
  {
    id: "h5",
    tier: "hard",
    text: "Unique New York, unique New York, you know you need unique New York.",
    focus: "NY and vowel precision",
  },
];
