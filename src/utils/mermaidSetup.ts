import mermaid from 'mermaid';

// Extend Window interface to include our custom property
declare global {
  interface Window {
    __mermaidInitialized?: boolean;
  }
}

/**
 * Initialize Mermaid library with optimal configuration
 */
export function setupMermaid() {
  if (typeof window === 'undefined') {
    console.log('Skipping Mermaid setup in SSR environment');
    return;
  }

  try {
    // Only initialize once and only in client-side environment
    if (!window.__mermaidInitialized) {
      console.log('Setting up Mermaid.js globally...');
      
      // Actually initialize mermaid with proper configuration
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        themeVariables: {
          primaryColor: '#f3f4f6',
          primaryTextColor: '#4b5563',
          primaryBorderColor: '#e5e7eb',
          lineColor: '#6b7280',
          secondaryColor: '#f9fafb',
          tertiaryColor: '#f3f4f6'
        },
        fontFamily: 'sans-serif',
        flowchart: {
          htmlLabels: true,
          useMaxWidth: true,
        }
      });
      
      // Mark as initialized to prevent duplicated setup
      window.__mermaidInitialized = true;
      
      // Register mermaid click handler
      document.addEventListener('click', (e) => {
        const el = e.target as HTMLElement;
        if (el.tagName === 'A' && el.classList.contains('mermaid-link')) {
          e.preventDefault();
          const href = el.getAttribute('href');
          if (href) {
            console.log('Mermaid link clicked:', href);
            // Handle navigation or other actions here
          }
        }
      });
            
      // Add error handling for Mermaid parsing errors
      document.addEventListener('mermaid:parseError', (event) => {
        console.log('Mermaid parse error:', event);
      });
      
      console.log('Mermaid global initialization complete.');
    }
  } catch (error) {
    console.error('Error setting up Mermaid:', error);
  }
}

/**
 * Process a piece of markdown text to properly format mermaid code blocks
 * This helps ensure mermaid blocks are properly prepared for rendering
 */
export function processMermaidInMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // Look for mermaid code blocks and ensure they're properly formatted
  return markdown.replace(
    /```(?:mermaid)\s*([\s\S]*?)```/g, 
    (_, code) => {
      // Clean and fix common syntax issues
      let cleanCode = code.trim();
      
      // Fix common issues with labels containing parentheses
      cleanCode = cleanCode.replace(/\[([^\]]*\([^\]]*\)[^\]]*)\]/g, function(match, capture) {
        // Replace parentheses with their HTML entity equivalents in node labels
        return '[' + capture.replace(/\(/g, '&#40;').replace(/\)/g, '&#41;') + ']';
      });
      
      return '```mermaid\n' + cleanCode + '\n```';
    }
  );
}

/**
 * Parse mermaid diagram text to ensure valid syntax
 */
export function validateMermaidSyntax(diagramText: string): { isValid: boolean; error?: string } {
  try {
    // Basic validation for common syntax errors
    if (!diagramText.trim()) {
      return { isValid: false, error: 'Diagram is empty' };
    }
    
    const firstLine = diagramText.trim().split('\n')[0].trim();
    const validFirstLines = ['graph ', 'flowchart ', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'gantt', 'pie'];
    
    if (!validFirstLines.some(prefix => firstLine.startsWith(prefix))) {
      return { 
        isValid: false, 
        error: `Diagram must start with a valid diagram type. Found: "${firstLine}"`
      };
    }
    
    // Fix common issues with node labels containing parentheses
    if (diagramText.includes('(') && diagramText.includes(')')) {
      const hasNodeWithParentheses = /\[([^\]]*\([^\]]*\)[^\]]*)\]/.test(diagramText);
      if (hasNodeWithParentheses) {
        return { 
          isValid: true, 
          error: 'Warning: Node labels contain parentheses which may cause rendering issues. Consider replacing them with HTML entities: &#40; and &#41;' 
        };
      }
    }
    
    return { isValid: true };
  } catch (err) {
    return { 
      isValid: false, 
      error: err instanceof Error ? err.message : 'Unknown error validating diagram' 
    };
  }
}

// Export default for convenience
export default setupMermaid; 