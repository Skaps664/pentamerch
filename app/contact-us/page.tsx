import type { Metadata } from 'next'
import { InformationPage } from '@/components/information-page'

export const metadata: Metadata = {
  title: 'Contact Us | PentaMerch UK',
  description: 'Get in touch with PentaMerch customer support in the United Kingdom.',
}

const sections = [
  {
    heading: 'How To Reach PentaMerch',
    paragraphs: [
      'Our UK support team is available from Monday to Friday, 09:00 to 18:00 (UK time), excluding bank holidays in England and Wales. We aim to answer all customer contacts quickly and clearly, whether you need order updates, product advice, account help, or after-sales support.',
      'For routine enquiries, email support is usually the fastest and most traceable method. For urgent delivery issues, please include your order number in the subject line so that our team can prioritise the case.',
    ],
    bullets: [
      'Email: support@pentamerch.co.uk',
      'Customer Care Phone: +44 20 7946 0184',
      'Business Address: PentaMerch Ltd, 42 Merchant Street, Manchester, M1 2AB, United Kingdom',
      'Press and Partnerships: partnerships@pentamerch.co.uk',
    ],
  },
  {
    heading: 'Response Times And Service Commitments',
    paragraphs: [
      'PentaMerch follows customer experience standards used by leading ecommerce retailers. We send immediate confirmation when your message is received, provide a named case reference, and keep communication in one thread to reduce repeated explanations.',
      'Typical first-response times are under 24 hours for email and under 5 minutes for live chat (during staffed hours). Complex investigations, such as courier incident checks or payment network verification, may take longer, but we provide progress updates at least every 48 hours until resolution.',
    ],
    bullets: [
      'Order tracking question: usually resolved same day',
      'Refund or replacement request: reviewed within 2 working days',
      'Technical product issue: triage in 1 working day and full response in up to 3 working days',
      'Formal complaint acknowledgement: within 3 working days',
    ],
  },
  {
    heading: 'Complaints And Escalations',
    paragraphs: [
      'If you are unhappy with a purchase or service interaction, please contact us first so we can investigate and put things right. Your complaint is logged and reviewed by our customer operations supervisor. We keep records of contact dates, proposed resolutions, and outcomes for fairness and service quality monitoring.',
      'For UK consumers, your statutory rights remain unaffected under the Consumer Rights Act 2015 and related legislation. If we cannot resolve your complaint directly, we will explain available next steps and provide any documentation required for independent resolution channels where applicable.',
    ],
  },
  {
    heading: 'Accessibility And Inclusive Support',
    paragraphs: [
      'PentaMerch is committed to serving customers with different accessibility needs. If you need larger text, plain-language explanations, or alternative communication formats, let us know and we will adapt where reasonably possible.',
      'Customers who require communication support can ask for follow-up summaries by email after a phone call so all agreed actions are clearly documented.',
    ],
  },
]

export default function ContactUsPage() {
  return (
    <InformationPage
      title="Contact Us"
      intro="Speak with the PentaMerch UK team for support before and after your purchase."
      lastUpdated="19 April 2026"
      sections={sections}
    />
  )
}
