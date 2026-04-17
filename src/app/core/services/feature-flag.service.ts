import { Injectable, inject, signal } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';

export interface FeatureFlags {
  show_stats_row: boolean;
  allow_category_create: boolean;
}

const DEFAULTS: FeatureFlags = {
  show_stats_row: true,
  allow_category_create: true,
};

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private readonly rc = inject(RemoteConfig, { optional: true });
  private readonly _flags = signal<FeatureFlags>(DEFAULTS);
  readonly flags = this._flags.asReadonly();

  async init(): Promise<void> {
    if (!this.rc) return;
    try {
      this.rc.settings.minimumFetchIntervalMillis = 10_000;
      this.rc.defaultConfig = { ...DEFAULTS } as unknown as Record<string, string | number | boolean>;
      await fetchAndActivate(this.rc);
      this._flags.set({
        show_stats_row: getValue(this.rc, 'show_stats_row').asBoolean(),
        allow_category_create: getValue(this.rc, 'allow_category_create').asBoolean(),
      });
    } catch {
      /* offline / misconfigured — keep defaults so UI still works */
    }
  }
}
