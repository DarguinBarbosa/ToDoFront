import { ChangeDetectionStrategy, Component, HostBinding, Input, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-glass',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrls: ['./glass.component.scss'],
  host: {
    '[class.glass--dark]': 'theme.dark()',
    '[class.glass--shine]': 'shine',
    '[class.glass--no-border]': '!border',
    '[style.border-radius.px]': 'radius',
    '[style.backdrop-filter]': '"blur(" + blur + "px) saturate(180%)"',
    '[style.-webkit-backdrop-filter]': '"blur(" + blur + "px) saturate(180%)"',
  },
})
export class GlassComponent {
  @Input() radius = 24;
  @Input() blur = 22;
  @Input() border = true;
  @Input() shine = true;

  protected theme = inject(ThemeService);
}
