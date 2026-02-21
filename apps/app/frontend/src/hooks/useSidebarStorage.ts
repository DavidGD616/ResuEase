import { useState, useEffect } from 'react';
import { SIDEBAR_ITEMS } from '../data/sidebarItems';
import {
  User, Phone, FileDown, Briefcase, GraduationCap, Award,
  MessageSquare, Globe, Link, Gamepad2, Code, FolderKanban, Cpu,
} from 'lucide-react';
import type { SidebarItem } from '../types/resume';
import type { LucideIcon } from 'lucide-react';

// Legacy key used before user-scoped storage was introduced.
const LEGACY_SIDEBAR_KEY = 'resumeBuilder_sidebarItems';

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

export const useSidebarStorage = (userId: string) => {
  const storageKey = userId ? `resumeBuilder_sidebarItems_${userId}` : null;

  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  // Load sidebar items from localStorage on mount.
  // Tries the user-scoped key first; if absent, migrates any data from the
  // legacy unscoped key and removes it.
  useEffect(() => {
    if (!storageKey) {
      setSidebarItems(SIDEBAR_ITEMS);
      return;
    }

    const loadSidebarItems = () => {
      try {
        // 1. Try user-scoped key
        const storedItems = localStorage.getItem(storageKey);
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

        // 2. Migrate from legacy unscoped key (one-time, on first login after this change)
        const legacyItems = localStorage.getItem(LEGACY_SIDEBAR_KEY);
        if (legacyItems) {
          const parsedLegacy: SerializedSidebarItem[] = JSON.parse(legacyItems);
          const isValidStructure = parsedLegacy.every(
            (item) => item.id && item.label && typeof item.order === 'number'
          );
          if (isValidStructure) {
            const items = deserializeItems(parsedLegacy);
            setSidebarItems(items);
            localStorage.setItem(storageKey, JSON.stringify(serializeItems(items)));
            localStorage.removeItem(LEGACY_SIDEBAR_KEY);
            return;
          }
        }
      } catch (error) {
        console.warn('Error loading sidebar items from localStorage:', error);
      }

      setSidebarItems(SIDEBAR_ITEMS);
    };

    loadSidebarItems();
  }, [storageKey]);

  const updateSidebarItems = (newItems: SidebarItem[]) => {
    try {
      setSidebarItems(newItems);
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(serializeItems(newItems)));
      }
    } catch (error) {
      console.warn('Error saving sidebar items to localStorage:', error);
      setSidebarItems(newItems);
    }
  };

  const resetSidebar = () => {
    try {
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
      setSidebarItems(SIDEBAR_ITEMS);
    } catch (error) {
      console.warn('Error resetting sidebar:', error);
      setSidebarItems(SIDEBAR_ITEMS);
    }
  };

  return { sidebarItems, updateSidebarItems, resetSidebar };
};
