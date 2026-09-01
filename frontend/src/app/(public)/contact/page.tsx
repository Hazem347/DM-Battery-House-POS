'use client';

import React, { useState } from "react";
import { createInquiry } from "@/lib/api";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const formElement = e.currentTarget;
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      status: 'pending'
    };

    try {
      await createInquiry(data);
      setSubmitStatus('success');
      formElement.reset();
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="mt-12 text-center max-w-2xl mx-auto mb-16">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-on-background font-bold mb-6 tracking-tight">Contact Us</h1>
        <p className="font-sans text-lg md:text-xl text-on-surface-variant leading-relaxed">
          Have a question about our products, need support, or want to inquire about bulk ordering? Our team is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-surface-container-lowest p-8 md:p-12 rounded-3xl shadow-xl shadow-primary/5 border border-outline-variant/20">
        {/* Contact Information */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary mb-8">Get in Touch</h2>
            <div className="flex items-start gap-5 mb-8 group">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-lg text-on-surface mb-1">Our Location</h3>
                <p className="text-on-surface-variant font-sans text-base leading-relaxed">Main Bazaar, Haripur<br/>Khyber Pakhtunkhwa, Pakistan</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5 mb-8 group">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-lg text-on-surface mb-1">Phone Number</h3>
                <p className="text-on-surface-variant font-sans text-base leading-relaxed">+92 (300) 123-4567<br/>+92 (333) 987-6543 (Support)</p>
              </div>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-lg text-on-surface mb-1">Email Address</h3>
                <p className="text-on-surface-variant font-sans text-base leading-relaxed">info@dmbh.com<br/>support@dmbh.com</p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant/30 mt-auto">
            <h3 className="font-sans font-bold text-lg text-on-surface mb-4">Business Hours</h3>
            <ul className="text-on-surface-variant font-sans text-base space-y-3">
              <li className="flex justify-between items-center border-b border-outline-variant/20 pb-2"><span>Monday - Friday:</span> <span className="font-medium text-on-surface">8:00 AM - 6:00 PM</span></li>
              <li className="flex justify-between items-center border-b border-outline-variant/20 pb-2"><span>Saturday:</span> <span className="font-medium text-on-surface">9:00 AM - 2:00 PM</span></li>
              <li className="flex justify-between items-center"><span>Sunday:</span> <span className="font-medium text-error">Closed</span></li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block font-sans font-medium text-sm text-on-surface mb-2">Full Name</label>
              <input type="text" name="name" id="name" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 font-sans text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-outline-variant" placeholder="John Doe" required />
            </div>
            
            <div>
              <label htmlFor="email" className="block font-sans font-medium text-sm text-on-surface mb-2">Email Address</label>
              <input type="email" name="email" id="email" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 font-sans text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-outline-variant" placeholder="john@example.com" required />
            </div>
            
            <div>
              <label htmlFor="subject" className="block font-sans font-medium text-sm text-on-surface mb-2">Subject</label>
              <input type="text" name="subject" id="subject" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 font-sans text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-outline-variant" placeholder="How can we help?" required />
            </div>
            
            <div>
              <label htmlFor="message" className="block font-sans font-medium text-sm text-on-surface mb-2">Message</label>
              <textarea name="message" id="message" rows={5} className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 font-sans text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-outline-variant resize-none" placeholder="Write your message here..." required></textarea>
            </div>
            
            {submitStatus === 'success' && (
              <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                <span className="material-symbols-outlined">check_circle</span>
                <p className="font-sans text-sm font-medium">Your message has been sent successfully!</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-on-primary py-4 rounded-xl font-sans font-semibold text-base hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
