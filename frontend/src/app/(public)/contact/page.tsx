import React from "react";

export default function ContactPage() {
  return (
    <main className="flex-grow pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="mt-8 text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background font-bold mb-4">Contact Us</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Have a question about our products, need support, or want to inquire about bulk ordering? Our team is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-surface-container-lowest p-8 md:p-12 rounded-2xl shadow-sm border border-outline-variant/20">
        {/* Contact Information */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-primary mb-6">Get in Touch</h2>
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h3 className="font-label-sm text-label-sm text-on-surface mb-1">Our Location</h3>
                <p className="text-on-surface-variant font-body-md text-body-md">Main Bazaar, Haripur<br/>Khyber Pakhtunkhwa, Pakistan</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <h3 className="font-label-sm text-label-sm text-on-surface mb-1">Phone Number</h3>
                <p className="text-on-surface-variant font-body-md text-body-md">+92 (300) 123-4567<br/>+92 (333) 987-6543 (Support)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h3 className="font-label-sm text-label-sm text-on-surface mb-1">Email Address</h3>
                <p className="text-on-surface-variant font-body-md text-body-md">info@dmbh.com<br/>support@dmbh.com</p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30">
            <h3 className="font-label-sm text-label-sm text-on-surface font-bold mb-3">Business Hours</h3>
            <ul className="text-on-surface-variant font-body-md text-body-md space-y-2">
              <li className="flex justify-between"><span>Monday - Friday:</span> <span>8:00 AM - 6:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday:</span> <span>9:00 AM - 2:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday:</span> <span>Closed</span></li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form className="flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="block font-label-sm text-label-sm text-on-surface mb-2">Full Name</label>
              <input type="text" id="name" className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" placeholder="John Doe" required />
            </div>
            
            <div>
              <label htmlFor="email" className="block font-label-sm text-label-sm text-on-surface mb-2">Email Address</label>
              <input type="email" id="email" className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" placeholder="john@example.com" required />
            </div>
            
            <div>
              <label htmlFor="subject" className="block font-label-sm text-label-sm text-on-surface mb-2">Subject</label>
              <input type="text" id="subject" className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" placeholder="How can we help?" required />
            </div>
            
            <div>
              <label htmlFor="message" className="block font-label-sm text-label-sm text-on-surface mb-2">Message</label>
              <textarea id="message" rows={5} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow resize-none" placeholder="Write your message here..." required></textarea>
            </div>
            
            <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md active:scale-95">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
