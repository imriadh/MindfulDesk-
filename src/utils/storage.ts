// Storage utility for persisting settings
const STORAGE_KEYS = {
  BLOCKER_SETTINGS: 'mindfuldesk_blocker_settings',
  REMINDER_SETTINGS: 'mindfuldesk_reminder_settings',
  FOCUS_SETTINGS: 'mindfuldesk_focus_settings',
  THEME: 'mindfuldesk_theme',
} as const;

export class StorageManager {
  static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  }

  static load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  static clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.remove(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export { STORAGE_KEYS };
