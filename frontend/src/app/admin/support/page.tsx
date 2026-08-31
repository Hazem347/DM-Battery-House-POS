import React from "react";

export default function SupportPage() {
  return (
    <div className="flex-1 overflow-auto p-margin-mobile md:p-gutter">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Support & Help</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Get assistance with the DM Battery House Management System.</p>
        </div>
        
        <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 text-center max-w-2xl mx-auto mt-12 shadow-sm">
          <span className="material-symbols-outlined text-6xl text-primary mb-4">support_agent</span>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">Need Technical Assistance?</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Our IT support team is available 24/7 to help resolve any issues with the POS, inventory tracking, or user accounts.</p>
          <div className="flex justify-center gap-4">
             <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm hover:bg-primary/90 transition-transform hover:-translate-y-0.5 shadow-md">
               Submit a Ticket
             </button>
             <button className="bg-surface border border-outline-variant text-on-surface px-6 py-3 rounded-lg font-label-sm hover:bg-surface-container-low transition-colors">
               View Documentation
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
