"use client";

import { ReactNode, useState } from "react";
import { Copy, Check } from "lucide-react";
import clsx from "clsx";

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  showCopyButton?: boolean;
  className?: string;
}

export function CodeBlock({
  children,
  language = "tsx",
  title,
  showCopyButton = true,
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

  return (
    <div className={clsx("relative rounded-lg overflow-hidden", className)}>
      {title && (
        <div className="bg-gray-800 dark:bg-gray-900 px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
          {title}
        </div>
      )}
      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm leading-relaxed">
          <code className={`language-${language}`}>{children}</code>
        </pre>
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} className="text-gray-400" />
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
}

export function ComponentExample({
  title,
  description,
  children,
  code,
  className
}: ComponentExampleProps) {
  return (
    <div className={clsx("border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden", className)}>
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {description}
          </p>
        )}
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center min-h-[100px]">
          {children}
        </div>
      </div>
      
      <CodeBlock>{code}</CodeBlock>
    </div>
  );
}

export default CodeBlock;