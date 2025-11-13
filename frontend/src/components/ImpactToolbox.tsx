'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const ImpactToolbox: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div
      className="h-full w-full p-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            {t('menu.impactToolbox')}
          </h1>
          <p
            className="text-lg"
            style={{ color: theme.colors.text.secondary }}
          >
            Comprehensive toolbox for impact assessment and analysis of satellite data applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.primary }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h2
              className="text-xl font-semibold mb-3 text-center"
              style={{ color: theme.colors.text.primary }}
            >
              Impact Assessment
            </h2>
            <p
              className="text-sm text-center mb-4"
              style={{ color: theme.colors.text.secondary }}
            >
              Assess the impact of satellite data on various applications and sectors.
            </p>
            <Button
              className="w-full px-4 py-2"
              data-testid="start-assessment-button"
            >
              Start Assessment
            </Button>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.success }}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2
              className="text-xl font-semibold mb-3 text-center"
              style={{ color: theme.colors.text.primary }}
            >
              Validation Tools
            </h2>
            <p
              className="text-sm text-center mb-4"
              style={{ color: theme.colors.text.secondary }}
            >
              Validate and verify the effectiveness of satellite data products.
            </p>
            <Button
              className="w-full px-4 py-2"
              data-testid="run-validation-button"
            >
              Run Validation
            </Button>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.warning }}>
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h2
              className="text-xl font-semibold mb-3 text-center"
              style={{ color: theme.colors.text.primary }}
            >
              Analytics Dashboard
            </h2>
            <p
              className="text-sm text-center mb-4"
              style={{ color: theme.colors.text.secondary }}
            >
              Advanced analytics and reporting for impact measurement.
            </p>
            <Button
              className="w-full px-4 py-2"
              data-testid="view-analytics-button"
            >
              View Analytics
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              Recent Impact Studies
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: theme.colors.background }}>
                <span style={{ color: theme.colors.text.primary }}>Agricultural Monitoring Impact</span>
                <span className="text-sm" style={{ color: theme.colors.text.secondary }}>2024-01-15</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: theme.colors.background }}>
                <span style={{ color: theme.colors.text.primary }}>Climate Change Assessment</span>
                <span className="text-sm" style={{ color: theme.colors.text.secondary }}>2024-01-10</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: theme.colors.background }}>
                <span style={{ color: theme.colors.text.primary }}>Disaster Management Study</span>
                <span className="text-sm" style={{ color: theme.colors.text.secondary }}>2024-01-05</span>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start p-3"
                data-testid="create-impact-study-button"
              >
                Create New Impact Study
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start p-3"
                data-testid="import-external-data-button"
              >
                Import External Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start p-3"
                data-testid="export-results-button"
              >
                Export Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactToolbox;