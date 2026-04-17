import { Category } from '../models/category.model';
import { Task } from '../models/task.model';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personal', color: 'oklch(0.75 0.15 340)', icon: '💫' },
  { id: 'trabajo',  name: 'Trabajo',  color: 'oklch(0.72 0.14 250)', icon: '💼' },
  { id: 'estudio',  name: 'Estudio',  color: 'oklch(0.75 0.13 170)', icon: '📚' },
  { id: 'casa',     name: 'Casa',     color: 'oklch(0.78 0.13 60)',  icon: '🏡' },
];

export const DEFAULT_TASKS: Task[] = [
  { id: 1, title: 'Llamar al doctor',           category: 'personal', priority: 'alta',  done: false, due: 'Hoy',    note: 'Agendar revisión anual', createdAt: Date.now() },
  { id: 2, title: 'Revisar PR del equipo',      category: 'trabajo',  priority: 'media', done: false, due: 'Hoy',    createdAt: Date.now() },
  { id: 3, title: 'Leer capítulo 4 de álgebra', category: 'estudio',  priority: 'media', done: true,  due: 'Ayer',   createdAt: Date.now() },
  { id: 4, title: 'Regar las plantas',          category: 'casa',     priority: 'baja',  done: false, due: 'Mañana', createdAt: Date.now() },
  { id: 5, title: 'Preparar presentación',      category: 'trabajo',  priority: 'alta',  done: false, due: 'Mañana', createdAt: Date.now() },
  { id: 6, title: 'Comprar leche y pan',        category: 'casa',     priority: 'baja',  done: false, due: 'Hoy',    createdAt: Date.now() },
  { id: 7, title: 'Meditar 10 minutos',         category: 'personal', priority: 'baja',  done: true,  due: 'Hoy',    createdAt: Date.now() },
  { id: 8, title: 'Responder email de Ana',     category: 'trabajo',  priority: 'media', done: false, due: 'Hoy',    createdAt: Date.now() },
];

export const CATEGORY_PALETTE: string[] = [
  'oklch(0.75 0.15 340)',
  'oklch(0.72 0.14 250)',
  'oklch(0.75 0.13 170)',
  'oklch(0.78 0.13 60)',
  'oklch(0.70 0.18 30)',
  'oklch(0.68 0.16 300)',
];
