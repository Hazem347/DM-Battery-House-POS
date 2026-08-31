'use client';

import React, { useState, useMemo, useRef } from "react";
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories, createSale } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';

interface CartItem {
  product: any;
  quantity: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [heldCarts, setHeldCarts] = useState<CartItem[][]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedSale, setCompletedSale] = useState<any | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p: any) => p.categoryId === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p: any) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string | number, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
  }, [cart]);

  const tax = useMemo(() => subtotal * 0.085, [subtotal]);
  const grandTotal = useMemo(() => subtotal + tax - discount, [subtotal, tax, discount]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      const saleData = {
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.salePrice
        })),
        totalAmount: subtotal,
        discount: discount,
        tax: tax,
        finalAmount: grandTotal,
        paymentMethod: 'CASH',
        amountPaid: grandTotal,
        changeAmount: 0
      };
      
      const saleResponse = await createSale(saleData);
      
      setCompletedSale(saleResponse);
      setCart([]);
      setDiscount(0);
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleHoldCart = () => {
    if (cart.length === 0) return;
    setHeldCarts(prev => [...prev, cart]);
    setCart([]);
    setDiscount(0);
  };

  const handleRestoreCart = (index: number) => {
    const cartToRestore = heldCarts[index];
    setCart(cartToRestore);
    setHeldCarts(prev => prev.filter((_, i) => i !== index));
  };

  const printReceipt = () => {
    const printContent = document.getElementById('receipt-print-area');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore React state cleanly
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Category Sidebar & Product Grid */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-bright">
        {/* Search Bar */}
        <div className="px-gutter pt-4 pb-2">
          <div className="relative w-full max-w-lg">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">search</span>
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-gutter py-2 flex gap-2 overflow-x-auto border-b border-outline-variant/20">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low'}`}
          >
            All Products
          </button>
          {categories?.map((cat: any) => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-gutter">
          {isLoadingProducts ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product: any) => (
                <div 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col group"
                >
                  <div className="h-32 bg-surface-container flex items-center justify-center p-4 relative">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-4xl">add_circle</span>
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-mono-data text-mono-data font-semibold text-on-surface line-clamp-2 mb-1">{product.name}</h3>
                    <p className="text-xs text-outline mb-2">SKU: {product.sku}</p>
                    <div className="mt-auto flex justify-between items-end">
                      <span className="font-headline-md text-headline-md text-primary">{formatCurrency(product.salePrice)}</span>
                      <span className="text-xs text-secondary-container bg-secondary/10 px-2 py-1 rounded font-medium">{product.inventory?.quantity || 0} in stock</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-outline">
                  No products found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Cart Panel */}
      <aside className="w-96 bg-surface-container-lowest border-l border-outline-variant/20 flex flex-col h-full shadow-lg z-10">
        {/* Cart Header */}
        <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low relative group">
          <h2 className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">shopping_cart</span>
            Current Order
          </h2>
          <div className="flex gap-2 items-center">
            {heldCarts.length > 0 && (
              <div className="relative group/hold">
                <button className="bg-secondary text-on-secondary text-xs px-2 py-1 rounded font-bold">
                  {heldCarts.length} Held
                </button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover/hold:block bg-surface shadow-lg border rounded p-2 z-50 min-w-[200px]">
                  <h4 className="text-xs font-bold mb-2">Held Carts</h4>
                  {heldCarts.map((hc, i) => (
                    <button key={i} onClick={() => handleRestoreCart(i)} className="w-full text-left text-sm hover:bg-surface-variant p-2 rounded flex justify-between">
                      <span>Cart {i + 1}</span>
                      <span className="font-mono-data">{hc.length} items</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <span className="bg-primary text-on-primary text-xs px-2 py-1 rounded-full font-bold">{cart.length} Items</span>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-outline text-center p-4">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">shopping_cart</span>
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="p-3 bg-surface rounded-lg border border-outline-variant/30 flex flex-col gap-2 relative group">
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="absolute top-2 right-2 text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                <div className="flex justify-between items-start pr-6">
                  <h4 className="font-mono-data text-mono-data text-sm font-semibold text-on-surface">{item.product.name}</h4>
                  <span className="font-semibold text-primary">{formatCurrency(item.product.salePrice)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center bg-surface-container rounded-full border border-outline-variant/50 overflow-hidden">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors">-</button>
                    <span className="w-8 text-center text-sm font-mono-data">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors">+</button>
                  </div>
                  <span className="text-sm font-bold text-on-surface">{formatCurrency(item.product.salePrice * item.quantity)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Checkout */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-mono-data">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Tax (8.5%)</span>
              <span className="font-mono-data">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-sm text-on-surface-variant text-secondary">
              <span>Discount</span>
              <span className="font-mono-data">-{formatCurrency(discount)}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-outline-variant/30 flex justify-between items-center">
              <span className="text-lg font-bold text-on-surface">Grand Total</span>
              <span className="text-2xl font-bold text-primary font-mono-data">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={handleHoldCart} disabled={cart.length === 0} className="py-2 px-4 bg-surface border border-outline-variant text-on-surface rounded flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors text-sm font-medium disabled:opacity-50">
              <span className="material-symbols-outlined text-base">pause_circle</span> Hold
            </button>
            <button 
              onClick={() => { setCart([]); setDiscount(0); }}
              className="py-2 px-4 bg-surface border border-outline-variant text-error rounded flex items-center justify-center gap-2 hover:bg-error-container transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined text-base">delete</span> Void
            </button>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? (
               <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-symbols-outlined">point_of_sale</span>
                Checkout
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Receipt Print Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface p-8 rounded-xl shadow-xl w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="font-headline-sm font-bold mb-2">Sale Completed!</h3>
            <p className="text-on-surface-variant mb-6">The transaction was successful.</p>
            
            <div className="space-y-3">
              <button 
                onClick={printReceipt}
                className="w-full flex items-center justify-center py-3 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-colors"
              >
                <span className="material-symbols-outlined align-middle mr-2 text-sm">print</span>
                Print Receipt
              </button>
              <button 
                onClick={() => setCompletedSale(null)} 
                className="w-full py-3 bg-surface-variant text-on-surface-variant rounded-lg font-bold hover:bg-surface-container transition-colors"
              >
                Start New Sale
              </button>
            </div>
          </div>
          
          {/* Hidden Print Area */}
          <div id="receipt-print-area" className="hidden">
            <div style={{ padding: '20px', fontFamily: 'monospace', width: '300px', margin: '0 auto', color: '#000' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>DM Battery House</h2>
              <p style={{ textAlign: 'center', margin: 0 }}>Receipt: {completedSale.receiptNumber}</p>
              <p style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Date: {new Date().toLocaleString()}</p>
              <table style={{ width: '100%', marginBottom: '20px', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px dashed #000' }}>
                    <th style={{ textAlign: 'left', paddingBottom: '5px' }}>Item</th>
                    <th style={{ textAlign: 'right', paddingBottom: '5px' }}>Qty</th>
                    <th style={{ textAlign: 'right', paddingBottom: '5px' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {completedSale.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ paddingTop: '5px' }}>{item.productName || 'Product'}</td>
                      <td style={{ textAlign: 'right', paddingTop: '5px' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', paddingTop: '5px' }}>{formatCurrency(item.unitPrice * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ borderTop: '1px dashed #000', paddingTop: '10px', textAlign: 'right', fontSize: '12px' }}>
                <p>Subtotal: {formatCurrency(completedSale.totalAmount)}</p>
                <p>Tax: {formatCurrency(completedSale.tax)}</p>
                {completedSale.discount > 0 && <p>Discount: -{formatCurrency(completedSale.discount)}</p>}
                <h3 style={{ marginTop: '10px' }}>Total: {formatCurrency(completedSale.finalAmount)}</h3>
              </div>
              <p style={{ textAlign: 'center', marginTop: '20px' }}>Thank you for your business!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
