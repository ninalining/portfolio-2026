import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { defaultLocale, isSupportedLocale, ogLocaleMap } from "@/i18n/routing";
import type { LocalePageProps } from "@/types/locale";

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  return {
    openGraph: {
      locale: ogLocaleMap[resolvedLocale],
    },
  };
}

export default function Home() {
  const t = useTranslations("hero");

  return (
    <main>
      {/* Hero */}
      <section id="hero" aria-label="Introduction">
        <h1>{t("name")}</h1>
        <p>{t("title")}</p>
      </section>

      {/* About */}
      <section id="about" aria-label="About me">
        {/* TODO: About section */}
      </section>

      {/* Experience */}
      <section id="experience" aria-label="Work experience">
        {/* TODO: Experience section */}
      </section>

      {/* Skills */}
      <section id="skills" aria-label="Skills">
        {/* TODO: Skills section */}
      </section>

      {/* Projects */}
      <section id="projects" aria-label="Projects">
        {/* TODO: Projects section */}
      </section>

      {/* Contact */}
      <section id="contact" aria-label="Contact">
        {/* TODO: Contact section */}
      </section>
    </main>
  );
}
