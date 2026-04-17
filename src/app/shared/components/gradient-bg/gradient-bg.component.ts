import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

export type GradientVariant = 'mint' | 'pastel' | 'peach';

@Component({
  selector: 'app-gradient-bg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="orb orb--one"></div>
    <div class="orb orb--two"></div>
    <ng-content />
  `,
  styleUrls: ['./gradient-bg.component.scss'],
  host: {
    '[class.bg--dark]': 'theme.dark()',
    '[attr.data-variant]': 'variant',
  },
})
export class GradientBgComponent {
  @Input() variant: GradientVariant = 'mint';
  protected theme = inject(ThemeService);
}
