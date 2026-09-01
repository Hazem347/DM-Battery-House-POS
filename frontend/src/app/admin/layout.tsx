'use client';
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavLink = ({ href, icon, label }: { href: string; icon: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 group ${isActive ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high active:translate-x-1'}`}>
        <span className={`material-symbols-outlined text-[20px] ${isActive ? '' : 'group-hover:text-primary transition-colors'}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
          {icon}
        </span>
        {label}
      </Link>
    );
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex relative w-full">
      {/* SideNavBar */}
      <nav className="bg-surface-container-low dark:bg-surface-container-lowest text-primary dark:text-primary-fixed-dim font-label-sm text-label-sm fixed left-0 top-0 h-screen w-64 flex flex-col p-base space-y-2 border-r border-outline-variant/30 z-50">
        <div className="px-4 py-6 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>battery_charging_full</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary">Admin Panel</h1>
              <p className="font-label-sm text-on-surface-variant font-normal opacity-80 mt-1">Technical Operations</p>
            </div>
          </div>
          <Link href="/admin/pos" className="w-full bg-primary text-on-primary py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm font-label-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Sale
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1 px-2">
          {user?.role !== 'CASHIER' && <NavLink href="/admin" icon="dashboard" label="Dashboard" />}
          {user?.role !== 'CASHIER' && <NavLink href="/admin/inventory" icon="inventory_2" label="Inventory" />}
          <NavLink href="/admin/pos" icon="point_of_sale" label="POS" />
          {user?.role !== 'CASHIER' && <NavLink href="/admin/reports" icon="analytics" label="Reports" />}
          {user?.role !== 'CASHIER' && <NavLink href="/admin/customers" icon="people" label="Customers" />}
          <NavLink href="/admin/sales" icon="receipt_long" label="Sales" />
          {user?.role === 'ADMIN' && <NavLink href="/admin/management" icon="settings" label="Management" />}
        </div>

        <div className="mt-auto px-2 pt-4 border-t border-outline-variant/30 space-y-1 pb-4">
          <NavLink href="/admin/support" icon="help" label="Support" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:translate-x-1 duration-150 group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-error transition-colors">logout</span>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 ml-64 bg-surface relative">
        {/* TopNavBar */}
        <header className="bg-surface/80 dark:bg-surface-dim/80 text-primary dark:text-primary-fixed-dim font-body-md text-body-md sticky top-0 w-full z-40 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center h-16 px-gutter relative">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="font-headline-md text-headline-md font-bold text-primary mr-8 hidden lg:block">Dashboard</h2>
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline">search</span>
              </div>
              <input type="text" placeholder="Search inventory, orders..." className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg leading-5 bg-surface-container-lowest placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative">
            <ThemeToggle />
            <div ref={notifRef} className="relative flex items-center">
              <button aria-label="Notifications" onClick={() => {setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false);}} className="p-2 text-on-surface-variant hover:bg-surface-variant/40 rounded-full active:scale-90 transition-transform relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-error ring-2 ring-surface"></span>
              </button>
              {isNotifOpen && (
                <div className="absolute top-14 right-0 w-80 bg-surface border border-outline-variant rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
                    <h3 className="font-bold text-on-surface">Notifications</h3>
                    <button className="text-primary text-xs font-medium">Mark all as read</button>
                  </div>
                  <div className="divide-y divide-outline-variant/10 max-h-64 overflow-y-auto">
                    <div className="p-4 hover:bg-surface-container-lowest cursor-pointer">
                      <p className="font-label-sm text-on-surface font-medium">Low Stock Alert</p>
                      <p className="text-xs text-on-surface-variant mt-1">Product SKU-102 is running low (2 left).</p>
                      <p className="text-[10px] text-outline mt-1">10 mins ago</p>
                    </div>
                    <div className="p-4 hover:bg-surface-container-lowest cursor-pointer">
                      <p className="font-label-sm text-on-surface font-medium">New Sale</p>
                      <p className="text-xs text-on-surface-variant mt-1">Receipt REC-17382029 was generated.</p>
                      <p className="text-[10px] text-outline mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-8 w-px bg-outline-variant/50 mr-4"></div>
            
            <div className="relative">
              <button onClick={() => {setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false);}} className="flex items-center gap-3 p-1 pr-3 rounded-full border border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </div>
                <span className="font-label-sm text-on-surface hidden sm:block">{user?.name || user?.email || 'Admin User'}</span>
                <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute top-12 right-0 w-56 bg-surface border border-outline-variant rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-outline-variant/30">
                    <p className="font-bold text-on-surface truncate">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user?.email || 'admin@dmbattery.com'}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button onClick={() => {router.push('/admin/management'); setIsProfileOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-on-surface hover:bg-surface-container rounded-md flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">person</span> Profile
                    </button>
                    <button onClick={() => {router.push('/admin/management'); setIsProfileOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-on-surface hover:bg-surface-container rounded-md flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-outline-variant/30">
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error-container/30 rounded-md flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">logout</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
