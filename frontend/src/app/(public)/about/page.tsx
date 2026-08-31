import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex-grow pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Hero Section */}
      <div className="bg-surface-container-low rounded-2xl p-8 md:p-16 mt-8 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 opacity-50 mix-blend-multiply"></div>
        <div className="md:w-1/2 relative z-10">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-4">
            Powering Your World Since 1998
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            DM Battery House is the leading provider of premium automotive, marine, and industrial batteries. With over two decades of expertise, we don't just sell batteries; we provide reliable power solutions designed to keep you moving forward.
          </p>
          <div className="flex gap-4">
            <Link href="/products" className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-sm hover:bg-primary/90 transition-transform hover:scale-105 shadow-md">
              Explore Our Products
            </Link>
            <Link href="/contact" className="bg-surface border border-outline-variant text-on-surface px-6 py-3 rounded-full font-label-sm hover:bg-surface-container-low transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 relative z-10 w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg border border-outline-variant/20">
           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCctDtyA7G2Sx0Q2i2hTaP-kn-97yvfKvBtn1x32NOIejR16UlqE2Y-dT0-DesMj71wYeeKKFB3ML5HrSTjssBhLODbZQgdiGrDi0dpmtlKFO41wuZQvjnjSLYmbbvrq3xs_qRCAw1E4BMjcFlFT-jnn-hqjZH5pHrMOHVqTrbOxc-4NoW1k66w6cUO9J4NCgvua1FdBZkKeoJjTuIBS1cVs1g_f31RXqqQlcI5EQ_2LMR5gGLMY89DLQ" alt="Our Store" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Core Values */}
      <div className="mt-20">
        <h2 className="text-center font-display-lg-mobile md:font-headline-md text-headline-md text-on-surface font-bold mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-3">Uncompromising Quality</h3>
            <p className="text-on-surface-variant font-body-md text-body-md">Every product we stock undergoes rigorous testing to ensure it meets our strict standards for durability and performance.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">support_agent</span>
            </div>
            <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-3">Expert Support</h3>
            <p className="text-on-surface-variant font-body-md text-body-md">Our team of certified technicians provides unparalleled advice, installation, and after-sales service.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">eco</span>
            </div>
            <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-3">Sustainable Practices</h3>
            <p className="text-on-surface-variant font-body-md text-body-md">We are committed to environmental responsibility through our comprehensive battery recycling programs.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
