import { Metadata } from "next";
import SignupForm from "./components/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your account",
  robots: "noindex, nofollow"
};

export default function SignupPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full min-h-screen bg-[var(--background)] px-4 py-12">
      <SignupForm />
    </main>
  );
} 