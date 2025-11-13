'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Panel, { PanelTool, DockedItem } from './Panel';
import { GraphPanel as GraphPanelType } from '@/viewmodels/AnalysisViewModel';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
} from '@/components/ui';

interface GraphPanelProps {
  panel: GraphPanelType;
  onRemove: () => void;
}

const GraphPanel: React.FC<GraphPanelProps> = ({ panel, onRemove }) => {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<string>(panel.chartType || 'line');
  const [showDataConfig, setShowDataConfig] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  // Sample data for demonstration
  const sampleData = [
    { month: 'Jan', value1: 20, value2: 35 },
    { month: 'Feb', value1: 45, value2: 40 },
    { month: 'Mar', value1: 35, value2: 60 },
    { month: 'Apr', value1: 50, value2: 45 },
    { month: 'May', value1: 65, value2: 70 },
    { month: 'Jun', value1: 75, value2: 65 }
  ];

  // ExtJS Panel Tools (header buttons)
  const tools: PanelTool[] = [
    {
      type: 'gear',
      tooltip: 'Chart Settings',
      handler: () => console.log('Chart settings clicked')
    },
    {
      type: 'save',
      tooltip: 'Export Chart',
      handler: () => console.log('Export chart clicked')
    },
    {
      type: 'refresh',
      tooltip: 'Refresh Data',
      handler: () => console.log('Refresh data clicked')
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
          text: 'DATA',
          iconCls: '📊',
          tooltip: 'Configure data source',
          handler: () => setShowDataConfig(!showDataConfig)
        },
        { type: 'separator' },
        {
          text: 'Line',
          tooltip: 'Line Chart',
          handler: () => setChartType('line')
        },
        {
          text: 'Bar',
          tooltip: 'Bar Chart',
          handler: () => setChartType('bar')
        },
        {
          text: 'Area',
          tooltip: 'Area Chart',
          handler: () => setChartType('area')
        },
        {
          text: 'Scatter',
          tooltip: 'Scatter Plot',
          handler: () => setChartType('scatter')
        },
        { type: 'separator' },
        {
          text: 'Grid',
          tooltip: 'Toggle Grid',
          handler: () => setShowGrid(!showGrid)
        },
        {
          text: 'Legend',
          tooltip: 'Toggle Legend',
          handler: () => setShowLegend(!showLegend)
        },
        { type: 'spacer' },
        {
          text: `Type: ${chartType}`,
          type: 'text'
        },
        { type: 'separator' },
        {
          text: '🖨',
          tooltip: 'Print Chart',
          handler: () => console.log('Print chart')
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
        text: `Data Points: ${sampleData.length}`,
        type: 'text'
      },
      { type: 'spacer' },
      {
        text: `Chart Type: ${chartType}`,
        type: 'text'
      },
      { type: 'separator' },
      {
        text: panel.dataSource ? `Source: ${panel.dataSource}` : 'Source: Sample Data',
        type: 'text'
      }
    ]
  };

  // Simple chart rendering based on type
  const renderChart = () => {
    const maxValue = Math.max(...sampleData.flatMap(d => [d.value1, d.value2]));
    const chartWidth = 400;
    const chartHeight = 250;
    const padding = 40;

    if (chartType === 'bar') {
      return (
        <svg width={chartWidth} height={chartHeight} style={{ border: showGrid ? `1px solid ${theme.colors.border}` : 'none' }}>
          {/* Grid lines */}
          {showGrid && (
            <g>
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1={padding}
                  y1={padding + (i * (chartHeight - 2 * padding) / 4)}
                  x2={chartWidth - padding}
                  y2={padding + (i * (chartHeight - 2 * padding) / 4)}
                  stroke={theme.colors.border}
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}
            </g>
          )}
          
          {/* Bars */}
          {sampleData.map((d, i) => {
            const barWidth = (chartWidth - 2 * padding) / sampleData.length / 2 - 2;
            const x = padding + (i * (chartWidth - 2 * padding) / sampleData.length);
            const height1 = (d.value1 / maxValue) * (chartHeight - 2 * padding);
            const height2 = (d.value2 / maxValue) * (chartHeight - 2 * padding);
            
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={chartHeight - padding - height1}
                  width={barWidth}
                  height={height1}
                  fill="#4A90E2"
                />
                <rect
                  x={x + barWidth + 2}
                  y={chartHeight - padding - height2}
                  width={barWidth}
                  height={height2}
                  fill="#7B68EE"
                />
                <text
                  x={x + barWidth}
                  y={chartHeight - padding + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill={theme.colors.text.secondary}
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      );
    } else {
      // Line chart
      const points1 = sampleData.map((d, i) => {
        const x = padding + (i * (chartWidth - 2 * padding) / (sampleData.length - 1));
        const y = chartHeight - padding - (d.value1 / maxValue) * (chartHeight - 2 * padding);
        return `${x},${y}`;
      }).join(' ');
      
      const points2 = sampleData.map((d, i) => {
        const x = padding + (i * (chartWidth - 2 * padding) / (sampleData.length - 1));
        const y = chartHeight - padding - (d.value2 / maxValue) * (chartHeight - 2 * padding);
        return `${x},${y}`;
      }).join(' ');

      return (
        <svg width={chartWidth} height={chartHeight} style={{ border: showGrid ? `1px solid ${theme.colors.border}` : 'none' }}>
          {/* Grid lines */}
          {showGrid && (
            <g>
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1={padding}
                  y1={padding + (i * (chartHeight - 2 * padding) / 4)}
                  x2={chartWidth - padding}
                  y2={padding + (i * (chartHeight - 2 * padding) / 4)}
                  stroke={theme.colors.border}
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}
            </g>
          )}
          
          {/* Lines */}
          <polyline
            points={points1}
            fill="none"
            stroke="#4A90E2"
            strokeWidth="2"
          />
          <polyline
            points={points2}
            fill="none"
            stroke="#7B68EE"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {sampleData.map((d, i) => {
            const x = padding + (i * (chartWidth - 2 * padding) / (sampleData.length - 1));
            const y1 = chartHeight - padding - (d.value1 / maxValue) * (chartHeight - 2 * padding);
            const y2 = chartHeight - padding - (d.value2 / maxValue) * (chartHeight - 2 * padding);
            
            return (
              <g key={i}>
                <circle cx={x} cy={y1} r="3" fill="#4A90E2" />
                <circle cx={x} cy={y2} r="3" fill="#7B68EE" />
                <text
                  x={x}
                  y={chartHeight - padding + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill={theme.colors.text.secondary}
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }
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
      cls="extjs-graph-panel"
      bodyCls="graph-body"
      onCollapse={(collapsed) => console.log('Graph panel collapsed:', collapsed)}
    >
      {/* Chart Content Area */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '20px'
      }}>
        {/* Main Chart */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}>
          {/* Chart Title */}
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: theme.colors.text.primary
          }}>
            Sample Data Visualization ({chartType} chart)
          </div>
          
          {/* Chart Area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {renderChart()}
          </div>
          
          {/* Legend */}
          {showLegend && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '16px',
              padding: '8px',
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '3px',
                  backgroundColor: '#4A90E2'
                }} />
                <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                  Series 1
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '3px',
                  backgroundColor: '#7B68EE'
                }} />
                <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                  Series 2
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Data Configuration Panel (conditionally visible) */}
        {showDataConfig && (
          <Card className="absolute top-2 left-2 w-64 z-10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                Data Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">
                  Data Source:
                </Label>
                <Select defaultValue="sample">
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sample">Sample Dataset</SelectItem>
                    <SelectItem value="live">Live Data Feed</SelectItem>
                    <SelectItem value="historical">Historical Data</SelectItem>
                    <SelectItem value="csv">Uploaded CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">
                  Date Range:
                </Label>
                <Input 
                  type="text" 
                  placeholder="Last 6 months"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">
                  Aggregation:
                </Label>
                <Select defaultValue="monthly">
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select aggregation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => setShowDataConfig(false)}
                size="sm"
                className="w-full"
              >
                Apply Configuration
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Chart Statistics */}
        <Card className="absolute top-2 right-2 w-36 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <div className="text-xs text-muted-foreground">
              <div>Points: {sampleData.length}</div>
              <div>Series: 2</div>
              <div>Type: {chartType}</div>
              <div>
                Range: {Math.min(...sampleData.flatMap(d => [d.value1, d.value2]))} - {Math.max(...sampleData.flatMap(d => [d.value1, d.value2]))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Panel>
  );
};

export default GraphPanel;