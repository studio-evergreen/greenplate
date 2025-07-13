"use client";
import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";
import enMessages from "../../locales/en.json";
import koMessages from "../../locales/ko.json";

export default function TermsPage() {
  const { t, lang } = useLanguage();
  const messages = lang === "ko" ? koMessages : enMessages;

  return (
    <main className="flex-1 w-full px-4 py-12 max-w-3xl mx-auto">
      <Link href="/" className="inline-block mb-8 text-sm text-[var(--muted)] hover:underline">{t("common.goHome")}</Link>
      <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-8 font-inter">{t("terms.title")}</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">1. {t("terms.introduction")}</h2>
        <p className="text-[var(--muted)] mb-2">{t("terms.introductionText")}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">2. {t("terms.acceptance")}</h2>
        <p className="text-[var(--muted)] mb-2">{t("terms.acceptanceText")}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">3. {t("terms.privacyPolicy")}</h2>
        <p className="text-[var(--muted)] mb-2">
          {lang === "ko" ? (
            <>귀하의 프라이버시는 저희에게 중요합니다. 저희가 정보를 수집하고 사용하는 방법에 대한 자세한 내용은 <Link href="/privacy" className="underline">개인정보처리방침</Link>을(를) 참조하십시오.</>
          ) : (
            <>Your privacy is important to us. Please refer to our <Link href="/privacy" className="underline">Privacy Policy</Link> for details on how we collect and use your information.</>
          )}
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">4. {t("terms.userConduct")}</h2>
        <ul className="list-disc list-inside text-[var(--muted)] mb-2">
          {messages.terms.userConductItems.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">5. {t("terms.contact")}</h2>
        <p className="text-[var(--muted)]">
          {lang === "ko" ? (
            <>이 약관에 대해 질문이 있으시면 <span className="underline">terms@greenplate.com</span>로 문의하십시오.</>
          ) : (
            <>If you have any questions about these Terms, contact us at <span className="underline">terms@greenplate.com</span>.</>
          )}
        </p>
      </section>
    </main>
  );
}
