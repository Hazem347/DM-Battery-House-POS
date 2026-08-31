'use client';

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSales, deleteProduct } from '@/lib/api'; // note: lib/api.ts doesn't have deleteSale yet, let's just implement delete logic inline with firebase, or add it to api.ts. Wait, I should add deleteSale to api.ts first.
import { formatCurrency } from '@/lib/currency';

// We will add it to api.ts, but for now I'll use inline firebase
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SalesPage() {
  const queryClient = useQueryClient();
  const [selectedSale, setSelectedSale] = useState<any>(null);

  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: getSales
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'sales', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    }
  });

  const handleExport = () => {
    if (!sales) return;
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
    a.download = 'sales_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className="flex-1 overflow-auto p-margin-mobile md:p-gutter">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Sales History</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">View recent transactions and receipts.</p>
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface hover:bg-surface-container-low hover:scale-105 active:scale-95 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Sales
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest font-label-sm text-label-sm text-on-surface-variant">
                <th className="p-4 font-semibold">Receipt No</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold text-right">Total</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest font-mono-data">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center font-sans">Loading...</td></tr>
              ) : sales?.map((sale: any) => (
                <tr key={sale.id} className="hover:bg-surface-container/30 transition-colors group">
                  <td className="p-4 text-primary font-medium">{sale.receiptNumber}</td>
                  <td className="p-4 text-on-surface-variant">{new Date(sale.createdAt).toLocaleDateString()} {new Date(sale.createdAt).toLocaleTimeString()}</td>
                  <td className="p-4 text-on-surface-variant font-sans">{sale.customer?.name || 'Walk-in'}</td>
                  <td className="p-4 text-right text-on-surface font-bold">{formatCurrency(sale.finalAmount)}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-sans">Completed</span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setSelectedSale(sale)} className="text-on-surface-variant hover:text-primary p-1 rounded transition-all hover:scale-110 active:scale-95 mr-2">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button onClick={() => { if(confirm('Delete sale?')) deleteMutation.mutate(sale.id); }} className="text-on-surface-variant hover:text-error p-1 rounded transition-all hover:scale-110 active:scale-95">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {sales?.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center font-sans">No sales found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
}
