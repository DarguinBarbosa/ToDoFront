import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS, IconName } from './icon-paths';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none"
    [attr.stroke]="color" [attr.stroke-width]="strokeWidth" stroke-linecap="round" stroke-linejoin="round"
    [innerHTML]="svg"></svg>`,
})
export class IconComponent {
  @Input({ required: true }) set name(n: IconName) {
    const def = ICONS[n];
    this.strokeWidth = def.stroke ?? 2;
    this.svg = this.sanitizer.bypassSecurityTrustHtml(def.path);
  }
  @Input() size = 20;
  @Input() color = 'currentColor';

  strokeWidth: number = 2;
  svg: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}
}
