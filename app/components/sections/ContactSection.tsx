'use client';

import React from 'react';
import { Page, BusinessHours } from '@/app/lib/types';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { cn } from '@/app/lib/utils';
import { ArrowUpRight, Clock3, MapPinned } from 'lucide-react';
import { ContactSideForm } from '@/app/components/ui/ContactSideForm';

const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun'
};

interface ContactSectionProps {
  contactSection: Page['contactSection'];
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactSection,
  className
}) => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { site } = useWebBuilder();

  if (!contactSection?.enabled) return null;

  const business = site?.business;
  const address = business?.address;
  const businessHours = business?.businessHours;

  const formatTime = (time: string) => {
    if (!time) return '';

    if (businessHours?.displayFormat === '12h') {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;

      return `${displayHour}:${minutes} ${ampm}`;
    }

    return time;
  };

  const formatDayHours = (dayHours: BusinessHours) => {
    if (!dayHours.isOpen) return 'Closed';
    if (dayHours.is24Hours) return '24 Hours';

    if (dayHours.timeRanges && dayHours.timeRanges.length > 0) {
      return dayHours.timeRanges
        .map(
          (range) =>
            `${formatTime(range.openTime)} - ${formatTime(range.closeTime)}`
        )
        .join(', ');
    }

    return '';
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden py-6',
        className
      )}
      style={{
        backgroundColor: themeColors.pageBackground,
        fontFamily: themeFonts.body
      }}
    >
      {/* Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-10 pointer-events-none"
        style={{
          backgroundColor: themeColors.primaryButton || '#E31E24'
        }}
      />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-20 items-center">
          
          {/* LEFT CONTENT */}
          <div className="space-y-14">
            {/* Heading */}
            <div className="space-y-8">
              <span
                className="inline-block text-[11px] uppercase tracking-[0.45em] font-semibold"
                style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
              >
                Contact Studio
              </span>

              <div className="space-y-4">
                <h2
                  className="text-4xl md:text-6xl lg:text-7xl font-extralight uppercase leading-[0.95]"
                  style={{
                    color: themeColors.mainText,
                    fontFamily: themeFonts.heading
                  }}
                >
                  Let’s Build
                  <br />
                  Something
                  <span
                    className="italic ml-4"
                    style={{
                      color:
                        themeColors.primaryButton || '#E31E24'
                    }}
                  >
                    Timeless
                  </span>
                </h2>

                <p
                  className="max-w-xl text-sm md:text-base leading-relaxed font-light"
                  style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                >
                  We create refined architectural and renovation
                  experiences with a focus on craftsmanship,
                  modern aesthetics, and thoughtful design details.
                </p>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Address Card */}
              <div
                className="relative p-8 border backdrop-blur-xl transition-all duration-500 hover:-translate-y-1"
                style={{
                  backgroundColor: `${themeColors.cardBackground}90`,
                  borderColor: `${themeColors.inactive}30`
                }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <MapPinned
                      size={18}
                      style={{
                        color:
                          themeColors.primaryButton || '#E31E24'
                      }}
                    />

                    <span
                      className="text-[11px] uppercase tracking-[0.35em] font-semibold"
                      style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                    >
                      Office
                    </span>
                  </div>

                  <div
                    className="space-y-1 text-sm md:text-base uppercase leading-relaxed"
                    style={{ color: themeColors.mainText, fontFamily: themeFonts.heading }}
                  >
                    <p>{address?.street}</p>

                    <p>
                      {address?.city}
                      {address?.zipCode
                        ? `, ${address?.zipCode}`
                        : ''}
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${address?.street || ''} ${
                        address?.city || ''
                      }`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] font-semibold transition-all"
                    style={{
                      color:
                        themeColors.primaryButton || '#E31E24',
                      fontFamily: themeFonts.body
                    }}
                  >
                    View Location
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </div>

              {/* Hours Card */}
              {businessHours?.isEnabled && (
                <div
                  className="relative p-8 border backdrop-blur-xl transition-all duration-500 hover:-translate-y-1"
                  style={{
                    backgroundColor: `${themeColors.cardBackground}90`,
                    borderColor: `${themeColors.inactive}30`
                  }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Clock3
                        size={18}
                        style={{
                          color:
                            themeColors.primaryButton || '#E31E24'
                        }}
                      />

                      <span
                        className="text-[11px] uppercase tracking-[0.35em] font-semibold"
                        style={{
                          color: themeColors.secondaryText,
                          fontFamily: themeFonts.body
                        }}
                      >
                        Working Hours
                      </span>
                    </div>

                    <div className="space-y-3">
                      {businessHours.hours.map((day) => (
                        <div
                          key={day.day}
                          className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em]"
                        >
                          <span
                            style={{
                              color: themeColors.secondaryText,
                              fontFamily: themeFonts.body
                            }}
                          >
                            {DAY_LABELS[day.day]}
                          </span>

                          <span
                            className="text-right"
                            style={{
                              color: themeColors.mainText,
                              fontFamily: themeFonts.body
                            }}
                          >
                            {formatDayHours(day)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="group relative inline-flex items-center gap-5 overflow-hidden px-10 py-5 transition-all duration-500"
              style={{
                backgroundColor:
                  themeColors.primaryButton || '#E31E24',
                color: '#FFFFFF',
                fontFamily: themeFonts.body
              }}
            >
              <span className="relative z-10 text-[11px] uppercase tracking-[0.4em] font-semibold">
                Start Your Project
              </span>

              <ArrowUpRight
                size={18}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />

              <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>

          {/* RIGHT MAP */}
          <div className="relative">
            <div
              className="relative overflow-hidden border backdrop-blur-xl"
              style={{
                backgroundColor: `${themeColors.cardBackground}70`,
                borderColor: `${themeColors.inactive}30`
              }}
            >
              {site?.business?.coordinates ? (
                <div className="relative aspect-[4/5] lg:aspect-[4/4.6] overflow-hidden">
                  <iframe
                    title="Office Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    loading="lazy"
                    className="grayscale contrast-125 scale-[1.02] hover:scale-105 hover:grayscale-0 transition-all duration-1000"
                    src={`https://maps.google.com/maps?q=${site.business.coordinates.latitude},${site.business.coordinates.longitude}&z=14&output=embed`}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Label */}
                  <div
                    className="absolute bottom-6 left-6 right-6 p-5 backdrop-blur-xl border"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.35)',
                      borderColor: 'rgba(255,255,255,0.08)'
                    }}
                  >
                    <div className="space-y-2">
                      <span
                        className="text-[10px] uppercase tracking-[0.35em] text-white/60"
                        style={{ fontFamily: themeFonts.body }}
                      >
                        Studio Location
                      </span>

                      <p
                        className="text-sm md:text-base text-white uppercase leading-relaxed"
                        style={{ fontFamily: themeFonts.heading }}
                      >
                        {address?.street}
                        <br />
                        {address?.city}
                        {address?.zipCode
                          ? `, ${address?.zipCode}`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="aspect-[4/5] flex items-center justify-center"
                  style={{
                    backgroundColor:
                      themeColors.cardBackground
                  }}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.4em]"
                    style={{
                      color: themeColors.secondaryText,
                      fontFamily: themeFonts.body
                    }}
                  >
                    Map Preview Pending
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ContactSideForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </section>
  );
};