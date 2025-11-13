'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Panel, { PanelTool, DockedItem } from './Panel';
import { MapPanel as MapPanelType } from '@/viewmodels/AnalysisViewModel';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Checkbox,
} from '@/components/ui';

interface MapPanelProps {
  panel: MapPanelType;
  onRemove: () => void;
}

const MapPanel: React.FC<MapPanelProps> = ({ panel, onRemove }) => {
  const { theme } = useTheme();
  const [selectedTool, setSelectedTool] = useState<string>('pan');
  const [showProducts, setShowProducts] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // ExtJS Panel Tools (header buttons)
  const tools: PanelTool[] = [
    {
      type: 'gear',
      tooltip: 'Map Settings',
      handler: () => console.log('Map settings clicked')
    },
    {
      type: 'refresh',
      tooltip: 'Refresh Map',
      handler: () => console.log('Refresh map clicked')
    },
    {
      type: 'close',
      tooltip: 'Close Panel',
      handler: onRemove
    }
  ];

  // ExtJS Docked Items (Toolbars)
  const dockedItems: DockedItem[] = [
    {
      xtype: 'toolbar',
      dock: 'top',
      items: [
        {
          text: 'PRODUCTS',
          iconCls: '📁',
          tooltip: 'Select map products',
          handler: () => setShowProducts(!showProducts)
        },
        { type: 'separator' },
        {
          text: '🔍+',
          tooltip: 'Zoom In',
          handler: () => setZoomLevel(prev => Math.min(prev + 25, 400))
        },
        {
          text: '🔍−',
          tooltip: 'Zoom Out',
          handler: () => setZoomLevel(prev => Math.max(prev - 25, 25))
        },
        {
          text: '↕',
          tooltip: 'Pan Tool',
          handler: () => setSelectedTool('pan')
        },
        { type: 'separator' },
        {
          text: '📏',
          tooltip: 'Measure Tool',
          handler: () => setSelectedTool('measure')
        },
        {
          text: 'ℹ',
          tooltip: 'Info Tool',
          handler: () => setSelectedTool('info')
        },
        { type: 'spacer' },
        {
          text: `${zoomLevel}%`,
          type: 'text'
        },
        { type: 'separator' },
        {
          text: '🖨',
          tooltip: 'Print Map',
          handler: () => console.log('Print map')
        }
      ]
    }
  ];

  // Status bar (bottom toolbar)
  const statusBar: DockedItem = {
    xtype: 'toolbar',
    dock: 'bottom',
    items: [
      {
        text: `Coordinate System: WGS84`,
        type: 'text'
      },
      { type: 'spacer' },
      {
        text: `Scale: 1:${(1000000 / (zoomLevel / 100)).toLocaleString()}`,
        type: 'text'
      },
      { type: 'separator' },
      {
        text: `Zoom: ${zoomLevel}%`,
        type: 'text'
      }
    ]
  };

  return (
    <Panel
      title={panel.title}
      width="100%"
      height="100%"
      collapsible={true}
      closable={false}
      tools={tools}
      dockedItems={[...dockedItems, statusBar]}
      layout="fit"
      cls="extjs-map-panel"
      bodyCls="map-body"
      onCollapse={(collapsed) => console.log('Map panel collapsed:', collapsed)}
    >
      {/* Map Content Area */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        backgroundColor: '#f0f0f0',
        border: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Map Placeholder */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: theme.colors.text.secondary
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
            OpenLayers Map Container
          </div>
          <div style={{ fontSize: '14px', textAlign: 'center' }}>
            <div>Active Tool: {selectedTool}</div>
            <div>Zoom Level: {zoomLevel}%</div>
            {panel.products && <div>Products: {panel.products.join(', ')}</div>}
            {panel.dateRange && <div>Date Range: {panel.dateRange}</div>}
          </div>
        </div>

        {/* Products Panel (conditionally visible) */}
        {showProducts && (
          <Card className="absolute top-2 left-2 w-48 z-10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                Available Products
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {[
                  'Vegetation Index (NDVI)',
                  'Land Surface Temperature',
                  'Precipitation Data',
                  'Cloud Coverage',
                  'Digital Elevation Model'
                ].map((product, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`product-${index}`}
                      onCheckedChange={(checked) => {
                        console.log(`Product ${product}: ${checked}`);
                      }}
                    />
                    <Label
                      htmlFor={`product-${index}`}
                      className="text-xs cursor-pointer"
                    >
                      {product}
                    </Label>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setShowProducts(false)}
                size="sm"
                className="w-full mt-2"
              >
                Apply
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <Card className="absolute top-2 right-2 w-32 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">
              Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            {[
              { color: '#228B22', label: 'High' },
              { color: '#FFD700', label: 'Medium' },
              { color: '#DC143C', label: 'Low' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 border border-gray-300"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Scale Bar */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(255,255,255,0.9)',
          border: `1px solid ${theme.colors.border}`,
          padding: '4px 8px',
          borderRadius: '2px',
          fontSize: '11px',
          color: theme.colors.text.primary
        }}>
          <div style={{ marginBottom: '2px' }}>Scale</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '60px',
              height: '4px',
              backgroundColor: '#000',
              marginRight: '6px'
            }} />
            <span>500 km</span>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default MapPanel;