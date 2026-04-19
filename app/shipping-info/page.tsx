import type { Metadata } from 'next'
import { InformationPage } from '@/components/information-page'

export const metadata: Metadata = {
  title: 'Shipping Info | PentaMerch UK',
  description: 'Read delivery locations, timings, and shipping terms for PentaMerch orders in the UK.',
}

const sections = [
  {
    heading: 'Where We Deliver',
    paragraphs: [
      'PentaMerch is a UK-based ecommerce business and currently operates with primary delivery coverage across England, Scotland, Wales, and Northern Ireland. We partner with recognised courier networks to provide tracked services and delivery notifications.',
      'At checkout, available shipping methods and estimated windows are shown based on postcode and product type. Oversized, high-value, or restricted products may require a signature, age verification, or additional dispatch checks.',
    ],
  },
  {
    heading: 'Dispatch Times And Cut-Offs',
    paragraphs: [
      'Most in-stock items are dispatched within 1 to 2 working days. Orders submitted before 14:00 UK time on business days are prioritised for same-day fulfilment where possible, though this is not guaranteed during peak seasonal periods.',
      'If an item is out of stock after purchase, we will contact you promptly with options including waiting for restock, receiving a partial shipment, selecting an alternative item, or requesting a full refund for the unavailable line.',
    ],
    bullets: [
      'Standard UK Delivery: typically 2 to 4 working days after dispatch',
      'Express UK Delivery: typically next working day in qualifying postcodes',
      'Remote postcode areas: may require 1 to 2 extra working days',
      'Bank holidays and severe weather may delay final-mile courier performance',
    ],
  },
  {
    heading: 'Shipping Charges And Free Delivery',
    paragraphs: [
      'Shipping fees are calculated transparently at checkout. Promotional free delivery thresholds, where offered, are shown before payment. We do not add hidden handling fees after the order has been confirmed.',
      'Where an order contains multiple dispatch origins, we may split delivery into separate parcels to reduce delays. You will only be charged the shipping amount confirmed at checkout unless you request a paid delivery upgrade after ordering.',
    ],
  },
  {
    heading: 'Delivery Responsibility And Risk',
    paragraphs: [
      'Under UK consumer rules, goods remain our responsibility until they are delivered to you or a person identified by you to receive them. Please check parcels promptly and report missing or damaged items as soon as possible so we can investigate with the courier network.',
      'If tracking indicates delivery but you have not received the parcel, contact PentaMerch immediately. We will open a trace with the courier and provide a resolution in line with UK consumer protections and our internal fraud prevention controls.',
    ],
  },
  {
    heading: 'Sustainable Packaging Approach',
    paragraphs: [
      'PentaMerch follows a packaging reduction policy based on practical ecommerce standards. We use right-sized packaging where possible and encourage suppliers to reduce excess plastics. Protective materials are selected to balance product safety and environmental impact.',
      'Customers are encouraged to recycle cardboard, paper fill, and approved plastic components via local UK recycling schemes.',
    ],
  },
]

export default function ShippingInfoPage() {
  return (
    <InformationPage
      title="Shipping Info"
      intro="Everything you need to know about dispatch, delivery timelines, and shipping responsibility in the UK."
      lastUpdated="19 April 2026"
      sections={sections}
    />
  )
}
