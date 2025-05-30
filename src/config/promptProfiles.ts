// Recommended Prompt
export const RECOMMENDED_PROFILE = {
  structure: {
    questionHeading: "Begin with 'Topic: [user question]' as a top-level heading",
    definition: "Start with a 2–3 line definition of the concept, including what it is, its purpose, and origin/full form if applicable",
    quickPoints: "Follow with a section titled 'Quick Mastery' using 4–6 short bullet points covering essential facts",
    deeperDive: "Add a 'Deeper Understanding' section with a short paragraph explaining mechanisms or connections",
    memoryHook: "Include a final 'Memory Hook' section with a catchy analogy or pop-culture reference",
    visualization: "If applicable, include a Mermaid diagram under '## VISUAL REPRESENTATION'",
  },
  contentGuidelines: {
    clarity: "All points should be concise and crystal clear for exam revision",
    structure: "Information must flow from core understanding to deeper insight",
    visualSupport: "Diagrams must clarify flows, hierarchies, or processes — avoid them if unnecessary",
    culturalReference: "Memory Hook should always use Indian pop culture (e.g., movies, series, or public figures) for relevance",
    avoidFluff: "No filler, long introductions, or redundant definitions"
  },
  tone: {
    toneStyle: "Direct, helpful, and explanatory — like a smart friend tutoring you",
    engagement: "Use informal but precise language, no jargon unless explained",
    retention: "Hook-based memory elements should be sticky and visual"
  },
  strictRules: [
    "Must begin with 'Topic: [question]' heading",
    "Use 'Quick Mastery', 'Deeper Understanding', 'Memory Hook' as labeled sections",
    "Always include a Mermaid diagram for process-based topics",
    "Memory Hook must use only popular Indian cultural references",
    "Avoid academic tone — prioritize clarity and retention",
    "Mermaid diagrams must use triple backticks and square brackets only"
  ]
};

//create quiz prompt
export const CREATE_QUIZ_PROFILE = {
  structure: {
    intro: "Start with a section labeled 'Topic Overview' explaining the importance of the topic in 3-4 lines",
    questionBlock: "For each question, use clear structure: '### Question X', followed by options and explanation",
    options: "Each question must have exactly 4 options labeled A, B, C, D — only one correct",
    answerLabeling: "Label correct option with 'Correct Answer: [Letter]' and add short justification after",
    flow: "Organize questions in increasing order of difficulty from foundational to advanced application"
  },
  contentGuidelines: {
    relevance: "Every question must directly test the user's knowledge of the exact topic — no general questions",
    originality: "Avoid prefabricated or generic MCQs — each must be custom to the topic",
    accuracy: "All content must reflect domain-correct terminology and definitions",
    distractors: "Wrong answers must be plausible enough to challenge real understanding but clearly incorrect upon analysis",
    explanation: "Justify every answer with clear reasoning referencing topic-specific knowledge",
    progression: "Distribute cognitive levels from basic recall to analysis and synthesis across questions"
  },
  formatting: {
    consistency: "Use markdown headers and bold for option labels (e.g., **A.**, **B.**)",
    spacing: "Ensure consistent spacing and line breaks for clean visual separation",
    clarity: "Keep questions and explanations concise, clear, and easy to follow"
  },
  strictRules: [
    "Include 12-20 MCQs depending on topic complexity",
    "Always begin with '## Topic Overview' section",
    "Only ONE correct option per question is allowed",
    "Label correct option clearly and explain reasoning concisely",
    "Ensure questions progress from basic to advanced",
    "Vary question formats (direct, scenario-based, comparative)",
    "Do not use conversational or meta language — stick to quiz content",
    "No reused, generic, or ChatGPT-style trivia — create academically accurate MCQs"
  ]
};

//detailed notes prompt
export const DETAILED_PROFILE = {
  structure: {
    title: "Start with '# 🔍 [Capitalized Topic Name]' as the main title",
    overview: "Begin with '## 📘 Overview' section explaining what the topic is and why it's important",
    definitions: "Use '## 📖 Key Definitions' to introduce all core terminology with bold labels",
    explanation: "Follow with '## 🧠 Deep Explanation' to break down the topic with layered logic and clarity",
    visualization: "If applicable, include a Mermaid diagram under '## VISUAL REPRESENTATION'",
    examples: "Add a '## 🧾 Real-World Examples' section to show applications or analogies",
    references: "End with '## 🔗 References & Sources' if authoritative sources were cited"
  },
  contentGuidelines: {
    depth: "Explain each section thoroughly with university-level clarity and completeness",
    rigor: "Use accurate domain-specific vocabulary and clearly define every technical term",
    diagrams: "Include Mermaid diagrams in the process section when any kind of flow, decision, or hierarchy is involved",
    examples: "Use relevant, high-context real-world or Indian examples to improve retention",
    citations: "Include citations only if directly relevant and impactful — don't cite just to cite"
  },
  formatting: {
    headers: "Use markdown headers (##) for all sections with emojis to help scanning",
    emphasis: "Bold technical terms when first introduced in each section",
    code: "Use fenced blocks (` ``` `) for Mermaid diagrams and any formulas/code snippets",
    clarity: "Use short paragraphs, clear labels, and white space to ensure readability"
  },
  strictRules: [
    "Always start with '# 🔍 [Topic Name]' as the document title",
    "Must include all mandatory sections unless truly inapplicable",
    "Mermaid diagrams must use triple backticks and square brackets for node labels",
    "Do not use AI-speak or first person anywhere in the content",
    "Must maintain academic tone — not casual or compressed",
    "Definitions must be clearly marked with bolded key terms",
    "Ensure progressive depth — from basics to complex layers"
  ]
};
