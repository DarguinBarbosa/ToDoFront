import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { TaskStore } from '../../core/services/task.store';
import { ThemeService } from '../../core/services/theme.service';
import { FeatureFlagService } from '../../core/services/feature-flag.service';
import { CATEGORY_PALETTE } from '../../core/constants/defaults';
import { GlassComponent } from '../../shared/components/glass/glass.component';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, IonContent, GlassComponent, IconComponent],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {
  protected store = inject(TaskStore);
  protected theme = inject(ThemeService);
  protected flags = inject(FeatureFlagService);
  private router = inject(Router);

  protected palette = CATEGORY_PALETTE;
  protected editingId = signal<string | null>(null);
  protected name = signal('');
  protected icon = signal('✨');
  protected color = signal(CATEGORY_PALETTE[0]);

  protected canSave = computed(() => this.name().trim().length > 0);

  edit(id: string) {
    const c = this.store.categories().find(x => x.id === id);
    if (!c) return;
    this.editingId.set(id);
    this.name.set(c.name);
    this.icon.set(c.icon);
    this.color.set(c.color);
  }

  startNew() {
    this.editingId.set(null);
    this.name.set('');
    this.icon.set('✨');
    this.color.set(this.palette[0]);
  }

  save() {
    const n = this.name().trim();
    if (!n) return;
    const id = this.editingId();
    if (id) {
      this.store.updateCategory(id, { name: n, icon: this.icon(), color: this.color() });
    } else {
      this.store.addCategory({ name: n, icon: this.icon(), color: this.color() });
    }
    this.startNew();
  }

  remove(id: string) {
    this.store.deleteCategory(id);
    if (this.editingId() === id) this.startNew();
  }

  back() { this.router.navigate(['/home']); }
}
