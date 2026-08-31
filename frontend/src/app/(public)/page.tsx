import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="bg-cover bg-center w-full h-full absolute inset-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB40tJyYNql9jlNg8C9jl6q94b6fOo4-y4AhZqJW46kCLhtM-eAoDaOj-E4gtS0e_-aSqss7jiGOmybSOPw9CMOgDw6y6-NQuU0fIc8Cj-DM5PI495LeSeesr9Jqi67EdHKSi-gWcoil2HQ9DMcASYJEuqG5eyA1urH-t_ZyovQ9i4PBtvsa0LltkwAk-p-qy91OoB6ACskC_m3QNKmt7r4lHoJj_FiWxmwy7BJRBRPKEpYW75sb_Lq2Q')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 to-surface/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-gutter items-center">
          <div className="backdrop-blur-[12px] bg-surface/70 p-8 md:p-12 rounded-xl border border-outline-variant/20 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
            <span className="inline-block px-3 py-1 mb-6 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
              Industrial Grade Energy
            </span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
              Reliable Battery Solutions for Every Need
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl">
              Automotive, Solar, UPS and Industrial Batteries. Technical Precision & Reliable Energy tailored for robust applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="h-12 px-8 rounded-full bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center justify-center gap-2">
                View Products
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link href="/contact" className="h-12 px-8 rounded-full border border-secondary text-secondary font-label-sm text-label-sm hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2 bg-transparent">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Why Choose DM Battery House</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Our commitment to technical excellence ensures your power systems operate flawlessly under demanding conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {/* Feature 1 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>battery_charging_full</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">Quality Batteries</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Premium cells engineered for longevity and consistent power output in extreme environments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">Professional Installation</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Certified technicians ensuring optimal setup and integration with your existing infrastructure.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">Warranty Support</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Comprehensive coverage plans designed to protect your critical energy investments long-term.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">Fast Delivery</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Streamlined logistics network ensuring rapid deployment of crucial power assets when needed most.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">Technical Consultation</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Expert guidance on system sizing, load calculation, and sustainable energy architecture.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">After Sales Service</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Ongoing maintenance schedules and performance diagnostics to maximize battery lifecycle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
