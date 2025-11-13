'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui';

interface Product {
  id: string;
  name: string;
  version?: string;
  productCode: string;
  provider: string;
}

interface ProductCategory {
  id: string;
  name: string;
  count: number;
  products: Product[];
}

const ProductCategories: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['vegetation']));

  const mockCategories: ProductCategory[] = [
    {
      id: 'vegetation',
      name: t('category.vegetation'),
      count: 1,
      products: [
        {
          id: 'vgt-ndvi',
          name: 'Sentinel3-OLCI NDVI 300m',
          version: 'olci-v2.0',
          productCode: 'vgt-ndvi',
          provider: 'Copernicus global land'
        }
      ]
    },
    {
      id: 'rainfall-monitoring',
      name: t('category.precipitationMonitoring'),
      count: 5,
      products: [
        {
          id: 'efi-spi',
          name: 'Forecast of Wet and Dry Spells',
          version: '1.0',
          productCode: 'efi-spi',
          provider: 'JRC/GDO'
        },
        {
          id: 's51-monthly-tp',
          name: 'ECMWF S51 monthly Precipitation rate',
          version: '1.0',
          productCode: 's51-monthly-tp',
          provider: 'CDS'
        }
      ]
    },
    {
      id: 'rainfall-forecast',
      name: t('category.precipitationForecast'),
      count: 2,
      products: []
    },
    {
      id: 'fire',
      name: t('category.fire') || 'Fire',
      count: 1,
      products: []
    },
    {
      id: 'oceanography',
      name: t('category.oceanography') || 'Oceanography',
      count: 3,
      products: []
    },
    {
      id: 'temperature-monitoring',
      name: t('category.temperatureMonitoring'),
      count: 4,
      products: []
    },
    {
      id: 'miscellaneous',
      name: t('category.miscellaneous') || 'Miscellaneous',
      count: 4,
      products: []
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const isExpanded = (categoryId: string) => expandedCategories.has(categoryId);

  return (
    <>
      <style jsx>{`
        .scrollable-content::-webkit-scrollbar {
          width: 6px;
        }
        .scrollable-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollable-content::-webkit-scrollbar-thumb {
          background: ${theme.colors.border};
          border-radius: 3px;
        }
        .scrollable-content::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.text.secondary};
        }
      `}</style>
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: theme.colors.primary + '20',
          border: `1px solid ${theme.colors.primary}`,
          height: '400px' // Fixed height
        }}
      >
      {/* Header - matching Data information style */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            {t('dashboard.newProducts')}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 h-full overflow-hidden flex flex-col">
        <div
          className="text-sm font-medium mb-3 pb-2 border-b flex-shrink-0"
          style={{
            color: theme.colors.text.primary,
            borderColor: theme.colors.border
          }}
        >
          {t('dashboard.products')}
        </div>

        {/* Scrollable content area */}
        <div 
          className="flex-1 overflow-y-auto space-y-1 pr-2 scrollable-content" 
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${theme.colors.border} transparent`
          }}
        >
          {mockCategories.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <Button
                onClick={() => toggleCategory(category.id)}
                variant="ghost"
                className="w-full flex items-center justify-between py-2 px-3 rounded justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-5 h-5 flex items-center justify-center rounded text-white text-xs font-bold"
                    style={{
                      backgroundColor: isExpanded(category.id) ? theme.colors.text.secondary : theme.colors.info
                    }}
                  >
                    {isExpanded(category.id) ? '−' : '+'}
                  </div>
                  <span className="text-sm font-medium">
                    {category.name} ({category.count})
                  </span>
                </div>
              </Button>

              {/* Products List */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded(category.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="ml-8 space-y-4 py-2">
                  {category.products.map((product) => (
                    <div
                      key={product.id}
                      className="py-3 px-4 rounded"
                      style={{
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${theme.colors.border}`
                      }}
                    >
                      <h4
                        className="font-medium text-base mb-2"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {product.name}
                        {product.version && (
                          <span
                            className="text-sm ml-2"
                            style={{ color: theme.colors.text.secondary }}
                          >
                            - {product.version}
                          </span>
                        )}
                      </h4>
                      <div className="space-y-1">
                        <p
                          className="text-sm"
                          style={{ color: theme.colors.text.secondary }}
                        >
                          <span className="font-medium">Product code:</span> {product.productCode}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: theme.colors.text.secondary }}
                        >
                          <span className="font-medium">Provider:</span> {product.provider}
                        </p>
                      </div>
                    </div>
                  ))}
                  {category.products.length === 0 && (
                    <div
                      className="py-2 px-4 text-sm italic"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      No products available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductCategories;