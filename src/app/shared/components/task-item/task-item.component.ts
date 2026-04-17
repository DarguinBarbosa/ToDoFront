import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { Category } from '../../../core/models/category.model';
import { GlassComponent } from '../glass/glass.component';
import { IconComponent } from '../../icons/icon.component';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GlassComponent, IconComponent],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Input() cat: Category | null = null;
  @Output() toggle = new EventEmitter<void>();
  @Output() open = new EventEmitter<void>();

  protected theme = inject(ThemeService);

  handleToggle(ev: Event): void {
    ev.stopPropagation();
    this.toggle.emit();
  }
}
