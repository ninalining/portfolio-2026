import { Mail, MapPin, Linkedin, Github } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Profile } from '@/types/profile'
import type { Locale } from '@/i18n/routing'
import type { ContactFormLabels, ContactInfoItem, ContactSocialLink } from '@/types/contact'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { ContactForm } from '@/components/ui/ContactForm'

export async function ContactSection({ locale, profile }: { locale: Locale; profile: Profile }) {
  const t = await getTranslations({ locale, namespace: 'contact' })

  const locationItem: ContactInfoItem | null = profile.location
    ? {
        Icon: MapPin,
        label: t('locationLabel'),
        value: profile.location,
        href: null,
        iconBg: 'bg-lavender',
      }
    : null

  const contactItems: ContactInfoItem[] = [
    {
      Icon: Mail,
      label: t('emailLabel'),
      value: profile.email,
      href: `mailto:${profile.email}`,
      iconBg: 'bg-primary',
    },
    ...(locationItem ? [locationItem] : []),
  ]

  const socialLinks: ContactSocialLink[] = [
    {
      Icon: Linkedin,
      label: 'LinkedIn',
      href: profile.linkedin,
      iconBg: 'bg-primary',
    },
    {
      Icon: Github,
      label: 'GitHub',
      href: profile.github,
      iconBg: 'bg-yellow',
    },
  ]

  const formLabels: ContactFormLabels = {
    nameLabel: t('nameLabel'),
    namePlaceholder: t('namePlaceholder'),
    emailLabel: t('emailLabel'),
    emailPlaceholder: t('emailPlaceholder'),
    messageLabel: t('messageLabel'),
    messagePlaceholder: t('messagePlaceholder'),
    submit: t('submit'),
    successMessage: t('successMessage'),
  }

  return (
    <SectionWrapper
      id="contact"
      aria-label={t('sectionTitle')}
      className="bg-cream relative overflow-hidden"
    >
      {/* Background decorations */}
      <div
        className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full opacity-10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-80 h-80 bg-yellow rounded-full opacity-10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl mb-6 text-foreground">{t('sectionTitle')}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('sectionSubtitle')}
        </p>
      </div>

      {/* Two-column layout: 2/5 info + 3/5 form */}
      <div className="grid md:grid-cols-5 gap-8">
        {/* Left: contact info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-2xl font-medium mb-4 text-foreground">{t('letsTalkHeading')}</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">{t('letsTalkDesc')}</p>
          </div>

          {/* Contact items */}
          <div className="space-y-4" role="list" aria-label={t('sectionTitle')}>
            {contactItems.map(({ Icon, label, value, href, iconBg }) => (
              <div
                key={label}
                role="listitem"
                className="group flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div
                  className={`shrink-0 w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center shadow-md text-primary-foreground group-hover:scale-110 transition-transform`}
                  aria-hidden="true"
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-foreground truncate">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">{t('followLabel')}</p>
            <ul className="flex gap-3" aria-label={t('followLabel')}>
              {socialLinks.map(({ Icon, label, href, iconBg }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform shadow-md`}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: form */}
        <div className="md:col-span-3">
          <ContactForm labels={formLabels} />
        </div>
      </div>
    </SectionWrapper>
  )
}
