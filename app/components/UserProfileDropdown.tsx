"use client";

import { useState, useRef, useEffect, memo, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { User as UserIcon, LogOut, Settings, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

interface UserProfileDropdownProps {
  user: User;
  onSignOut: () => void;
}

const UserProfileDropdown = memo(function UserProfileDropdown({ 
  user, 
  onSignOut 
}: UserProfileDropdownProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  const toggleOpen = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const handleSignOut = useCallback(() => {
    onSignOut();
    setOpen(false);
  }, [onSignOut]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--border)] transition-colors cursor-pointer"
        onClick={toggleOpen}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt="프로필 이미지"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover border border-[var(--border)]"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--card)] border border-[var(--border)]">
            <UserIcon size={18} className="text-[var(--muted)]" />
          </div>
        )}
        <ChevronDown size={14} className={`text-[var(--muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--card)] rounded-xl shadow-lg border border-[var(--border)] z-50 py-2 animate-fade-in">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="프로필 이미지"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)]">
                  <UserIcon size={24} className="text-[var(--muted)]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                  {user.user_metadata?.name || user.user_metadata?.full_name || "사용자"}
                </p>
                <p className="text-xs text-[var(--muted)] truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="py-1">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--border)] transition-colors cursor-pointer">
              <Settings size={16} className="text-[var(--muted)]" />
              <span>{t("topbar.settings")}</span>
            </button>
            
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--border)] transition-colors cursor-pointer"
            >
              <LogOut size={16} className="text-[var(--muted)]" />
              <span>{t("topbar.logout")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default UserProfileDropdown;