'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAnalysisViewModel } from '@/viewmodels/AnalysisViewModel';
import { Button } from '@/components/ui';
import MapPanel from './MapPanel';
import GraphPanel from './GraphPanel';

// Import React Grid Layout directly
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/grid-layout.css';

const Analysis: React.FC = () => {
  // MVVM: View layer - only handles UI presentation
  const { theme } = useTheme();
  
  // MVVM: Connect to ViewModel - single source of state and business logic
  const analysisViewModel = useAnalysisViewModel();

  const activeWorkspace = analysisViewModel.workspaces.find(
    w => w.id === analysisViewModel.activeWorkspaceId
  );

  return (
    <div
      className="h-screen w-full flex flex-col"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Workspace Tab Bar - Sticky */}
      <div 
        className="flex items-center border-b sticky top-0 z-30"
        style={{ 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border 
        }}
      >
        {/* Hamburger Menu */}
        <Button variant="ghost" size="icon" className="p-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>

        {/* REF WORKSPACES and MY WORKSPACES buttons */}
        <div className="flex gap-2 px-4">
          <Button variant="outline" size="sm">
            REF WORKSPACES
          </Button>
          <Button variant="outline" size="sm">
            MY WORKSPACES
          </Button>
        </div>

        {/* Workspace Tabs */}
        <div className="flex">
          {analysisViewModel.workspaces.map(workspace => (
            <div
              key={workspace.id}
              className={`px-4 py-2 border-r cursor-pointer flex items-center gap-2 ${
                workspace.id === analysisViewModel.activeWorkspaceId ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              style={{ 
                borderColor: theme.colors.border,
                backgroundColor: workspace.id === analysisViewModel.activeWorkspaceId ? theme.colors.primary + '10' : undefined
              }}
              onClick={() => analysisViewModel.switchWorkspace(workspace.id)}
            >
              <span style={{ color: theme.colors.text.primary }}>{workspace.name}</span>
              {!workspace.isDefault && (
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 text-gray-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar - Sticky */}
      <div 
        className="flex items-center gap-4 p-4 border-b sticky top-16 z-20"
        style={{ 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border 
        }}
      >
        <Button
          onClick={analysisViewModel.createMapPanel}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          NEW MAP
        </Button>

        <Button variant="outline" className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          MY MAPS
        </Button>

        <Button
          onClick={analysisViewModel.createGraphPanel}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          NEW GRAPH
        </Button>

        <Button variant="outline" className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          MY GRAPHS
        </Button>

        <div className="flex-1"></div>

        <Button
          onClick={analysisViewModel.saveWorkspace}
          variant="outline"
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save as...
        </Button>
      </div>

      {/* Workspace Body with Grid Layout */}
      <div 
        className="flex-1 p-4 overflow-hidden" 
        style={{ 
          backgroundColor: theme.colors.background,
          height: 'calc(100vh - 140px)' // Account for tab bar and toolbar height
        }}
      >
        {activeWorkspace && (
          <div className="h-full">
            {(activeWorkspace.mapPanels.length === 0 && activeWorkspace.graphPanels.length === 0) ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div 
                    className="text-6xl mb-4"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    📊
                  </div>
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {activeWorkspace.name}
                  </h3>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    Click &quot;NEW MAP&quot; or &quot;NEW GRAPH&quot; to start creating your analysis workspace
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <ResponsiveGridLayout
                  className="layout"
                  layouts={{
                    lg: [
                      ...activeWorkspace.mapPanels.map(panel => ({
                        i: panel.id,
                        x: panel.x,
                        y: panel.y,
                        w: panel.w,
                        h: panel.h,
                        minW: 4,
                        minH: 6,
                        static: false
                      })),
                      ...activeWorkspace.graphPanels.map(panel => ({
                        i: panel.id,
                        x: panel.x,
                        y: panel.y,
                        w: panel.w,
                        h: panel.h,
                        minW: 4,
                        minH: 6,
                        static: false
                      }))
                    ]
                  }}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                  rowHeight={75}
                  onLayoutChange={(layout) => {
                    // Update panel positions in ViewModel
                    layout.forEach(item => {
                      const mapPanel = activeWorkspace.mapPanels.find(p => p.id === item.i);
                      const graphPanel = activeWorkspace.graphPanels.find(p => p.id === item.i);
                      
                      if (mapPanel) {
                        analysisViewModel.updatePanelLayout(item.i, {
                          x: item.x,
                          y: item.y,
                          w: item.w,
                          h: item.h
                        }, 'map');
                      } else if (graphPanel) {
                        analysisViewModel.updatePanelLayout(item.i, {
                          x: item.x,
                          y: item.y,
                          w: item.w,
                          h: item.h
                        }, 'graph');
                      }
                    });
                  }}
                  isDraggable={true}
                  isResizable={false}
                  isBounded={false}
                  margin={[10, 10]}
                  containerPadding={[10, 10]}
                  useCSSTransforms={true}
                  transformScale={1}
                  preventCollision={false}
                  autoSize={true}
                >
                  {/* Render Map Panels */}
                  {activeWorkspace.mapPanels.map(panel => (
                    <div key={panel.id}>
                      <MapPanel
                        panel={panel}
                        onRemove={() => analysisViewModel.removePanel(panel.id, 'map')}
                      />
                    </div>
                  ))}
                  
                  {/* Render Graph Panels */}
                  {activeWorkspace.graphPanels.map(panel => (
                    <div key={panel.id}>
                      <GraphPanel
                        panel={panel}
                        onRemove={() => analysisViewModel.removePanel(panel.id, 'graph')}
                      />
                    </div>
                  ))}
                </ResponsiveGridLayout>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;