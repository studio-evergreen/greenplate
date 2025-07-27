import Link from "next/link";
import { siteConfig } from "../config";
import { ROUTES } from "@/lib/constants/routes";

export default function StaticTopbar() {
  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 min-h-[56px]">
        <div className="font-extrabold text-2xl tracking-tight text-[var(--foreground)] font-inter">
          <Link href={ROUTES.HOME}>{siteConfig.name}</Link>
        </div>
        <nav className="hidden md:flex gap-8 text-[var(--foreground)] text-[15px] font-medium font-inter">
          <Link href="/components">Components</Link>
          <Link href="/blog">Blog</Link>
          <Link href="#">Contact</Link>
          <Link href="#">Payments</Link>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-px h-6 bg-[var(--border)] mx-2" />
            <Link href={ROUTES.SIGNIN}>
              <span className="px-3 py-1 text-[15px] font-semibold font-inter">Sign In</span>
            </Link>
            <Link href={ROUTES.SIGNUP}>
              <span className="ml-2 px-4 py-1.5 text-[15px] font-semibold font-inter bg-emerald-600 text-white rounded-lg">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}