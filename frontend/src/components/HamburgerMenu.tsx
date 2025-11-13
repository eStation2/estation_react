'use client';

import React from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';

interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface HamburgerMenuProps {
  menuItems: MenuItem[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ menuItems }) => {
  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-full text-white hover:bg-transparent"
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" sideOffset={12}>
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => handleMenuItemClick(item)}
            className="flex items-center px-4 py-3 cursor-pointer"
          >
            <span className="mr-3 w-5 h-5 flex items-center justify-center">
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HamburgerMenu;