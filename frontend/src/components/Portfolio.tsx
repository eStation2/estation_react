'use client';

import React, { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { Button } from '@/components/ui';
import ProductFilters from './portfolio/ProductFilters';
import CurrentPortfolio from './portfolio/CurrentPortfolio';
import PortfolioActions from './portfolio/PortfolioActions';

const Portfolio: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { loadPortfolioData, isLoading, error } = usePortfolioStore();

  // Load portfolio data on component mount
  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full p-4 flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
        data-page="portfolio"
      >
        <div
          className="text-lg"
          style={{ color: theme.colors.text.primary }}
        >
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen w-full p-4 flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
        data-page="portfolio"
      >
        <div className="text-center">
          <div
            className="text-lg mb-2"
            style={{ color: theme.colors.accent }}
          >
            {t('common.error')}
          </div>
          <div
            className="text-sm mb-4"
            style={{ color: theme.colors.text.secondary }}
          >
            {error}
          </div>
          <Button onClick={loadPortfolioData}>
            {t('common.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full p-4"
      style={{ backgroundColor: theme.colors.background }}
      data-page="portfolio"
    >
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Left Sidebar - Product Search & Filters */}
        <div className="col-span-3">
          <ProductFilters />
        </div>

        {/* Center Panel - Current Portfolio */}
        <div className="col-span-7">
          <CurrentPortfolio />
        </div>

        {/* Right Sidebar - Additional Actions */}
        <div className="col-span-2">
          <PortfolioActions />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;