'use client';

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, getCategories, createCategory, deleteCategory, getBrands, createBrand, deleteBrand } from '@/lib/api';

export default function ManagementPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'brands' | 'settings'>('users');
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newBrand, setNewBrand] = useState({ name: '', description: '' });

  const { data: users, isLoading: loadingUsers } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: categories, isLoading: loadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: brands, isLoading: loadingBrands } = useQuery({ queryKey: ['brands'], queryFn: getBrands });

  const addCategory = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategory({ name: '', description: '' });
    }
  });

  const removeCategory = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const addBrand = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setNewBrand({ name: '', description: '' });
    }
  });

  const removeBrand = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brands'] })
  });

  return (
    <div className="flex-1 overflow-auto p-margin-mobile md:p-gutter">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">System Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Configure users, taxonomies, and store settings.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-surface-container-highest pb-2 overflow-x-auto">
          {['users', 'categories', 'brands', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-t-lg font-label-md capitalize transition-colors ${activeTab === tab ? 'bg-primary text-on-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-6 shadow-sm min-h-[400px]">
          {activeTab === 'users' && (
            <div>
              <h3 className="font-headline-sm font-bold mb-4">User Accounts</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? <tr><td colSpan={3}>Loading...</td></tr> : users?.map((u: any) => (
                    <tr key={u.id} className="border-b hover:bg-surface-container">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full bg-primary-container text-on-primary-container text-xs">{u.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h3 className="font-headline-sm font-bold mb-4">Categories</h3>
              <div className="flex gap-4 mb-6">
                <input placeholder="Name" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} className="border p-2 rounded" />
                <input placeholder="Description" value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})} className="border p-2 rounded flex-1" />
                <button onClick={() => addCategory.mutate(newCategory)} className="bg-primary text-on-primary px-4 py-2 rounded">Add</button>
              </div>
              <table className="w-full text-left border-collapse">
                <tbody>
                  {loadingCategories ? <tr><td>Loading...</td></tr> : categories?.map((c: any) => (
                    <tr key={c.id} className="border-b hover:bg-surface-container">
                      <td className="p-3 font-medium">{c.name}</td>
                      <td className="p-3 text-on-surface-variant">{c.description}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => removeCategory.mutate(c.id)} className="text-error hover:scale-110 transition-transform"><span className="material-symbols-outlined">delete</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'brands' && (
            <div>
              <h3 className="font-headline-sm font-bold mb-4">Brands</h3>
              <div className="flex gap-4 mb-6">
                <input placeholder="Name" value={newBrand.name} onChange={e => setNewBrand({...newBrand, name: e.target.value})} className="border p-2 rounded" />
                <input placeholder="Description" value={newBrand.description} onChange={e => setNewBrand({...newBrand, description: e.target.value})} className="border p-2 rounded flex-1" />
                <button onClick={() => addBrand.mutate(newBrand)} className="bg-primary text-on-primary px-4 py-2 rounded">Add</button>
              </div>
              <table className="w-full text-left border-collapse">
                <tbody>
                  {loadingBrands ? <tr><td>Loading...</td></tr> : brands?.map((b: any) => (
                    <tr key={b.id} className="border-b hover:bg-surface-container">
                      <td className="p-3 font-medium">{b.name}</td>
                      <td className="p-3 text-on-surface-variant">{b.description}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => removeBrand.mutate(b.id)} className="text-error hover:scale-110 transition-transform"><span className="material-symbols-outlined">delete</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="font-headline-sm font-bold mb-4">System Settings</h3>
              <p className="text-on-surface-variant">Store configuration, tax rates, and email settings will be configured here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
