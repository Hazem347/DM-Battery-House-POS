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
              <div className="col-span-full py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
            
            {error && (
              <div className="col-span-full py-8 text-center text-error bg-error-container rounded-lg">
                <p>Failed to load products. Please try again later.</p>
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-on-surface-variant">
                <p>No products found matching your criteria.</p>
              </div>
            )}

            {!isLoading && filteredProducts.map((product: any) => (
              <div key={product.id} className="bg-surface-container-lowest border border-[#E9ECEF] rounded-lg overflow-hidden group hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-shadow duration-300 flex flex-col h-full">
                <div className="relative h-48 bg-surface-container-low flex items-center justify-center p-4">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <div className="w-24 h-24 bg-surface-variant rounded-md flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">battery_charging_full</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-surface-container-lowest rounded-full p-1.5 text-outline hover:text-error transition-colors cursor-pointer shadow-sm">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{product.brand?.name || 'Brand'}</div>
                  <h3 className="font-body-lg text-body-lg font-semibold mb-2 leading-tight">{product.name}</h3>
                  <div className="font-mono-data text-mono-data text-on-surface-variant mb-4">{product.voltage} • {product.capacity} • {product.sku}</div>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="font-headline-md text-headline-md text-primary">{formatCurrency(product.salePrice)}</div>
                    <div className={`flex items-center text-sm font-medium ${product.inventory?.quantity > 0 ? 'text-secondary' : 'text-error'}`}>
                      <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {product.inventory?.quantity > 0 ? 'check_circle' : 'cancel'}
                      </span>
                      {product.inventory?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  <Link href={`/products/${product.id}`} className="block text-center mt-4 w-full py-2 border-2 border-secondary text-secondary font-label-sm text-label-sm rounded hover:bg-secondary hover:text-white transition-colors">
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
