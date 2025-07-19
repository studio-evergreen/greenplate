"use client";

import { ReactNode, useState } from "react";
import { Copy, Check, Code, Eye } from "lucide-react";
import clsx from "clsx";

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  showCopyButton?: boolean;
  showLineNumbers?: boolean;
  className?: string;
}

// Simple syntax highlighting using React elements - safer than dangerouslySetInnerHTML
const highlightCode = (code: string, language: string) => {
  if (language !== 'tsx' && language !== 'ts' && language !== 'jsx' && language !== 'js') {
    // For non-JS languages, just return plain text
    return <span className="text-[var(--foreground)]">{code}</span>;
  }

  const lines = code.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        // Simple tokenization for JSX/TS
        const tokens = [];
        let currentPos = 0;
        const lineLength = line.length;
        
        while (currentPos < lineLength) {
          let matched = false;
          
          // Comments
          if (line.slice(currentPos).match(/^\/\/.*/)) {
            const match = line.slice(currentPos).match(/^\/\/.*/)?.[0] || '';
            tokens.push(
              <span key={`${lineIndex}-${currentPos}`} className="text-gray-500 italic">
                {match}
              </span>
            );
            currentPos += match.length;
            matched = true;
          }
          // Block comments
          else if (line.slice(currentPos).match(/^\/\*[\s\S]*?\*\//)) {
            const match = line.slice(currentPos).match(/^\/\*[\s\S]*?\*\//)?.[0] || '';
            tokens.push(
              <span key={`${lineIndex}-${currentPos}`} className="text-gray-500 italic">
                {match}
              </span>
            );
            currentPos += match.length;
            matched = true;
          }
          // Strings
          else if (line.slice(currentPos).match(/^(['"`])((?:\\.|(?!\1)[^\\])*?)\1/)) {
            const match = line.slice(currentPos).match(/^(['"`])((?:\\.|(?!\1)[^\\])*?)\1/)?.[0] || '';
            tokens.push(
              <span key={`${lineIndex}-${currentPos}`} className="text-green-400">
                {match}
              </span>
            );
            currentPos += match.length;
            matched = true;
          }
          // Keywords
          else if (line.slice(currentPos).match(/^\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|interface|type|enum|async|await|try|catch|finally|throw|new|this|super|static|public|private|protected|readonly|abstract|implements|as|is|in|of|typeof|instanceof|default|case|switch|break|continue|do|null|undefined|true|false)\b/)) {
            const match = line.slice(currentPos).match(/^\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|interface|type|enum|async|await|try|catch|finally|throw|new|this|super|static|public|private|protected|readonly|abstract|implements|as|is|in|of|typeof|instanceof|default|case|switch|break|continue|do|null|undefined|true|false)\b/)?.[0] || '';
            tokens.push(
              <span key={`${lineIndex}-${currentPos}`} className="text-blue-400 font-medium">
                {match}
              </span>
            );
            currentPos += match.length;
            matched = true;
          }
          // JSX tags
          else if (line.slice(currentPos).match(/^<\/?[A-Z][a-zA-Z0-9]*/)) {
            const match = line.slice(currentPos).match(/^<\/?[A-Z][a-zA-Z0-9]*/)?.[0] || '';
            tokens.push(
              <span key={`${lineIndex}-${currentPos}`} className="text-red-400">
                {match}
              </span>
            );
            currentPos += match.length;
            matched = true;
          }
          // HTML tags
          else if (line.slice(currentPos).match(/^<\/?[a-z][a-zA-Z0-9]*/)) {
            const match = line.slice(currentPos).match(/^<\/?[a-z][a-zA-Z0-9]*/)?.[0] || '';
            tokens.push(
              <span key={`${lineIndex}-${currentPos}`} className="text-blue-300">
                {match}
              </span>
            );
            currentPos += match.length;
            matched = true;
          }
          // Props and attributes
          else if (line.slice(currentPos).match(/^\s+[a-zA-Z-]+=/)) {
            const match = line.slice(currentPos).match(/^(\s+)([a-zA-Z-]+)(=)/);
            if (match) {
              tokens.push(
                <span key={`${lineIndex}-${currentPos}`}>
                  {match[1]}
                  <span className="text-yellow-300">{match[2]}</span>
                  {match[3]}
                </span>
              );
              currentPos += match[0].length;
              matched = true;
            }
          }
          // Numbers
          else if (line.slice(currentPos).match(/^\d+\.?\d*/)) {
            const match = line.slice(currentPos).match(/^\d+\.?\d*/)?.[0] || '';
            tokens.push(
              <span key={`${lineIndex}-${currentPos}`} className="text-orange-400">
                {match}
              </span>
            );
            currentPos += match.length;
            matched = true;
          }
          // Functions
          else if (line.slice(currentPos).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/)) {
            const match = line.slice(currentPos).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/)?.[0] || '';
            tokens.push(
              <span key={`${lineIndex}-${currentPos}`} className="text-purple-400">
                {match}
              </span>
            );
            currentPos += match.length;
            matched = true;
          }
          
          // If no pattern matched, just add the character as is
          if (!matched) {
            tokens.push(
              <span key={`${lineIndex}-${currentPos}`} className="text-[var(--foreground)]">
                {line[currentPos]}
              </span>
            );
            currentPos += 1;
          }
        }
        
        return (
          <div key={lineIndex}>
            {tokens}
            {lineIndex < lines.length - 1 && '\n'}
          </div>
        );
      })}
    </>
  );
};

