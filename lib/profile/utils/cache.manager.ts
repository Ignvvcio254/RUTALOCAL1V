import { CacheEntry } from '../types/api.types';

export class CacheManager {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private defaultTtl: number;

  constructor(maxSize: number = 50, defaultTtl: number = 300000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl; // 5 minutos por defecto
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Verificar si expiró
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    // Evict si alcanzamos el máximo
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTtl,
    });
  }

  has(key: string): boolean {
    const value = this.get(key);
    return value !== null;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  clear(): void {
    this.cache.clear();
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilizationPercentage: (this.cache.size / this.maxSize) * 100,
    };
  }
}

// Instancia global
export const globalCache = new CacheManager();
