import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';

import { TaskStore } from '../../core/services/task.store';
import { ThemeService } from '../../core/services/theme.service';
import { GlassComponent } from '../../shared/components/glass/glass.component';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, IonContent, GlassComponent, IconComponent],
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage {
  protected store = inject(TaskStore);
  protected theme = inject(ThemeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private idSig = toSignal(this.route.paramMap, { requireSync: true });
  protected task = computed(() => {
    const id = Number(this.idSig().get('id'));
    return this.store.tasks().find(t => t.id === id) ?? null;
  });
  protected cat = computed(() => {
    const t = this.task();
    if (!t?.category) return null;
    return this.store.categories().find(c => c.id === t.category) ?? null;
  });

  protected editing = signal(false);
  protected draft = signal('');

  startEdit() {
    const t = this.task();
    if (!t) return;
    this.draft.set(t.title);
    this.editing.set(true);
  }

  saveEdit() {
    const t = this.task();
    const title = this.draft().trim();
    if (!t || !title) { this.editing.set(false); return; }
    this.store.updateTask(t.id, { title });
    this.editing.set(false);
  }

  cancelEdit() { this.editing.set(false); }

  back() { this.router.navigate(['/home']); }

  remove() {
    const t = this.task();
    if (!t) return;
    this.store.deleteTask(t.id);
    this.back();
  }

  toggle() {
    const t = this.task();
    if (t) this.store.toggleTask(t.id);
  }
}
