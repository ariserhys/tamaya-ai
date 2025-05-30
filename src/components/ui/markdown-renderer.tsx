import React, { useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import MermaidDiagram from '../MermaidDiagram';
import CodeDisplay from '../CodeDisplay';
import { processMermaidInMarkdown } from '@/utils/mermaidSetup';
import styled from 'styled-components';
import { Components } from 'react-markdown';

// Style wrapper that allows code blocks to maintain their styling
const MarkdownWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  
  img, svg {
    max-width: 100%;
    height: auto;
  }
  
  pre {
    max-width: 100%;
    overflow-x: auto;
  }
  
  table {
    display: block;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }
  
  .code-display-wrapper {
    margin: 0;
    width: 100%;
    max-width: 100%;
    
    & > div {
      // Preserve Mac-style terminal appearance
      margin: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }
  }
  
  // If this is used in the NotesInterface we want to remove the extra margins
  &.in-notes {
    .code-display-wrapper {
      margin: 0;
      width: 100%;
      max-width: 100%;
      
      & > div {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
    
    .mermaid-diagram {
      max-width: 100%;
      overflow-x: auto;
    }
  }
  
  // Custom styling for specific keyword headings
  .special-heading {
    background: linear-gradient(90deg, #818cf8 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 700;
    letter-spacing: 0.02em;
    font-size: 1.1em;
  }
`;

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Define types for the props in markdown components
type MarkdownComponentProps = {
  node?: Record<string, unknown>;
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
};

// Custom mermaid renderer component to reduce re-renders
const MermaidRenderer = React.memo(({ content }: { content: string }) => {
  if (!content.trim()) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
        <p className="text-sm font-medium">Empty Mermaid Diagram</p>
        <p className="text-sm">There is no content in this mermaid diagram.</p>
      </div>
    );
  }
  
  return (
    <div className="page-break-inside-avoid py-4 max-w-full overflow-x-auto">
      <MermaidDiagram 
        chart={content}
        className="my-4"
      />
    </div>
  );
});

MermaidRenderer.displayName = 'MermaidRenderer';

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ 
  content, 
  className = '' 
}) => {
  // Process content to ensure proper mermaid formatting - memoize to prevent unnecessary processing
  const processedContent = useMemo(() => processMermaidInMarkdown(content), [content]);

  // Add custom class to special headings like DEFINITION, QUICK FACTS, etc.
  const enhanceHeadings = (text: string) => {
    if (!text) return text;
    
    if (typeof text === 'string' && 
        (text.includes('DEFINITION:') || 
         text.includes('QUICK FACTS') || 
         text.includes('CORE IDEA'))) {
      return <span className="special-heading">{text}</span>;
    }
    
    return text;
  };

  // Memoize the components object to prevent unnecessary re-renders
  const components = useMemo<Components>(() => ({
    // Add page break control attributes to headings
    h1: ({node, ...props}: MarkdownComponentProps) => 
      <h1 {...props} className="page-break-after-avoid" />,
    h2: ({node, ...props}: MarkdownComponentProps) => 
      <h2 {...props} className="page-break-after-avoid" />,
    h3: ({node, ...props}: MarkdownComponentProps) => 
      <h3 {...props} className="page-break-after-avoid" />,
    // Make tables avoid page breaks
    table: ({node, ...props}: MarkdownComponentProps) => 
      <table {...props} className="page-break-inside-avoid overflow-x-auto block max-w-full" />,
    // Add custom formatting to strong text containing special keywords
    strong: ({node, children, ...props}: MarkdownComponentProps) => {
      return <strong {...props}>{enhanceHeadings(String(children))}</strong>;
    },
    // Handle code blocks and mermaid diagrams
    code: ({className, children, ...props}: MarkdownComponentProps) => {
      const match = /language-(\w+)/.exec(className || '');
      
      // Handle mermaid code blocks specifically
      if (match && match[1] === 'mermaid') {
        const chartContent = String(children).replace(/\n$/, '').trim();
        return <MermaidRenderer content={chartContent} />;
      }
      
      // Handle regular code blocks with our enhanced CodeDisplay component
      return match ? (
        <div className="page-break-inside-avoid code-display-wrapper w-full max-w-full overflow-hidden">
          <CodeDisplay
            code={String(children).replace(/\n$/, '')}
            language={match[1]}
            fileName={`example.${match[1]}`}
            showLineNumbers={true}
          />
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  }), []);

  return (
    <MarkdownWrapper className={className}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        remarkPlugins={[remarkGfm, remarkMath]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </MarkdownWrapper>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer'; 