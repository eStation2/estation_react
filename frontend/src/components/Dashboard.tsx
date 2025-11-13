'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
});
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDashboardViewModel } from '@/viewmodels/DashboardViewModel';
import { useNavigation } from '@/contexts/NavigationContext';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import Header from './Header';
import ServiceButton from './ServiceButton';
import ProductCategories from './ProductCategories';
import Portfolio from './Portfolio';
import Acquisition from './Acquisition';
import Processing from './Processing';
import DataManagement from './DataManagement';
import Analysis from './Analysis';
import FitnessForPurposes from './FitnessForPurposes';
import ImpactToolbox from './ImpactToolbox';
import JupyterNotebook from './JupyterNotebook';
import SystemSettings from './SystemSettings';
import Help from './Help';

const Dashboard: React.FC = () => {
  // MVVM: View layer - only handles UI presentation
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { currentPage } = useNavigation();
  
  // MVVM: Connect to ViewModel - single source of state and business logic
  const dashboardViewModel = useDashboardViewModel();

  // Transform ViewModel data for UI display with translations
  const archiveStatusData = dashboardViewModel.archiveStatusData.map(item => ({
    ...item,
    name: item.name === 'Present' ? t('archive.present') : t('archive.missing')
  }));

  const productsCategoryData = dashboardViewModel.productsCategoryData.map(item => {
    const categoryMap: { [key: string]: string } = {
      'Vegetation': t('categories.vegetation') || 'Vegetation',
      'Precipitation (Monitoring)': t('categories.precipitationMonitoring') || 'Precipitation Monitoring',
      'Precipitation (Forecast)': t('categories.precipitationForecast') || 'Precipitation Forecast',
      'Fire': t('categories.fire') || 'Fire',
      'Oceanography': t('categories.oceanography') || 'Oceanography',
      'Temperature (Monitoring)': t('categories.temperatureMonitoring') || 'Temperature Monitoring',
      'Temperature (Forecast)': t('categories.temperatureForecast') || 'Temperature Forecast',
      'Continental Water': t('categories.continentalWater') || 'Continental Water',
      'Various': t('categories.various') || 'Various',
      'Miscellaneous': t('categories.miscellaneous') || 'Miscellaneous'
    };
    return {
      ...item,
      name: categoryMap[item.name] || item.name
    };
  });

  const getArchiveStatusChartOption = () => ({
    backgroundColor: 'transparent',
    title: {
      text: t('dashboard.datasetCompleteness'),
      left: 'center',
      top: '10px',
      textStyle: {
        color: theme.colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number; percent: number }) => {
        return `${t('dashboard.datasetCompleteness')} <br/>${params.name}: ${params.value} (${params.percent}%)`;
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 50,
      textStyle: {
        color: theme.colors.text.primary,
        fontSize: 11
      },
      itemWidth: 10,
      itemHeight: 10,
      data: archiveStatusData.map(item => item.name)
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#fff'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: archiveStatusData
      }
    ]
  });

  const getProductsChartOption = () => ({
    backgroundColor: 'transparent',
    title: {
      text: t('dashboard.availableProducts'),
      left: 'center',
      top: '10px',
      textStyle: {
        color: theme.colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number; percent: number }) => {
        return `${t('dashboard.availableProducts')} <br/>${params.name}: ${params.value} (${params.percent}%)`;
      }
    },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 50,
      textStyle: {
        color: theme.colors.text.primary,
        fontSize: 11
      },
      itemWidth: 10,
      itemHeight: 10,
      data: productsCategoryData.map(item => item.name)
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}',
          fontSize: 11,
          color: theme.colors.text.primary
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '12',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 30,
          lineStyle: {
            color: theme.colors.text.primary,
            width: 1
          }
        },
        itemStyle: {
          borderRadius: 2,
          borderColor: theme.colors.text.primary,
          borderWidth: 1
        },
        data: productsCategoryData
      }
    ]
  });

  // Render all pages simultaneously - ExtJS CardLayout pattern
  // Only the active page is visible, others are hidden but remain mounted
  const renderPersistentPages = () => {
    const pages = [
      {
        key: 'dashboard',
        component: (
          <div className="w-full p-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-10">
                <Card 
                  className="mb-4"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.text.primary
                  }}
                >
                  <CardHeader className="flex flex-row items-center justify-between py-2">
                    <CardTitle 
                      className="text-lg"
                      style={{ color: theme.colors.text.primary }}
                    >
                      {t('dashboard.dataInformation')}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      style={{ 
                        color: theme.colors.text.primary,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </Button>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-5 gap-6 mb-6">
                  <Card 
                    className="col-span-2"
                    style={{ 
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    <CardContent className="p-4">
                      <ReactECharts
                        option={getArchiveStatusChartOption()}
                        style={{ height: '420px', width: '100%' }}
                      />
                    </CardContent>
                  </Card>
                  <Card 
                    className="col-span-3"
                    style={{ 
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    <CardContent className="p-4">
                      <ReactECharts
                        option={getProductsChartOption()}
                        style={{ height: '420px', width: '100%' }}
                      />
                    </CardContent>
                  </Card>
                </div>

                <ProductCategories />
              </div>

              <div className="col-span-2">
                <Card 
                  className="w-[300px]"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  <CardHeader>
                    <CardTitle 
                      className="text-lg"
                      style={{ color: theme.colors.text.primary }}
                    >
                      {t('services.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardViewModel.serviceStatuses.map(service => (
                        <ServiceButton 
                          key={service.name} 
                          serviceName={service.name} 
                          isActive={service.isActive}
                          onClick={() => dashboardViewModel.updateServiceStatus(service.name, !service.isActive)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      },
      { key: 'portfolio', component: <Portfolio /> },
      { key: 'acquisition', component: <Acquisition /> },
      { key: 'processing', component: <Processing /> },
      { key: 'dataManagement', component: <DataManagement /> },
      { key: 'analysis', component: <Analysis /> },
      { key: 'fitnessForPurposes', component: <FitnessForPurposes /> },
      { key: 'impactToolbox', component: <ImpactToolbox /> },
      { key: 'jupyterNotebook', component: <JupyterNotebook /> },
      { key: 'systemSettings', component: <SystemSettings /> },
      { key: 'help', component: <Help /> }
    ];

    return pages.map(page => (
      <div
        key={page.key}
        className={`absolute inset-0 overflow-auto ${
          currentPage === page.key ? 'block' : 'hidden'
        }`}
        data-page={page.key}
        data-active={currentPage === page.key}
      >
        {page.component}
      </div>
    ));
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Header />
      {/* CardLayout Container - All pages remain mounted */}
      <div className="flex-1 relative overflow-hidden">
        {renderPersistentPages()}
      </div>
    </div>
  );
};

export default Dashboard;