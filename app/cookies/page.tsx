import type { Metadata } from 'next'
import { InformationPage } from '@/components/information-page'

export const metadata: Metadata = {
  title: 'Cookies | PentaMerch UK',
  description: 'Understand how PentaMerch uses cookies and similar technologies on our website.',
}

const sections = [
  {
    heading: 'What Cookies Are',
    paragraphs: [
      'Cookies are small text files stored on your device when you visit a website. They allow websites to remember settings, keep users signed in where applicable, preserve cart selections, and understand how services are used.',
      'PentaMerch also uses similar technologies such as local storage and tracking pixels for security, analytics, and service optimisation. These technologies are managed in line with UK privacy and electronic communications rules.',
    ],
  },
  {
    heading: 'Types Of Cookies We Use',
    paragraphs: [
      'Some cookies are strictly necessary to run core site features, including navigation stability, checkout sessions, and fraud protection. Other cookies support analytics, performance measurement, and user experience improvements.',
      'Where consent is required, non-essential cookies are only activated after your choice. You can update preferences at any time through cookie settings controls when available.',
    ],
    bullets: [
      'Strictly necessary cookies: required for core ecommerce and security functions',
      'Performance cookies: help us understand speed, errors, and user flows',
      'Analytics cookies: provide aggregated usage insights for service improvement',
      'Preference cookies: remember selected options for a smoother experience',
    ],
  },
  {
    heading: 'Why We Use Cookies',
    paragraphs: [
      'PentaMerch uses cookies to ensure the store works reliably, to protect customer accounts and payment sessions, and to evaluate product discovery and checkout performance. This helps us reduce friction and follow best-practice ecommerce standards used by leading retailers.',
      'We use aggregated data wherever possible and avoid collecting more information than is necessary for the purpose being served.',
    ],
  },
  {
    heading: 'Managing Cookie Choices',
    paragraphs: [
      'Most browsers let you block or delete cookies through settings. If you disable essential cookies, some parts of the website may not function correctly, including cart persistence and checkout continuity.',
      'You can also control certain analytics and advertising settings through browser tools or device-level privacy controls. Preferences are device- and browser-specific and may need to be re-applied after clearing data.',
    ],
  },
  {
    heading: 'Third-Party Cookies And Updates',
    paragraphs: [
      'Some services integrated into the PentaMerch platform, such as payment, analytics, or embedded content providers, may set third-party cookies according to their own notices. We contract with providers carefully and review integrations for compliance and necessity.',
      'We may update this Cookies page as our technology stack evolves. Material changes will be reflected by updating the revision date and, where required, requesting renewed consent.',
    ],
  },
]

export default function CookiesPage() {
  return (
    <InformationPage
      title="Cookies"
      intro="This page explains how PentaMerch uses cookies and similar technologies for secure and effective UK ecommerce operations."
      lastUpdated="19 April 2026"
      sections={sections}
    />
  )
}
