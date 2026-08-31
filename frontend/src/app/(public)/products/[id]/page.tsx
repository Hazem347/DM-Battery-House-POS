'use client';

import React from "react";
import Link from "next/link";
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/api';
import { formatCurrency } from "@/lib/currency";

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => getProductById(params.id)
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (error || !product) {
    return <div className="flex justify-center items-center h-96 text-error">Failed to load product details.</div>;
  }

  const inStock = (product.inventory?.quantity || 0) > 0;
  return (
    <main className="flex-grow pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-6 mt-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href="/products" className="hover:text-primary">{product.category?.name || 'Category'}</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-background font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Product Gallery Section */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/20 flex items-center justify-center min-h-[400px] relative overflow-hidden group">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-low to-surface-container-highest opacity-50"></div>
            <img src={product.image || "https://images.unsplash.com/photo-1620283085439-3f6229c66cc2?auto=format&fit=crop&q=80&w=400"} alt={product.name} className="w-full h-auto object-contain max-h-[500px] relative z-10 transition-transform duration-500 group-hover:scale-105" />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest rounded-lg p-2 border-2 border-primary cursor-pointer h-24 flex items-center justify-center">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_gMTMjxZHAkmtR2FsM_PFfZVgJdKhPN6908MlZwY0fBx25rIyaRcpptcmkav6zYBHuPVGcrNlNo_RGHGubU52rOAaiDAarbbiiFFc7axC0kHHQ3LPFn9a2_amtTu-B7aI0AlVAk62xnpspjrOT-cPcLW4ywgHKCyxvgOjD3TcBM-rTXwYUOXrcV68pR7J87xpsqKC0rkgBMf4xKxXQ1FK5Kd4GJCxXQKhDW4_WwNgRHqb4Fja2OkAYA" alt="Terminal close-up" className="h-full object-contain" />
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-2 border border-outline-variant/30 cursor-pointer h-24 flex items-center justify-center hover:border-primary/50 transition-colors">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3lK6wBKVkNOa-LBIDgHyQqou4LOsF0OpxTr0-vdZTUdhgQZ2St6MIb05IEfFl7uDoY3aOXvorrJBhz4yqZMeZeyuz_54YwPfibBtaDAmS4S6MowNlnUsKKTsl5qR8A6iCWsiY6EreBjl11AM5NpibcwUKrzBKs-rYGAQNvxBj3DNPd9id4w--vZkhRGW9eNfzwReN0GOqFOEOTHiDWlwQJvjA_NeFIW6pbdmk5DXnkwstCL9GxNEZuA" alt="Specs label" className="h-full object-contain" />
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-2 border border-outline-variant/30 cursor-pointer h-24 flex items-center justify-center hover:border-primary/50 transition-colors">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjf8m-dY1wmb4bZ62a3-4iKp7XIZwTaoaERvyCxlVWCCz6yzY5v1joutt-P5Hz0Kib25yqNfIev3sLdgEkAUcH4r1oDU_CXsxQwSa7AR7t7NUQ2bUH1qRSbCMmDlWbfpCcLcJX7mYGDO5XCngprRVYOqLP-Sc0aRY702yVAzUlZ3VGhT7c2DGQMymKOrJeAvZSngpqOtmJ0oDOKeXwd-gtwgOqEp0erZ5g9KG4M591_64g-nws_LsnAw" alt="Engine bay" className="h-full object-contain" />
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-2 border border-outline-variant/30 cursor-pointer h-24 flex items-center justify-center bg-surface-container-low hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-outline text-3xl">play_circle</span>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded font-label-sm text-label-sm inline-flex items-center gap-1 ${inStock ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                <span className="material-symbols-outlined text-[14px]">check_circle</span> {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="text-on-surface-variant font-mono-data text-mono-data">SKU: {product.sku}</span>
            </div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-2">
              {product.name}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {product.description || 'High-performance maintenance-free battery.'}
            </p>
          </div>

          <div className="flex items-baseline gap-4 border-b border-outline-variant/20 pb-6">
            <span className="font-display-lg text-display-lg text-primary font-bold">{formatCurrency(product.salePrice)}</span>
            <span className="font-body-md text-body-md text-on-surface-variant line-through">{formatCurrency(product.salePrice * 1.1)}</span>
          </div>

          {/* Technical Specs Mini */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-surface-container p-2 rounded-full text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Voltage</div>
                <div className="font-body-md text-body-md font-semibold text-on-background">{product.voltage || '12V'}</div>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-surface-container p-2 rounded-full text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">battery_charging_full</span>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Capacity</div>
                <div className="font-body-md text-body-md font-semibold text-on-background">{product.capacity || 'N/A'}</div>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-surface-container p-2 rounded-full text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">electric_car</span>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Brand</div>
                <div className="font-body-md text-body-md font-semibold text-on-background">{product.brand?.name || 'N/A'}</div>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-surface-container p-2 rounded-full text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Warranty</div>
                <div className="font-body-md text-body-md font-semibold text-on-background">{product.warranty || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-4">
            <button className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-headline-md text-headline-md py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
              <svg className="w-6 h-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Contact for Purchase
            </button>
            <button className="w-full bg-surface-container-lowest border border-primary text-primary hover:bg-surface-container font-body-md text-body-md py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-lg">download</span>
              Download Specifications (PDF)
            </button>
          </div>

          <div className="bg-surface-container-low rounded-lg p-4 mt-2 border border-outline-variant/20 flex gap-3 text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <p>Free professional installation available at our DM Battery House service centers. Same-day delivery available for orders placed before 2 PM.</p>
          </div>
        </div>
      </div>

      {/* Detailed Specifications Tabbed Area */}
      <div className="mt-16 bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-outline-variant/20 bg-surface-bright">
          <button className="px-6 py-4 font-headline-md text-[16px] md:text-headline-md font-bold text-primary border-b-2 border-primary bg-surface-container-low/50">
            Technical Specifications
          </button>
          <button className="px-6 py-4 font-headline-md text-[16px] md:text-headline-md text-on-surface-variant hover:text-primary transition-colors">
            Compatibility
          </button>
          <button className="px-6 py-4 font-headline-md text-[16px] md:text-headline-md text-on-surface-variant hover:text-primary transition-colors">
            Warranty Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b border-outline-variant/10">
                <th className="py-3 font-mono-data text-mono-data text-on-surface-variant w-1/3 font-normal">Nominal Voltage</th>
                <td className="py-3 font-body-md text-body-md text-on-background font-medium">{product.voltage || '12V'}</td>
              </tr>
              <tr className="border-b border-outline-variant/10 bg-surface/50">
                <th className="py-3 font-mono-data text-mono-data text-on-surface-variant w-1/3 font-normal">Capacity</th>
                <td className="py-3 font-body-md text-body-md text-on-background font-medium">{product.capacity || 'N/A'}</td>
              </tr>
              <tr className="border-b border-outline-variant/10">
                <th className="py-3 font-mono-data text-mono-data text-on-surface-variant w-1/3 font-normal">Brand</th>
                <td className="py-3 font-body-md text-body-md text-on-background font-medium">{product.brand?.name || 'N/A'}</td>
              </tr>
              <tr className="border-b border-outline-variant/10 bg-surface/50">
                <th className="py-3 font-mono-data text-mono-data text-on-surface-variant w-1/3 font-normal">Category</th>
                <td className="py-3 font-body-md text-body-md text-on-background font-medium">{product.category?.name || 'N/A'}</td>
              </tr>
              <tr className="border-b border-outline-variant/10">
                <th className="py-3 font-mono-data text-mono-data text-on-surface-variant w-1/3 font-normal">Terminals</th>
                <td className="py-3 font-body-md text-body-md text-on-background font-medium">{product.specifications?.terminals || 'Standard'}</td>
              </tr>
              <tr className="border-b border-outline-variant/10 bg-surface/50">
                <th className="py-3 font-mono-data text-mono-data text-on-surface-variant w-1/3 font-normal">Maintenance</th>
                <td className="py-3 font-body-md text-body-md text-on-background font-medium">{product.specifications?.maintenance || 'Maintenance Free'}</td>
              </tr>
              <tr>
                <th className="py-3 font-mono-data text-mono-data text-on-surface-variant w-1/3 font-normal">Layout</th>
                <td className="py-3 font-body-md text-body-md text-on-background font-medium">0 (Positive Right)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
