'use client';

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/lib/api';

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  });

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: {id: number, customer: any}) => updateCustomer(data.id, data.customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  const openModal = (customer?: any) => {
    if (customer) {
      setEditingId(customer.id);
      setFormData({ name: customer.name, email: customer.email || '', phone: customer.phone || '', address: customer.address || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, customer: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-margin-mobile md:p-gutter relative">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Customer Management</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage customer profiles and purchase history.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Customer
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest font-label-sm text-label-sm text-on-surface-variant">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center">Loading...</td></tr>
              ) : customers?.map((c: any) => (
                <tr key={c.id} className="hover:bg-surface-container/30 transition-colors group">
                  <td className="p-4 text-on-surface font-medium">{c.name}</td>
                  <td className="p-4 text-on-surface-variant">{c.email || '-'}</td>
                  <td className="p-4 text-on-surface-variant">{c.phone || '-'}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(c)} className="p-1 text-on-surface-variant hover:text-primary transition-all hover:scale-110 active:scale-95"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button onClick={() => deleteMutation.mutate(c.id)} className="p-1 text-on-surface-variant hover:text-error transition-all hover:scale-110 active:scale-95"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-surface p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all scale-100">
            <h3 className="font-headline-sm font-bold mb-4">{editingId ? 'Edit Customer' : 'Add Customer'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-on-surface">Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2 bg-surface-container-lowest" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-on-surface">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg p-2 bg-surface-container-lowest" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-on-surface">Phone</label>
                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-lg p-2 bg-surface-container-lowest" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-on-surface">Address</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border rounded-lg p-2 bg-surface-container-lowest" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-on-surface border hover:bg-surface-variant transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
