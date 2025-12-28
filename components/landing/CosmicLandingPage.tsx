import React from 'react';
import CosmicHeroVisual from './CosmicHeroVisual';
import FeaturesGrid from './FeaturesGrid';
import LiveStats from './LiveStats';
import PricingSection from './PricingSection';
import LandingFooter from './LandingFooter';
import ZodiacBackground from '../ZodiacBackground'; // Re-use the cool background

const CosmicLandingPage: React.FC = () => {
    return (
        <div className="relative overflow-hidden">
            <ZodiacBackground />
            <div className="relative z-10">
                <CosmicHeroVisual />
                <LiveStats />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
                    <FeaturesGrid />
                    <PricingSection />
                </div>
                <LandingFooter />
            </div>
        </div>
    );
};

export default CosmicLandingPage;