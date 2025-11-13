'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

const SystemSettings: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'data', name: 'Data Sources', icon: '📊' },
    { id: 'processing', name: 'Processing', icon: '🔄' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'advanced', name: 'Advanced', icon: '🔧' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                System Configuration
              </h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <Label className="block font-medium">System Name</Label>
                      <span className="text-sm text-muted-foreground">eStation Frontend</span>
                    </div>
                    <Button size="sm">Edit</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <Label className="block font-medium">Version</Label>
                      <span className="text-sm text-muted-foreground">v2.1.0</span>
                    </div>
                    <Button size="sm" variant="secondary">Update</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <Label className="block font-medium">Auto-Save</Label>
                      <span className="text-sm text-muted-foreground">Automatically save workspace changes</span>
                    </div>
                    <Switch defaultChecked />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                Data Source Configuration
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium" style={{ color: theme.colors.text.primary }}>Satellite Data Archives</span>
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: theme.colors.text.secondary }}>
                    Connection to primary satellite data repositories
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                      Test Connection
                    </button>
                    <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.warning, color: 'white' }}>
                      Configure
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium" style={{ color: theme.colors.text.primary }}>External APIs</span>
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: theme.colors.text.secondary }}>
                    Third-party data integration endpoints
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                      Test Connection
                    </button>
                    <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.warning, color: 'white' }}>
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'processing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                Processing Settings
              </h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="space-y-4 p-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-jobs">Max Concurrent Jobs</Label>
                      <Input
                        id="max-jobs"
                        type="number"
                        defaultValue="4"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="space-y-4 p-4">
                    <div className="space-y-2">
                      <Label>Processing Priority</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="space-y-4 p-4">
                    <div className="space-y-2">
                      <Label>Output Format</Label>
                      <Select defaultValue="geotiff">
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="geotiff">GeoTIFF</SelectItem>
                          <SelectItem value="netcdf">NetCDF</SelectItem>
                          <SelectItem value="hdf5">HDF5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                Security Settings
              </h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium">Two-Factor Authentication</Label>
                      <Switch />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enable 2FA for enhanced security
                    </p>
                  </CardContent>
                </Card>
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium" style={{ color: theme.colors.text.primary }}>Session Timeout</span>
                    <span className="text-sm" style={{ color: theme.colors.text.secondary }}>30 minutes</span>
                  </div>
                  <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                    Configure
                  </button>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium" style={{ color: theme.colors.text.primary }}>API Key Management</span>
                  </div>
                  <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.warning, color: 'white' }}>
                    Manage Keys
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium" style={{ color: theme.colors.text.primary }}>Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                    Receive email notifications for system events
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium" style={{ color: theme.colors.text.primary }}>Processing Alerts</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                    Get notified when processing jobs complete
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium" style={{ color: theme.colors.text.primary }}>System Maintenance</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                    Receive notifications about system maintenance
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'advanced':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                Advanced Settings
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <h4 className="font-medium mb-2" style={{ color: theme.colors.text.primary }}>Debug Mode</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm" style={{ color: theme.colors.text.secondary }}>Enable detailed logging</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <h4 className="font-medium mb-2" style={{ color: theme.colors.text.primary }}>Cache Management</h4>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.warning, color: 'white' }}>
                      Clear Cache
                    </button>
                    <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                      Configure
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <h4 className="font-medium mb-2" style={{ color: theme.colors.text.primary }}>System Logs</h4>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.info, color: 'white' }}>
                      View Logs
                    </button>
                    <button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.success, color: 'white' }}>
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
            {t('menu.systemSettings')}
          </h1>
          <p
            className="text-lg"
            style={{ color: theme.colors.text.secondary }}
          >
            Configure system settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full justify-start p-3"
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;