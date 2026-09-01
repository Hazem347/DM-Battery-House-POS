'use client';
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getSales, getProducts, getCustomers, getSettings } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState<'30' | 'all'>('30');
  
  const { data: allSales, isLoading: isLoadingSales, isError: isErrorSales } = useQuery({
    queryKey: ['sales'],
    queryFn: () => getSales(),
    enabled: !!user
  });

  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    enabled: !!user
  });

  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const closeDropdown = () => setOpenDropdownId(null);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const printReceipt = () => {
    const printContent = document.getElementById('receipt-print-area');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const { data: customers, isError: isErrorCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    enabled: !!user
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  const sales = useMemo(() => {
    if (!allSales) return [];
    if (dateFilter === 'all') return allSales;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(dateFilter));
    return allSales.filter((s: any) => new Date(s.createdAt) >= cutoff);
  }, [allSales, dateFilter]);

  const stats = useMemo(() => {
    if (!sales || !products) return { totalRevenue: 0, activeInventory: 0, stockAlerts: 0, newPartners: 0 };
    
    const lowStockThreshold = settings?.lowStockThreshold || 5;

    const totalRevenue = sales.reduce((sum: number, sale: any) => sum + Number(sale.finalAmount), 0);
    const activeInventory = products.reduce((sum: number, p: any) => sum + (Number(p.inventory?.quantity) || 0), 0);
    const stockAlerts = products.filter((p: any) => (p.inventory?.quantity || 0) <= lowStockThreshold).length;
    
    return {
      totalRevenue,
      activeInventory,
      stockAlerts,
      newPartners: customers ? customers.length : 0
    };
  }, [sales, products, customers, settings]);

  const chartData = useMemo(() => {
    if (!sales) return Array(6).fill(0);
    const grouped = sales.reduce((acc: any, sale: any) => {
      const month = new Date(sale.createdAt).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month] += Number(sale.finalAmount);
      return acc;
    }, {});
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(m => grouped[m] || 0);
  }, [sales]);

  const salesTodayCount = useMemo(() => {
    if (!allSales) return 0;
    const today = new Date().toDateString();
    return allSales.filter((s: any) => new Date(s.createdAt).toDateString() === today).length;
  }, [allSales]);

  const isConnected = !isErrorSales && !isErrorProducts && !isErrorCustomers;

  const maxChartValue = Math.max(...chartData, 100000);

  const handleExport = () => {
    if (!sales || sales.length === 0) {
      alert('No sales data to export.');
      return;
    }
    const csvRows = [
      ['Receipt No', 'Date', 'Amount', 'Tax', 'Discount', 'Payment Method'].join(','),
      ...sales.map((s: any) => [
        s.receiptNumber,
        new Date(s.createdAt).toLocaleDateString(),
        s.finalAmount,
        s.tax || 0,
        s.discount || 0,
        s.paymentMethod || 'N/A'
      ].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 p-gutter lg:p-margin-desktop overflow-y-auto w-full max-w-container-max mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-primary mb-1">Overview</h2>
          <p className="font-body-lg text-on-surface-variant">Real-time performance metrics for DM Battery House.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setDateFilter(dateFilter === '30' ? 'all' : '30')}
            className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-label-sm flex items-center gap-2 hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {dateFilter === '30' ? 'Last 30 Days' : 'All Time'}
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-label-sm flex items-center gap-2 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Card 1: Total Sales */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Total Sales</p>
            <div className="p-2 bg-primary-container/20 rounded-lg text-primary">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-md text-on-surface mb-1">{formatCurrency(stats.totalRevenue)}</h3>
            <p className="font-label-sm text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +12.5% from last month
            </p>
          </div>
        </div>

        {/* Card 2: Active Inventory */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Active Inventory</p>
            <div className="p-2 bg-secondary-container/30 rounded-lg text-secondary">
              <span className="material-symbols-outlined text-[20px]">inventory</span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-md text-on-surface mb-1">{stats.activeInventory}</h3>
            <p className="font-label-sm text-on-surface-variant flex items-center gap-1">
              Units in warehouse
            </p>
          </div>
        </div>

        {/* Card 3: Stock Alerts */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Stock Alerts</p>
            <div className="p-2 bg-error-container/50 rounded-lg text-error">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-md text-on-surface mb-1">{stats.stockAlerts}</h3>
            <p className={`font-label-sm flex items-center gap-1 ${stats.stockAlerts > 0 ? 'text-error' : 'text-secondary'}`}>
              <span className="material-symbols-outlined text-[16px]">{stats.stockAlerts > 0 ? 'priority_high' : 'check'}</span>
              {stats.stockAlerts > 0 ? 'Requires immediate action' : 'All good'}
            </p>
          </div>
        </div>

        {/* Card 4: New Partners */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">New Partners</p>
            <div className="p-2 bg-primary-container/20 rounded-lg text-primary">
              <span className="material-symbols-outlined text-[20px]">group_add</span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-md text-on-surface mb-1">{stats.newPartners}</h3>
            <p className="font-label-sm text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +5% this week
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-on-surface">Revenue Trend</h3>
            <select className="bg-surface border border-outline-variant rounded-md text-sm py-1 pl-2 pr-8 focus:ring-primary focus:border-primary outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 relative mt-4">
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-outline pr-2 w-10 border-r border-outline-variant/20">
              <span>{Math.round(maxChartValue / 1000)}k</span>
              <span>{Math.round(maxChartValue * 0.75 / 1000)}k</span>
              <span>{Math.round(maxChartValue * 0.5 / 1000)}k</span>
              <span>{Math.round(maxChartValue * 0.25 / 1000)}k</span>
              <span>0</span>
            </div>
            
            <div className="absolute left-10 right-0 top-0 h-full flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-outline-variant/10"></div>
              <div className="w-full border-t border-outline-variant/10"></div>
              <div className="w-full border-t border-outline-variant/10"></div>
              <div className="w-full border-t border-outline-variant/10"></div>
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            
            <div className="ml-12 flex-1 flex items-end justify-around h-full pb-px z-10">
              {chartData.map((val, i) => {
                const heightPercent = Math.max((val / maxChartValue) * 100, 5);
                return (
                  <div key={i} className="w-full max-w-[40px] flex flex-col items-center group relative cursor-pointer">
                    <div className={`w-full ${heightPercent > 70 ? 'bg-secondary/30' : 'bg-surface-container-high'} rounded-t-sm group-hover:bg-primary/20 transition-colors`} style={{ height: `${heightPercent}%` }}></div>
                    <div className={`w-full ${heightPercent > 70 ? 'bg-secondary' : 'bg-primary'} rounded-b-sm group-hover:bg-primary-container transition-colors shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]`} style={{ height: '20%' }}></div>
                    <span className="text-xs text-outline mt-2 absolute -bottom-6">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* System Overview */}
        {user?.role !== 'CASHIER' && (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface">System Overview</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isConnected ? 'bg-secondary/20 text-secondary' : 'bg-error/20 text-error'}`}>
                <span className="material-symbols-outlined text-[14px]">{isConnected ? 'wifi' : 'wifi_off'}</span>
                {isConnected ? 'Connected' : 'Connection Error'}
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-container/20 text-primary rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Total Products</span>
                </div>
                <span className="font-headline-sm font-bold text-on-surface">{products?.length || 0}</span>
              </div>
              
              <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary-container/20 text-secondary rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">people</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Registered Customers</span>
                </div>
                <span className="font-headline-sm font-bold text-on-surface">{customers?.length || 0}</span>
              </div>
              
              <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-tertiary-container/20 text-tertiary rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Sales Today</span>
                </div>
                <span className="font-headline-sm font-bold text-on-surface">{salesTodayCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions Table Area */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
          <h3 className="font-headline-md text-on-surface">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant font-label-sm tracking-wider uppercase">
                <th className="py-3 px-6 font-semibold">Order ID</th>
                <th className="py-3 px-6 font-semibold">Payment</th>
                <th className="py-3 px-6 font-semibold">Date</th>
                <th className="py-3 px-6 font-semibold text-right">Amount</th>
                <th className="py-3 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="font-mono-data text-on-surface divide-y divide-outline-variant/10">
              {isLoadingSales ? (
                <tr><td colSpan={5} className="py-8 text-center text-on-surface-variant">Loading transactions...</td></tr>
              ) : sales?.slice(0, 5).map((sale: any) => (
                <tr key={sale.id} className="hover:bg-surface-container-low/50 transition-colors h-[48px]">
                  <td className="py-2 px-6 text-primary">{sale.receiptNumber}</td>
                  <td className="py-2 px-6 font-medium text-on-surface">{sale.paymentMethod || 'N/A'}</td>
                  <td className="py-2 px-6 text-on-surface-variant">{new Date(sale.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-6 text-right font-bold">{formatCurrency(sale.finalAmount)}</td>
                  <td className="py-2 px-6 text-right relative">
                    <button 
                      className="text-outline hover:text-primary transition-colors p-1" 
                      onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === sale.id ? null : sale.id); }}
                    >
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                    {openDropdownId === sale.id && (
                      <div className="absolute right-6 top-full mt-1 bg-surface shadow-lg border border-outline-variant/30 rounded p-1 z-50 min-w-[150px] text-left">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedSale(sale); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-surface-variant rounded">View Details</button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedSale(sale); setTimeout(() => printReceipt(), 100); setOpenDropdownId(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-surface-variant rounded">Print Receipt</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {sales?.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-on-surface-variant">No recent transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface p-8 rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-sm font-bold">Receipt Details</h3>
              <button onClick={() => setSelectedSale(null)} className="text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm">
                <p><strong>Receipt:</strong> {selectedSale.receiptNumber}</p>
                <p><strong>Date:</strong> {new Date(selectedSale.createdAt).toLocaleString()}</p>
                <p><strong>Total:</strong> {formatCurrency(selectedSale.finalAmount)}</p>
                <p><strong>Payment:</strong> {selectedSale.paymentMethod || 'N/A'}</p>
                <p><strong>Cashier UID:</strong> {selectedSale.cashierId}</p>
              </div>
              
              <button 
                onClick={printReceipt}
                className="w-full flex items-center justify-center py-3 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-colors mt-4"
              >
                <span className="material-symbols-outlined align-middle mr-2 text-sm">print</span>
                Print Receipt
              </button>
            </div>
          </div>
          
          <div id="receipt-print-area" className="hidden">
            <div style={{ padding: '20px', fontFamily: 'monospace', width: '300px', margin: '0 auto', color: '#000' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>DM Battery House</h2>
              <p style={{ textAlign: 'center', margin: 0 }}>Receipt: {selectedSale.receiptNumber}</p>
              <p style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Date: {new Date(selectedSale.createdAt).toLocaleString()}</p>
              <p style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Cashier UID: {selectedSale.cashierId}</p>
              <table style={{ width: '100%', marginBottom: '20px', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px dashed #000' }}>
                    <th style={{ textAlign: 'left', paddingBottom: '5px' }}>Item</th>
                    <th style={{ textAlign: 'right', paddingBottom: '5px' }}>Qty</th>
                    <th style={{ textAlign: 'right', paddingBottom: '5px' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ paddingTop: '5px' }}>{item.productName || 'Product'}</td>
                      <td style={{ textAlign: 'right', paddingTop: '5px' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', paddingTop: '5px' }}>{formatCurrency(item.unitPrice * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ borderTop: '1px dashed #000', paddingTop: '10px', textAlign: 'right', fontSize: '12px' }}>
                <p>Subtotal: {formatCurrency(selectedSale.totalAmount)}</p>
                <p>Tax: {formatCurrency(selectedSale.tax)}</p>
                {selectedSale.discount > 0 && <p>Discount: -{formatCurrency(selectedSale.discount)}</p>}
                <h3 style={{ marginTop: '10px' }}>Total: {formatCurrency(selectedSale.finalAmount)}</h3>
              </div>
              <p style={{ textAlign: 'center', marginTop: '20px' }}>Thank you for your business!</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
