import {siteConfig} from "@/app/config";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full select-none">
      <h1 className="text-[var(--foreground)] text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 font-inter tracking-tight text-center">
          {siteConfig.name}
      </h1>
      <p className="text-[var(--foreground)] text-lg sm:text-xl font-medium font-inter text-center">
        Inspired by Supaplate
      </p>
    </main>
  );
}
