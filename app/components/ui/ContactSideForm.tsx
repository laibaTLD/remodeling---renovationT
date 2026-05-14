'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

interface ContactSideFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSideForm: React.FC<ContactSideFormProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { site } = useWebBuilder();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    time: '',
    source: '',
    acceptedTerms: false
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      
      tl.to(overlayRef.current, { 
        opacity: 1, 
        visibility: 'visible', 
        duration: 0.5, 
        ease: 'power2.out' 
      })
      .to(formRef.current, { 
        x: 0, 
        duration: 0.8, 
        ease: 'expo.out' 
      }, '-=0.3');
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
        }
      });

      tl.to(formRef.current, { 
        x: '100%', 
        duration: 0.6, 
        ease: 'expo.in' 
      })
      .to(overlayRef.current, { 
        opacity: 0, 
        visibility: 'hidden', 
        duration: 0.4 
      }, '-=0.2');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          siteId: site?._id,
          subject: `Request for Information - ${formData.name}`,
          message: `Phone: ${formData.phone}\nCallback Time: ${formData.time}\nSource: ${formData.source}`
        }),
      });
      
      if (response.ok) {
        setSubmitMessage('✅ Sent successfully!');
        setTimeout(() => {
          onClose();
          setSubmitMessage('');
        }, 2000);
      } else {
        setSubmitMessage('❌ Failed to send.');
      }
    } catch (error) {
      setSubmitMessage('❌ Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden pointer-events-none">
      {/* Overlay */}
      <div 
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 invisible pointer-events-auto cursor-pointer"
      />

      {/* Form Container */}
      <div 
        ref={formRef}
        className="absolute top-0 right-0 h-full w-full max-w-[600px] bg-white pointer-events-auto transform translate-x-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
        style={{ fontFamily: themeFonts.body }}
      >
        {/* Header/Close */}
        <div className="flex justify-end p-6">
          <button 
            onClick={onClose}
            className="p-1 hover:rotate-90 transition-transform duration-300"
            aria-label="Close form"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-16 pb-10">
          <div className="max-w-md mx-auto space-y-8">
            
            {/* Typography Heading */}
            <div className="space-y-3">
              <h2 
                className="text-3xl md:text-4xl font-light tracking-tight leading-tight"
                style={{ color: themeColors.primaryButton, fontFamily: themeFonts.heading }}
              >
                Would you like<br />
                more information?
              </h2>
              <p className="text-gray-500 text-[13px] leading-relaxed max-w-sm">
                If you have any questions, tell us when it is better for us to call you.
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Name and surname" 
                  required
                  className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="email" 
                  placeholder="Mail" 
                  required
                  className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="tel" 
                    placeholder="Telephone" 
                    className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <div className="relative border-b border-gray-200">
                    <select 
                      className="w-full py-3 bg-transparent outline-none appearance-none text-gray-400 text-sm"
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    >
                      <option value="">Preferable time</option>
                      <option value="10-15">De 10 a 15hr</option>
                      <option value="15-20">De 15 a 20hr</option>
                    </select>
                  </div>
                </div>

                <div className="relative border-b border-gray-200">
                   <select 
                    className="w-full py-3 bg-transparent outline-none appearance-none text-gray-400 text-sm"
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                   >
                      <option value="">Where did you find us</option>
                      <option value="social">Social media</option>
                      <option value="friends">Friends/family</option>
                      <option value="web">Web Search</option>
                    </select>
                </div>
              </div>

              {/* Privacy Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer group mt-2">
                <input 
                  type="checkbox" 
                  className="h-3 w-3" 
                  required 
                  onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})}
                />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors">
                  I accept the privacy policy
                </span>
              </label>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 flex items-center justify-center font-bold tracking-[0.3em] uppercase transition-all duration-300 hover:brightness-110 active:scale-[0.98] mt-4 disabled:opacity-50"
                style={{ backgroundColor: themeColors.primaryButton, color: '#FFFFFF' }}
              >
                {isSubmitting ? 'Sending...' : submitMessage || 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
