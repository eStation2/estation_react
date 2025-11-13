'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';

const Help: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'data-management', name: 'Data Management', icon: '📊' },
    { id: 'analysis', name: 'Analysis Tools', icon: '🔍' },
    { id: 'processing', name: 'Processing', icon: '⚙️' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' },
    { id: 'faq', name: 'FAQ', icon: '❓' }
  ];

  const helpContent = {
    'getting-started': {
      title: 'Getting Started with eStation',
      articles: [
        {
          title: 'Welcome to eStation',
          content: 'Learn the basics of navigating the eStation platform and understanding its key features.'
        },
        {
          title: 'Setting Up Your Workspace',
          content: 'Configure your analysis workspace with maps, graphs, and data visualization tools.'
        },
        {
          title: 'Understanding the Dashboard',
          content: 'Explore the main dashboard features including services, data information, and system status.'
        },
        {
          title: 'Basic Navigation',
          content: 'Learn how to navigate between different sections: Portfolio, Acquisition, Processing, and Analysis.'
        }
      ]
    },
    'data-management': {
      title: 'Data Management',
      articles: [
        {
          title: 'Data Sources',
          content: 'Understanding available satellite data sources and how to access them.'
        },
        {
          title: 'Data Import & Export',
          content: 'Learn how to import external data and export processed results.'
        },
        {
          title: 'Data Quality Assessment',
          content: 'Tools and methods for assessing data quality and fitness for purpose.'
        },
        {
          title: 'Archive Management',
          content: 'Managing your data archives and understanding storage options.'
        }
      ]
    },
    'analysis': {
      title: 'Analysis Tools',
      articles: [
        {
          title: 'Creating Maps',
          content: 'Step-by-step guide to creating and customizing interactive maps.'
        },
        {
          title: 'Graph Generation',
          content: 'How to create various types of graphs and charts for data visualization.'
        },
        {
          title: 'Workspace Management',
          content: 'Managing multiple workspaces and organizing your analysis projects.'
        },
        {
          title: 'Advanced Analysis Features',
          content: 'Utilizing advanced analysis tools and statistical functions.'
        }
      ]
    },
    'processing': {
      title: 'Processing',
      articles: [
        {
          title: 'Processing Workflows',
          content: 'Understanding and creating automated processing workflows.'
        },
        {
          title: 'Job Management',
          content: 'Monitoring and managing processing jobs and their status.'
        },
        {
          title: 'Custom Processing',
          content: 'Creating custom processing algorithms and scripts.'
        },
        {
          title: 'Performance Optimization',
          content: 'Tips for optimizing processing performance and resource usage.'
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      articles: [
        {
          title: 'Common Issues',
          content: 'Solutions to frequently encountered problems and error messages.'
        },
        {
          title: 'Performance Issues',
          content: 'Diagnosing and resolving performance-related problems.'
        },
        {
          title: 'Connection Problems',
          content: 'Troubleshooting connectivity issues with data sources and services.'
        },
        {
          title: 'Error Messages',
          content: 'Understanding and resolving common error messages.'
        }
      ]
    },
    'faq': {
      title: 'Frequently Asked Questions',
      articles: [
        {
          title: 'What is eStation?',
          content: 'eStation is a comprehensive satellite data processing and analysis platform designed for environmental monitoring and research.'
        },
        {
          title: 'How do I get started?',
          content: 'Begin by exploring the Dashboard to understand available services, then navigate to the Analysis section to create your first workspace.'
        },
        {
          title: 'What data formats are supported?',
          content: 'eStation supports various formats including GeoTIFF, NetCDF, HDF5, and other common geospatial data formats.'
        },
        {
          title: 'How can I export my results?',
          content: 'Results can be exported in multiple formats through the Analysis workspace or using the Impact Toolbox export functions.'
        }
      ]
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
            {t('menu.help')}
          </h1>
          <p
            className="text-lg"
            style={{ color: theme.colors.text.secondary }}
          >
            Get help and support for using the eStation platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Help Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "ghost"}
                      onClick={() => setActiveCategory(category.id)}
                      className="w-full justify-start p-3"
                    >
                      <span className="mr-3">{category.icon}</span>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start p-2">
                    📘 User Manual
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-2">
                    🎥 Video Tutorials
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-2">
                    💬 Community Forum
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-2">
                    📧 Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {helpContent[activeCategory as keyof typeof helpContent].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {helpContent[activeCategory as keyof typeof helpContent].articles.map((article, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                          {article.content}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm">
                            Read More
                          </Button>
                          <Button size="sm" variant="secondary">
                            View Tutorial
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle>Need Additional Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 text-muted-foreground">
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help you.
                </p>
                <div className="flex gap-3">
                  <Button>
                    Contact Support
                  </Button>
                  <Button variant="secondary">
                    Submit Feedback
                  </Button>
                  <Button variant="outline">
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;