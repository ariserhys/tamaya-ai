import { callGeminiAPI } from "./apiUtils";
import { MCQuestion } from "@/components/MCQTest";
import { createTamayaMCQPrompt } from "./promptUtils";
import { toast } from "@/components/ui/sonner";

/**
 * Quiz difficulty levels for adaptive learning
 */
export enum QuizDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard"
}

/**
 * Question categories for better quiz organization
 */
export enum QuestionCategory {
  RECALL = "recall",           // Basic knowledge recall
  UNDERSTANDING = "understanding", // Testing comprehension
  APPLICATION = "application",     // Applying knowledge
  ANALYSIS = "analysis"           // Analyzing relationships
}

/**
 * Generates fallback MCQ questions for common topics when the API fails
 */
const generateFallbackMCQs = (topic: string): MCQuestion[] => {
  // Default set of questions for DBMS if topic contains database or dbms
  if (topic.toLowerCase().includes('database') || topic.toLowerCase().includes('dbms')) {
    return [
      {
        id: "fallback-question-1",
        question: "What does DBMS stand for?",
        options: [
          "Database Management System",
          "Data Backup and Maintenance System",
          "Distributed Binary Management System",
          "Digital Business Management Software"
        ],
        correctAnswer: 0,
        explanation: "DBMS stands for Database Management System, which is software for creating and managing databases."
      },
      {
        id: "fallback-question-2",
        question: "Which of the following is NOT a type of database model?",
        options: [
          "Relational",
          "Document-oriented",
          "Execution-based",
          "Hierarchical"
        ],
        correctAnswer: 2,
        explanation: "Execution-based is not a database model. The common types include relational, document-oriented, hierarchical, and network models."
      },
      {
        id: "fallback-question-3",
        question: "Which language is most commonly used to query relational databases?",
        options: [
          "XML",
          "SQL",
          "Python",
          "HTML"
        ],
        correctAnswer: 1,
        explanation: "SQL (Structured Query Language) is the standard language for relational database management systems."
      },
      {
        id: "fallback-question-4",
        question: "What is a primary key in a database?",
        options: [
          "The most important table in a database",
          "The password used to access the database",
          "A unique identifier for each record in a table",
          "The first column in any database table"
        ],
        correctAnswer: 2,
        explanation: "A primary key is a unique identifier for each record in a database table."
      },
      {
        id: "fallback-question-5",
        question: "What does ACID refer to in database systems?",
        options: [
          "Automated Column Integration Design",
          "Algorithm for Continuous Input Detection",
          "Atomicity, Consistency, Isolation, Durability",
          "Advanced Computing in Databases"
        ],
        correctAnswer: 2,
        explanation: "ACID refers to Atomicity, Consistency, Isolation, Durability - properties that guarantee reliable processing of database transactions."
      }
    ];
  }

  // Programming fallback questions
  if (topic.toLowerCase().includes('programming') || 
      topic.toLowerCase().includes('coding') || 
      topic.toLowerCase().includes('javascript') || 
      topic.toLowerCase().includes('python')) {
    return [
      {
        id: "prog-question-1",
        question: "Which programming paradigm emphasizes the use of functions and immutable data?",
        options: [
          "Object-oriented programming",
          "Functional programming",
          "Procedural programming",
          "Event-driven programming"
        ],
        correctAnswer: 1,
        explanation: "Functional programming emphasizes the application of functions and avoids changing state and mutable data."
      },
      {
        id: "prog-question-2",
        question: "What is the purpose of version control systems like Git?",
        options: [
          "To compile code into executable programs",
          "To track changes to source code over time",
          "To automatically fix bugs in code",
          "To optimize code for better performance"
        ],
        correctAnswer: 1,
        explanation: "Version control systems like Git track changes to files over time, allowing multiple developers to collaborate and maintain a history of changes."
      },
      {
        id: "prog-question-3",
        question: "What is the main difference between compiled and interpreted languages?",
        options: [
          "Compiled languages are newer than interpreted languages",
          "Interpreted languages execute code directly while compiled languages convert code to machine code first",
          "Compiled languages can only run on specific operating systems",
          "Interpreted languages are always faster than compiled languages"
        ],
        correctAnswer: 1,
        explanation: "Compiled languages translate code to machine code before execution, while interpreted languages execute code line by line without prior translation to machine code."
      },
      {
        id: "prog-question-4",
        question: "What does API stand for in software development?",
        options: [
          "Application Programming Interface",
          "Automated Program Integration",
          "Advanced Programming Implementation",
          "Application Process Interaction"
        ],
        correctAnswer: 0,
        explanation: "API stands for Application Programming Interface, which defines how different software components should interact."
      },
      {
        id: "prog-question-5",
        question: "What is the purpose of a constructor in object-oriented programming?",
        options: [
          "To destroy objects when they are no longer needed",
          "To initialize a newly created object",
          "To convert objects from one type to another",
          "To check if an object is valid"
        ],
        correctAnswer: 1,
        explanation: "Constructors are special methods used to initialize new objects and set their initial state when they are created."
      }
    ];
  }
  
  // Machine Learning fallback questions
  if (topic.toLowerCase().includes('machine learning') || 
      topic.toLowerCase().includes('ml') || 
      topic.toLowerCase().includes('ai') || 
      topic.toLowerCase().includes('artificial intelligence')) {
    return [
      {
        id: "ml-question-1",
        question: "Which of the following is a supervised learning algorithm?",
        options: [
          "K-means clustering",
          "Linear regression",
          "Principal Component Analysis",
          "Autoencoders"
        ],
        correctAnswer: 1,
        explanation: "Linear regression is a supervised learning algorithm that uses labeled data to predict continuous values."
      },
      {
        id: "ml-question-2",
        question: "What is the primary goal of unsupervised learning?",
        options: [
          "To make predictions based on labeled data",
          "To find patterns and structure in unlabeled data",
          "To reward or punish an agent based on actions",
          "To mimic human reasoning exactly"
        ],
        correctAnswer: 1,
        explanation: "Unsupervised learning algorithms aim to discover patterns, groupings, or structures in data without using labeled examples."
      },
      {
        id: "ml-question-3",
        question: "What is overfitting in machine learning?",
        options: [
          "When a model performs well on training data but poorly on new data",
          "When a model is too simple to capture the underlying pattern",
          "When a model needs more training epochs",
          "When a model runs too slowly on large datasets"
        ],
        correctAnswer: 0,
        explanation: "Overfitting occurs when a model learns the training data too well, including its noise and outliers, resulting in poor generalization to new data."
      },
      {
        id: "ml-question-4",
        question: "Which technique is used to reduce the dimensionality of data?",
        options: [
          "Gradient descent",
          "Backpropagation",
          "Principal Component Analysis (PCA)",
          "Cross-validation"
        ],
        correctAnswer: 2,
        explanation: "PCA is a dimensionality reduction technique that transforms data into a new coordinate system where the greatest variance comes from the first coordinate."
      },
      {
        id: "ml-question-5",
        question: "What is the purpose of a loss function in neural networks?",
        options: [
          "To initialize the weights of the network",
          "To measure how well the network is performing",
          "To determine the architecture of the network",
          "To store training examples"
        ],
        correctAnswer: 1,
        explanation: "A loss function quantifies the difference between the predicted output and the actual target values, allowing the network to adjust its weights to improve performance."
      }
    ];
  }
  
  // Generic computer science questions for any other topic
  return [
    {
      id: "generic-question-1",
      question: `What is the main focus of ${topic}?`,
      options: [
        `Understanding the fundamental concepts of ${topic}`,
        `Creating applications related to ${topic}`,
        `Managing resources in ${topic}`,
        `Analyzing data in ${topic}`
      ],
      correctAnswer: 0,
      explanation: `The main focus is typically on understanding the fundamental concepts, which forms the basis for all other activities.`
    },
    {
      id: "generic-question-2",
      question: `Which is NOT commonly associated with ${topic}?`,
      options: [
        "Data processing",
        "Algorithm design",
        "Quantum physics",
        "System architecture"
      ],
      correctAnswer: 2,
      explanation: `Quantum physics is a field of physics and is typically not directly associated with most computer science topics unless specifically studying quantum computing.`
    },
    {
      id: "generic-question-3",
      question: "Which programming paradigm emphasizes the use of functions and immutable data?",
      options: [
        "Object-oriented programming",
        "Functional programming",
        "Procedural programming",
        "Event-driven programming"
      ],
      correctAnswer: 1,
      explanation: "Functional programming emphasizes the application of functions and avoids changing state and mutable data."
    },
    {
      id: "generic-question-4",
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Program Utility",
        "Computing Processor Unit"
      ],
      correctAnswer: 0,
      explanation: "CPU stands for Central Processing Unit, the primary component of a computer that performs most of the processing."
    },
    {
      id: "generic-question-5",
      question: "Which of these is a principle of Object-Oriented Programming?",
      options: [
        "Sequencing",
        "Encapsulation",
        "Normalization",
        "Serialization"
      ],
      correctAnswer: 1,
      explanation: "Encapsulation is one of the four principles of Object-Oriented Programming, along with inheritance, polymorphism, and abstraction."
    }
  ];
};

/**
 * Improved parser for MCQ responses with better error tolerance
 * Handles more variations in response format
 */
export function parseMCQResponse(responseText: string, topic: string): MCQuestion[] {
  console.log("Parsing MCQ response for topic:", topic);
  
  // Try multiple parsing approaches
  const mcqs: MCQuestion[] = [];
  
  // Check if the response has the expected structure
  // Look for topic overview to verify relevance
  const hasTopicOverview = responseText.includes("## TOPIC OVERVIEW") || 
                           responseText.includes("TOPIC OVERVIEW");
  
  if (!hasTopicOverview) {
    console.warn("Response lacks expected topic overview section");
  }
  
  // Extract questions using more reliable pattern matching
  // First, we'll try to split by question markers
  const questionSections = responseText.split(/###\s*Question\s*\d+/i);
  
  // If we have at least one question section (plus the intro section)
  if (questionSections.length > 1) {
    // Skip the first section (usually contains the overview)
    for (let i = 1; i < questionSections.length; i++) {
      const section = questionSections[i].trim();
      try {
        // Parse individual question
        const questionText = extractQuestionText(section);
        const options = extractOptions(section);
        const correctAnswer = extractCorrectAnswer(section);
        const explanation = extractExplanation(section);
        
        // Validate extracted content
        if (questionText && options.length === 4 && correctAnswer && explanation) {
          // Verify topic relevance
          if (isTopicRelevant(questionText, topic)) {
            mcqs.push({
              id: `question-${i}`,
              question: questionText,
              options: options,
              correctAnswer: letterToIndex(correctAnswer), // Convert letter to index
              explanation: explanation,
            });
          } else {
            console.warn(`Question ${i} rejected - not relevant to topic "${topic}"`);
          }
        } else {
          console.warn(`Question ${i} rejected - incomplete question data`);
        }
      } catch (error) {
        console.error(`Error parsing question ${i}:`, error);
      }
    }
  } else {
    // Define helper functions for regex parsing
    const regexMatches = findAllRegexMatches(responseText);
    
    // Deduplicate based on question similarity
    const processedQuestions = new Set<string>();
    
    for (const match of regexMatches) {
      const { question, options, correctAnswer, explanation } = match;
      
      // Skip if we already processed a very similar question
      if (isDuplicate(question, processedQuestions)) continue;
      
      // Verify topic relevance
      if (isTopicRelevant(question, topic)) {
        mcqs.push({
          id: `question-${mcqs.length + 1}`,
          question,
          options,
          correctAnswer: letterToIndex(correctAnswer), // Convert letter to index
          explanation
        });
        
        // Add to processed questions
        processedQuestions.add(question);
      } else {
        console.warn(`Question rejected - not relevant to topic "${topic}"`);
      }
    }
  }

  // Sort by completeness and quality
  mcqs.sort((a, b) => {
    // Questions with all fields properly filled are preferred
    const aQuality = getQuestionQuality(a);
    const bQuality = getQuestionQuality(b);
    return bQuality - aQuality;
  });
  
  console.log(`Successfully parsed ${mcqs.length} MCQs for topic "${topic}"`);
  return mcqs;
}

// Helper functions for the enhanced parser

// Convert letter to index (A->0, B->1, etc.)
function letterToIndex(letter: string): number {
  const letterMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  return letterMap[letter] || 0; // Default to 0 (A) if letter not recognized
}

// Find all regex matches using multiple patterns
function findAllRegexMatches(responseText: string): Array<{question: string, options: string[], correctAnswer: string, explanation: string}> {
  // Prepare content for processing
  const contentToProcess = responseText
    .replace(/(\n[A-D]\.)/g, "\n$1 ") // Ensure space after option letters
    .replace(/\n(?=QUESTION)/g, "\n\n"); // Add extra newline before each QUESTION
  
  // Standard format regex
  const standardMcqRegex = /QUESTION:\s*(.*?)\s*\n+A\.?\s*(.*?)\s*\n+B\.?\s*(.*?)\s*\n+C\.?\s*(.*?)\s*\n+D\.?\s*(.*?)\s*\n+(?:CORRECT|Answer|Correct Answer):\s*([ABCD])\s*\n+(?:EXPLANATION|Explanation):\s*(.*?)(?=\n\n+QUESTION:|$)/gis;
  
  // Alternative numbered questions format
  const numberedMcqRegex = /(?:Question|Q)[\s-]*(\d+)[.):]?\s*(.*?)\s*\n+A\.?\s*(.*?)\s*\n+B\.?\s*(.*?)\s*\n+C\.?\s*(.*?)\s*\n+D\.?\s*(.*?)\s*\n+(?:CORRECT|Answer|Correct Answer):\s*([ABCD])\s*\n+(?:EXPLANATION|Explanation):\s*(.*?)(?=\n\n+(?:Question|Q)|$)/gis;
  
  // Simple format that just uses "Q:" instead of "QUESTION:"
  const simpleMcqRegex = /(?:Q)[\s.):]+?(.*?)\s*\n+A\.?\s*(.*?)\s*\n+B\.?\s*(.*?)\s*\n+C\.?\s*(.*?)\s*\n+D\.?\s*(.*?)\s*\n+(?:CORRECT|Answer|Correct):\s*([ABCD])\s*\n+(?:EXPLANATION|Explanation):\s*(.*?)(?=\n\n+(?:Q)|$)/gis;
  
  // Very simple format that just captures option structure
  const basicMcqRegex = /(.*?)\n+A\.?\s*(.*?)\s*\n+B\.?\s*(.*?)\s*\n+C\.?\s*(.*?)\s*\n+D\.?\s*(.*?)(?:\n+(?:Answer|ANSWER|Correct|CORRECT):\s*([ABCD]))?(?:\n+(?:Explanation|EXPLANATION|Reason|REASON):\s*(.*?))?(?=\n\n|$)/gis;
  
  // Even more flexible format for finding any question-like structure
  const flexibleMcqRegex = /(\d+[.)]?\s*|\b(?:QUESTION|Question)(?:\s*\d+)?:?\s*)(.*?)\s*(?:\n+|\s*\r\n+)(?:A[.)]?\s*|[Oo]ption\s*A[.)]?\s*|\(A\)\s*)(.*?)(?:\n+|\s*\r\n+)(?:B[.)]?\s*|[Oo]ption\s*B[.)]?\s*|\(B\)\s*)(.*?)(?:\n+|\s*\r\n+)(?:C[.)]?\s*|[Oo]ption\s*C[.)]?\s*|\(C\)\s*)(.*?)(?:\n+|\s*\r\n+)(?:D[.)]?\s*|[Oo]ption\s*D[.)]?\s*|\(D\)\s*)(.*?)(?:\n+|\s*\r\n+).*?(?:(?:CORRECT|Answer|Correct)\s*(?:Answer)?:\s*([ABCD]))?(?:\n+|\s*\r\n+)?(?:(?:EXPLANATION|Explanation|Reason):\s*(.*?))?(?=\n\n|\n\s*\d+[.)]|\n\s*QUESTION|\n\s*Question|$)/gis;
  
  // Process each regex pattern and compile results
  const allMatches: Array<{question: string, options: string[], correctAnswer: string, explanation: string}> = [];
  
  // Extract matches from each regex pattern
  const processMatches = (regex: RegExp, processIndexOffset = 0) => {
    const matches = [...contentToProcess.matchAll(regex)];
    for (const match of matches) {
      let question, options, correctAnswerLetter, explanation;
      
      if (match.length >= 8) {
        // Standard format or numbered format
        [, question, ...options] = match;
        correctAnswerLetter = match[6] || 'A';
        explanation = match[7] || 'No explanation provided';
        
        // If the first item might be a question number, handle it
        if (/^\d+$/.test(question) && match.length >= 9) {
          question = match[2] || '';
          options = [match[3], match[4], match[5], match[6]];
          correctAnswerLetter = match[7] || 'A';
          explanation = match[8] || 'No explanation provided';
        }
      } else if (match.length === 7 || match.length === 6) {
        // Basic format with just question and options
        question = match[1];
        options = [match[2], match[3], match[4], match[5]];
        correctAnswerLetter = match[6] || 'A';
        explanation = match[7] || 'No explanation provided';
      } else {
        // Skip unrecognized formats
        continue;
      }
      
      // Clean up data
      question = question ? question.trim() : "";
      options = options.slice(0, 4).map(opt => opt ? opt.trim() : "");
      correctAnswerLetter = correctAnswerLetter ? correctAnswerLetter.trim().toUpperCase() : 'A';
      explanation = explanation ? explanation.trim() : 'No explanation provided';
      
      // Only add complete and valid questions
      if (question && options.length === 4 && options.every(opt => opt.length > 0)) {
        allMatches.push({
          question,
          options,
          correctAnswer: correctAnswerLetter,
          explanation
        });
      }
    }
  };
  
  // Process each regex pattern
  processMatches(standardMcqRegex);
  processMatches(numberedMcqRegex);
  processMatches(simpleMcqRegex);
  processMatches(basicMcqRegex);
  processMatches(flexibleMcqRegex);
  
  return allMatches;
}

function extractQuestionText(section: string): string {
  // The question text is usually the first line or paragraph
  const lines = section.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) return "";
  
  // Extract everything until we hit the options section
  const optionsIndex = lines.findIndex(line => 
    line.includes("**Options:**") || 
    line.match(/options:/i) || 
    line.match(/^\s*-\s*\*\*[A-D]\.\*\*/i)
  );
  
  if (optionsIndex === -1) {
    // If no options marker, take the first paragraph
    return lines[0].replace(/^\s*\*?\*?/g, '').trim();
  }
  
  // Take everything before options as the question
  return lines.slice(0, optionsIndex).join(' ').replace(/^\s*\*?\*?/g, '').trim();
}

function extractOptions(section: string): string[] {
  const options: string[] = [];
  
  // Match options with letter labels (A-D)
  const optionMatches = section.matchAll(/\*\*([A-D])\.\*\*\s*(.*?)(?=\*\*[A-D]\.\*\*|\*\*Correct Answer:|\*\*Explanation:|\n\n|$)/gs);
  
  for (const match of optionMatches) {
    if (match[2]) {
      options.push(match[2].trim());
    }
  }
  
  // If we couldn't find properly formatted options, try alternative format
  if (options.length < 4) {
    const altOptionMatches = section.matchAll(/[A-D]\.\s*(.*?)(?=[A-D]\.|Correct Answer:|Explanation:|\n\n|$)/gs);
    options.length = 0; // Clear the array
    
    for (const match of altOptionMatches) {
      if (match[1]) {
        options.push(match[1].trim());
      }
    }
  }
  
  // Ensure we have exactly 4 options
  while (options.length < 4) {
    options.push(`[Option ${options.length + 1}]`);
  }
  
  return options.slice(0, 4); // Ensure exactly 4 options
}

