import { Injectable, computed, effect, signal } from '@angular/core';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';
import { DEFAULT_CATEGORIES, DEFAULT_TASKS } from '../constants/defaults';
import { StorageService } from './storage.service';

interface PersistedState {
  tasks: Task[];
  categories: Category[];
  nextId: number;
}

const STORAGE_KEY = 'glasstodo_state_v1';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly _tasks = signal<Task[]>([]);
  private readonly _categories = signal<Category[]>([]);
  private _nextId = 100;

  readonly tasks = this._tasks.asReadonly();
  readonly categories = this._categories.asReadonly();

  readonly totalCount = computed(() => this._tasks().length);
  readonly doneCount = computed(() => this._tasks().filter(t => t.done).length);
  readonly todayCount = computed(() => this._tasks().filter(t => t.due === 'Hoy' && !t.done).length);

  constructor(private storage: StorageService) {
    const saved = this.storage.get<PersistedState>(STORAGE_KEY);
    if (saved && Array.isArray(saved.tasks) && Array.isArray(saved.categories)) {
      this._tasks.set(saved.tasks);
      this._categories.set(saved.categories);
      this._nextId = saved.nextId ?? 100;
    } else {
      this._tasks.set(DEFAULT_TASKS);
      this._categories.set(DEFAULT_CATEGORIES);
    }

    effect(() => {
      const snapshot: PersistedState = {
        tasks: this._tasks(),
        categories: this._categories(),
        nextId: this._nextId,
      };
      this.storage.set(STORAGE_KEY, snapshot);
    });
  }

  byCategory(categoryId: string | null) {
    return computed(() =>
      categoryId ? this._tasks().filter(t => t.category === categoryId) : this._tasks()
    );
  }

  taskById(id: number) {
    return computed(() => this._tasks().find(t => t.id === id) ?? null);
  }

  addTask(partial: Omit<Task, 'id' | 'done' | 'createdAt'> & Partial<Pick<Task, 'done'>>): Task {
    const task: Task = {
      id: this._nextId++,
      done: false,
      createdAt: Date.now(),
      ...partial,
    };
    this._tasks.update(list => [task, ...list]);
    return task;
  }

  toggleTask(id: number): void {
    this._tasks.update(list => list.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  deleteTask(id: number): void {
    this._tasks.update(list => list.filter(t => t.id !== id));
  }

  updateTask(id: number, patch: Partial<Task>): void {
    this._tasks.update(list => list.map(t => (t.id === id ? { ...t, ...patch } : t)));
  }

  addCategory(cat: Omit<Category, 'id'>): Category {
    const id = `c${this._nextId++}`;
    const created: Category = { id, ...cat };
    this._categories.update(list => [...list, created]);
    return created;
  }

  updateCategory(id: string, patch: Partial<Omit<Category, 'id'>>): void {
    this._categories.update(list => list.map(c => (c.id === id ? { ...c, ...patch } : c)));
  }

  deleteCategory(id: string): void {
    this._categories.update(list => list.filter(c => c.id !== id));
    this._tasks.update(list => list.map(t => (t.category === id ? { ...t, category: null } : t)));
  }

  reset(): void {
    this._tasks.set(DEFAULT_TASKS);
    this._categories.set(DEFAULT_CATEGORIES);
    this._nextId = 100;
  }
}
