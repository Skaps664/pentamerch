import type { Metadata } from 'next'
import { InformationPage } from '@/components/information-page'

export const metadata: Metadata = {
  title: 'Privacy Policy | PentaMerch UK',
  description: 'Learn how PentaMerch collects, uses, and protects personal data in line with UK GDPR.',
}

const sections = [
  {
    heading: 'Who We Are',
    paragraphs: [
      'PentaMerch Ltd is the data controller for personal information processed through our website and customer support channels. We are a UK-focused ecommerce business and handle personal data in accordance with UK data protection law, including the UK GDPR and the Data Protection Act 2018.',
      'For privacy enquiries, contact privacy@pentamerch.co.uk. Our support team can route your request to the correct data governance contact for handling and response.',
    ],
  },
  {
    heading: 'What Data We Collect',
    paragraphs: [
      'To provide ecommerce services, we collect information such as your name, delivery and billing addresses, contact details, order history, payment status tokens, and customer service interactions. We also collect technical website usage data for security, fraud prevention, and performance monitoring.',
      'We do not intentionally collect special category data unless you provide it in customer service correspondence. Please avoid sharing unnecessary sensitive information in open text fields.',
    ],
    bullets: [
      'Account and checkout data: name, email, phone, postcode, addresses',
      'Transaction data: ordered items, order values, payment status references',
      'Service data: chat transcripts, support tickets, delivery issue correspondence',
      'Technical data: IP address, browser type, session diagnostics, security logs',
    ],
  },
  {
    heading: 'Legal Bases For Processing',
    paragraphs: [
      'PentaMerch processes personal data under one or more legal bases depending on the context. For example, we process order and delivery data to perform our contract with you. We process certain records to comply with legal obligations such as accounting and anti-fraud requirements.',
      'Where we rely on legitimate interests, we assess necessity and balance against your rights. Marketing communications are managed according to consent and opt-out preferences where required by UK rules including PECR.',
    ],
  },
  {
    heading: 'How We Use Your Data',
    paragraphs: [
      'We use personal data to process orders, arrange delivery, handle payments, provide customer support, manage returns, and improve store operations. We also use security and anomaly detection controls to reduce fraud and account misuse.',
      'Analytics and service diagnostics help us optimise website reliability and checkout performance. We apply access controls and role-based permissions so only relevant staff and providers can handle customer information needed for service delivery.',
    ],
  },
  {
    heading: 'Sharing Data With Third Parties',
    paragraphs: [
      'PentaMerch shares limited data with trusted service providers where necessary, including payment processors, delivery partners, hosting services, and customer support tools. Providers are required to protect data, process it only on our documented instructions, and meet contractual security obligations.',
      'If data is transferred outside the UK, appropriate safeguards are used, such as adequacy regulations or approved contractual mechanisms, to protect equivalent privacy standards.',
    ],
  },
  {
    heading: 'Retention And Security',
    paragraphs: [
      'We retain personal data only as long as required for service, legal, tax, and fraud prevention needs. Retention periods vary by data category. When data is no longer necessary, it is deleted or anonymised in line with documented retention schedules.',
      'Security measures include encrypted transmission, monitoring controls, access management, and incident response procedures. No online system is risk-free, but PentaMerch continuously reviews controls against evolving threats.',
    ],
  },
  {
    heading: 'Your Rights',
    paragraphs: [
      'Under UK data protection law, you may have rights to access, correct, erase, restrict, or object to processing of personal data, and to data portability where applicable. You may also withdraw consent for consent-based processing at any time.',
      'To exercise rights, email privacy@pentamerch.co.uk. We may need to verify identity before actioning requests. If you are dissatisfied, you can complain to the UK Information Commissioner\'s Office (ICO).',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <InformationPage
      title="Privacy Policy"
      intro="This policy explains how PentaMerch processes personal information when you use our UK ecommerce services."
      lastUpdated="19 April 2026"
      sections={sections}
    />
  )
}
