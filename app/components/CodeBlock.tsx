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

// Simple syntax highlighting for common tokens
const highlightCode = (code: string, language: string) => {
  if (language === 'tsx' || language === 'ts' || language === 'jsx' || language === 'js') {
    return code
      // Comments
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')
      // Strings
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
      // Keywords
      .replace(/\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|interface|type|enum|async|await|try|catch|finally|throw|new|this|super|static|public|private|protected|readonly|abstract|implements|as|is|in|of|typeof|instanceof|default|case|switch|break|continue|do|null|undefined|true|false)\b/g, '<span class="text-blue-400 font-medium">$1</span>')
      // JSX tags
      .replace(/(&lt;\/?)([A-Z][a-zA-Z0-9]*)/g, '$1<span class="text-red-400">$2</span>')
      .replace(/(&lt;\/?)([a-z][a-zA-Z0-9]*)/g, '$1<span class="text-blue-300">$2</span>')
      // Props and attributes
      .replace(/\s([a-zA-Z-]+)=/g, ' <span class="text-yellow-300">$1</span>=')
      // Numbers
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>')
      // Functions
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="text-purple-400">$1</span>(');
  }
  
  if (language === 'css' || language === 'scss') {
    return code
      // Comments
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')
      // Selectors
      .replace(/^(\s*)([.#]?[a-zA-Z-_][a-zA-Z0-9-_]*)\s*{/gm, '$1<span class="text-yellow-300">$2</span> {')
      // Properties
      .replace(/(\s*)([a-zA-Z-]+)(\s*:)/g, '$1<span class="text-blue-400">$2</span>$3')
      // Values
      .replace(/(:\s*)([^;{}\s][^;{}]*)(;?)/g, '$1<span class="text-green-400">$2</span>$3')
      // Units and colors
      .replace(/\b(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|deg|s|ms))\b/g, '<span class="text-orange-400">$1</span>')
      .replace(/(#[0-9a-fA-F]{3,8})\b/g, '<span class="text-pink-400">$1</span>');
  }
  
  return code;
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
    <div className={clsx("relative rounded-lg overflow-hidden border border-[var(--border)]", className)}>
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
          "overflow-x-auto text-sm leading-relaxed",
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
          <code 
            className={`language-${language} text-[var(--foreground)]`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
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