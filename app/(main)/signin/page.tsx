import { Metadata } from "next";
import SigninForm from "./components/SigninForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
  robots: "noindex, nofollow"
};

export default function SigninPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full min-h-screen bg-[var(--background)] px-4 py-12">
      <SigninForm />
    </main>
  );
} 