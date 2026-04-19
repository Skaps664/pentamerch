'use client'

import { useMemo, useState } from 'react'
import type { Product } from '@/lib/data'
import { useSiteData } from '@/lib/site-data-context'

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Unable to read file'))
    reader.readAsDataURL(file)
  })
}

function emptyProduct(): Omit<Product, 'id'> {
  return {
    name: '',
    price: 0,
    originalPrice: 0,
    description: '',
    category: '',
    image: '',
    rating: 4,
    reviews: 0,
    inStock: true,
    isFeatured: false,
    isBestseller: false,
    images: [],
    specifications: {},
    keyFeatures: [],
    shippingInfo: [],
    returnInfo: [],
  }
}

function parseLineList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseSpecifications(value: string): Record<string, string> {
  return parseLineList(value).reduce<Record<string, string>>((acc, line) => {
    const [key, ...rest] = line.split(':')
    if (!key || rest.length === 0) {
      return acc
    }

    acc[key.trim()] = rest.join(':').trim()
    return acc
  }, {})
}

export default function AdminProductsPage() {
  const {
    products,
    categories,
    productPageConfig,
    setProductPageConfig,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useSiteData()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct())

  const categoryOptions = useMemo(
    () => categories.map((item) => ({ value: item.slug || item.id, label: item.name })),
    [categories]
  )

  const resetForm = () => {
    setEditingId(null)
    setIsFormOpen(false)
    setForm(emptyProduct())
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.category) {
      return
    }

    const additionalImages = (form.images ?? []).filter(Boolean)

    const payload: Omit<Product, 'id'> = {
      ...form,
      images: form.image
        ? [form.image, ...additionalImages.filter((item) => item !== form.image)]
        : additionalImages,
      originalPrice: form.originalPrice && form.originalPrice > 0 ? form.originalPrice : undefined,
      specifications: form.specifications ?? {},
      keyFeatures: form.keyFeatures ?? [],
      shippingInfo: form.shippingInfo ?? [],
      returnInfo: form.returnInfo ?? [],
    }

    if (editingId) {
      updateProduct(editingId, payload)
    } else {
      createProduct(payload)
    }

    resetForm()
  }

  const openCreateForm = () => {
    setEditingId(null)
    setForm(emptyProduct())
    setIsFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      category: product.category,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      inStock: product.inStock,
      isFeatured: product.isFeatured,
      isBestseller: product.isBestseller,
      images: (product.images ?? []).filter((item) => item !== product.image),
      specifications: product.specifications ?? {},
      keyFeatures: product.keyFeatures ?? [],
      shippingInfo: product.shippingInfo ?? [],
      returnInfo: product.returnInfo ?? [],
    })
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Products</h2>
        <p className="text-sm text-slate-600 mt-1">Create, edit, and remove products with full product page data fields and image uploads.</p>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Product Records</h3>
            <p className="text-sm text-slate-600 mt-1">Open the form only when you need to add or edit a product.</p>
          </div>
          <button
            onClick={openCreateForm}
            className="rounded-md bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-slate-800"
          >
            Create New Product
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Universal Product Page Banner</h3>
            <p className="text-sm text-slate-600 mt-1">This banner appears before Related Products on every product slug page.</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={productPageConfig.detailBanner.enabled}
              onChange={(e) =>
                setProductPageConfig({
                  ...productPageConfig,
                  detailBanner: {
                    ...productPageConfig.detailBanner,
                    enabled: e.target.checked,
                  },
                })
              }
            />
            Enable Banner
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Banner Title"
            value={productPageConfig.detailBanner.title}
            onChange={(e) =>
              setProductPageConfig({
                ...productPageConfig,
                detailBanner: {
                  ...productPageConfig.detailBanner,
                  title: e.target.value,
                },
              })
            }
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Button Text"
            value={productPageConfig.detailBanner.linkText}
            onChange={(e) =>
              setProductPageConfig({
                ...productPageConfig,
                detailBanner: {
                  ...productPageConfig.detailBanner,
                  linkText: e.target.value,
                },
              })
            }
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            placeholder="Banner Description"
            value={productPageConfig.detailBanner.text}
            onChange={(e) =>
              setProductPageConfig({
                ...productPageConfig,
                detailBanner: {
                  ...productPageConfig.detailBanner,
                  text: e.target.value,
                },
              })
            }
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Banner Link"
            value={productPageConfig.detailBanner.linkHref}
            onChange={(e) =>
              setProductPageConfig({
                ...productPageConfig,
                detailBanner: {
                  ...productPageConfig.detailBanner,
                  linkHref: e.target.value,
                },
              })
            }
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Banner Image URL"
            value={productPageConfig.detailBanner.image}
            onChange={(e) =>
              setProductPageConfig({
                ...productPageConfig,
                detailBanner: {
                  ...productPageConfig.detailBanner,
                  image: e.target.value,
                },
              })
            }
          />
        </div>

        <input
          type="file"
          accept="image/*"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm w-full"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) {
              return
            }
            const image = await toDataUrl(file)
            setProductPageConfig({
              ...productPageConfig,
              detailBanner: {
                ...productPageConfig.detailBanner,
                image,
              },
            })
          }}
        />
      </div>

      {isFormOpen ? (
        <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {editingId ? 'Edit Product' : 'Create Product'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Product Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            <textarea className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />

            <textarea
              className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
              rows={4}
              placeholder="Specifications (one per line, format: Key: Value)"
              value={Object.entries(form.specifications ?? {})
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}
              onChange={(e) => setForm((prev) => ({
                ...prev,
                specifications: parseSpecifications(e.target.value),
              }))}
            />

            <textarea
              className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
              rows={4}
              placeholder="Key Features (one line per feature)"
              value={(form.keyFeatures ?? []).join('\n')}
              onChange={(e) => setForm((prev) => ({ ...prev, keyFeatures: parseLineList(e.target.value) }))}
            />

            <textarea
              className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
              rows={4}
              placeholder="Shipping Information (one line per point)"
              value={(form.shippingInfo ?? []).join('\n')}
              onChange={(e) => setForm((prev) => ({ ...prev, shippingInfo: parseLineList(e.target.value) }))}
            />

            <textarea
              className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
              rows={4}
              placeholder="Returns & Buyer Protection (one line per point)"
              value={(form.returnInfo ?? []).join('\n')}
              onChange={(e) => setForm((prev) => ({ ...prev, returnInfo: parseLineList(e.target.value) }))}
            />

            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" placeholder="Price" value={form.price || ''} onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) || 0 }))} />
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" placeholder="Original Price" value={form.originalPrice || ''} onChange={(e) => setForm((prev) => ({ ...prev, originalPrice: Number(e.target.value) || 0 }))} />

            <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
              <option value="">Select Category</option>
              {categoryOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min="0" max="5" step="0.1" placeholder="Rating (0 to 5)" value={form.rating || ''} onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) || 0 }))} />

            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Main Image URL" value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} />
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
                setForm((prev) => ({ ...prev, image }))
              }}
            />

            <div className="md:col-span-2 rounded-md border border-slate-300 p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-800">Additional Images</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="block text-sm"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files ?? [])
                    if (files.length === 0) {
                      return
                    }

                    const uploaded = await Promise.all(files.map((file) => toDataUrl(file)))
                    setForm((prev) => ({
                      ...prev,
                      images: [...(prev.images ?? []), ...uploaded],
                    }))
                    e.currentTarget.value = ''
                  }}
                />
              </div>

              {(form.images ?? []).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(form.images ?? []).map((image, index) => (
                    <div key={`${image}-${index}`} className="rounded-md border border-slate-300 p-2">
                      <img src={image} alt={`Additional ${index + 1}`} className="h-20 w-full rounded object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            images: (prev.images ?? []).filter((_, imageIndex) => imageIndex !== index),
                          }))
                        }}
                        className="mt-2 w-full rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No additional images uploaded yet.</p>
              )}
            </div>

            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" placeholder="Reviews Count" value={form.reviews || ''} onChange={(e) => setForm((prev) => ({ ...prev, reviews: Number(e.target.value) || 0 }))} />

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((prev) => ({ ...prev, inStock: e.target.checked }))} />
                In Stock
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))} />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm((prev) => ({ ...prev, isBestseller: e.target.checked }))} />
                Best Seller
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} className="rounded-md bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-slate-800">
              {editingId ? 'Save Changes' : 'Create Product'}
            </button>
            <button onClick={resetForm} className="rounded-md border border-slate-300 px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100">
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-slate-300 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Product</th>
              <th className="text-left px-4 py-3 font-semibold">Category</th>
              <th className="text-left px-4 py-3 font-semibold">Price</th>
              <th className="text-left px-4 py-3 font-semibold">Stock</th>
              <th className="text-left px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-900">{product.name}</td>
                <td className="px-4 py-3 text-slate-700">{product.category}</td>
                <td className="px-4 py-3 text-slate-700">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-700">{product.inStock ? 'In Stock' : 'Out of Stock'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(product)}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
