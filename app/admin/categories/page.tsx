'use client'

import { useState } from 'react'
import { useSiteData } from '@/lib/site-data-context'

const emptyForm = {
  id: '',
  name: '',
  slug: '',
  image: '',
  description: '',
}

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Unable to read file'))
    reader.readAsDataURL(file)
  })
}

export default function AdminCategoriesPage() {
  const {
    categories,
    products,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useSiteData()

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      return
    }

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: form.name,
          slug: form.slug,
          image: form.image,
          description: form.description,
        })
      } else {
        await createCategory({
          id: form.id || form.slug,
          name: form.name,
          slug: form.slug,
          image: form.image,
          description: form.description,
        })
      }

      resetForm()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to save category.')
    }
  }

  const usedCategoryIds = new Set(products.map((item) => item.category))

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Categories</h2>
        <p className="text-sm text-slate-600 mt-1">Create, edit, and delete product categories with clear labels and image support.</p>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          {editingId ? 'Edit Category' : 'Create Category'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Slug (example: electronics)"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
          />
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
          <textarea
            className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            rows={3}
            placeholder="Category Description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSubmit}
            className="rounded-md bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-slate-800"
          >
            {editingId ? 'Save Changes' : 'Create Category'}
          </button>
          {editingId ? (
            <button
              onClick={resetForm}
              className="rounded-md border border-slate-300 px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Slug</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-900">{category.name}</td>
                <td className="px-4 py-3 text-slate-700">{category.slug}</td>
                <td className="px-4 py-3 text-slate-700">
                  {usedCategoryIds.has(category.slug) || usedCategoryIds.has(category.id)
                    ? 'In use'
                    : 'Unused'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(category.id)
                        setForm({
                          id: category.id,
                          name: category.name,
                          slug: category.slug,
                          image: category.image,
                          description: category.description,
                        })
                      }}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        const hasProducts = products.some(
                          (item) => item.category === category.slug || item.category === category.id
                        )
                        if (hasProducts) {
                          window.alert('This category has products. Reassign or delete those products first.')
                          return
                        }

                        try {
                          await deleteCategory(category.id)
                        } catch (error) {
                          window.alert(error instanceof Error ? error.message : 'Unable to delete category.')
                        }
                      }}
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
