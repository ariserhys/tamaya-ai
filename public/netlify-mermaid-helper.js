/**
 * Netlify Mermaid.js Helper Script
 * 
 * This script helps to ensure Mermaid diagrams work properly on Netlify
 * by providing additional initialization support.
 */

(function() {
  // We'll check periodically to see if mermaid needs initialization
  function checkForMermaidElements() {
    const mermaidElements = document.querySelectorAll('.mermaid-diagram');
    
    if (mermaidElements.length > 0) {
      console.log('Found mermaid elements on page, ensuring initialization');
      
      // This will be executed after the main app has loaded
      try {
        // Trigger a window resize event which can help Mermaid render properly
        window.dispatchEvent(new Event('resize'));
        
        console.log('Netlify Mermaid helper: triggered resize');
      } catch (error) {
        console.error('Netlify Mermaid helper error:', error);
      }
    }
  }

  // Run on page load
  window.addEventListener('load', function() {
    // Wait a bit for React to render components
    setTimeout(checkForMermaidElements, 500);
    
    // Also check again after 2 seconds
    setTimeout(checkForMermaidElements, 2000);
  });
})(); 