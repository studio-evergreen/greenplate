import { Suspense } from "react";
import ClientFooter from "./ClientFooter";

export default function Footer() {
  return (
    <Suspense fallback={
      <footer className="w-full border-t border-[var(--border)] bg-[var(--background)] py-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6">
          <div className="text-sm text-[var(--foreground)] font-inter text-center sm:text-left">
            © {new Date().getFullYear()} GreenPlate. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm text-[var(--foreground)] font-inter">
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/terms" className="hover:underline">Terms</a>
            <a href="https://github.com/greenplate" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          </div>
        </div>
      </footer>
    }>
      <ClientFooter />
    </Suspense>
  );
}
