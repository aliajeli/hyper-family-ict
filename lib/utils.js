import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Generate unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Delay utility
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate IP Address
 */
export function isValidIP(ip) {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

/**
 * Truncate text
 */
export function truncate(text, length = 50) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Get status color class
 */
export function getStatusColor(status) {
  switch (status) {
    case 'online':
      return 'text-success';
    case 'offline':
      return 'text-error';
    case 'warning':
      return 'text-warning';
    default:
      return 'text-text-muted';
  }
}

/**
 * Get status background color class
 */
export function getStatusBgColor(status) {
  switch (status) {
    case 'online':
      return 'bg-success/20';
    case 'offline':
      return 'bg-error/20';
    case 'warning':
      return 'bg-warning/20';
    default:
      return 'bg-text-muted/20';
  }
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Device type icons mapping
 */
export const deviceTypeIcons = {
  Router: 'Router',
  Kyan: 'Server',
  ESXi: 'Server',
  iLO: 'Server',
  Switch: 'Network',
  NVR: 'Video',
  Client: 'Monitor',
  Checkout: 'ShoppingCart',
};

/**
 * Get device type icon
 */
export function getDeviceIcon(type) {
  return deviceTypeIcons[type] || 'HelpCircle';
}