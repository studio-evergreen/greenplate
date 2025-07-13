"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";

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
  
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg"
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
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          {label}
        </label>
      )}
      
      <div
        className={clsx(
          "relative w-full bg-white dark:bg-gray-800 border rounded-xl cursor-pointer transition-colors",
          sizeStyles[size],
          error
            ? "border-red-500 focus-within:ring-red-500"
            : "border-gray-300 dark:border-gray-600 focus-within:ring-emerald-500",
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
                ? "text-gray-500 dark:text-gray-400" 
                : "text-gray-900 dark:text-gray-100"
            )}>
              {getDisplayValue()}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {clearable && selectedValues.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label="Clear selection"
              >
                <span className="text-gray-400 text-lg leading-none">×</span>
              </button>
            )}
            <ChevronDown
              size={20}
              className={clsx(
                "text-gray-400 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
              />
            </div>
          )}
          
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
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
                        : "hover:bg-gray-100 dark:hover:bg-gray-700",
                      isSelected && "bg-emerald-50 dark:bg-emerald-900/20"
                    )}
                    onClick={() => !option.disabled && handleOptionSelect(option.value)}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0">{option.icon}</span>
                    )}
                    <span className="flex-1 text-gray-900 dark:text-gray-100">
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
        </div>
      )}

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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