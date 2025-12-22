/**
 * DraftStorage - Client-side storage utility for non-sensitive UI state
 *
 * ⚠️ SECURITY WARNING: This utility is designed ONLY for non-sensitive data like:
 * - Draft form data
 * - UI preferences
 * - Temporary user settings
 *
 * DO NOT USE FOR:
 * - API keys or tokens
 * - Passwords or credentials
 * - Personally identifiable information (PII)
 * - Any confidential data
 *
 * For sensitive data, use:
 * - Server-side storage with proper encryption
 * - httpOnly cookies
 * - Supabase Edge Functions with secrets
 */
class SecureStorage {
  private static readonly PREFIX = "SoaBra_draft_";

  /**
   * Store non-sensitive data in localStorage with expiration
   * @param key - Storage key
   * @param value - Data to store (must be non-sensitive)
   * @param expirationHours - Hours until data expires (default: 24)
   */
  static setItem(key: string, value: unknown, expirationHours = 24): void {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        expiresAt: Date.now() + expirationHours * 60 * 60 * 1000,
        dataType: this.classifyData(value),
      };

      // Warn if potentially sensitive data is being stored
      if (data.dataType === "potentially_sensitive") {
        console.warn(
          "[SecureStorage] Warning: Storing potentially sensitive data client-side. " +
            "Consider using server-side storage for sensitive information.",
        );
      }

      const serialized = JSON.stringify(data);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (error) {
      console.error("[SecureStorage] Failed to store data:", error);
      throw error;
    }
  }

  /**
   * Retrieve data from localStorage
   * @param key - Storage key
   * @returns Stored value or null if not found/expired
   */
  static getItem<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(this.PREFIX + key);
      if (!stored) return null;

      const data = JSON.parse(stored);

      // Check if data has expired
      if (Date.now() > data.expiresAt) {
        this.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      // Remove corrupted data
      this.removeItem(key);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  static removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  /**
   * Clear all items with our prefix
   */
  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Classify data to detect potentially sensitive information
   * This is a safety check to warn developers
   */
  private static classifyData(value: unknown): "safe" | "potentially_sensitive" {
    const sensitiveKeywords = ["password", "token", "key", "secret", "api", "auth", "credential"];
    const dataString = JSON.stringify(value).toLowerCase();

    if (sensitiveKeywords.some((keyword) => dataString.includes(keyword))) {
      return "potentially_sensitive";
    }

    return "safe";
  }

  /**
   * Get storage statistics
   */
  static getStorageInfo(): { totalItems: number; classifications: Record<string, number> } {
    const keys = Object.keys(localStorage);
    const draftKeys = keys.filter((key) => key.startsWith(this.PREFIX));
    const classifications: Record<string, number> = { safe: 0, potentially_sensitive: 0 };

    draftKeys.forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          const dataType = data.dataType || "safe";
          classifications[dataType] = (classifications[dataType] || 0) + 1;
        }
      } catch {
        // Skip corrupted entries
      }
    });

    return {
      totalItems: draftKeys.length,
      classifications,
    };
  }
}

export default SecureStorage;
