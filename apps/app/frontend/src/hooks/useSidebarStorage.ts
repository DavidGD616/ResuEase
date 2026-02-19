import { useState, useEffect } from 'react';
import { SIDEBAR_ITEMS } from '../data/sidebarItems';
import {
  User, Phone, FileDown, Briefcase, GraduationCap, Award,
  MessageSquare, Globe, Link, Gamepad2, Code, FolderKanban, Cpu,
} from 'lucide-react';
import type { SidebarItem } from '../types/resume';
import type { LucideIcon } from 'lucide-react';

const SIDEBAR_STORAGE_KEY = 'resumeBuilder_sidebarItems';

// Map of icon names to icon components
const ICON_MAP: Record<string, LucideIcon> = {
  User, Phone, FileDown, Briefcase, GraduationCap, Award,
  MessageSquare, Globe, Link, Gamepad2, Code, FolderKanban, Cpu,
};

// Reverse map to get icon name from component
const ICON_REVERSE_MAP = new Map<LucideIcon, string>();
Object.entries(ICON_MAP).forEach(([name, component]) => {
  ICON_REVERSE_MAP.set(component, name);
});

interface SerializedSidebarItem extends Omit<SidebarItem, 'icon'> {
  iconName: string;
}

const serializeItems = (items: SidebarItem[]): SerializedSidebarItem[] => {
  return items.map((item) => ({
    ...item,
    iconName: ICON_REVERSE_MAP.get(item.icon) ?? 'Code',
  }));
};

const deserializeItems = (items: SerializedSidebarItem[]): SidebarItem[] => {
  return items.map((item) => ({
    ...item,
    icon: ICON_MAP[item.iconName] ?? Code,
  }));
};

export const useSidebarStorage = () => {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  // Load sidebar items from localStorage on component mount
  useEffect(() => {
    const loadSidebarItems = () => {
      try {
        const storedItems = localStorage.getItem(SIDEBAR_STORAGE_KEY);

        if (storedItems) {
          const parsedItems: SerializedSidebarItem[] = JSON.parse(storedItems);

          const isValidStructure = parsedItems.every(
            (item) => item.id && item.label && typeof item.order === 'number'
          );

          if (isValidStructure) {
            setSidebarItems(deserializeItems(parsedItems));
            return;
          }
        }
      } catch (error) {
        console.warn('Error loading sidebar items from localStorage:', error);
      }

      setSidebarItems(SIDEBAR_ITEMS);
    };

    loadSidebarItems();
  }, []);

  const updateSidebarItems = (newItems: SidebarItem[]) => {
    try {
      setSidebarItems(newItems);
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(serializeItems(newItems)));
    } catch (error) {
      console.warn('Error saving sidebar items to localStorage:', error);
      setSidebarItems(newItems);
    }
  };

  const resetSidebar = () => {
    try {
      localStorage.removeItem(SIDEBAR_STORAGE_KEY);
      setSidebarItems(SIDEBAR_ITEMS);
    } catch (error) {
      console.warn('Error resetting sidebar:', error);
      setSidebarItems(SIDEBAR_ITEMS);
    }
  };

  return { sidebarItems, updateSidebarItems, resetSidebar };
};
