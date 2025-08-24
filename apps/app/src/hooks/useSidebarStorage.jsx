import { useState, useEffect } from 'react';
import { SIDEBAR_ITEMS } from '../data/sidebarItems';
import { User, Phone, FileDown, Briefcase, GraduationCap, Award, MessageSquare, Globe, Link, Gamepad2, Code, FolderKanban, Cpu } from 'lucide-react';

const SIDEBAR_STORAGE_KEY = 'resumeBuilder_sidebarItems';

// Map of icon names to icon components
const ICON_MAP = {
  User,
  Phone,
  FileDown,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  Globe,
  Link,
  Gamepad2,
  Code,
  FolderKanban,
  Cpu
};

// Reverse map to get icon name from component
const ICON_REVERSE_MAP = new Map();
Object.entries(ICON_MAP).forEach(([name, component]) => {
  ICON_REVERSE_MAP.set(component, name);
});

// Helper function to serialize items for storage (replace icon components with icon names)
const serializeItems = (items) => {
  return items.map(item => ({
    ...item,
    iconName: ICON_REVERSE_MAP.get(item.icon) || 'Code' // use reverse map to find icon name
  }));
};

// Helper function to deserialize items from storage (replace icon names with icon components)
const deserializeItems = (items) => {
  return items.map(item => ({
    ...item,
    icon: ICON_MAP[item.iconName] || Code 
  }));
};

export const useSidebarStorage = () => {
  const [sidebarItems, setSidebarItems] = useState([]);

  // Load sidebar items from localStorage on component mount
  useEffect(() => {
    const loadSidebarItems = () => {
      try {
        const storedItems = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          
          // Validate that stored items have the required structure
          const isValidStructure = parsedItems.every(item => 
            item.id && item.label && typeof item.order === 'number'
          );
          
          if (isValidStructure) {
            // Deserialize the items to restore icon components
            setSidebarItems(deserializeItems(parsedItems));
            return;
          }
        }
      } catch (error) {
        console.warn('Error loading sidebar items from localStorage:', error);
      }
      
      // Fall back to default items if no valid stored data
      setSidebarItems(SIDEBAR_ITEMS);
    };

    loadSidebarItems();
  }, []);

  // Save sidebar items to localStorage whenever they change
  const updateSidebarItems = (newItems) => {
    try {
      setSidebarItems(newItems);
      // Serialize the items before saving to localStorage
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(serializeItems(newItems)));
    } catch (error) {
      console.warn('Error saving sidebar items to localStorage:', error);
      // Still update state even if localStorage fails
      setSidebarItems(newItems);
    }
  };

  // Reset sidebar to default
  const resetSidebar = () => {
    try {
      localStorage.removeItem(SIDEBAR_STORAGE_KEY);
      setSidebarItems(SIDEBAR_ITEMS);
    } catch (error) {
      console.warn('Error resetting sidebar:', error);
      setSidebarItems(SIDEBAR_ITEMS);
    }
  };

  return {
    sidebarItems,
    updateSidebarItems,
    resetSidebar
  };
};