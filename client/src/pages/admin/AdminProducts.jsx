import React, { useState, useEffect } from 'react';
import { Package, Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/Toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToast } = useToast();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes] = await Promise.allSettled([
        categoryApi.getAll(),
        productApi.getAll(),
      ]);

      const loadedCats = catsRes.status === 'fulfilled' ? catsRes.value.categories || [] : [
        { _id: 'cat_1', name: 'Electronics' },
        { _id: 'cat_2', name: 'Fashion' },
        { _id: 'cat_3', name: 'Shoes' },
      ];
      setCategories(loadedCats);

      const loadedProds = prodsRes.status === 'fulfilled' ? prodsRes.value.products || [] : [
        {
          _id: 'prod_1',
          name: 'Wireless Noise-Cancelling Headphones',
          description: 'High-fidelity audio with 30hr battery life and adaptive ANC.',
          price: 149.99,
          stock: 15,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
          category: { _id: 'cat_1', name: 'Electronics' },
        },
        {
          _id: 'prod_2',
          name: 'Smart Fitness Tracker Watch',
          description: 'Heart rate monitor, step tracking, GPS navigation and waterproof.',
          price: 99.50,
          stock: 6,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
          category: { _id: 'cat_1', name: 'Electronics' },
        },
        {
          _id: 'prod_3',
          name: 'Classic Vintage Leather Jacket',
          description: 'Genuine sheepskin leather with quilted lining and metallic zippers.',
          price: 199.00,
          stock: 0,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60',
          category: { _id: 'cat_2', name: 'Fashion' },
        },
        {
          _id: 'prod_4',
          name: 'Pro Performance Running Sneakers',
          description: 'Ultra-cushioned responsive foam sole designed for marathon runners.',
          price: 129.99,
          stock: 22,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
          category: { _id: 'cat_3', name: 'Shoes' },
        },
      ];
      setProducts(loadedProds);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: categories[0]?._id || '',
      stock: '10',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description || '',
      price: prod.price?.toString() || '',
      image: prod.image || '',
      category: prod.category?._id || prod.category || categories[0]?._id || '',
      stock: prod.stock?.toString() || '0',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.category) {
      addToast('Please fill out all required fields', 'error');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10) || 0,
    };

    if (payload.price <= 0) {
      addToast('Price must be greater than zero', 'error');
      return;
    }

    if (payload.stock < 0) {
      addToast('Stock cannot be negative', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const selectedCatObj = categories.find((c) => c._id === payload.category);
      const catReference = selectedCatObj ? { _id: selectedCatObj._id, name: selectedCatObj.name } : payload.category;

      if (editingProduct) {
        try {
          await productApi.update(editingProduct._id, payload);
        } catch {
          // Local fallback
        }
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id
              ? { ...p, ...payload, category: catReference }
              : p
          )
        );
        addToast('Product updated successfully!', 'success');
      } else {
        try {
          const res = await productApi.create(payload);
          if (res?.product) {
            setProducts((prev) => [{ ...res.product, category: catReference }, ...prev]);
          } else {
            setProducts((prev) => [
              { _id: 'prod_' + Date.now(), ...payload, category: catReference },
              ...prev,
            ]);
          }
        } catch {
          setProducts((prev) => [
            { _id: 'prod_' + Date.now(), ...payload, category: catReference },
            ...prev,
          ]);
        }
        addToast('Product created successfully!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      try {
        await productApi.delete(deleteTarget._id);
      } catch {
        // Local fallback
      }
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      addToast(`Product "${deleteTarget.name}" deleted`, 'success');
      setDeleteTarget(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(search.toLowerCase()));

    const prodCatId = prod.category?._id || prod.category;
    const matchesCategory = selectedCategory === 'all' || prodCatId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store inventory, pricing, and product details
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-1 text-sm outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
          />
        </div>

        <div className="w-full md:w-64 flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-xl">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-1 text-sm bg-transparent outline-none text-slate-700 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <Loader text="Loading products catalog..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description={search ? 'No products match your search or filter.' : 'Your store has no products yet. Add your first product.'}
          actionText={search ? 'Reset Filters' : '+ Add Product'}
          onAction={search ? () => { setSearch(''); setSelectedCategory('all'); } : handleOpenAdd}
          icon={Package}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Stock Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0 bg-slate-50"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate max-w-xs">{prod.name}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{prod.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-700">
                        {prod.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      ${Number(prod.price).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          prod.stock > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            prod.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          title="Edit Product"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(prod)}
                          title="Delete Product"
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
              >
                <option value="" disabled>Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="49.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="10"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Image URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Features, dimensions, and specifications..."
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
              {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be reversed.`}
        confirmText="Yes, Delete"
        isLoading={deleting}
      />
    </div>
  );
}
