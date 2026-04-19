import Link from 'next/link'

interface InfoSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

interface InformationPageProps {
  title: string
  intro: string
  lastUpdated: string
  sections: InfoSection[]
}

export function InformationPage({
  title,
  intro,
  lastUpdated,
  sections,
}: InformationPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-base md:text-lg opacity-95 max-w-3xl">{intro}</p>
          <p className="text-sm mt-4 opacity-90">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-5 md:p-7 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Quick Links</p>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-primary">
              <Link href="/contact-us" className="hover:underline">Contact Us</Link>
              <Link href="/shipping-info" className="hover:underline">Shipping Info</Link>
              <Link href="/returns" className="hover:underline">Returns</Link>
              <Link href="/faq" className="hover:underline">FAQ</Link>
              <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:underline">Terms of Service</Link>
              <Link href="/cookies" className="hover:underline">Cookies</Link>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <article key={section.heading} className="rounded-xl border border-border bg-card p-5 md:p-7">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">{section.heading}</h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.heading}-${index}`} className="text-sm md:text-base leading-7 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="mt-4 space-y-2 list-disc pl-6 text-sm md:text-base text-muted-foreground">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
