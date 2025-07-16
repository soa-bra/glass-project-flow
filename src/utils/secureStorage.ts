import { z } from 'zod';

// Simple encryption for client-side storage (not production-grade)
// In production, consider using Web Crypto API or a proper encryption library
class SecureStorage {
  private static readonly PREFIX = 'supra_secure_';
  private static readonly ENCRYPTION_KEY = 'supra-app-key-2024'; // In production, derive from user session

  private static encrypt(data: string): string {
    // Simple XOR cipher - replace with proper encryption in production
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const keyChar = this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
      const dataChar = data.charCodeAt(i);
      encrypted += String.fromCharCode(dataChar ^ keyChar);
    }
    return btoa(encrypted);
  }

  private static decrypt(encryptedData: string): string {
    try {
      const data = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < data.length; i++) {
        const keyChar = this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
        const dataChar = data.charCodeAt(i);
        decrypted += String.fromCharCode(dataChar ^ keyChar);
      }
      return decrypted;
    } catch {
      throw new Error('Failed to decrypt data');
    }
  }

  static setItem(key: string, value: any, expirationHours = 24): void {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        expiresAt: Date.now() + (expirationHours * 60 * 60 * 1000),
        classification: this.classifyData(value)
      };
      
      const serialized = JSON.stringify(data);
      const encrypted = this.encrypt(serialized);
      localStorage.setItem(this.PREFIX + key, encrypted);
    } catch (error) {
      console.error('SecureStorage: Failed to store data', error);
      throw error;
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(this.PREFIX + key);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      const data = JSON.parse(decrypted);

      // Check if data has expired
      if (Date.now() > data.expiresAt) {
        this.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('SecureStorage: Failed to retrieve data', error);
      this.removeItem(key); // Remove corrupted data
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  private static classifyData(value: any): 'public' | 'internal' | 'confidential' {
    const sensitive = ['password', 'token', 'key', 'secret', 'api', 'auth'];
    const dataString = JSON.stringify(value).toLowerCase();
    
    if (sensitive.some(keyword => dataString.includes(keyword))) {
      return 'confidential';
    }
    
    if (dataString.includes('email') || dataString.includes('phone')) {
      return 'internal';
    }
    
    return 'public';
  }

  static getStorageInfo(): { totalItems: number; classifications: Record<string, number> } {
    const keys = Object.keys(localStorage);
    const secureKeys = keys.filter(key => key.startsWith(this.PREFIX));
    const classifications: Record<string, number> = { public: 0, internal: 0, confidential: 0 };
    
    secureKeys.forEach(key => {
      try {
        const encrypted = localStorage.getItem(key);
        if (encrypted) {
          const decrypted = this.decrypt(encrypted);
          const data = JSON.parse(decrypted);
          classifications[data.classification] = (classifications[data.classification] || 0) + 1;
        }
      } catch {
        // Skip corrupted entries
      }
    });

    return {
      totalItems: secureKeys.length,
      classifications
    };
  }
}

export default SecureStorage;