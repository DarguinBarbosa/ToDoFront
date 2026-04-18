import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { GradientBgComponent } from './shared/components/gradient-bg/gradient-bg.component';
import { FeatureFlagService } from './core/services/feature-flag.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonApp, IonRouterOutlet, GradientBgComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected theme = inject(ThemeService);

  constructor(private flags: FeatureFlagService) {
    void this.flags.init();
  }
}
