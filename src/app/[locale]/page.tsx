import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { defaultLocale, isSupportedLocale, locales, ogLocaleMap } from "@/i18n/routing";
import type { LocalePageProps } from "@/types/locale";
import { HeroSection } from "@/components/sections/HeroSection";

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  return {
    openGraph: {
      locale: ogLocaleMap[resolvedLocale],
    },
  };
}

export default async function Home({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />

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
