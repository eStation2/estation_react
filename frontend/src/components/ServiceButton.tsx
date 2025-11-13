'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';

interface ServiceButtonProps {
  serviceName: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ 
  serviceName, 
  onClick 
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const menuItems: MenuItem[] = [
    {
      id: 'execute',
      label: t('action.execute'),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      ),
      action: () => console.log(`Execute ${serviceName}`)
    },
    {
      id: 'stop',
      label: t('action.stop'),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h12v12H6z"/>
        </svg>
      ),
      action: () => console.log(`Stop ${serviceName}`)
    },
    {
      id: 'restart',
      label: t('action.restart'),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      ),
      action: () => console.log(`Restart ${serviceName}`)
    },
    {
      id: 'logs',
      label: t('action.viewLogs'),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      ),
      action: () => console.log(`View logs for ${serviceName}`)
    }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.action) item.action();
  };

  const getStatusIcon = () => {
    // Eumetcast should remain red, all others should be green
    const isEumetcast = serviceName.toLowerCase().includes('eumetcast');
    const colorClass = isEumetcast ? 'bg-red-500' : 'bg-green-500';
    
    return (
      <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
    );
  };

  const getTranslatedServiceName = (name: string) => {
    const serviceTranslations: { [key: string]: string } = {
      'Eumetcast': t('services.eumetcast') || 'Eumetcast',
      'Internet': t('services.internet') || 'Internet',
      'Data Store': t('services.dataStore') || 'Data Store',
      'Ingestion': t('services.ingestion') || 'Ingestion',
      'Processing': t('services.processing') || 'Processing',
      'System': t('services.system') || 'System'
    };
    return serviceTranslations[name] || name;
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto flex items-center"
          onClick={onClick}
        >
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {getTranslatedServiceName(serviceName)}
            </span>
          </div>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64" 
        align="end"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text.primary
        }}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick(item)}
              className="flex items-center px-4 py-3"
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
              <span 
                className="mr-3 w-5 h-5 flex items-center justify-center"
                style={{ color: theme.colors.text.primary }}
              >
                {item.icon}
              </span>
              <span 
                className="text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                {item.label}
              </span>
            </DropdownMenuItem>
            {index < menuItems.length - 1 && (
              <DropdownMenuSeparator 
                style={{ backgroundColor: theme.colors.border }}
              />
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServiceButton;