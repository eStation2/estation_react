'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAcquisitionViewModel } from '@/viewmodels/AcquisitionViewModel';

const Acquisition: React.FC = () => {
  // MVVM: View layer - only handles UI presentation
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // MVVM: Connect to ViewModel - single source of state and business logic
  const acquisitionViewModel = useAcquisitionViewModel();

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="w-full p-6">
        <div
          className="rounded-lg p-6 shadow-md"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <h1
            className="text-3xl font-bold mb-6"
            style={{ color: theme.colors.text.primary }}
          >
            {t('menu.acquisition')}
          </h1>
          
          <div className="space-y-4">
            <p
              className="text-lg"
              style={{ color: theme.colors.text.secondary }}
            >
              Data acquisition services for collecting and managing satellite and ground-based observations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="rounded-md p-4"
                style={{
                  backgroundColor: theme.colors.info + '10',
                  border: `1px solid ${theme.colors.info}`
                }}
              >
                <h2
                  className="text-xl font-semibold mb-3"
                  style={{ color: theme.colors.text.primary }}
                >
                  Active Acquisitions
                </h2>
                <ul className="space-y-2">
                  {acquisitionViewModel.sources.map(source => (
                    <li 
                      key={source.id} 
                      style={{ color: theme.colors.text.secondary }}
                      className="flex justify-between items-center"
                    >
                      <span>• {source.name}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        source.status === 'active' ? 'bg-green-100 text-green-800' : 
                        source.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {source.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-md p-4"
                style={{
                  backgroundColor: theme.colors.success + '10',
                  border: `1px solid ${theme.colors.success}`
                }}
              >
                <h2
                  className="text-xl font-semibold mb-3"
                  style={{ color: theme.colors.text.primary }}
                >
                  Acquisition Status
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Daily Coverage</span>
                    <span style={{ color: theme.colors.success }}>{acquisitionViewModel.stats.dailyCoverage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Data Quality</span>
                    <span style={{ color: theme.colors.success }}>{acquisitionViewModel.stats.dataQuality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Processing Time</span>
                    <span style={{ color: theme.colors.success }}>{acquisitionViewModel.stats.processingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Active Sources</span>
                    <span style={{ color: theme.colors.success }}>{acquisitionViewModel.getActiveSourcesCount()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acquisition;