function extractCorrectAnswer(section: string): string {
  // Look for the correct answer specification
  const correctAnswerMatch = section.match(/\*\*Correct Answer:\*\*\s*([A-D])/i) || 
                             section.match(/Correct Answer:\s*([A-D])/i) ||
                             section.match(/Answer:\s*([A-D])/i);
  
  if (correctAnswerMatch && correctAnswerMatch[1]) {
    return correctAnswerMatch[1];
  }
  
  // If no explicit correct answer found, default to A
  return "A";
}

function extractExplanation(section: string): string {
  // Look for the explanation section
  const explanationMatch = section.match(/\*\*Explanation:\*\*\s*(.*?)(?=###|$)/is) ||
                           section.match(/Explanation:\s*(.*?)(?=###|$)/is);
  
  if (explanationMatch && explanationMatch[1]) {
    return explanationMatch[1].trim();
  }
  
  return "No explanation provided.";
}

function isTopicRelevant(questionText: string, topic: string): boolean {
  // Basic relevance check - the question should mention terms related to the topic
  const topicTerms = topic.toLowerCase().split(/\s+/);
  const questionLower = questionText.toLowerCase();
  
  // Check if any of the topic terms or the entire topic phrase is in the question
  return topicTerms.some(term => term.length > 3 && questionLower.includes(term)) || 
         questionLower.includes(topic.toLowerCase());
}

function isDuplicate(question: string, processedQuestions: Set<string>): boolean {
  // Simple duplicate detection - normalize and check similarity
  const normalized = question.toLowerCase().replace(/\W+/g, ' ').trim();
  
  for (const processed of processedQuestions) {
    const processedNormalized = processed.toLowerCase().replace(/\W+/g, ' ').trim();
    
    // If 70% of words match, consider it a duplicate
    const words1 = normalized.split(' ');
    const words2 = processedNormalized.split(' ');
    
    const commonWords = words1.filter(word => words2.includes(word)).length;
    const similarity = commonWords / Math.max(words1.length, words2.length);
    
    if (similarity > 0.7) {
      return true;
    }
  }
  
  return false;
}

function getQuestionQuality(mcq: MCQuestion): number {
  let score = 0;
  
  // Award points for completeness
  if (mcq.question && mcq.question.length > 10) score += 2;
  if (mcq.options.length === 4) score += 2;
  if (mcq.options.every(opt => opt && opt.length > 3)) score += 2;
  if (mcq.correctAnswer >= 0 && mcq.correctAnswer <= 3) score += 2;
  if (mcq.explanation && mcq.explanation.length > 15) score += 2;
  
  // Award points for quality markers
  if (mcq.question.length > 20) score += 1;
  if (mcq.explanation.length > 30) score += 1;
  
  return score;
}

/**
 * Analyzes quiz performance to recommend topics for further study
 */
export function analyzeQuizPerformance(questions: MCQuestion[], selectedAnswers: number[]): {
  score: number;
  correctCount: number;
  totalCount: number;
  percentage: number;
  weakAreas: string[];
  feedback: string;
} {
  const correctCount = selectedAnswers.reduce((acc, selected, index) => {
    return acc + (selected === questions[index].correctAnswer ? 1 : 0);
  }, 0);
  
  const totalCount = questions.length;
  const percentage = Math.round((correctCount / totalCount) * 100);
  
  // Extract topics from incorrectly answered questions for weak areas
  const weakAreas: string[] = [];
  
  selectedAnswers.forEach((selected, index) => {
    if (selected !== questions[index].correctAnswer) {
      // Try to extract topic from the question
      const questionText = questions[index].question;
      const potentialTopics = extractKeyTopics(questionText);
      
      if (potentialTopics.length > 0) {
        // Add unique topics only
        potentialTopics.forEach(topic => {
          if (!weakAreas.includes(topic)) {
            weakAreas.push(topic);
          }
        });
      }
    }
  });
  
  // Generate feedback based on performance
  let feedback = '';
  if (percentage >= 90) {
    feedback = 'Excellent! You have a strong understanding of this topic.';
  } else if (percentage >= 80) {
    feedback = 'Very good! You have a solid grasp of this material.';
  } else if (percentage >= 70) {
    feedback = 'Good job! Review a few concepts to strengthen your understanding.';
  } else if (percentage >= 60) {
    feedback = 'You\'re making progress. Focus on the areas you missed to improve your score.';
  } else {
    feedback = 'This topic needs more attention. Consider reviewing the core concepts again.';
  }
  
  return {
    score: correctCount,
    correctCount,
    totalCount,
    percentage,
    weakAreas,
    feedback
  };
}

/**
 * Extracts key topics from a question text for learning analysis
 */
function extractKeyTopics(questionText: string): string[] {
  // Simple topic extraction based on capitalized terms and key phrases
  const topics: string[] = [];
  
  // Look for capitalized terms that might be topics
  const capitalizedTerms = questionText.match(/\b[A-Z][a-zA-Z]+\b/g) || [];
  capitalizedTerms.forEach(term => {
    if (term.length > 3 && !['What', 'Which', 'When', 'Where', 'Why', 'How'].includes(term)) {
      topics.push(term);
    }
  });
  
  // Look for technical terms
  const technicalTerms = [
    'algorithm', 'programming', 'database', 'function', 'variable', 'object', 
    'class', 'API', 'SQL', 'HTTP', 'REST', 'framework', 'library', 'method',
    'machine learning', 'artificial intelligence', 'neural network', 'deep learning',
    'data structure', 'encryption', 'network', 'protocol', 'compiler'
  ];
  
  const lowerQuestionText = questionText.toLowerCase();
  technicalTerms.forEach(term => {
    if (lowerQuestionText.includes(term.toLowerCase())) {
      topics.push(term);
    }
  });
  
  return [...new Set(topics)]; // Remove duplicates
}

/**
 * Fetches Tamaya's exam-focused MCQs based on a topic
 */
export const getMCQs = async (
  topic: string, 
  count: number = 10, 
  difficulty: QuizDifficulty = QuizDifficulty.MEDIUM
): Promise<MCQuestion[]> => {
  try {
    const prompt = createTamayaMCQPrompt(topic, count, difficulty);
    
    // Call the Gemini API with the MCQ prompt
    const responseText = await callGeminiAPI(
      prompt,
      "Failed to generate quiz questions"
    );
    
    // Parse the response into MCQ objects
    let questions = parseMCQResponse(responseText, topic);
    
    // If we got fewer than the requested count, try once more with a different prompt
    if (questions.length < 10) {
      console.log(`Only parsed ${questions.length} questions. Attempting to parse more...`);
      
      try {
        // Try an alternative prompt format focusing more on quantity
        const alternativePrompt = `
You are an expert teacher creating a comprehensive quiz about "${topic}".

I need you to create EXACTLY 10 well-formatted multiple-choice questions about "${topic}" at a ${difficulty} difficulty level.

For each question:
1. Include question text that specifically addresses "${topic}"
2. Provide 4 answer options labeled A, B, C, D
3. Clearly indicate which answer is correct
4. Include a brief explanation for the correct answer

Format each question exactly like this:

### Question 1: [question text about ${topic}]
**A.** [option 1]
**B.** [option 2]
**C.** [option 3]
**D.** [option 4]
**Correct Answer:** [A/B/C/D]
**Explanation:** [brief explanation]

### Question 2: [question text]
[and so on...]
`;

        // Call API with alternative prompt
        const alternativeResponse = await callGeminiAPI(
          alternativePrompt,
          "Failed to generate additional quiz questions"
        );
        
        // Parse alternative response
        const additionalQuestions = parseMCQResponse(alternativeResponse, topic);
        
        // Combine questions, avoiding duplicates
        const existingQuestions = new Set(questions.map(q => q.question));
        
        for (const question of additionalQuestions) {
          if (!existingQuestions.has(question.question)) {
            questions.push(question);
            existingQuestions.add(question.question);
          }
        }
      } catch (error) {
        console.error("Failed to get additional questions:", error);
      }
    }
    
    // If we still don't have enough questions, use fallbacks
    if (questions.length < 10) {
      console.log("Using fallback questions");
      const fallbackQuestions = generateFallbackMCQs(topic);
      
      // Combine with any successfully parsed questions
      questions = [...questions, ...fallbackQuestions];
    }
    
    // Ensure we have exactly 10 questions
    questions = questions.slice(0, 10);
    
    // If we still don't have 10 questions, pad with generic ones
    if (questions.length < 10) {
      const genericQuestions = generateFallbackMCQs("general knowledge");
      questions = [...questions, ...genericQuestions.slice(0, 10 - questions.length)];
    }
    
    // Add unique IDs if they're missing
    questions = questions.map((q, i) => ({
      ...q,
      id: q.id || `question-${i + 1}`
    }));
    
    return questions;
  } catch (error) {
    console.error("Error getting MCQs:", error);
    toast.error("Failed to generate quiz questions. Using fallback questions.");
    
    // Return exactly 10 fallback questions
    const fallbackQuestions = generateFallbackMCQs(topic);
    return fallbackQuestions.slice(0, 10);
  }
}; 