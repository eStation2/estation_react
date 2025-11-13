'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const FitnessForPurposes: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div
      className="h-full w-full p-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            {t('menu.fitnessForPurposes')}
          </h1>
          <p
            className="text-lg"
            style={{ color: theme.colors.text.secondary }}
          >
            Evaluate and assess data fitness for specific purposes and use cases.
          </p>
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
              className="text-xl font-semibold mb-3"
              style={{ color: theme.colors.text.primary }}
            >
              Data Quality Assessment
            </h2>
            <p
              className="text-sm mb-4"
              style={{ color: theme.colors.text.secondary }}
            >
              Assess the quality of satellite data products for specific applications.
            </p>
            <Button
              className="px-4 py-2"
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
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: theme.colors.text.primary }}
            >
              Validation Reports
            </h2>
            <p
              className="text-sm mb-4"
              style={{ color: theme.colors.text.secondary }}
            >
              Generate comprehensive validation reports for data products.
            </p>
            <Button
              className="px-4 py-2"
              data-testid="generate-report-button"
            >
              Generate Report
            </Button>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: theme.colors.text.primary }}
            >
              Accuracy Metrics
            </h2>
            <p
              className="text-sm mb-4"
              style={{ color: theme.colors.text.secondary }}
            >
              Calculate and analyze accuracy metrics for satellite products.
            </p>
            <Button
              className="px-4 py-2"
              data-testid="view-metrics-button"
            >
              View Metrics
            </Button>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: theme.colors.text.primary }}
            >
              Fitness Criteria
            </h2>
            <p
              className="text-sm mb-4"
              style={{ color: theme.colors.text.secondary }}
            >
              Define and manage fitness criteria for different use cases.
            </p>
            <Button
              className="px-4 py-2"
              data-testid="manage-criteria-button"
            >
              Manage Criteria
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessForPurposes;