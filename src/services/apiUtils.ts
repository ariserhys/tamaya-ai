import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Common response type for Gemini API calls
 */
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
}

/**
 * Calls the Gemini API with a prompt and returns the response
 * @param prompt The prompt to send to the API
 * @returns The response text from Gemini
 * @throws Error if the API call fails
 */
export const callGeminiAPI = async (prompt: string, errorMessage: string = "API request failed"): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-answer', {
      body: { question: prompt }
    });

    if (error) {
      console.error("Error calling gemini-answer function:", error);
      toast.error(errorMessage, {
        description: error.message || "An unexpected error occurred"
      });
      throw error;
    }

    const response = data as GeminiResponse;
    
    // Extract the text from the response
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected response format:", response);
      toast.error("Received an invalid response format");
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error in API call:", error);
    toast.error(errorMessage);
    throw error;
  }
};

/**
 * Adds formatting instructions for proper math rendering
 * This enhances the prompt to ensure math expressions are properly formatted
 */
export const addMathFormatting = (prompt: string): string => {
  // Add instructions for proper math formatting
  const mathFormattingInstructions = `
MATH FORMATTING INSTRUCTIONS:
- For mathematical expressions, use LaTeX syntax enclosed in dollar signs: $E = mc^2$
- For inline math, use single dollar signs: $x^2 + y^2 = z^2$
- For block math expressions, use double dollar signs: $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
- Avoid breaking LaTeX expressions across multiple lines
- Ensure all brackets and braces are properly balanced
- Use \\text{} for text within math expressions: $P(A|B) = \\frac{P(B|A) \\times P(A)}{P(B)}$ where \\text{P represents probability}
- For matrices, use the matrix environment: $$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$$

`;

  // Handle potential encoding issues in complex math with escaping
  const mathEncodingInstructions = `
Remember to properly escape backslashes in LaTeX math expressions when needed.
The following characters need special attention in math expressions:
- Backslash: Use \\\\ instead of \\ for LaTeX commands
- Curly braces: { and } need to be properly balanced
- Underscore: _ should be used for subscripts (e.g., $x_1$)
- Caret: ^ should be used for superscripts (e.g., $x^2$)
- Pipe: | should be escaped as \\mid or \\vert when used as a delimiter

For neural networks specifically, ensure matrices, tensors, and activation functions are properly formatted.
`;

  // Check if prompt is already very long, if so use shorter instructions
  if (prompt.length > 2000) {
    // Use a shorter, more targeted version for long prompts
    return prompt + "\n\nInclude proper math formatting with LaTeX syntax where appropriate. Use $...$ for inline math and $$...$$  for block math.";
  }

  // Return the prompt with the math formatting instructions appended
  return prompt + "\n\n" + mathFormattingInstructions + mathEncodingInstructions;
}; 