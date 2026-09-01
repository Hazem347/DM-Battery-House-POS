'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';

export default function ProductsPage() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const [sortOption, setSortOption] = useState('Recommended');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    let result = products;

    if (searchQuery) {
      result = result.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p: any) => selectedCategories.includes(p.category?.name));
    }

    switch (sortOption) {
      case 'Price: Low to High':
        result = [...result].sort((a: any, b: any) => a.salePrice - b.salePrice);
        break;
      case 'Price: High to Low':
        result = [...result].sort((a: any, b: any) => b.salePrice - a.salePrice);
        break;
      case 'Capacity':
        // Extremely basic sorting by alphabetical capacity string
        result = [...result].sort((a: any, b: any) => (a.capacity || '').localeCompare(b.capacity || ''));
        break;
    }

    return result;
  }, [products, sortOption, selectedCategories, searchQuery]);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-gutter">
        {/* Sidebar / Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-6 sticky top-24">
            <h2 className="font-headline-md text-headline-md mb-6">Categories</h2>
            <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
              <li>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={selectedCategories.length === 0} onChange={() => setSelectedCategories([])} className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary" />
                  <span className="group-hover:text-primary transition-colors text-primary font-medium">All Batteries</span>
                </label>
              </li>
              {['Automotive Batteries', 'Marine Batteries', 'Motorcycle Batteries', 'Solar Batteries', 'Inverter Batteries'].map(cat => (
                <li key={cat}>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary" />
                    <span className="group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-outline-variant/30 gap-4">
            <div className="flex items-center w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 bg-surface-container-lowest border border-outline-variant rounded-md py-1.5 px-3 font-body-md text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant flex-1 text-center sm:text-left">
              {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
            </p>
            <div className="flex items-center space-x-2">
              <span className="font-body-md text-sm text-on-surface-variant">Sort by:</span>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-surface-container-lowest border border-outline-variant rounded-md py-1.5 pl-3 pr-8 font-body-md text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Capacity</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
              <>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-surface border border-outline-variant/20 rounded-xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-surface-container-low w-full"></div>
                    <div className="p-5 flex flex-col gap-3">
                      <div className="h-3 w-16 bg-surface-container rounded"></div>
                      <div className="h-5 w-3/4 bg-surface-container rounded"></div>
                      <div className="h-4 w-full bg-surface-container rounded mt-2"></div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="h-6 w-20 bg-surface-container rounded"></div>
                        <div className="h-4 w-16 bg-surface-container rounded"></div>
                      </div>
                      <div className="h-10 w-full bg-surface-container rounded mt-2"></div>
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {error && (
              <div className="col-span-full py-8 text-center text-error bg-error-container rounded-lg">
                <p>Failed to load products. Please try again later.</p>
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant mb-4">
                  <span className="material-symbols-outlined text-3xl">inventory_2</span>
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface mb-2">No products found</h3>
                <p className="font-sans text-on-surface-variant max-w-md">
                  We couldn't find any products matching your current filters or search query.
                </p>
                {(searchQuery || selectedCategories.length > 0) && (
                  <button onClick={() => { setSearchQuery(''); setSelectedCategories([]); }} className="mt-6 font-sans text-sm font-semibold text-primary hover:text-primary-container underline underline-offset-4">
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {!isLoading && filteredProducts.map((product: any) => (
              <div key={product.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                <div className="relative h-48 bg-surface-container-low flex items-center justify-center p-6 group-hover:bg-surface-container transition-colors">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center opacity-50">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">battery_charging_full</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm rounded-full p-2 text-outline-variant hover:text-error hover:bg-surface transition-all cursor-pointer shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {product.voltage && <span className="bg-surface/90 backdrop-blur-sm text-on-surface text-xs font-semibold px-2 py-1 rounded shadow-sm border border-outline-variant/10">{product.voltage}</span>}
                    {product.capacity && <span className="bg-primary text-on-primary text-xs font-semibold px-2 py-1 rounded shadow-sm">{product.capacity}</span>}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">{product.brand?.name || 'DM Battery'}</div>
                  <h3 className="font-display text-lg font-bold mb-2 leading-tight text-on-surface group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="font-sans text-sm text-on-surface-variant mb-4 flex-1">SKU: {product.sku}</div>
                  
                  <div className="flex items-end justify-between mt-auto mb-4">
                    <div>
                      <div className="text-xs text-on-surface-variant mb-0.5">Price</div>
                      <div className="font-display text-2xl font-bold text-primary">{formatCurrency(product.salePrice)}</div>
                    </div>
                    <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${product.inventory?.quantity > 0 ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                      <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {product.inventory?.quantity > 0 ? 'check_circle' : 'cancel'}
                      </span>
                      {product.inventory?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  
                  <Link href={`/products/${product.id}`} className="block text-center w-full py-2.5 bg-primary/10 text-primary font-semibold text-sm rounded-lg hover:bg-primary hover:text-on-primary transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
