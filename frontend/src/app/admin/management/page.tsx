'use client';

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, getCategories, createCategory, updateCategory, deleteCategory, getBrands, createBrand, updateBrand, deleteBrand, getSettings, updateSettings, getInquiries, updateInquiry, deleteInquiry } from '@/lib/api';

export default function ManagementPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'brands' | 'settings' | 'inquiries'>('users');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'pending' | 'done'>('pending');
  
  // Data Fetching
  const { data: users, isLoading: loadingUsers } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: categories, isLoading: loadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: brands, isLoading: loadingBrands } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  const { data: settings, isLoading: loadingSettings } = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const { data: inquiries, isLoading: loadingInquiries } = useQuery({ queryKey: ['inquiries'], queryFn: getInquiries });

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'CASHIER', active: true });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [brandForm, setBrandForm] = useState({ name: '', description: '' });

  const [settingsForm, setSettingsForm] = useState({ storeName: '', address: '', phone: '', currency: 'PKR', lowStockThreshold: 5, taxRate: 8.5, receiptHeader: '', receiptFooter: '' });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        storeName: settings.storeName || '',
        address: settings.address || '',
        phone: settings.phone || '',
        currency: settings.currency || 'PKR',
        lowStockThreshold: settings.lowStockThreshold || 5,
        taxRate: settings.taxRate ?? 8.5,
        receiptHeader: settings.receiptHeader || '',
        receiptFooter: settings.receiptFooter || ''
      });
    }
  }, [settings]);

  // Mutations
  const saveUserMutation = useMutation({
    mutationFn: (data: any) => editingUser ? updateUser(editingUser.id, data) : createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsUserModalOpen(false);
    },
    onError: (err: any) => alert(err.message || "Failed to save user")
  });

  const saveCategoryMutation = useMutation({
    mutationFn: (data: any) => editingCategory ? updateCategory(editingCategory.id, data) : createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
    },
    onError: (err: any) => alert(err.message || "Failed to save category")
  });

  const removeCategory = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const saveBrandMutation = useMutation({
    mutationFn: (data: any) => editingBrand ? updateBrand(editingBrand.id, data) : createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setIsBrandModalOpen(false);
    },
    onError: (err: any) => alert(err.message || "Failed to save brand")
  });

  const removeBrand = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brands'] })
  });

  const saveSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert("Settings saved successfully!");
    },
    onError: (err: any) => alert(err.message || "Failed to save settings")
  });

  const updateInquiryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateInquiry(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inquiries'] }),
    onError: (err: any) => alert(err.message || "Failed to update inquiry status")
  });

  const removeInquiryMutation = useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inquiries'] }),
    onError: (err: any) => alert(err.message || "Failed to delete inquiry")
  });

  // Modal Openers
  const openUserModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ name: user.name, email: user.email, password: '', role: user.role, active: user.active !== false });
    } else {
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'CASHIER', active: true });
    }
    setIsUserModalOpen(true);
  };

  const openCategoryModal = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '' });
    }
    setIsCategoryModalOpen(true);
  };

  const openBrandModal = (brand?: any) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandForm({ name: brand.name, description: brand.description || '' });
    } else {
      setEditingBrand(null);
      setBrandForm({ name: '', description: '' });
    }
    setIsBrandModalOpen(true);
  };

  const filteredInquiries = React.useMemo(() => {
    if (!inquiries) return [];
    if (inquiryFilter === 'all') return inquiries;
    return inquiries.filter((i: any) => i.status === inquiryFilter);
  }, [inquiries, inquiryFilter]);

  return (
    <div className="flex-1 overflow-auto p-margin-mobile md:p-gutter relative">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">System Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Configure users, taxonomies, and store settings.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-surface-container-highest pb-2 overflow-x-auto">
          {['users', 'categories', 'brands', 'settings', 'inquiries'].map(tab => (
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
          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm font-bold">User Accounts</h3>
                <button onClick={() => openUserModal()} className="bg-primary text-on-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span> Add User
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-highest">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : users?.map((u: any) => (
                    <tr key={u.id} className="border-b border-surface-container-highest hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold">{u.role}</span>
                      </td>
                      <td className="p-3">
                        {u.active !== false ? (
                           <span className="text-secondary font-bold text-sm flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Active</span>
                        ) : (
                           <span className="text-error font-bold text-sm flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">cancel</span> Inactive</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => openUserModal(u)} className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm font-bold">Categories</h3>
                <button onClick={() => openCategoryModal()} className="bg-primary text-on-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span> Add Category
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-highest">
                    <th className="p-3">Name</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingCategories ? <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr> : categories?.map((c: any) => (
                    <tr key={c.id} className="border-b border-surface-container-highest hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-medium">{c.name}</td>
                      <td className="p-3 text-on-surface-variant">{c.description}</td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <button onClick={() => openCategoryModal(c)} className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                        <button onClick={() => { if(confirm("Delete category?")) removeCategory.mutate(c.id); }} className="text-on-surface-variant hover:text-error p-1 rounded transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* BRANDS TAB */}
          {activeTab === 'brands' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm font-bold">Brands</h3>
                <button onClick={() => openBrandModal()} className="bg-primary text-on-primary px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span> Add Brand
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-highest">
                    <th className="p-3">Name</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingBrands ? <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr> : brands?.map((b: any) => (
                    <tr key={b.id} className="border-b border-surface-container-highest hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-medium">{b.name}</td>
                      <td className="p-3 text-on-surface-variant">{b.description}</td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <button onClick={() => openBrandModal(b)} className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                        <button onClick={() => { if(confirm("Delete brand?")) removeBrand.mutate(b.id); }} className="text-on-surface-variant hover:text-error p-1 rounded transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h3 className="font-headline-sm font-bold mb-6">System Settings</h3>
              {loadingSettings ? <p>Loading settings...</p> : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Store Name</label>
                      <input value={settingsForm.storeName} onChange={e => setSettingsForm({...settingsForm, storeName: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Currency</label>
                      <input value={settingsForm.currency} onChange={e => setSettingsForm({...settingsForm, currency: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Store Address / Phone</label>
                    <div className="flex gap-4">
                      <input placeholder="Address" value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="flex-1 border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
                      <input placeholder="Phone" value={settingsForm.phone} onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-48 border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Low Stock Alert Threshold</label>
                      <input type="number" min="1" value={settingsForm.lowStockThreshold} onChange={e => setSettingsForm({...settingsForm, lowStockThreshold: parseInt(e.target.value) || 5})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Tax Rate (%)</label>
                      <input type="number" step="0.1" min="0" value={settingsForm.taxRate} onChange={e => setSettingsForm({...settingsForm, taxRate: parseFloat(e.target.value) || 0})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Receipt Header Text</label>
                    <textarea value={settingsForm.receiptHeader} onChange={e => setSettingsForm({...settingsForm, receiptHeader: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none min-h-[80px]"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Receipt Footer Text</label>
                    <textarea value={settingsForm.receiptFooter} onChange={e => setSettingsForm({...settingsForm, receiptFooter: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none min-h-[80px]"></textarea>
                  </div>
                  <div className="pt-4 border-t border-surface-container-highest">
                    <button onClick={() => saveSettingsMutation.mutate(settingsForm)} disabled={saveSettingsMutation.isPending} className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50">
                      {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INQUIRIES TAB */}
          {activeTab === 'inquiries' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm font-bold">Customer Inquiries</h3>
                <div className="flex gap-2">
                  <button onClick={() => setInquiryFilter('all')} className={`px-4 py-1 text-sm rounded-full ${inquiryFilter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-high'}`}>All</button>
                  <button onClick={() => setInquiryFilter('pending')} className={`px-4 py-1 text-sm rounded-full ${inquiryFilter === 'pending' ? 'bg-primary text-on-primary' : 'bg-surface-container-high'}`}>Pending</button>
                  <button onClick={() => setInquiryFilter('done')} className={`px-4 py-1 text-sm rounded-full ${inquiryFilter === 'done' ? 'bg-primary text-on-primary' : 'bg-surface-container-high'}`}>Done</button>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-highest">
                    <th className="p-3">Date</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Message</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingInquiries ? <tr><td colSpan={7} className="p-4 text-center">Loading...</td></tr> : filteredInquiries?.map((i: any) => (
                    <tr key={i.id} className="border-b border-surface-container-highest hover:bg-surface-container-low transition-colors">
                      <td className="p-3 text-sm whitespace-nowrap">{new Date(i.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 font-medium">{i.name}</td>
                      <td className="p-3 text-sm text-on-surface-variant">{i.email}</td>
                      <td className="p-3 font-medium text-sm">{i.subject}</td>
                      <td className="p-3 text-sm text-on-surface-variant max-w-xs truncate" title={i.message}>{i.message}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${i.status === 'done' ? 'bg-secondary/20 text-secondary' : 'bg-error/20 text-error'}`}>
                          {i.status === 'done' ? 'Done' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <button onClick={() => updateInquiryMutation.mutate({ id: i.id, data: { status: i.status === 'done' ? 'pending' : 'done' }})} className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors" title="Toggle Status">
                          <span className="material-symbols-outlined text-[20px]">{i.status === 'done' ? 'undo' : 'check_circle'}</span>
                        </button>
                        <button onClick={() => { if(confirm("Delete this inquiry?")) removeInquiryMutation.mutate(i.id); }} className="text-on-surface-variant hover:text-error p-1 rounded transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInquiries?.length === 0 && !loadingInquiries && (
                    <tr><td colSpan={7} className="p-4 text-center text-on-surface-variant">No inquiries found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="font-headline-sm font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={e => { e.preventDefault(); saveUserMutation.mutate(userForm); }} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-bold">Name</label>
                <input required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-bold">Email</label>
                <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" disabled={!!editingUser} />
                {editingUser && <p className="text-xs text-on-surface-variant mt-1">Email cannot be changed.</p>}
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm mb-1 font-bold">Password</label>
                  <input required minLength={6} type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
                </div>
              )}
              {editingUser && (
                <div>
                  <label className="block text-sm mb-1 font-bold">New Password (Optional)</label>
                  <input minLength={6} type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" placeholder="Leave blank to keep current" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 font-bold">Role</label>
                  <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none">
                    <option value="CASHIER">Cashier</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1 font-bold">Status</label>
                  <select value={userForm.active ? 'true' : 'false'} onChange={e => setUserForm({...userForm, active: e.target.value === 'true'})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4 border-t border-surface-container-highest mt-6">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors">Cancel</button>
                <button type="submit" disabled={saveUserMutation.isPending} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-colors disabled:opacity-50">{saveUserMutation.isPending ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="font-headline-sm font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={e => { e.preventDefault(); saveCategoryMutation.mutate(categoryForm); }} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-bold">Name</label>
                <input required value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-bold">Description</label>
                <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="flex gap-2 justify-end pt-4 border-t border-surface-container-highest mt-6">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors">Cancel</button>
                <button type="submit" disabled={saveCategoryMutation.isPending} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-colors disabled:opacity-50">{saveCategoryMutation.isPending ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BRAND MODAL */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="font-headline-sm font-bold mb-4">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h3>
            <form onSubmit={e => { e.preventDefault(); saveBrandMutation.mutate(brandForm); }} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-bold">Name</label>
                <input required value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-bold">Description</label>
                <textarea value={brandForm.description} onChange={e => setBrandForm({...brandForm, description: e.target.value})} className="w-full border border-outline-variant bg-surface rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="flex gap-2 justify-end pt-4 border-t border-surface-container-highest mt-6">
                <button type="button" onClick={() => setIsBrandModalOpen(false)} className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors">Cancel</button>
                <button type="submit" disabled={saveBrandMutation.isPending} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-colors disabled:opacity-50">{saveBrandMutation.isPending ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
