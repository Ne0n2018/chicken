// types/task.ts
export type BaseTask = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  isActive: boolean;
  teacherId: string | null;
  teacher?: { name: string | null } | null;
};

export type ChooseOneTask = BaseTask & {
  type: "CHOOSE_ONE";
  data: {
    question: string;
    options: string[];
    correctIndex: number;
    imageUrl?: string;
  };
};

export type DrawTask = BaseTask & {
  type: "DRAW";
  data: {
    prompt: string;
    imageUrl?: string;
  };
};

// Можно добавить MATCH, WRITE_TEXT и т.д.
export type Task = ChooseOneTask | DrawTask /* | ... */;
