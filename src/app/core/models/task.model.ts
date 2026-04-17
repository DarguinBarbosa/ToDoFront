export type Priority = 'baja' | 'media' | 'alta';
export type Due = 'Hoy' | 'Mañ.' | 'Sem.' | string;

export interface Task {
  id: number;
  title: string;
  category: string | null;
  priority: Priority;
  due: Due;
  done: boolean;
  note?: string;
  createdAt: number;
}
