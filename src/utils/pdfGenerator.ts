import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface PdfOptions {
  filename?: string;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  imageQuality?: number; // Added image quality option (0-1)
  scale?: number; // Added scale option for better resolution
}

/**
 * Generates a PDF from a specific HTML element
 */
export const generatePdfFromElement = async (
  element: HTMLElement,
  options: PdfOptions = {}
): Promise<void> => {
  try {
    const {
      filename = "tamaya-notes.pdf",
      title = "Tamaya AI Notes",
      author = "Tamaya AI",
      subject = "AI Generated Notes",
      keywords = "tamaya, notes, ai, education",
      imageQuality = 0.95, // High quality default
      scale = 2, // Higher scale for better resolution
    } = options;

    // Add a class to force clean export styles
    element.classList.add('pdf-export-clean');
    
    // Create a clone to optimize for printing
    const printOptimizedElement = element.cloneNode(true) as HTMLElement;
    printOptimizedElement.style.width = "800px"; // Fixed width for better quality
    printOptimizedElement.style.padding = "20px";
    printOptimizedElement.style.position = "absolute";
    printOptimizedElement.style.left = "-9999px";
    printOptimizedElement.style.top = "-9999px";
    printOptimizedElement.style.backgroundColor = "#ffffff";
    
    // Improve image quality in the clone
    const images = printOptimizedElement.querySelectorAll('img');
    images.forEach(img => {
      // Remove any size restrictions that might affect quality
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      // Force image quality attributes
      img.setAttribute('data-html2canvas-ignore', 'false');
    });
    
    document.body.appendChild(printOptimizedElement);
    
    // Enhanced canvas capture settings
    const canvas = await html2canvas(printOptimizedElement, {
      scale: scale, // Higher scale for better resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      imageTimeout: 15000, // Extended timeout for image loading
      allowTaint: true, // Allow cross-origin images
    });
    
    // Remove temporary elements
    document.body.removeChild(printOptimizedElement);
    element.classList.remove('pdf-export-clean');

    // Higher quality image data
    const imgData = canvas.toDataURL("image/jpeg", imageQuality);
    
    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Create PDF with better compression settings
    const pdf = new jsPDF({ 
      orientation: "p", 
      unit: "mm", 
      format: "a4", 
      compress: true,
      hotfixes: ["px_scaling"] // Fix for better image rendering
    });
    
    // Add metadata
    pdf.setProperties({
      title,
      author,
      subject,
      keywords,
    });

    // First page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Add more pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    // Download PDF
    pdf.save(filename);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating PDF:", error);
    return Promise.reject(error);
  }
};

/**
 * Generates a PDF from HTML content string
 */
export const generatePdfFromHtml = async (
  htmlContent: string,
  options: PdfOptions = {}
): Promise<void> => {
  try {
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.width = "800px"; // Fixed width for consistent rendering
    tempDiv.style.padding = "20px";
    tempDiv.style.backgroundColor = "#ffffff";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "-9999px";
    
    document.body.appendChild(tempDiv);
    
    // Generate the PDF
    await generatePdfFromElement(tempDiv, options);
    
    // Clean up
    document.body.removeChild(tempDiv);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating PDF from HTML:", error);
    return Promise.reject(error);
  }
};

/**
 * Generates a PDF from markdown content
 * Simple implementation that doesn't require the marked package
 */
export const generatePdfFromMarkdown = async (
  markdownContent: string,
  options: PdfOptions = {}
): Promise<void> => {
  try {
    // Simple markdown to HTML conversion for basic formatting
    // This doesn't handle everything but covers the basics
    const htmlContent = markdownContent
      // Handle headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      // Handle bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Handle lists
      .replace(/^\s*- (.*$)/gm, '<ul><li>$1</li></ul>')
      .replace(/^\s*\d+\. (.*$)/gm, '<ol><li>$1</li></ol>')
      // Handle links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      // Handle code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Handle inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Handle paragraphs
      .replace(/^\s*(\n)?(.+)/gm, function(m) {
        return /<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
      })
      // Handle line breaks
      .replace(/\n/g, '<br />')
      // Fix duplicate tags
      .replace(/<\/ul>\s*<ul>/g, '')
      .replace(/<\/ol>\s*<ol>/g, '')
      .replace(/<\/p>\s*<p>/g, '<br />');
    
    // Add custom styles for better PDF rendering
    const styledHtmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <style>
          h1, h2, h3, h4, h5, h6 { color: #333; margin-top: 24px; margin-bottom: 16px; }
          h1 { font-size: 24px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
          h2 { font-size: 20px; }
          h3 { font-size: 18px; }
          p { margin-bottom: 16px; }
          code { background-color: #f6f8fa; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
          pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; margin-bottom: 16px; }
          pre code { background-color: transparent; padding: 0; }
          ul, ol { padding-left: 24px; margin-bottom: 16px; }
          blockquote { margin: 0; padding-left: 16px; border-left: 4px solid #ddd; color: #555; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
          th, td { padding: 8px; border: 1px solid #ddd; }
          th { background-color: #f6f8fa; }
          img { max-width: 100%; height: auto; }
        </style>
        ${htmlContent}
      </div>
    `;
    
    return generatePdfFromHtml(styledHtmlContent, options);
  } catch (error) {
    console.error("Error generating PDF from Markdown:", error);
    return Promise.reject(error);
  }
}; 