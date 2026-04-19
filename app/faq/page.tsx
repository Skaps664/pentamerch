import type { Metadata } from 'next'
import { InformationPage } from '@/components/information-page'

export const metadata: Metadata = {
  title: 'FAQ | PentaMerch UK',
  description: 'Find quick answers to common customer questions about shopping with PentaMerch.',
}

const sections = [
  {
    heading: 'Ordering And Payment',
    paragraphs: [
      'PentaMerch accepts major card payments and other checkout methods shown at payment stage. Orders are confirmed by email immediately after successful payment authorisation. If you do not receive an email, check spam folders and contact support with the name and postcode used at checkout.',
      'If payment is declined, no order is created. Please verify billing details and card security checks before trying again. For repeated issues, contact your payment provider and then speak to our support team for assistance.',
    ],
    bullets: [
      'Can I edit my order after payment? We can often help if dispatch has not started.',
      'Do you store card details? No full card details are not stored by PentaMerch.',
      'Can I request a VAT invoice? Yes, business customers can request one via support.',
    ],
  },
  {
    heading: 'Delivery Questions',
    paragraphs: [
      'Delivery estimates are shown at checkout and in your confirmation email. Once dispatched, tracking details are sent so you can monitor parcel progress in real time. Some carriers also offer delivery preference updates directly through their app or portal.',
      'If your parcel appears delayed, allow the full estimated window first, then contact PentaMerch with your order number so we can open a courier trace and keep you informed.',
    ],
  },
  {
    heading: 'Returns And Refunds',
    paragraphs: [
      'You can start a return by emailing support@pentamerch.co.uk. Include your order number, item details, and reason for return. We provide step-by-step guidance and confirm when the return is received and reviewed.',
      'Refunds are sent back to your original payment method after approval. Banking settlement times vary, but you will receive a confirmation email once the refund has been issued by PentaMerch.',
    ],
  },
  {
    heading: 'Product Information And Warranty',
    paragraphs: [
      'Product pages include key specifications, compatibility notes, and high-quality images. If you need additional technical details before purchase, our team can help verify fit, dimensions, and usage scenarios.',
      'Where manufacturer warranty applies, warranty length and process are explained in product documentation or on request. Your statutory rights as a UK consumer are always in addition to any commercial warranty terms.',
    ],
  },
  {
    heading: 'Account And Data',
    paragraphs: [
      'You can shop as a guest or through an account, depending on checkout options currently enabled on the platform. We process personal information according to our Privacy Policy and UK GDPR obligations.',
      'If you want to request access, correction, or deletion of personal data, contact privacy@pentamerch.co.uk and we will handle your request under applicable data protection timelines.',
    ],
  },
]

export default function FaqPage() {
  return (
    <InformationPage
      title="Frequently Asked Questions"
      intro="Quick answers about ordering, delivery, returns, payments, and account support at PentaMerch."
      lastUpdated="19 April 2026"
      sections={sections}
    />
  )
}
