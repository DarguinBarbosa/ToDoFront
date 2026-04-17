import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly available = typeof window !== 'undefined' && !!window.localStorage;

  get<T>(key: string): T | null {
    if (!this.available) return null;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.available) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or serialization — ignore */
    }
  }

  remove(key: string): void {
    if (!this.available) return;
    try { window.localStorage.removeItem(key); } catch { /* noop */ }
  }
}
