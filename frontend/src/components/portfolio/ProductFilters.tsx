'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

const ProductFilters: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { filters, setFilters } = usePortfolioStore();

  // Theme options
  const themeOptions = [
    'Land',
    'Marine',
    'Other'
  ];

  // Product category options
  const categoryOptions = [
    'Vegetation',
    'Rainfall (Monitoring)',
    'Rainfall (Forecast)',
    'Fire',
    'Inland water',
    'Temperature (Monitoring)',
    'Temperature (Forecast)',
    'Oceanography',
    'Atmosphere',
    'Miscellaneous'
  ];

  // Region options
  const regionOptions = [
    'Global',
    'Caribbean, Pacific, Africa',
    'Africa',
    'Northern Africa',
    'Western Africa',
    'Eastern Africa',
    'Central Africa',
    'Southern Africa',
    'Caribbean',
    'Pacific'
  ];


  const handleThemeSelectAll = (checked: boolean) => {
    setFilters({
      selectedThemes: checked ? [...themeOptions] : []
    });
  };

  const handleThemeToggle = (theme: string) => {
    const isSelected = filters.selectedThemes.includes(theme);
    const newSelectedThemes = isSelected
      ? filters.selectedThemes.filter(t => t !== theme)
      : [...filters.selectedThemes, theme];
    
    setFilters({ selectedThemes: newSelectedThemes });
  };

  const handleCategoryToggle = (category: string) => {
    const isSelected = filters.selectedCategories.includes(category);
    const newSelectedCategories = isSelected
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category];
    
    setFilters({ selectedCategories: newSelectedCategories });
  };

  const handleRegionToggle = (region: string) => {
    const isSelected = filters.selectedRegions.includes(region);
    const newSelectedRegions = isSelected
      ? filters.selectedRegions.filter(r => r !== region)
      : [...filters.selectedRegions, region];
    
    setFilters({ selectedRegions: newSelectedRegions });
  };

  const renderCheckbox = (
    id: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
    label: string,
    isSelectAll = false
  ) => (
    <div className="flex items-center space-x-2 mb-2" key={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border"
        style={{
          accentColor: theme.colors.primary,
          borderColor: theme.colors.border
        }}
        data-testid={`filter-checkbox-${id}`}
      />
      <label
        htmlFor={id}
        className={`text-sm cursor-pointer ${isSelectAll ? 'font-medium' : ''}`}
        style={{ 
          color: isSelectAll ? theme.colors.primary : theme.colors.text.primary 
        }}
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="w-5/6" data-testid="product-filters">
      {/* Search Products Container */}
      <Card
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <CardContent className="p-4">
          {/* Search Products Title */}
          <div
            className="text-lg font-semibold text-center mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            {t('portfolio.search') || 'Search Products'}
          </div>

          {/* Theme Filters */}
          <div className="mb-4">
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              {t('portfolio.themes') || 'Themes'}
            </h3>
            <div
              className="border rounded p-3"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.hover }}
            >
              <div className="max-h-24 overflow-y-auto space-y-1">
                {themeOptions.map((themeOption) =>
                  renderCheckbox(
                    `theme-${themeOption.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                    filters.selectedThemes.includes(themeOption),
                    () => handleThemeToggle(themeOption),
                    t(`categories.${themeOption.toLowerCase().replace(/[^a-z0-9]/g, '')}`) || themeOption
                  )
                )}
              </div>
            </div>
          </div>

          {/* Product Category Filters */}
          <div className="mb-4">
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              {t('portfolio.productCategories') || 'Product Categories'}
            </h3>
            <div
              className="border rounded p-3"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.hover }}
            >
              <div className="max-h-44 overflow-y-auto space-y-1">
                {categoryOptions.map((category) =>
                  renderCheckbox(
                    `category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                    filters.selectedCategories.includes(category),
                    () => handleCategoryToggle(category),
                    t(`categories.${category.toLowerCase().replace(/[^a-z0-9]/g, '')}`) || category
                  )
                )}
              </div>
            </div>
          </div>

          {/* Region Filters */}
          <div className="mb-4">
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              {t('portfolio.regions') || 'Regions'}
            </h3>
            <div
              className="border rounded p-3"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.hover }}
            >
              <div className="max-h-44 overflow-y-auto space-y-1">
                {regionOptions.map((region) =>
                  renderCheckbox(
                    `region-${region.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                    filters.selectedRegions.includes(region),
                    () => handleRegionToggle(region),
                    t(`regions.${region.toLowerCase().replace(/[^a-z0-9]/g, '')}`) || region
                  )
                )}
              </div>
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: theme.colors.border }}>
            {/* Left side - New products checkbox */}
            <div className="flex items-center space-x-2 mr-8">
              <div className="flex items-center justify-center w-10 h-6 bg-green-500 rounded-full px-2">
                <span className="text-white text-xs font-bold">
                  {t('portfolio.new') || 'New'}
                </span>
              </div>
              <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                {t('portfolio.newProductsVersion') || 'Search only new products in version 4.0'}
              </span>
              <input
                type="checkbox"
                className="w-4 h-4 rounded border"
                style={{
                  accentColor: theme.colors.primary,
                  borderColor: theme.colors.border
                }}
                data-testid="search-new-products-checkbox"
              />
            </div>

            {/* Right side - Search button */}
            <Button
              data-testid="search-products-button"
            >
              {t('portfolio.searchButton') || 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;