export function CodeBlock({
  children,
  language = "tsx",
  title,
  showCopyButton = true,
  showLineNumbers = false,
  className
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const lines = children.split('\n');
  const highlightedCode = highlightCode(children, language);

  return (
    <div className={clsx("relative rounded-lg overflow-hidden border border-[var(--border)] group", className)}>
      {/* Header */}
      {(title || showCopyButton) && (
        <div className="flex items-center justify-between bg-[var(--muted)]/20 px-4 py-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Code size={14} className="text-[var(--muted)]" />
            {title && (
              <span className="text-sm font-mono text-[var(--muted)]">
                {title}
              </span>
            )}
            {language && !title && (
              <span className="text-sm font-mono text-[var(--muted)] capitalize">
                {language}
              </span>
            )}
          </div>
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={clsx(
                "p-1.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] transition-colors",
                "hover:bg-[var(--muted)]/20"
              )}
              aria-label={copied ? "Copied!" : "Copy code"}
            >
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          )}
        </div>
      )}
      
      {/* Code Content */}
      <div className="relative bg-[var(--background)]">
        <pre className={clsx(
          "overflow-x-auto text-sm leading-relaxed font-mono",
          showLineNumbers ? "pl-12" : "p-4"
        )}>
          {showLineNumbers && (
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-[var(--muted)]/10 border-r border-[var(--border)] flex flex-col text-[var(--muted)] text-xs text-right py-4">
              {lines.map((_, index) => (
                <span key={index + 1} className="px-2 leading-relaxed">
                  {index + 1}
                </span>
              ))}
            </div>
          )}
          <code className={`language-${language}`}>
            {highlightedCode}
          </code>
        </pre>
        
        {/* Copy button overlay (when no header) */}
        {showCopyButton && !title && (
          <button
            onClick={handleCopy}
            className={clsx(
              "absolute top-2 right-2 p-2 rounded bg-[var(--background)]/80 backdrop-blur-sm",
              "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]",
              "transition-all duration-200 hover:bg-[var(--muted)]/10",
              "opacity-0 group-hover:opacity-100"
            )}
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

interface ComponentExampleProps {
  title: string;
  description?: string;
  children: ReactNode;
  code: string;
  className?: string;
  showCode?: boolean;
}

export function ComponentExample({
  title,
  description,
  children,
  code,
  className,
  showCode: initialShowCode = true
}: ComponentExampleProps) {
  const [showCode, setShowCode] = useState(initialShowCode);
  
  return (
    <div className={clsx(
      "border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background)]",
      className
    )}>
      {/* Header */}
      <div className="border-b border-[var(--border)] p-4 bg-[var(--muted)]/5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowCode(!showCode)}
            className={clsx(
              "ml-4 p-2 rounded-md text-[var(--muted)] hover:text-[var(--foreground)]",
              "hover:bg-[var(--muted)]/10 transition-colors flex items-center gap-2 text-sm"
            )}
            aria-label={showCode ? "Hide code" : "Show code"}
          >
            {showCode ? (
              <>
                <Eye size={16} />
                Hide Code
              </>
            ) : (
              <>
                <Code size={16} />
                Show Code
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Preview */}
      <div className="p-6 bg-[var(--background)]">
        <div className="flex items-center justify-center min-h-[100px]">
          {children}
        </div>
      </div>
      
      {/* Code */}
      {showCode && (
        <div className="border-t border-[var(--border)]">
          <CodeBlock language="tsx" showCopyButton={true}>
            {code}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}

export default CodeBlock;