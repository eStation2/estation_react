'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface PortfolioItem {
  id: string;
  name: string;
  type: 'service' | 'product';
  children?: PortfolioItem[];
  isExpanded?: boolean;
  productCode?: string;
  version?: string;
  status?: 'active' | 'inactive' | 'pending';
}

const CurrentPortfolio: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Mock portfolio data with Services group header and hierarchical structure
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([
    {
      id: 'services',
      name: 'Services',
      type: 'service',
      isExpanded: true,
      children: [
        {
          id: 'vegetation-service',
          name: 'Vegetation Monitoring Service',
          type: 'service',
          status: 'active',
          children: [
            {
              id: 'ndvi-product',
              name: 'NDVI - Normalized Difference Vegetation Index',
              type: 'product',
              productCode: 'VGT-NDVI-1KM',
              version: 'v2.1',
              status: 'active'
            },
            {
              id: 'lai-product',
              name: 'LAI - Leaf Area Index',
              type: 'product',
              productCode: 'VGT-LAI-1KM',
              version: 'v1.8',
              status: 'active'
            }
          ]
        },
        {
          id: 'fire-service',
          name: 'Fire Monitoring Service',
          type: 'service',
          status: 'active',
          children: [
            {
              id: 'fire-alerts-product',
              name: 'Fire Alerts',
              type: 'product',
              productCode: 'FIRE-ALERT-1KM',
              version: 'v3.0',
              status: 'active'
            },
            {
              id: 'burned-areas-product',
              name: 'Burned Areas',
              type: 'product',
              productCode: 'FIRE-BA-500M',
              version: 'v2.5',
              status: 'pending'
            }
          ]
        },
        {
          id: 'precipitation-service',
          name: 'Precipitation Monitoring Service',
          type: 'service',
          status: 'active',
          children: [
            {
              id: 'rainfall-product',
              name: 'Rainfall Estimates',
              type: 'product',
              productCode: 'PRECIP-RF-10KM',
              version: 'v4.2',
              status: 'active'
            },
            {
              id: 'drought-product',
              name: 'Drought Indicators',
              type: 'product',
              productCode: 'PRECIP-DI-25KM',
              version: 'v1.9',
              status: 'inactive'
            }
          ]
        }
      ]
    }
  ]);

  const toggleExpansion = (itemId: string) => {
    const updateItems = (items: PortfolioItem[]): PortfolioItem[] => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.children) {
          return { ...item, children: updateItems(item.children) };
        }
        return item;
      });
    };

    setPortfolioData(updateItems(portfolioData));
  };

  const getStatusIcon = (status?: string) => {
    const statusColors = {
      active: theme.colors.success,
      inactive: theme.colors.accent,
      pending: theme.colors.warning
    };

    const color = statusColors[status as keyof typeof statusColors] || theme.colors.text.secondary;

    return (
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    );
  };

  const renderTreeItem = (item: PortfolioItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = level * 20;

    return (
      <div key={item.id}>
        {/* Tree item row */}
        <div
          className="flex items-center py-2 px-2 hover:bg-opacity-50 cursor-pointer group"
          style={{
            paddingLeft: `${paddingLeft + 8}px`,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={() => hasChildren && toggleExpansion(item.id)}
          data-testid={`portfolio-item-${item.id}`}
        >
          {/* Expand/Collapse icon */}
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            {hasChildren && (
              <svg
                className="w-3 h-3 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  color: theme.colors.text.primary,
                  transform: item.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>

          {/* Status indicator */}
          <div className="mr-3 flex items-center">
            {getStatusIcon(item.status)}
          </div>

          {/* Item name */}
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm ${item.type === 'service' ? 'font-semibold' : 'font-normal'} truncate`}
              style={{ color: theme.colors.text.primary }}
            >
              {t(`portfolio.${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`) || item.name}
            </div>
            {item.productCode && (
              <div
                className="text-xs mt-1"
                style={{ color: theme.colors.text.secondary }}
              >
                {item.productCode} {item.version && `(${item.version})`}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Configure ${item.name}`);
              }}
              data-testid={`configure-${item.id}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Remove ${item.name}`);
              }}
              data-testid={`remove-${item.id}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && item.isExpanded && item.children?.map(child => 
          renderTreeItem(child, level + 1)
        )}
      </div>
    );
  };

  return (
    <Card
      className="h-full"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`
      }}
      data-testid="current-portfolio"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle
            className="text-lg font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            {t('portfolio.currentPortfolio') || 'Current Portfolio'}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="p-2 rounded"
              data-testid="refresh-portfolio"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="overflow-auto"
          style={{ maxHeight: '600px' }}
        >
          {portfolioData.map(item => renderTreeItem(item))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPortfolio;