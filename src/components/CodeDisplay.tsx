import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

const CodeContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace;
  background: #1e1e1e;
  width: 100%;
  margin: 0;
`;

const CodeHeader = styled.div`
  background: #2d2d2d;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  position: relative;
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 6px;
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
`;

const Light = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const FileName = styled.div`
  color: #d8d8d8;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0 auto;
  text-align: center;
`;

const LanguageBadge = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: #d8d8d8;
  font-size: 0.7rem;
  padding: 0.2rem 0.7rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  position: absolute;
  right: 12px;
`;

const HighlighterWrapper = styled.div`
  margin: 0;
  padding: 0;
  
  pre {
    margin: 0 !important;
    border-radius: 0 !important;
  }
  
  .code-highlighter {
    margin: 0 !important;
    padding: 0.75rem 0 !important;
    font-size: 0.9rem !important;
    line-height: 1.5 !important;
    background: #1e1e1e !important;
    border-radius: 0 !important;
  }
  
  code {
    padding: 0 !important;
    background: none !important;
  }
  
  .react-syntax-highlighter-line-number {
    color: #666 !important;
    opacity: 0.7 !important;
    min-width: 2.5em !important;
    padding-right: 1em !important;
    text-align: right !important;
    user-select: none !important;
    margin-right: 0 !important;
  }
  
  .token.comment {
    color: #6A9955 !important;
    font-style: italic;
  }

  .token.keyword {
    color: #569CD6 !important;
  }

  .token.string {
    color: #FF9170 !important;
  }

  .token.function {
    color: #DCDCAA !important;
  }

  .token.number {
    color: #B5CEA8 !important;
  }
  
  .token.operator {
    color: #D4D4D4 !important;
  }
  
  .token.punctuation {
    color: #D4D4D4 !important;
  }
  
  .token.preprocessor {
    color: #C586C0 !important;
  }
  
  .token.property {
    color: #9CDCFE !important;
  }
  
  .token.selector {
    color: #D7BA7D !important;
  }
  
  .token.tag {
    color: #569CD6 !important;
  }
  
  .token.attr-name {
    color: #9CDCFE !important;
  }
  
  .token.attr-value {
    color: #CE9178 !important;
  }
  
  .token.boolean {
    color: #569CD6 !important;
    font-weight: bold;
  }
  
  .token.constant {
    color: #4FC1FF !important;
  }
  
  .react-syntax-highlighter-line {
    padding: 0 !important;
    margin: 0 !important;
  }
`;

interface CodeDisplayProps {
  code: string;
  language?: string;
  fileName?: string;
  showLineNumbers?: boolean;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  language = 'c',
  fileName = 'example.c',
  showLineNumbers = true,
}) => {
  // Remove leading and trailing whitespace while preserving indentation
  const trimmedCode = code.trim();
  
  const getLanguageDisplay = (lang: string): string => {
    const displayNames: {[key: string]: string} = {
      'c': 'C',
      'cpp': 'C++',
      'javascript': 'JS',
      'typescript': 'TS',
      'python': 'PYTHON',
      'java': 'JAVA',
      'csharp': 'C#',
      'php': 'PHP',
      'go': 'GO',
      'rust': 'RUST',
      'html': 'HTML',
      'css': 'CSS',
    };
    
    return displayNames[lang] || lang.toUpperCase();
  };

  return (
    <CodeContainer>
      <CodeHeader>
        <TrafficLights>
          <Light color="#FF5F56" />
          <Light color="#FFBD2E" />
          <Light color="#27C93F" />
        </TrafficLights>
        <FileName>{fileName}</FileName>
        <LanguageBadge>{getLanguageDisplay(language)}</LanguageBadge>
      </CodeHeader>
      <HighlighterWrapper>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', textAlign: 'right' }}
          wrapLongLines={false}
          className="code-highlighter"
          customStyle={{ 
            fontSize: '0.9rem',
            backgroundColor: '#1e1e1e',
            margin: 0,
            padding: '0.75rem 0',
            borderRadius: 0
          }}
          codeTagProps={{
            style: {
              padding: 0,
              margin: 0,
              background: 'none'
            }
          }}
        >
          {trimmedCode}
        </SyntaxHighlighter>
      </HighlighterWrapper>
    </CodeContainer>
  );
};

export default CodeDisplay; 