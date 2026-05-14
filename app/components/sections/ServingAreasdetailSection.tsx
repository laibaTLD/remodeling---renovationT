'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';

// Import all the serving area detail sections
import { HeroSection } from './serving-area-detail-sections/Hero';
import { Highlights } from './serving-area-detail-sections/Highlights';
import { About } from './serving-area-detail-sections/About';
import { OurServices } from './serving-area-detail-sections/OurServices';
import { CTA } from './serving-area-detail-sections/CTA';
import { ServiceOverview } from './serving-area-detail-sections/ServiceOverview';
import { ServiceDetails } from './serving-area-detail-sections/ServiceDetails';
import { WhyChooseUs } from './serving-area-detail-sections/WhyChooseUs';
import { FAQs } from './serving-area-detail-sections/FAQs';
import { ServingAreas } from './serving-area-detail-sections/ServingAreas';

interface ServingAreasdetailSectionProps {
  data: {
    hero?: any;
    highlights?: any;
    about?: any;
    ourServices?: any;
    cta?: any;
    serviceOverview?: any;
    serviceDetails?: any;
    whyChooseUs?: any;
    faqs?: any;
    servingAreas?: any;
  };
  className?: string;
}

export const ServingAreasdetailSection: React.FC<ServingAreasdetailSectionProps> = ({ 
  data, 
  className 
}) => {
  const themeColors = useThemeColors();

  return (
    <div 
      className={cn('w-full', className)}
      style={{ backgroundColor: themeColors.pageBackground }}
    >
      {/* Hero Section */}
      {data.hero && <HeroSection hero={data.hero} />}

      {/* Highlights Section */}
      {data.highlights && <Highlights highlights={data.highlights} />}

      {/* About Section */}
      {data.about && <About about={data.about} />}

      {/* Our Services Section */}
      {data.ourServices && <OurServices services={data.ourServices} />}

      {/* Service Details Section */}
      {data.serviceDetails && <ServiceDetails details={data.serviceDetails} />}

      {/* Service Overview Section */}
      {data.serviceOverview && <ServiceOverview overview={data.serviceOverview} />}

      {/* Why Choose Us Section */}
      {data.whyChooseUs && <WhyChooseUs whyChooseUs={data.whyChooseUs} />}

      {/* FAQs Section */}
      {data.faqs && <FAQs faqs={data.faqs} />}

      {/* Serving Areas Section */}
      {data.servingAreas && <ServingAreas service={data.servingAreas} />}

      {/* CTA Section */}
      {data.cta && <CTA cta={data.cta} />}
    </div>
  );
};

export default ServingAreasdetailSection;