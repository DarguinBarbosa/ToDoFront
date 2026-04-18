import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { TaskStore } from '../../core/services/task.store';
import { ThemeService } from '../../core/services/theme.service';
import { Priority, Due } from '../../core/models/task.model';
import { GlassComponent } from '../../shared/components/glass/glass.component';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-create-task',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, IonContent, GlassComponent, IconComponent],
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
})
export class CreateTaskPage {
  protected store = inject(TaskStore);
  protected theme = inject(ThemeService);
  private router = inject(Router);

  protected title = signal('');
  protected categoryId = signal<string | null>(this.store.categories()[0]?.id ?? null);
  protected priority = signal<Priority>('media');
  protected due = signal<Due>('Hoy');

  protected selectedCat = computed(() =>
    this.store.categories().find(c => c.id === this.categoryId()) ?? null
  );

  protected priorities: Priority[] = ['baja', 'media', 'alta'];
  protected dues: Due[] = ['Hoy', 'Mañ.', 'Sem.'];

  protected canSave = computed(() => this.title().trim().length > 0);

  submit() {
    const t = this.title().trim();
    if (!t) return;
    this.store.addTask({
      title: t,
      category: this.categoryId(),
      priority: this.priority(),
      due: this.due(),
    });
    this.back();
  }

  back() { this.router.navigate(['/home']); }
}
