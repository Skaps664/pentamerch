import type { Metadata } from 'next'
import { InformationPage } from '@/components/information-page'

export const metadata: Metadata = {
  title: 'Returns | PentaMerch UK',
  description: 'Review the PentaMerch returns and refund process aligned with UK consumer protections.',
}

const sections = [
  {
    heading: 'Your UK Return Rights',
    paragraphs: [
      'PentaMerch applies return handling in line with UK consumer protections, including the Consumer Contracts Regulations 2013 for distance sales and the Consumer Rights Act 2015 for faulty or misdescribed goods. This policy explains our process and does not reduce your legal rights.',
      'For most online purchases, you may cancel within 14 days of receiving goods and then return within a further 14 days after telling us you want to cancel, subject to product exclusions required by law.',
    ],
  },
  {
    heading: 'Standard Returns Process',
    paragraphs: [
      'To start a return, contact support@pentamerch.co.uk with your order number, the item(s) you want to return, and the reason. We will issue return instructions and, where applicable, a prepaid label or arranged collection option.',
      'Returned items should be securely packaged and include all accessories, documentation, and original serial labels where relevant. We recommend using tracked return services if a prepaid label is not provided.',
    ],
    bullets: [
      'Request a return authorisation from PentaMerch support',
      'Pack items safely and include all relevant components',
      'Use the provided return label or approved tracked method',
      'Share tracking details if you arranged return transport yourself',
    ],
  },
  {
    heading: 'Refund Timelines',
    paragraphs: [
      'After returned goods are received and inspected, approved refunds are processed to the original payment method. We aim to complete refunds quickly and in all cases within legal requirements for eligible cancellations and accepted returns.',
      'Where a returned item shows signs of handling beyond what is necessary to establish nature, characteristics, and function, we may apply a value adjustment as permitted under UK regulations. Any adjustment is explained before final settlement.',
    ],
    bullets: [
      'Refund initiation target: within 3 working days of return approval',
      'Card settlement timing: usually 3 to 10 banking days depending on issuer',
      'Partial refunds: item-level calculations shown in confirmation email',
    ],
  },
  {
    heading: 'Faulty, Damaged, Or Incorrect Goods',
    paragraphs: [
      'If goods are faulty, damaged on arrival, or incorrect, notify us promptly with photos where possible. PentaMerch will provide a repair, replacement, price reduction, or refund as appropriate under the Consumer Rights Act 2015 and the circumstances of your order.',
      'If a fault appears within the first 30 days, customers typically have a short-term right to reject and request a refund, unless an alternative remedy is agreed. After this period, repair or replacement options may apply before a final refund pathway where legally required.',
    ],
  },
  {
    heading: 'Items That May Be Excluded',
    paragraphs: [
      'Certain goods may not be returnable for hygiene, health protection, or personalisation reasons once unsealed or customised, unless faulty. This includes products such as sealed beauty items, intimate wear, and made-to-order goods where exceptions apply by law.',
      'Any return restrictions are displayed clearly on product pages before checkout to support informed purchase decisions.',
    ],
  },
]

export default function ReturnsPage() {
  return (
    <InformationPage
      title="Returns"
      intro="Simple and transparent returns at PentaMerch, designed around trusted ecommerce standards and UK consumer law."
      lastUpdated="19 April 2026"
      sections={sections}
    />
  )
}
