import { callGeminiAPI, addMathFormatting } from "./apiUtils";
import { Concept } from "@/types/concept";
import { 
  createTamayaRecommendedPrompt, 
  createTamayaDetailedNotesPrompt,
  createTamayaMCQPrompt
} from "./promptUtils";

export interface EnhancedResponse {
  answer: string;
  concepts: Concept[];
}

// The type of notes to generate
export type NotesType = "Recommended" | "MCQ" | "detailed" | "standard";

/**
 * Extracts concepts from the structured Gemini response
 */
const extractConcepts = (text: string): { answer: string; concepts: Concept[] } => {
  const concepts: Concept[] = [];
  let mainAnswer = text;
  
  // Find the KEY CONCEPTS section
  const conceptSectionIndex = text.indexOf("KEY CONCEPTS:");
  
  if (conceptSectionIndex !== -1) {
    // Split the response into main answer and concepts section
    mainAnswer = text.substring(0, conceptSectionIndex).trim();
    const conceptsText = text.substring(conceptSectionIndex + "KEY CONCEPTS:".length).trim();
    
    // Regular expression to match concept blocks
    const conceptRegex = /CONCEPT:\s*(.*?)\s*\n+EXPLANATION:\s*(.*?)\s*\n+MEMORY HOOK:\s*(.*?)\s*\n+ICON:\s*(.*?)(?=\n+CONCEPT:|$)/gs;
    
    let match;
    let counter = 0;
    
    while ((match = conceptRegex.exec(conceptsText)) !== null) {
      counter++;
      concepts.push({
        id: `concept-${counter}`,
        title: match[1].trim(),
        description: match[2].trim(),
        memoryHook: match[3].trim(),
        icon: match[4].trim()
      });
    }
  }
  
  return { answer: mainAnswer, concepts };
};

/**
 * Ensures that mermaid code blocks are properly formatted
 */
const ensureMermaidFormatting = (text: string): string => {
  // Check if there are any mermaid code blocks
  return text.replace(
    /```(?:mermaid)?\s*\n?((?:flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie)[\s\S]*?)```/g,
    (_, diagramContent) => {
      // Process the diagram content to fix common issues
      let cleanContent = diagramContent.trim();
      
      // Fix issue with node labels containing parentheses
      cleanContent = cleanContent.replace(/\[([^\]]*\([^\]]*\)[^\]]*)\]/g, function(match, capture) {
        // Replace parentheses with their HTML entity equivalents in node labels
        return '[' + capture.replace(/\(/g, '&#40;').replace(/\)/g, '&#41;') + ']';
      });
      
      // Fix common syntax errors with arrows
      cleanContent = cleanContent.replace(/-->/g, " --> ");
      cleanContent = cleanContent.replace(/-->/g, " --> ");
      
      // Ensure flowchart syntax is correct
      if (cleanContent.startsWith("graph") || cleanContent.startsWith("flowchart")) {
        // Ensure there's a space between the diagram type and direction
        cleanContent = cleanContent.replace(/^(graph|flowchart)([A-Z][A-Z])/, "$1 $2");
      }
      
      // Make sure the diagram is properly enclosed in mermaid code fences
      return '```mermaid\n' + cleanContent + '\n```';
    }
  );
};

/**
 * Enhanced handler for Gemini API with better error handling and retry logic
 */
export const getGeminiAnswer = async (
  question: string, 
  notesType: NotesType = "standard"
): Promise<EnhancedResponse> => {
  const MAX_RETRIES = 1;
  let retryCount = 0;
  
  // Function to try getting answer with potential retry
  const tryGetAnswer = async (): Promise<EnhancedResponse> => {
    try {
      // Variables for MCQ case
      let questionCount = 0;
      let topicRepeat = '';
      
      // Select the appropriate prompt based on the notes type
      let tamayaPrompt: string;
      
      switch (notesType) {
        case "Recommended":
          tamayaPrompt = createTamayaRecommendedPrompt(question);
          break;
        case "detailed":
          // For detailed notes, use a slightly modified approach
          tamayaPrompt = createTamayaDetailedNotesPrompt(question);
          // If it's a long topic, we might need to simplify the prompt
          if (question.length > 50) {
            console.log("Long detailed query detected, optimizing prompt...");
            // Keep the detailed format but simplify some requirements
            tamayaPrompt = tamayaPrompt.replace(
              /MERMAID DIAGRAM GUIDELINES:[\s\S]*?EXAMPLE MERMAID SYNTAX FOR DATABASE ARCHITECTURE:/,
              "MERMAID DIAGRAM GUIDELINES:\n- Include a simple mermaid diagram if it helps explain the concept\n- Keep diagram simple with clear labels\n\nEXAMPLE MERMAID SYNTAX:"
            );
          }
          // Log topic being requested to help with debugging
          console.log(`Generating detailed notes specifically about: "${question}"`);
          break;
        case "MCQ":
          // Generate a random number of questions between 12 and 20
          questionCount = Math.floor(Math.random() * 9) + 12; // Random number between 12-20
          
          // Add topic repetition and emphasis to ensure topic-specific questions
          topicRepeat = question.replace(/['"]/g, ''); // Remove quotes to avoid JSON issues
          tamayaPrompt = createTamayaMCQPrompt(topicRepeat, questionCount);
          console.log(`Generating ${questionCount} MCQs for topic: ${topicRepeat.substring(0, 30)}${topicRepeat.length > 30 ? '...' : ''}`);
          break;
        default:
          // For standard or any other type, use recommended prompt as default
          tamayaPrompt = createTamayaRecommendedPrompt(question);
          break;
      }
      
      // Add math formatting instructions
      const finalPrompt = addMathFormatting(tamayaPrompt);
      
      // Log the prompt type for debugging
      console.log(`Generating ${notesType} notes for: ${question.substring(0, 50)}${question.length > 50 ? '...' : ''}`);
      
      // Call the Gemini API
      let responseText = await callGeminiAPI(
        finalPrompt, 
        `Failed to get Tamaya's ${notesType} notes`
      );
      
      // Check if we got a valid response
      if (!responseText || responseText.trim().length < 10) {
        throw new Error(`Empty or invalid response received for ${notesType} notes`);
      }
      
      // Ensure proper mermaid formatting in all responses
      responseText = ensureMermaidFormatting(responseText);
      
      // Process different note types appropriately
      if (notesType === "MCQ") {
        // For MCQ responses, don't attempt to extract concepts
        // Just return the full response as is - the UI will handle rendering
        return { 
          answer: responseText,
          // Return empty concepts array for MCQs
          concepts: [] 
        };
      } else {
        // For all other types (Recommended, detailed, standard)
        // Extract concepts if they exist in the response
        const conceptsExist = responseText.includes("## KEY CONCEPTS") || 
                             responseText.includes("KEY CONCEPTS:");
        
        if (conceptsExist) {
          const { answer, concepts } = extractConcepts(responseText);
          return { answer, concepts };
        } else {
          // If no concepts section, return the full response
          return { answer: responseText, concepts: [] };
        }
      }
    } catch (error) {
      console.error(`Error getting ${notesType} answer (attempt ${retryCount + 1}):`, error);
      
      // Increment retry count and potentially retry
      retryCount++;
      
      if (retryCount <= MAX_RETRIES) {
        console.log(`Retrying ${notesType} notes generation (attempt ${retryCount + 1})...`);
        
        // If it's a detailed note failing, try with standard format instead
        if (notesType === "detailed") {
          console.log("Falling back to standard notes format...");
          
          try {
            // Get response using standard format as a fallback
            const standardPrompt = createTamayaRecommendedPrompt(question);
            const finalPrompt = addMathFormatting(standardPrompt);
            let responseText = await callGeminiAPI(
              finalPrompt, 
              `Failed to get fallback standard notes`
            );
            
            // Process the response
            responseText = ensureMermaidFormatting(responseText);
            // Don't extract concepts for Recommended format, just return the full text
            const fallbackNotice = "\n\n**Note:** These notes were provided in our standard format as the detailed format encountered an issue.\n";
            return { answer: responseText + fallbackNotice, concepts: [] };
          } catch (fallbackError) {
            console.error("Fallback to standard notes also failed:", fallbackError);
            throw error; // Throw the original error
          }
        } else {
          // For other note types, just retry with the same approach
          return await tryGetAnswer();
        }
      }
      
      // If we've exhausted retries or fallbacks, propagate the error
      throw error;
    }
  };
  
  // Start the answer attempt process
  try {
    return await tryGetAnswer();
  } catch (finalError) {
    console.error(`All attempts failed for ${notesType} notes:`, finalError);
    
    // Create a user-friendly error message
    let errorMessage = `Sorry, I encountered an error while preparing your ${notesType} exam notes. Please try again in a moment.`;
    
    if (notesType === "detailed") {
      errorMessage = "I'm having trouble generating detailed notes right now. You might try using the 'Recommended' format instead, which is optimized for better performance.";
    }
    
    return { 
      answer: errorMessage, 
      concepts: [] 
    };
  }
};
