import React from "react";
import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-surface/70 border-b border-outline-variant/30 shadow-sm transition-all duration-300" id="main-nav">
        <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD66R3X2ZrXwrvtsArHKs1qzY4q-lX37CKviSgszOAycqoStYuk3Tqau_zJhytle2gBIBD8w-T1EZo5FbSBo04hSOSrUcB1L7Q39kKsnJzN5R3dEikSw9ISqsdUKRtyOItO4bQ7MTWnVF4rGShS5p-KgAi4nYWw7VIOkUMtiPB1v8OvOWUUOrU_qU-OxZ1ZSk7bADeb4-2ZmzwEiy4DoDXHWxOhLTBurH0mGY_meDlSdAjkFSlAP9WMzg" alt="DM Battery House Logo" className="h-8 w-auto" />
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">DM Battery House</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">Products</Link>
            <Link href="/about" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="hidden md:flex items-center justify-center h-10 px-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
              Sign In
            </Link>
            <button className="md:hidden text-on-surface p-2">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-primary dark:bg-surface-container-lowest mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop max-w-container-max mx-auto">
          <div className="md:col-span-1">
            <span className="font-headline-md text-headline-md text-on-primary block mb-4">DM Battery House</span>
            <p className="font-label-sm text-label-sm text-on-primary/80 dark:text-outline-variant mb-6">
              © 2024 DM Battery House. Technical Precision & Reliable Energy.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-8 justify-start md:justify-end">
            <a href="#" className="font-label-sm text-label-sm text-on-primary/80 dark:text-outline-variant hover:text-white hover:underline transition-colors">Privacy Policy</a>
            <a href="#" className="font-label-sm text-label-sm text-on-primary/80 dark:text-outline-variant hover:text-white hover:underline transition-colors">Terms of Service</a>
            <a href="#" className="font-label-sm text-label-sm text-on-primary/80 dark:text-outline-variant hover:text-white hover:underline transition-colors">Warranty Info</a>
            <a href="#" className="font-label-sm text-label-sm text-on-primary/80 dark:text-outline-variant hover:text-white hover:underline transition-colors">Store Locator</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
