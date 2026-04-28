'use client'

import { useMemo, useState } from 'react'
import type { HomePageConfig } from '@/lib/site-data-context'
import { useSiteData } from '@/lib/site-data-context'

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Unable to read file'))
    reader.readAsDataURL(file)
  })
}

export default function AdminHomePageSettings() {
  const { homeConfig, products, setHomeConfig } = useSiteData()
  const [draft, setDraft] = useState<HomePageConfig>(homeConfig)
  const [saved, setSaved] = useState(false)

  const productOptions = useMemo(
    () => products.map((item) => ({ id: item.id, label: item.name })),
    [products]
  )

  const setSavedFlash = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const updateSection = <K extends keyof HomePageConfig>(
    key: K,
    value: HomePageConfig[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const toggleProductId = (
    key: 'featured' | 'bestSellers' | 'trending',
    productId: string
  ) => {
    const selected = draft[key].productIds
    const exists = selected.includes(productId)
    const productIds = exists
      ? selected.filter((item) => item !== productId)
      : [...selected, productId]

    updateSection(key, { ...draft[key], productIds })
  }

  const handleSlideUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const imageUrl = await toDataUrl(file)
    const nextSlides = [...draft.hero.slides]
    nextSlides[index] = imageUrl
    updateSection('hero', { ...draft.hero, slides: nextSlides })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Home Page Management</h2>
        <p className="text-sm text-slate-600 mt-1">
          Configure every home page section, set wording, choose products, and upload images.
        </p>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Hero Section</h3>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.hero.enabled}
              onChange={(e) => updateSection('hero', { ...draft.hero, enabled: e.target.checked })}
            />
            Show Section
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Hero Title" value={draft.hero.title} onChange={(e) => updateSection('hero', { ...draft.hero, title: e.target.value })} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="CTA Text" value={draft.hero.ctaText} onChange={(e) => updateSection('hero', { ...draft.hero, ctaText: e.target.value })} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Subtitle" value={draft.hero.subtitle} onChange={(e) => updateSection('hero', { ...draft.hero, subtitle: e.target.value })} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="CTA Link" value={draft.hero.ctaHref} onChange={(e) => updateSection('hero', { ...draft.hero, ctaHref: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {draft.hero.slides.map((slide, index) => (
            <div key={`slide-${index}`} className="rounded-md border border-slate-300 p-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Slide {index + 1}</p>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={slide}
                onChange={(e) => {
                  const nextSlides = [...draft.hero.slides]
                  nextSlides[index] = e.target.value
                  updateSection('hero', { ...draft.hero, slides: nextSlides })
                }}
              />
              <input type="file" accept="image/*" onChange={(e) => handleSlideUpload(e, index)} className="block w-full text-sm" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Featured Products Section</h3>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.featured.enabled}
              onChange={(e) => updateSection('featured', { ...draft.featured, enabled: e.target.checked })}
            />
            Show Section
          </label>
        </div>
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Section Title" value={draft.featured.title} onChange={(e) => updateSection('featured', { ...draft.featured, title: e.target.value })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-auto border border-slate-300 rounded-md p-3">
          {productOptions.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={draft.featured.productIds.includes(item.id)}
                onChange={() => toggleProductId('featured', item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <BannerEditor
        title="Banner One"
        value={draft.bannerOne}
        onChange={(value) => updateSection('bannerOne', value)}
      />

      <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Best Sellers Section</h3>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.bestSellers.enabled}
              onChange={(e) => updateSection('bestSellers', { ...draft.bestSellers, enabled: e.target.checked })}
            />
            Show Section
          </label>
        </div>
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Section Title" value={draft.bestSellers.title} onChange={(e) => updateSection('bestSellers', { ...draft.bestSellers, title: e.target.value })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-auto border border-slate-300 rounded-md p-3">
          {productOptions.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={draft.bestSellers.productIds.includes(item.id)}
                onChange={() => toggleProductId('bestSellers', item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Why Customers Choose Section</h3>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.trust.enabled}
              onChange={(e) => updateSection('trust', { ...draft.trust, enabled: e.target.checked })}
            />
            Show Section
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Eyebrow" value={draft.trust.eyebrow} onChange={(e) => updateSection('trust', { ...draft.trust, eyebrow: e.target.value })} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Section Title" value={draft.trust.title} onChange={(e) => updateSection('trust', { ...draft.trust, title: e.target.value })} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Section Subtitle" value={draft.trust.subtitle} onChange={(e) => updateSection('trust', { ...draft.trust, subtitle: e.target.value })} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Categories Section</h3>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.categories.enabled}
              onChange={(e) => updateSection('categories', { ...draft.categories, enabled: e.target.checked })}
            />
            Show Section
          </label>
        </div>
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Section Title" value={draft.categories.title} onChange={(e) => updateSection('categories', { ...draft.categories, title: e.target.value })} />
      </div>

      <BannerEditor
        title="Banner Two"
        value={draft.bannerTwo}
        onChange={(value) => updateSection('bannerTwo', value)}
      />

      <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Trending Section</h3>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.trending.enabled}
              onChange={(e) => updateSection('trending', { ...draft.trending, enabled: e.target.checked })}
            />
            Show Section
          </label>
        </div>
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Section Title" value={draft.trending.title} onChange={(e) => updateSection('trending', { ...draft.trending, title: e.target.value })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-auto border border-slate-300 rounded-md p-3">
          {productOptions.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={draft.trending.productIds.includes(item.id)}
                onChange={() => toggleProductId('trending', item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={async () => {
            try {
              await setHomeConfig(draft)
              setSavedFlash()
            } catch (error) {
              window.alert(error instanceof Error ? error.message : 'Unable to save home settings.')
            }
          }}
          className="rounded-md bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-slate-800"
        >
          Save Home Page Settings
        </button>
        {saved ? <p className="text-sm text-green-700">Saved successfully.</p> : null}
      </div>
    </div>
  )
}

function BannerEditor({
  title,
  value,
  onChange,
}: {
  title: string
  value: {
    enabled: boolean
    title: string
    subtitle: string
    ctaText: string
    ctaHref: string
    background: string
    image: string
  }
  onChange: (value: {
    enabled: boolean
    title: string
    subtitle: string
    ctaText: string
    ctaHref: string
    background: string
    image: string
  }) => void
}) {
  return (
    <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          />
          Show Section
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Title" />
        <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={value.ctaText} onChange={(e) => onChange({ ...value, ctaText: e.target.value })} placeholder="CTA Text" />
        <input className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={value.subtitle} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} placeholder="Subtitle" />
        <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={value.ctaHref} onChange={(e) => onChange({ ...value, ctaHref: e.target.value })} placeholder="CTA Link" />
        <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={value.background} onChange={(e) => onChange({ ...value, background: e.target.value })} placeholder="Tailwind background class" />
        <input className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={value.image} onChange={(e) => onChange({ ...value, image: e.target.value })} placeholder="Banner Image URL" />
        <input
          type="file"
          accept="image/*"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) {
              return
            }
            const image = await toDataUrl(file)
            onChange({ ...value, image })
          }}
        />
      </div>
    </div>
  )
}
