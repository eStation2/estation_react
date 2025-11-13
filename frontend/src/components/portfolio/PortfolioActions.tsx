'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

const PortfolioActions: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { portfolioStats } = usePortfolioStore();


  const quickStats = [
    {
      id: 'total-product-categories',
      label: t('portfolio.totalProductCategories') || 'Total Product Categories',
      value: portfolioStats.productCategories?.toString() || '10',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'total-products',
      label: t('portfolio.totalProducts') || 'Total Products',
      value: portfolioStats.totalProducts.toString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    }
  ];


  const renderQuickStat = (stat: typeof quickStats[0]) => (
    <div
      key={stat.id}
      className="flex items-center space-x-3 p-3 rounded"
      style={{
        backgroundColor: theme.colors.hover,
        border: `1px solid ${theme.colors.border}`
      }}
    >
      <div style={{ color: theme.colors.primary }}>
        {stat.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-xs font-medium"
          style={{ color: theme.colors.text.secondary }}
        >
          {stat.label}
        </div>
        <div
          className="text-lg font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          {stat.value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4" data-testid="portfolio-actions">
      {/* Quick Stats */}
      <Card
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            {t('portfolio.quickStats') || 'Quick Stats'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {quickStats.map(renderQuickStat)}
          </div>
        </CardContent>
      </Card>


      {/* Help Section */}
      <Card
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            {t('portfolio.help') || 'Help'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full flex items-center space-x-2 p-2 rounded text-sm justify-start"
              data-testid="portfolio-documentation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('portfolio.documentation') || 'Documentation'}</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full flex items-center space-x-2 p-2 rounded text-sm justify-start"
              data-testid="portfolio-tutorial"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('portfolio.tutorial') || 'Tutorial'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioActions;