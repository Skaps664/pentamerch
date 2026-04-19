import type { Metadata } from 'next'
import { InformationPage } from '@/components/information-page'

export const metadata: Metadata = {
  title: 'Terms of Service | PentaMerch UK',
  description: 'Read the terms that govern purchases and use of the PentaMerch website in the UK.',
}

const sections = [
  {
    heading: 'Agreement Scope',
    paragraphs: [
      'These Terms of Service govern your use of the PentaMerch website and purchases made through our ecommerce platform. By using our site or placing an order, you agree to these terms together with linked policies, including Shipping Info, Returns, Privacy Policy, and Cookies notice.',
      'PentaMerch serves customers in the United Kingdom and these terms are intended to operate in alignment with applicable UK consumer law. Nothing in these terms is designed to remove rights granted by law.',
    ],
  },
  {
    heading: 'Orders And Contract Formation',
    paragraphs: [
      'Product listings are invitations to purchase and not binding offers. Your order is placed when you complete checkout and payment authorisation succeeds. A contract is formed when PentaMerch accepts your order and sends confirmation of dispatch or explicit acceptance by email.',
      'We may decline or cancel orders for reasons including payment verification issues, pricing errors, stock unavailability, or suspected fraud. If payment has already been captured, a refund is issued promptly using the original method.',
    ],
  },
  {
    heading: 'Pricing, Payments, And Promotions',
    paragraphs: [
      'Prices shown on the website are presented at checkout before payment confirmation. Promotional codes and offers are subject to stated eligibility, validity periods, and exclusions. Offers cannot be exchanged for cash unless explicitly required by law.',
      'PentaMerch takes reasonable care to ensure pricing accuracy. If a clear pricing error occurs and you could reasonably have recognised it, we may contact you to reconfirm or cancel the order before dispatch.',
    ],
  },
  {
    heading: 'Delivery, Risk, And Title',
    paragraphs: [
      'Delivery terms, timelines, and exceptions are set out in our Shipping Info page. Risk passes to the customer on delivery to the provided address or nominated recipient. Title to goods passes once full payment is received and goods are delivered, subject to applicable law.',
      'You are responsible for providing accurate delivery details. Additional charges caused by incorrect addresses or missed delivery instructions may apply where permitted and clearly communicated.',
    ],
  },
  {
    heading: 'Returns, Faults, And Liability',
    paragraphs: [
      'Return and refund procedures are explained in our Returns policy and are applied in line with UK legal protections. For faulty goods, your statutory remedies may include repair, replacement, price reduction, or refund depending on timing and circumstances.',
      'PentaMerch does not exclude liability for death or personal injury caused by negligence, fraud, or any liability that cannot legally be limited or excluded under UK law. For other losses, liability is limited to foreseeable losses arising directly from breach of contract.',
    ],
  },
  {
    heading: 'Use Of Website Content',
    paragraphs: [
      'All site content, including branding, text, imagery, and design elements, belongs to PentaMerch or its licensors unless otherwise stated. You may use the website for personal, lawful shopping activity but may not copy, redistribute, or exploit content commercially without permission.',
      'You must not misuse the website through malicious activity, unauthorised access attempts, scraping that harms service stability, or conduct that interferes with other customers.',
    ],
  },
  {
    heading: 'Governing Law And Disputes',
    paragraphs: [
      'These terms are governed by the laws of England and Wales. Consumers resident in Scotland or Northern Ireland may also rely on mandatory protections and local jurisdiction rules available to them under UK law.',
      'If a dispute arises, please contact us first at support@pentamerch.co.uk so we can attempt resolution quickly and fairly.',
    ],
  },
]

export default function TermsOfServicePage() {
  return (
    <InformationPage
      title="Terms of Service"
      intro="These terms set out the legal framework for using PentaMerch and purchasing products through our UK ecommerce platform."
      lastUpdated="19 April 2026"
      sections={sections}
    />
  )
}
