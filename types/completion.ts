// types/completion.ts
export type Completion = {
  id: string;
  taskId: string;
  userId: string;
  completed: boolean;
  stars: number;
  attempts: number;
  completedAt: Date | null;
};

// Дефолтный объект — полностью соответствует типу
export const DEFAULT_COMPLETION: Completion = {
  id: "",
  taskId: "",
  userId: "",
  completed: false,
  stars: 0,
  attempts: 0,
  completedAt: null,
};
