// Application Info
export const APP_NAME = 'Hyper Family ICT';
export const APP_VERSION = '1.0.0';
export const APP_AUTHOR = 'Ali Ajeli Lahiji';
export const APP_EMAIL = 'lahiji.ali@hyperfamili.com';

// Default Settings
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_THEME = 'dark';
export const TEAMVIEWER_PASSWORD = 'FMR@ICT';

// Device Types
export const DEVICE_TYPES = [
  { id: 'router', name: 'Router', icon: 'Router' },
  { id: 'kyan', name: 'Kyan', icon: 'Server' },
  { id: 'esxi', name: 'ESXi', icon: 'Server' },
  { id: 'ilo', name: 'iLO', icon: 'Server' },
  { id: 'switch', name: 'Switch', icon: 'Network' },
  { id: 'nvr', name: 'NVR', icon: 'Video' },
  { id: 'client', name: 'Client', icon: 'Monitor' },
  { id: 'checkout', name: 'Checkout', icon: 'ShoppingCart' },
];

// Equipment Types
export const EQUIPMENT_TYPES = [
  { id: 'checkout', name: 'Checkouts', icon: 'ShoppingCart' },
  { id: 'client', name: 'Clients', icon: 'Monitor' },
  { id: 'scale', name: 'Scales', icon: 'Scale' },
  { id: 'switch', name: 'Switches', icon: 'Network' },
  { id: 'accesspoint', name: 'Access Points', icon: 'Wifi' },
  { id: 'pda', name: 'PDAs', icon: 'Smartphone' },
  { id: 'printer', name: 'Printers', icon: 'Printer' },
  { id: 'nvr', name: 'NVRs', icon: 'Video' },
];

// Monitoring Interval (ms)
export const PING_INTERVAL = 5000;
export const PING_TIMEOUT = 2000;

// File Operations
export const SUPPORTED_OPERATIONS = ['copy', 'delete', 'rename', 'replace'];

// Translations
export const TRANSLATIONS = {
  en: {
    // Common
    app_name: 'Hyper Family ICT',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    confirm: 'Confirm',
    search: 'Search',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    remember_me: 'Remember me',
    
    // Navigation
    dashboard: 'Dashboard',
    monitoring: 'Monitoring',
    systems: 'Systems',
    destinations: 'Destinations',
    equipments: 'Equipments',
    settings: 'Settings',
    about: 'About',
    
    // Actions
    add_system: 'Add System',
    add_destination: 'Add Destination',
    start_monitoring: 'Start Monitoring',
    stop_monitoring: 'Stop Monitoring',
    send_message: 'Send Message',
    start_service: 'Start Service',
    stop_service: 'Stop Service',
    copy: 'Copy',
    replace: 'Replace',
    rename: 'Rename',
    
    // Status
    online: 'Online',
    offline: 'Offline',
    connecting: 'Connecting',
    
    // Device Types
    router: 'Router',
    server: 'Server',
    switch: 'Switch',
    nvr: 'NVR',
    client: 'Client',
    checkout: 'Checkout',
    
    // Messages
    confirm_delete: 'Are you sure you want to delete this item?',
    operation_success: 'Operation completed successfully',
    operation_failed: 'Operation failed',
    connection_error: 'Connection error',
  },
  fa: {
    // Common
    app_name: 'هایپر فامیلی ICT',
    save: 'ذخیره',
    cancel: 'انصراف',
    delete: 'حذف',
    edit: 'ویرایش',
    add: 'افزودن',
    close: 'بستن',
    confirm: 'تایید',
    search: 'جستجو',
    loading: 'در حال بارگذاری...',
    success: 'موفق',
    error: 'خطا',
    warning: 'هشدار',
    
    // Auth
    login: 'ورود',
    logout: 'خروج',
    username: 'نام کاربری',
    password: 'رمز عبور',
    remember_me: 'مرا به خاطر بسپار',
    
    // Navigation
    dashboard: 'داشبورد',
    monitoring: 'مانیتورینگ',
    systems: 'سیستم‌ها',
    destinations: 'مقصدها',
    equipments: 'تجهیزات',
    settings: 'تنظیمات',
    about: 'درباره',
    
    // Actions
    add_system: 'افزودن سیستم',
    add_destination: 'افزودن مقصد',
    start_monitoring: 'شروع مانیتورینگ',
    stop_monitoring: 'توقف مانیتورینگ',
    send_message: 'ارسال پیام',
    start_service: 'شروع سرویس',
    stop_service: 'توقف سرویس',
    copy: 'کپی',
    replace: 'جایگزینی',
    rename: 'تغییر نام',
    
    // Status
    online: 'آنلاین',
    offline: 'آفلاین',
    connecting: 'در حال اتصال',
    
    // Device Types
    router: 'روتر',
    server: 'سرور',
    switch: 'سوئیچ',
    nvr: 'NVR',
    client: 'کلاینت',
    checkout: 'صندوق',
    
    // Messages
    confirm_delete: 'آیا از حذف این مورد اطمینان دارید؟',
    operation_success: 'عملیات با موفقیت انجام شد',
    operation_failed: 'عملیات با خطا مواجه شد',
    connection_error: 'خطا در اتصال',
  }
};