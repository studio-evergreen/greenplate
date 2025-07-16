"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";
import BottomSheet from "./BottomSheet";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  error,
  label,
  helperText,
  size = "md",
  searchable = false,
  clearable = false,
  multiple = false,
  className,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (value ? value.split(",") : []) : value ? [value] : []
  );
  const [isMobile, setIsMobile] = useState(false);
  
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 sm:py-2.5 text-base",
    lg: "px-5 py-4 sm:py-3 text-lg"
  };

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === value);
  const selectedLabels = options
    .filter(option => selectedValues.includes(option.value))
    .map(option => option.label);

  useEffect(() => {
    // 모바일 화면 크기 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (!isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      
      setSelectedValues(newValues);
      onChange?.(newValues.join(","));
    } else {
      setSelectedValues([optionValue]);
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.(multiple ? "" : "");
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder;
    
    if (multiple) {
      if (selectedValues.length === 1) {
        return selectedLabels[0];
      }
      return `${selectedValues.length} items selected`;
    }
    
    return selectedOption?.label || placeholder;
  };

  const renderOptions = () => (
    <>
      {searchable && (
        <div className="p-3 border-b border-[var(--border)]">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}
      
      <div className={clsx("overflow-y-auto", isMobile ? "max-h-80" : "max-h-48")}>
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-[var(--muted)] text-center">
            No options found
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            
            return (
              <div
                key={option.value}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                  option.disabled
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-[var(--border)]",
                  isSelected && "bg-emerald-50 dark:bg-emerald-900/20"
                )}
                onClick={() => !option.disabled && handleOptionSelect(option.value)}
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <span className="flex-1 text-[var(--foreground)]">
                  {option.label}
                </span>
                {isSelected && (
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          {label}
        </label>
      )}
      
      <div
        className={clsx(
          "relative w-full bg-[var(--input)] border rounded-xl cursor-pointer transition-colors",
          sizeStyles[size],
          error
            ? "border-red-500 focus-within:ring-red-500"
            : "border-[var(--border)] focus-within:ring-emerald-500",
          "focus-within:ring-2 focus-within:outline-none",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
        onClick={handleToggle}
        data-testid="select-trigger"
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedOption?.icon && (
              <span className="flex-shrink-0">{selectedOption.icon}</span>
            )}
            <span className={clsx(
              "truncate",
              selectedValues.length === 0 
                ? "text-[var(--muted)]" 
                : "text-[var(--foreground)]"
            )}>
              {getDisplayValue()}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {clearable && selectedValues.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-[var(--border)] rounded transition-colors"
                aria-label="Clear selection"
              >
                <span className="text-[var(--muted)] text-lg leading-none">×</span>
              </button>
            )}
            <ChevronDown
              size={20}
              className={clsx(
                "text-[var(--muted)] transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {/* 모바일: 바텀 시트 */}
      {isMobile && (
        <BottomSheet
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSearchTerm("");
          }}
          title={label || "Select an option"}
        >
          {renderOptions()}
        </BottomSheet>
      )}

      {/* 데스크톱: 드롭다운 */}
      {!isMobile && isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg max-h-60 overflow-hidden">
          {renderOptions()}
        </div>
      )}

      {helperText && !error && (
        <p className="mt-1 text-xs text-[var(--muted)]">
          {helperText}
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;