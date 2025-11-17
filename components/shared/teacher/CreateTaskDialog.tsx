// components/teacher/CreateTaskDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ChooseOneTaskForm from "./task-form/ChooseOneTaskForm";
// import ColoringTaskForm from "./task-forms/ColoringTaskForm";
// import PuzzleTaskForm from "./task-forms/PuzzleTaskForm";

// import DragAndDropTaskForm from "./task-forms/DragAndDropTaskForm";

type TaskType = "COLORING" | "PUZZLE" | "CHOOSE_ONE" | "DRAG_AND_DROP";

const taskTemplates = [
  {
    value: "CHOOSE_ONE",
    label: "Выбери один",
    color: "bg-green-500",
  },
];

export default function CreateTaskDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TaskType | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-6">
            {selectedType ? "Создание задания" : "Выберите тип задания"}
          </DialogTitle>
        </DialogHeader>

        {!selectedType ? (
          // ШАГ 1: Выбор типа
          <div className="space-y-8">
            <RadioGroup onValueChange={(v) => setSelectedType(v as TaskType)}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {taskTemplates.map((t) => (
                  <label key={t.value} className="cursor-pointer group flex ">
                    <RadioGroupItem value={t.value} className="sr-only" />
                    <div
                      className={`p-10 rounded-3xl text-white text-center transition-all group-hover:scale-105 ${t.color} shadow-xl`}
                    >
                      <p className="text-xl font-bold">{t.label}</p>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button
                size="lg"
                disabled={!selectedType}
                onClick={() => {}}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Далее →
              </Button>
            </div>
          </div>
        ) : (
          // ШАГ 2: Форма конкретного задания
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType(null)}
              className="mb-6"
            >
              ← Назад к выбору типа
            </Button>

            {selectedType === "CHOOSE_ONE" && (
              <ChooseOneTaskForm onClose={() => setOpen(false)} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
