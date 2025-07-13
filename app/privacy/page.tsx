"use client";
import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";
import enMessages from "../../locales/en.json";
import koMessages from "../../locales/ko.json";

export default function PrivacyPage() {
  const { t, lang } = useLanguage();
  const messages = lang === "ko" ? koMessages : enMessages;

  return (
    <main className="flex-1 w-full px-4 py-12 max-w-3xl mx-auto">
      <Link href="/" className="inline-block mb-8 text-sm text-[var(--muted)] hover:underline">{t("common.goHome")}</Link>
      <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-8 font-inter">{t("privacy.title")}</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">1. {t("privacy.introduction")}</h2>
        <p className="text-[var(--muted)] mb-2">{t("privacy.introductionText")}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">2. {t("privacy.informationWeCollect")}</h2>
        <ul className="list-disc list-inside text-[var(--muted)] mb-2">
          {messages.privacy.informationWeCollectItems.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">3. {t("privacy.useOfInformation")}</h2>
        <ul className="list-disc list-inside text-[var(--muted)] mb-2">
          {messages.privacy.useOfInformationItems.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">4. {t("privacy.dataRetention")}</h2>
        <p className="text-[var(--muted)] mb-2">{t("privacy.dataRetentionText")}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">5. {t("privacy.contact")}</h2>
        <p className="text-[var(--muted)]">
          {lang === "ko" ? (
            <>이 개인정보처리방침에 대해 질문이 있으시면 <span className="underline">privacy@greenplate.com</span>로 문의하십시오.</>
          ) : (
            <>If you have any questions about this Privacy Policy, contact us at <span className="underline">privacy@greenplate.com</span>.</>
          )}
        </p>
      </section>
    </main>
  );
}
