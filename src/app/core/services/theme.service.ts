import { Injectable, effect, signal } from '@angular/core';
import { StorageService } from './storage.service';

const KEY = 'glasstodo_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _dark = signal<boolean>(this.initial());
  readonly dark = this._dark.asReadonly();

  constructor(private storage: StorageService) {
    effect(() => {
      const isDark = this._dark();
      this.storage.set(KEY, isDark);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('glass-dark', isDark);
      }
    });
  }

  toggle(): void { this._dark.update(v => !v); }
  set(dark: boolean): void { this._dark.set(dark); }

  private initial(): boolean {
    const stored = this.storage.get<boolean>(KEY);
    if (stored !== null) return stored;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }
}
