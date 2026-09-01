import React from "react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="bg-cover bg-center w-full h-full absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513828742140-ccaa24fefe4a?q=80&w=2070&auto=format&fit=crop')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface/95 to-surface/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-gutter items-center pt-24 pb-12">
          <div className="backdrop-blur-sm bg-surface/50 p-8 md:p-12 rounded-2xl border border-outline-variant/30 shadow-2xl">
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary font-semibold text-sm tracking-wide uppercase border border-primary/20">
              Industrial Grade Energy
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface mb-6 leading-tight tracking-tight">
              Reliable Battery Solutions for <span className="text-primary">Every Need</span>
            </h1>
            <p className="font-sans text-lg md:text-xl text-on-surface-variant mb-8 max-w-xl leading-relaxed">
              Automotive, Solar, UPS and Industrial Batteries. Technical Precision & Reliable Energy tailored for robust applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="h-14 px-8 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center gap-2 hover:-translate-y-1">
                View Products
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link href="/contact" className="h-14 px-8 rounded-full border-2 border-outline-variant text-on-surface font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="relative z-10 w-full bg-surface-container-low/80 backdrop-blur-md border-y border-outline-variant/20 mt-auto">
          <FadeIn>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-outline-variant/20">
              <div>
                <div className="font-display text-3xl font-bold text-primary mb-1">25+</div>
                <div className="font-sans text-sm text-on-surface-variant uppercase tracking-wider">Years Experience</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-primary mb-1">5,000+</div>
                <div className="font-sans text-sm text-on-surface-variant uppercase tracking-wider">Happy Customers</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-primary mb-1">200+</div>
                <div className="font-sans text-sm text-on-surface-variant uppercase tracking-wider">Products Available</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-primary mb-1">100%</div>
                <div className="font-sans text-sm text-on-surface-variant uppercase tracking-wider">Quality Guarantee</div>
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <FadeIn>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface mb-4">Why Choose DM Battery House</h2>
            <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto">
              Our commitment to technical excellence ensures your power systems operate flawlessly under demanding conditions.
            </p>
          </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <FadeIn delay={100}>
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group h-full">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>battery_charging_full</span>
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface mb-3">Quality Batteries</h3>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                Premium cells engineered for longevity and consistent power output in extreme environments.
              </p>
            </div>
            </FadeIn>

            {/* Feature 2 */}
            <FadeIn delay={200}>
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group h-full">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface mb-3">Professional Installation</h3>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                Certified technicians ensuring optimal setup and integration with your existing infrastructure.
              </p>
            </div>
            </FadeIn>

            {/* Feature 3 */}
            <FadeIn delay={300}>
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group h-full">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface mb-3">Warranty Support</h3>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                Comprehensive coverage plans designed to protect your critical energy investments long-term.
              </p>
            </div>
            </FadeIn>

            {/* Feature 4 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface mb-3">Fast Delivery</h3>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                Streamlined logistics network ensuring rapid deployment of crucial power assets when needed most.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface mb-3">Technical Consultation</h3>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                Expert guidance on system sizing, load calculation, and sustainable energy architecture.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface mb-3">After Sales Service</h3>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                Ongoing maintenance schedules and performance diagnostics to maximize battery lifecycle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
