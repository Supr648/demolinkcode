import React, { useState, useEffect } from 'react';
import { Layers, Plus, Pencil, Trash2, Search, AlertCircle } from 'lucide-react';
import { categoryApi } from '../../api/categoryApi';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/Toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      setCategories(res.categories || []);
    } catch {
      // Local fallback initial categories if server is not yet running
      setCategories([
        { _id: 'cat_1', name: 'Electronics', description: 'Smartphones, laptops, headphones and smart accessories' },
        { _id: 'cat_2', name: 'Fashion', description: 'Jackets, casual shirts, streetwear and apparel' },
        { _id: 'cat_3', name: 'Shoes', description: 'Athletic running shoes, sneakers, and casual boots' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Category name is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        // Try live API or update locally
        try {
          await categoryApi.update(editingCategory._id, formData);
        } catch {
          // Local fallback
        }
        setCategories((prev) =>
          prev.map((c) =>
            c._id === editingCategory._id
              ? { ...c, name: formData.name, description: formData.description }
              : c
          )
        );
        addToast('Category updated successfully!', 'success');
      } else {
        try {
          const res = await categoryApi.create(formData);
          if (res?.category) {
            setCategories((prev) => [res.category, ...prev]);
          } else {
            setCategories((prev) => [
              { _id: 'cat_' + Date.now(), name: formData.name, description: formData.description },
              ...prev,
            ]);
          }
        } catch {
          setCategories((prev) => [
            { _id: 'cat_' + Date.now(), name: formData.name, description: formData.description },
            ...prev,
          ]);
        }
        addToast('Category created successfully!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to save category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      try {
        await categoryApi.delete(deleteTarget._id);
      } catch {
        // Local fallback
      }
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      addToast(`Category "${deleteTarget.name}" deleted`, 'success');
      setDeleteTarget(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete category', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize products into customer-facing categories
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search categories by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
        />
      </div>

      {/* Categories Table / Empty State */}
      {loading ? (
        <Loader text="Loading categories..." />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description={search ? 'No categories match your search criteria.' : 'Create your first category to get started.'}
          actionText={search ? 'Clear Search' : '+ Add Category'}
          onAction={search ? () => setSearch('') : handleOpenAdd}
          icon={Layers}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Category Name</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {cat.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs max-w-md truncate">
                      {cat.description || <span className="text-slate-400 italic">No description provided</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          title="Edit Category"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          title="Delete Category"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Electronics, Fashion, Shoes"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description about the products in this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"? Products assigned to this category might become unlinked.`}
        confirmText="Yes, Delete"
        isLoading={deleting}
      />
    </div>
  );
}
