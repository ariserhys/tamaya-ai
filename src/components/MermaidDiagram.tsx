import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

// Global diagram cache to prevent re-renders of the same diagram
const diagramCache = new Map<string, string>();

// The actual MermaidDiagram component
const MermaidDiagram: React.FC<MermaidDiagramProps> = memo(({ chart, className = '' }) => {
  const [state, setState] = useState<{
    svg: string;
    error: string | null;
    isLoading: boolean;
  }>({
    svg: '',
    error: null,
    isLoading: true
  });
  
  const mermaidRef = useRef<HTMLDivElement>(null);
  
  // Generate a hash of the chart content to use as a cache key
  const chartHash = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < chart.length; i++) {
      hash = ((hash << 5) - hash) + chart.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
  }, [chart]);
  
  // Use a stable diagram ID based on the chart hash
  const diagramId = useMemo(() => `mermaid-${chartHash}`, [chartHash]);

  // Render the chart only once when the component mounts or when chart changes
  useEffect(() => {
    let isMounted = true;
    
    const renderChart = async () => {
      if (!chart) {
        if (isMounted) setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      try {
        // Check if we have this diagram in cache first
        if (diagramCache.has(chartHash)) {
          if (isMounted) {
            setState({
              svg: diagramCache.get(chartHash) || '',
              error: null,
              isLoading: false
            });
          }
          return;
        }
        
        // Clean chart input (remove leading/trailing whitespace and fix common issues)
        let cleanChart = chart.trim();
        
        // Fix common issues with labels containing parentheses
        cleanChart = cleanChart.replace(/\[([^\]]*\([^\]]*\)[^\]]*)\]/g, function(match, capture) {
          return '[' + capture.replace(/\(/g, '&#40;').replace(/\)/g, '&#41;') + ']';
        });

        // Render the chart
        try {
          const { svg } = await mermaid.render(diagramId, cleanChart);
          
          // Process the SVG for better print handling
          let processedSvg = svg;
          
          // Add data attribute for print handling
          processedSvg = processedSvg.replace('<svg ', '<svg data-print-preserve="true" ');
          
          // Ensure SVG has proper viewBox for better scaling
          if (!processedSvg.includes('viewBox') && processedSvg.includes('width') && processedSvg.includes('height')) {
            const widthMatch = processedSvg.match(/width="([^"]+)"/);
            const heightMatch = processedSvg.match(/height="([^"]+)"/);
            if (widthMatch && heightMatch) {
              const width = widthMatch[1].replace('px', '');
              const height = heightMatch[1].replace('px', '');
              processedSvg = processedSvg.replace('<svg ', `<svg viewBox="0 0 ${width} ${height}" `);
            }
          }
          
          // Store the result in cache
          diagramCache.set(chartHash, processedSvg);
          
          // Update state if component is still mounted
          if (isMounted) {
            setState({
              svg: processedSvg,
              error: null,
              isLoading: false
            });
          }
        } catch (renderErr) {
          console.error('Error rendering chart:', renderErr);
          
          // Try fallback rendering with simplified diagram
          try {
            if (chart.includes('flowchart') || chart.includes('graph')) {
              console.log('Attempting fallback rendering...');
              
              // Simplify the diagram by removing styles and escaping problematic characters
              let fallbackChart = chart
                .replace(/style\s+.+/g, '') // Remove all style lines
                .replace(/\([^)]*\)/g, '_') // Replace parentheses content with underscores
                .trim();
              
              // Try with simpler syntax
              if (fallbackChart.includes('flowchart')) {
                fallbackChart = fallbackChart.replace('flowchart', 'graph');
              }
              
              const { svg } = await mermaid.render(`${diagramId}-fallback`, fallbackChart);
              
              // Store the fallback result in cache
              diagramCache.set(chartHash, svg);
              
              if (isMounted) {
                setState({
                  svg: svg,
                  error: 'Warning: Using simplified diagram due to syntax issues with the original.',
                  isLoading: false
                });
              }
              return;
            }
          } catch (fallbackErr) {
            console.error('Fallback rendering also failed:', fallbackErr);
          }
          
          if (isMounted) {
            setState({
              svg: '',
              error: `Failed to render diagram: ${renderErr instanceof Error ? renderErr.message : 'Unknown error'}`,
              isLoading: false
            });
          }
        }
      } catch (err) {
        console.error('Error in Mermaid diagram process:', err);
        
        if (isMounted) {
          setState({
            svg: '',
            error: `Error processing diagram: ${err instanceof Error ? err.message : 'Unknown error'}`,
            isLoading: false
          });
        }
      }
    };

    renderChart();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [chart, chartHash, diagramId]);

  if (state.error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
        <p className="text-sm font-medium">Diagram Error</p>
        <p className="text-sm">{state.error}</p>
        <div className="mt-2">
          <p className="text-xs font-medium mb-1">Your diagram code:</p>
          <pre className="p-2 bg-gray-50 rounded text-xs overflow-auto border border-gray-200 whitespace-pre-wrap">
            {chart}
          </pre>
          <p className="text-xs mt-2">
            <strong>Tip:</strong> If you're using parentheses in node labels, try using HTML entities instead: <code>&amp;#40;</code> for '(' and <code>&amp;#41;</code> for ')'
          </p>
        </div>
      </div>
    );
  }

  if (state.isLoading || !state.svg) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-pulse rounded-full h-6 w-6 bg-purple-300"></div>
        <p className="ml-2 text-sm text-gray-500">Rendering diagram...</p>
      </div>
    );
  }

  return (
    <div 
      className={`mermaid-diagram print-preserve ${className}`}
      data-paginate="keep-together"
      dangerouslySetInnerHTML={{ __html: state.svg }}
      key={chartHash} // Add a stable key to prevent unnecessary DOM updates
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  // Only re-render if the chart content has actually changed
  return prevProps.chart === nextProps.chart;
});

export default MermaidDiagram; 