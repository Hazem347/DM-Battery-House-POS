'use client';

import React, { useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { getSales, getProducts } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const [dateFilter, setDateFilter] = useState<'7' | '30' | 'all'>('all');

  const { data: allSales, isLoading: isLoadingSales } = useQuery({
    queryKey: ['sales'],
    queryFn: () => getSales()
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const sales = useMemo(() => {
    if (!allSales) return [];
    if (dateFilter === 'all') return allSales;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(dateFilter));
    return allSales.filter((s: any) => new Date(s.createdAt) >= cutoff);
  }, [allSales, dateFilter]);

  const stats = useMemo(() => {
    if (!sales || !products) return { totalRevenue: 0, totalSales: 0, avgOrderValue: 0, inventoryValue: 0 };
    const totalRevenue = sales.reduce((sum: number, sale: any) => sum + Number(sale.finalAmount), 0);
    const inventoryValue = products.reduce((sum: number, p: any) => sum + (Number(p.purchasePrice || 0) * (p.inventory?.quantity || 0)), 0);
    return {
      totalRevenue,
      totalSales: sales.length,
      avgOrderValue: sales.length ? totalRevenue / sales.length : 0,
      inventoryValue
    };
  }, [sales, products]);

  const chartData = useMemo(() => {
    if (!sales) return [];
    // Group sales by date
    const grouped = sales.reduce((acc: any, sale: any) => {
      const date = new Date(sale.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = 0;
      acc[date] += Number(sale.finalAmount);
      return acc;
    }, {});
    
    return Object.keys(grouped).map(date => ({
      date,
      revenue: grouped[date]
    })).reverse(); // Oldest first for chart left-to-right
  }, [sales]);

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
    a.download = 'sales_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-auto p-margin-mobile md:p-gutter">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Reports & Analytics</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">View detailed insights on sales, inventory, and business performance.</p>
          </div>
          <div className="flex gap-3 items-center">
            <select 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value as any)}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-2 font-label-sm text-sm outline-none"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-md">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Report
            </button>
          </div>
        </div>

        {/* Real Data Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <p className="font-label-sm text-on-surface-variant mb-1">Total Revenue</p>
            <p className="font-headline-md font-bold text-primary">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <p className="font-label-sm text-on-surface-variant mb-1">Total Sales</p>
            <p className="font-headline-md font-bold text-primary">{stats.totalSales}</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <p className="font-label-sm text-on-surface-variant mb-1">Average Order Value</p>
            <p className="font-headline-md font-bold text-primary">{formatCurrency(stats.avgOrderValue)}</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <p className="font-label-sm text-on-surface-variant mb-1">Inventory Asset Value</p>
            <p className="font-headline-md font-bold text-primary">{formatCurrency(stats.inventoryValue)}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-highest shadow-sm">
          <h3 className="font-headline-sm font-bold text-on-surface mb-6">Revenue Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#006c4b" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest overflow-hidden shadow-sm">
           <div className="p-4 border-b border-surface-container-highest">
             <h3 className="font-headline-sm font-bold text-on-surface">Recent Sales</h3>
           </div>
           <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest font-label-sm text-label-sm text-on-surface-variant">
                <th className="p-4 font-semibold">Receipt No</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest font-mono-data">
              {isLoadingSales ? (
                <tr><td colSpan={3} className="p-8 text-center font-sans">Loading...</td></tr>
              ) : sales?.slice(0, 5).map((sale: any) => (
                <tr key={sale.id} className="hover:bg-surface-container/30 transition-colors group">
                  <td className="p-4 text-primary font-medium">{sale.receiptNumber}</td>
                  <td className="p-4 text-on-surface-variant">{new Date(sale.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right text-on-surface font-bold">{formatCurrency(sale.finalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
