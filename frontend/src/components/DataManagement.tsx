'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDataManagementViewModel } from '@/viewmodels/DataManagementViewModel';

const DataManagement: React.FC = () => {
  // MVVM: View layer - only handles UI presentation
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // MVVM: Connect to ViewModel - single source of state and business logic
  const dataManagementViewModel = useDataManagementViewModel();

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
            {t('menu.dataManagement')}
          </h1>
          
          <div className="space-y-6">
            <p
              className="text-lg"
              style={{ color: theme.colors.text.secondary }}
            >
              Comprehensive data management tools for organizing, cataloging, and maintaining Earth observation datasets.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Storage Overview
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Total Capacity</span>
                    <span style={{ color: theme.colors.text.primary }}>{dataManagementViewModel.storageInfo.totalCapacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Used Space</span>
                    <span style={{ color: theme.colors.warning }}>{dataManagementViewModel.storageInfo.usedSpace}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Available</span>
                    <span style={{ color: theme.colors.success }}>{dataManagementViewModel.storageInfo.availableSpace}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.text.secondary }}>Usage Rate</span>
                    <span style={{ color: theme.colors.text.primary }}>{dataManagementViewModel.storageInfo.usageRate.toFixed(1)}%</span>
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
                  Data Categories
                </h2>
                <ul className="space-y-2">
                  {dataManagementViewModel.dataCategories.map(category => (
                    <li key={category.name} style={{ color: theme.colors.text.secondary }}>
                      • {category.name}: {category.size} ({category.percentage.toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              </div>
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
                Data Management Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dataManagementViewModel.features.map(feature => (
                  <div key={feature.title}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold" style={{ color: theme.colors.text.primary }}>
                        {feature.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        feature.status === 'active' ? 'bg-green-100 text-green-800' : 
                        feature.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    <p style={{ color: theme.colors.text.secondary }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;