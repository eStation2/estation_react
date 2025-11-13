'use client';

import React, { useState, useRef } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from '@/components/ui';

// Panel Tool interface
export interface PanelTool {
  type: 'close' | 'minimize' | 'maximize' | 'restore' | 'gear' | 'help' | 'print' | 'refresh' | 'save' | 'search';
  tooltip?: string;
  handler?: () => void;
  hidden?: boolean;
}

// ExtJS Panel DockedItem interface (for toolbars)
export interface DockedItem {
  xtype: 'toolbar';
  dock: 'top' | 'bottom' | 'left' | 'right';
  items: ToolbarItem[];
}

export interface ToolbarItem {
  text?: string;
  iconCls?: string;
  tooltip?: string;
  handler?: () => void;
  type?: 'button' | 'separator' | 'text' | 'spacer';
  disabled?: boolean;
  hidden?: boolean;
}

// Main Panel Props
export interface PanelProps {
  // Basic properties
  title?: string;
  html?: string;
  width?: number | string;
  height?: number | string;
  
  // Panel behavior
  collapsible?: boolean;
  collapsed?: boolean;
  closable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  
  // Layout and styling
  layout?: 'fit' | 'border' | 'hbox' | 'vbox' | 'card' | 'accordion';
  cls?: string;
  bodyCls?: string;
  headerCls?: string;
  
  // Tools and docked items
  tools?: PanelTool[];
  dockedItems?: DockedItem[];
  
  // Events (React style)
  onClose?: () => void;
  onCollapse?: (collapsed: boolean) => void;
  onResize?: (width: number, height: number) => void;
  
  // Content
  children?: React.ReactNode;
  
  // ExtJS-style config
  border?: boolean;
  frame?: boolean;
  constrain?: boolean;
}

const Panel: React.FC<PanelProps> = ({
  title,
  html,
  width = 'auto',
  height = 'auto',
  collapsible = false,
  collapsed = false,
  closable = false,
  layout = 'fit',
  cls = '',
  bodyCls = '',
  headerCls = '',
  tools = [],
  dockedItems = [],
  onClose,
  onCollapse,
  children,
  border = true,
  frame = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Handle collapse/expand
  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };
  
  // Handle close
  const handleClose = () => {
    onClose?.();
  };
  
  // Tool icon mapping
  const getToolIcon = (type: string) => {
    const icons = {
      close: '✕',
      minimize: '−',
      maximize: '□',
      restore: '⧉',
      gear: '⚙',
      help: '?',
      print: '🖨',
      refresh: '↻',
      save: '💾',
      search: '🔍'
    };
    return icons[type as keyof typeof icons] || '●';
  };
  
  // Get layout styles
  const getLayoutStyles = () => {
    const styles: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      display: 'flex',
      flexDirection: 'column'
    };
    
    if (layout === 'fit') {
      styles.overflow = 'hidden';
    }
    
    return styles;
  };
  
  // Get body layout styles
  const getBodyLayoutStyles = () => {
    const styles: React.CSSProperties = {
      flex: 1,
      overflow: 'hidden'
    };
    
    switch (layout) {
      case 'fit':
        styles.display = 'flex';
        styles.flexDirection = 'column';
        break;
      case 'hbox':
        styles.display = 'flex';
        styles.flexDirection = 'row';
        break;
      case 'vbox':
        styles.display = 'flex';
        styles.flexDirection = 'column';
        break;
      case 'border':
        styles.display = 'grid';
        styles.gridTemplate = '"north" auto "center" 1fr "south" auto / 1fr';
        break;
    }
    
    return styles;
  };
  
  // Render toolbar
  const renderToolbar = (docked: DockedItem) => {
    return (
      <div key={`toolbar-${docked.dock}`} className="flex items-center gap-1 p-2 bg-muted/50 border-b">
        {docked.items.map((item, index) => {
          if (item.type === 'separator') {
            return <Separator key={index} orientation="vertical" className="h-5 mx-1" />;
          }
          
          if (item.type === 'spacer') {
            return <div key={index} className="flex-1" />;
          }
          
          if (item.type === 'text') {
            return (
              <span key={index} className="text-sm text-muted-foreground">
                {item.text}
              </span>
            );
          }
          
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={item.handler}
              disabled={item.disabled}
              title={item.tooltip}
              className={item.hidden ? "hidden" : ""}
            >
              {item.iconCls && <span className={`${item.iconCls} mr-1`} />}
              {item.text}
            </Button>
          );
        })}
      </div>
    );
  };
  
  return (
    <Card
      ref={panelRef}
      className={`extjs-panel ${cls} ${!border ? 'border-0' : ''} ${frame ? 'shadow-md' : 'shadow-none'}`}
      style={getLayoutStyles()}
    >
      {/* Header */}
      {(title || collapsible || closable || tools.length > 0) && (
        <CardHeader className={`flex flex-row items-center justify-between py-2 px-3 bg-primary/5 ${headerCls}`}>
          <div className="flex items-center flex-1">
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCollapse}
                className="mr-2 h-6 w-6 p-0"
              >
                <span 
                  className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                >
                  ▼
                </span>
              </Button>
            )}
            
            {title && (
              <CardTitle className="text-sm font-semibold">
                {title}
              </CardTitle>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {tools.map((tool, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={tool.handler}
                title={tool.tooltip}
                className={`h-6 w-6 p-0 ${tool.hidden ? 'hidden' : ''}`}
              >
                {getToolIcon(tool.type)}
              </Button>
            ))}
            
            {closable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                ✕
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      
      {/* Docked Items (Toolbars) - Always show under header */}
      {dockedItems.filter(item => item.dock === 'top').map(renderToolbar)}
      
      {/* Body */}
      {!isCollapsed && (
        <CardContent 
          className={`extjs-panel-body ${bodyCls} p-2`}
          style={getBodyLayoutStyles()}
        >
          {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
          {children}
        </CardContent>
      )}
      
      {/* Bottom Docked Items */}
      {!isCollapsed && dockedItems.filter(item => item.dock === 'bottom').map(renderToolbar)}
    </Card>
  );
};

export default Panel;