'use client';

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getCategories, getBrands, createProduct, updateProduct, deleteProduct, uploadImage } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const [formData, setFormData] = useState({ name: '', sku: '', salePrice: 0, purchasePrice: 0, capacity: '', voltage: '', warranty: '', barcode: '', description: '', images: '' });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: {id: number, product: any}) => updateProduct(data.id, data.product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const openModal = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        sku: product.sku,
        salePrice: product.salePrice,
        purchasePrice: product.purchasePrice || 0,
        capacity: product.capacity || '',
        voltage: product.voltage || '',
        warranty: product.warranty || '',
        barcode: product.barcode || '',
        description: product.description || '',
        images: product.images || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', sku: '', salePrice: 0, purchasePrice: 0, capacity: '', voltage: '', warranty: '', barcode: '', description: '', images: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const data = await uploadImage(e.target.files[0]);
        // Backend runs on 5000, but axios in lib/api.ts already has baseURL.
        // We will store the relative URL in the DB: e.g. '/uploads/file.png'
        setFormData({ ...formData, images: data.url });
      } catch (err) {
        console.error('Upload failed', err);
        alert('Image upload failed');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, product: { ...formData, salePrice: Number(formData.salePrice), purchasePrice: Number(formData.purchasePrice) } });
    } else {
      createMutation.mutate({ ...formData, salePrice: Number(formData.salePrice), purchasePrice: Number(formData.purchasePrice) });
    }
  };

  const handleBulkExport = () => {
    if (!products) return;
    const csvRows = [
      ['ID', 'Name', 'SKU', 'Sale Price', 'Purchase Price', 'Stock'].join(','),
      ...products.map((p: any) => [
        p.id, `"${p.name}"`, p.sku, p.salePrice, p.purchasePrice, p.inventory?.quantity || 0
      ].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProducts = products?.filter((p: any) => {
    const matchesText = p.name.toLowerCase().includes(filterText.toLowerCase()) || p.sku.toLowerCase().includes(filterText.toLowerCase());
    if (!matchesText) return false;
    
    if (statusFilter === 'all') return true;
    
    const stock = p.inventory?.quantity || 0;
    const isOut = stock === 0;
    const isLow = stock > 0 && stock <= (p.minStockLevel || 5);
    
    if (statusFilter === 'in_stock') return stock > 0 && !isLow;
    if (statusFilter === 'low_stock') return isLow;
    if (statusFilter === 'out_of_stock') return isOut;
    
    return true;
  });

  return (
    <div className="flex-1 overflow-auto p-margin-mobile md:p-gutter">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Inventory Management</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage stock levels, pricing, and product details.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">search</span>
              <input 
                type="text" 
                placeholder="Filter name/SKU..." 
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none shadow-sm"
              />
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 pl-3 pr-8 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none shadow-sm"
            >
              <option value="all">All Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <button onClick={handleBulkExport} className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface hover:bg-surface-container-low hover:scale-105 active:scale-95 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Bulk Export
            </button>
            <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-md">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-highest font-label-sm text-label-sm text-on-surface-variant">
                  <th className="p-4 font-semibold whitespace-nowrap">Product</th>
                  <th className="p-4 font-semibold whitespace-nowrap">SKU</th>
                  <th className="p-4 font-semibold whitespace-nowrap text-right">Unit Price</th>
                  <th className="p-4 font-semibold whitespace-nowrap text-right">Stock</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="p-4 font-semibold whitespace-nowrap text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="font-mono-data text-mono-data text-on-surface divide-y divide-surface-container-highest">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center font-sans">
                      Loading...
                    </td>
                  </tr>
                ) : filteredProducts?.map((product: any) => {
                  const stock = product.inventory?.quantity || 0;
                  const isOut = stock === 0;
                  const isLow = stock > 0 && stock <= (product.minStockLevel || 5);
                  
                  return (
                    <tr key={product.id} className={`${isOut ? 'bg-error-container/10' : isLow ? 'bg-tertiary-container/30' : 'hover:bg-surface-container/30'} transition-colors group`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`font-body-md text-body-md font-medium ${isOut ? 'text-on-surface-variant' : 'text-on-surface'} font-sans`}>{product.name}</div>
                        </div>
                      </td>
                      <td className="p-4 text-on-surface-variant">{product.sku}</td>
                      <td className="p-4 text-right font-medium text-on-surface-variant">{formatCurrency(product.salePrice)}</td>
                      <td className={`p-4 text-right font-bold ${isOut ? 'text-error' : isLow ? 'text-tertiary' : 'text-on-surface'}`}>{stock}</td>
                      <td className="p-4 font-sans">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container/50 text-on-error-container font-label-sm text-[11px] border border-error-container">Out of Stock</span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/50 text-on-tertiary-container font-label-sm text-[11px] border border-tertiary-container/50">Low Stock</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-[11px] border border-secondary-container">In Stock</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => openModal(product)} className="text-on-surface-variant hover:text-primary p-1 rounded transition-all hover:scale-110 active:scale-95">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => deleteMutation.mutate(product.id)} className="text-on-surface-variant hover:text-error p-1 rounded transition-all hover:scale-110 active:scale-95">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-sm font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm mb-1">Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Product Image</label>
                <div className="flex items-center gap-4">
                  {formData.images && <img src={formData.images.startsWith('http') ? formData.images : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${formData.images}`} alt="Preview" className="w-16 h-16 object-cover rounded-md" />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded-lg p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">SKU</label>
                <input required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Barcode</label>
                <input value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Sale Price</label>
                <input required type="number" step="0.01" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value)})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Purchase Price</label>
                <input required type="number" step="0.01" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: parseFloat(e.target.value)})} className="w-full border rounded-lg p-2" />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-surface-variant transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:scale-105 transition-transform">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
