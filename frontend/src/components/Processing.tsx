'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProcessingViewModel } from '@/viewmodels/ProcessingViewModel';

const Processing: React.FC = () => {
  // MVVM: View layer - only handles UI presentation
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // MVVM: Connect to ViewModel - single source of state and business logic
  const processingViewModel = useProcessingViewModel();

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
            {t('menu.processing')}
          </h1>
          
          <div className="space-y-6">
            <p
              className="text-lg"
              style={{ color: theme.colors.text.secondary }}
            >
              Advanced processing algorithms for Earth observation data analysis and product generation.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                className="rounded-md p-4"
                style={{
                  backgroundColor: theme.colors.primary + '10',
                  border: `1px solid ${theme.colors.primary}`
                }}
              >
                <h2
                  className="text-xl font-semibold mb-3"
                  style={{ color: theme.colors.text.primary }}
                >
                  Processing Chains
                </h2>
                <ul className="space-y-2">
                  {processingViewModel.processingChains.map(chain => (
                    <li 
                      key={chain.id} 
                      style={{ color: theme.colors.text.secondary }}
                      className="flex justify-between items-center"
                    >
                      <span>• {chain.name}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        chain.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {chain.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-md p-4"
                style={{
                  backgroundColor: theme.colors.warning + '10',
                  border: `1px solid ${theme.colors.warning}`
                }}
              >
                <h2
                  className="text-xl font-semibold mb-3"
                  style={{ color: theme.colors.text.primary }}
                >
                  Current Jobs
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Running</span>
                    <span style={{ color: theme.colors.warning }}>{processingViewModel.runningJobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Queued</span>
                    <span style={{ color: theme.colors.warning }}>{processingViewModel.queuedJobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Completed Today</span>
                    <span style={{ color: theme.colors.success }}>{processingViewModel.completedJobsToday}</span>
                  </div>
                </div>
              </div>

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
                  System Resources
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>CPU Usage</span>
                    <span style={{ color: theme.colors.info }}>{processingViewModel.systemResources.cpuUsage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Memory</span>
                    <span style={{ color: theme.colors.info }}>{processingViewModel.systemResources.memoryUsage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Storage</span>
                    <span style={{ color: theme.colors.info }}>{processingViewModel.systemResources.storageUsage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Temperature</span>
                    <span style={{ color: theme.colors.info }}>{processingViewModel.systemResources.temperature.toFixed(1)}°C</span>
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

export default Processing;