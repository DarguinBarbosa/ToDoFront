import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { TaskStore } from '../../core/services/task.store';
import { ThemeService } from '../../core/services/theme.service';
import { FeatureFlagService } from '../../core/services/feature-flag.service';
import { GlassComponent } from '../../shared/components/glass/glass.component';
import { TaskItemComponent } from '../../shared/components/task-item/task-item.component';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, RouterLink, GlassComponent, TaskItemComponent, IconComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  protected store = inject(TaskStore);
  protected theme = inject(ThemeService);
  protected flags = inject(FeatureFlagService);
  private router = inject(Router);

  protected focusedCat = signal<string | null>(null);

  protected displayed = computed(() => {
    const focus = this.focusedCat();
    const all = this.store.tasks();
    return focus
      ? all.filter(t => t.category === focus)
      : all.filter(t => t.due === 'Hoy' || !t.done).slice(0, 10);
  });
  protected pending = computed(() => this.displayed().filter(t => !t.done));
  protected completed = computed(() => this.displayed().filter(t => t.done));

  protected categoriesView = computed(() => {
    const all = this.store.tasks();
    return this.store.categories().map(c => {
      const catTasks = all.filter(t => t.category === c.id);
      const done = catTasks.filter(t => t.done).length;
      return {
        ...c,
        pending: catTasks.length - done,
        progress: catTasks.length > 0 ? done / catTasks.length : 0,
        active: this.focusedCat() === c.id,
      };
    });
  });

  protected categoryOf(id: string | null) {
    if (!id) return null;
    return this.store.categories().find(c => c.id === id) ?? null;
  }

  protected toggleFocus(id: string) {
    this.focusedCat.update(curr => (curr === id ? null : id));
  }

  protected clearFocus() { this.focusedCat.set(null); }

  protected openTask(id: number) { this.router.navigate(['/task', id]); }
  protected openCreate() { this.router.navigate(['/create']); }
  protected scrollTop() {
    if (typeof window !== 'undefined') {
      document.querySelector('ion-content')?.scrollToTop?.(300);
    }
  }
}
