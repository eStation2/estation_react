'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const JupyterNotebook: React.FC = () => {
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
            {t('menu.jupyterNotebook')}
          </h1>
          <p
            className="text-lg"
            style={{ color: theme.colors.text.secondary }}
          >
            Interactive development environment for data analysis and visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div
            className="lg:col-span-2 p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              Jupyter Notebook Interface
            </h2>
            <div
              className="h-96 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.primary }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v-.07zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <p
                  className="text-lg font-medium"
                  style={{ color: theme.colors.text.primary }}
                >
                  Jupyter Notebook Environment
                </p>
                <p
                  className="text-sm mt-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Launch a new notebook session to start coding
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                className="px-4 py-2"
                data-testid="launch-notebook-button"
              >
                Launch Notebook
              </Button>
              <Button
                variant="outline"
                className="px-4 py-2"
                data-testid="open-existing-button"
              >
                Open Existing
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: theme.colors.text.primary }}
              >
                Available Kernels
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: theme.colors.background }}>
                  <span style={{ color: theme.colors.text.primary }}>Python 3.9</span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: theme.colors.background }}>
                  <span style={{ color: theme.colors.text.primary }}>R</span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: theme.colors.background }}>
                  <span style={{ color: theme.colors.text.primary }}>Julia</span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
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
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: theme.colors.text.primary }}
              >
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2"
                  data-testid="new-python-notebook-button"
                >
                  New Python Notebook
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2"
                  data-testid="import-from-file-button"
                >
                  Import from File
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2"
                  data-testid="view-templates-button"
                >
                  View Templates
                </Button>
              </div>
            </div>
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
              Recent Notebooks
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: theme.colors.background }}>
                <div>
                  <span className="block" style={{ color: theme.colors.text.primary }}>Satellite Data Analysis</span>
                  <span className="text-sm" style={{ color: theme.colors.text.secondary }}>Modified: 2 hours ago</span>
                </div>
                <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: theme.colors.success + '20', color: theme.colors.success }}>
                  Python
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: theme.colors.background }}>
                <div>
                  <span className="block" style={{ color: theme.colors.text.primary }}>Vegetation Index Calculation</span>
                  <span className="text-sm" style={{ color: theme.colors.text.secondary }}>Modified: 1 day ago</span>
                </div>
                <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: theme.colors.success + '20', color: theme.colors.success }}>
                  Python
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: theme.colors.background }}>
                <div>
                  <span className="block" style={{ color: theme.colors.text.primary }}>Climate Data Processing</span>
                  <span className="text-sm" style={{ color: theme.colors.text.secondary }}>Modified: 3 days ago</span>
                </div>
                <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: theme.colors.info + '20', color: theme.colors.info }}>
                  R
                </span>
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
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{ color: theme.colors.text.primary }}>Jupyter Server</span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-sm" style={{ color: theme.colors.success }}>Running</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: theme.colors.text.primary }}>Memory Usage</span>
                <span className="text-sm" style={{ color: theme.colors.text.secondary }}>2.4 GB / 8 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: theme.colors.text.primary }}>Active Sessions</span>
                <span className="text-sm" style={{ color: theme.colors.text.secondary }}>3</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: theme.colors.text.primary }}>CPU Usage</span>
                <span className="text-sm" style={{ color: theme.colors.text.secondary }}>15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JupyterNotebook;