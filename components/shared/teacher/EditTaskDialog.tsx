// components/teacher/EditTaskDialog.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

type TaskType = "COLORING" | "PUZZLE" | "CHOOSE_ONE" | "DRAG_AND_DROP";

type Task = {
  id: string;
  title: string;
  type: TaskType;
  data: any;
};

type Props = {
  task: Task;
  children: React.ReactNode;
};

export default function EditTaskDialog({ task, children }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  // Для CHOOSE_ONE
  const [question, setQuestion] = useState(task.data?.question || "");
  const [options, setOptions] = useState<string[]>(
    task.type === "CHOOSE_ONE" ? task.data?.options || ["", "", "", ""] : []
  );
  const [correctIndex, setCorrectIndex] = useState<string>(
    task.type === "CHOOSE_ONE" ? String(task.data?.correctIndex ?? 0) : "0"
  );

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Введите название задания");
      return;
    }

    setLoading(true);

    const updatedData: any = {};

    if (task.type === "CHOOSE_ONE") {
      if (!question.trim() || options.some((o) => !o.trim())) {
        toast.error("Заполните вопрос и все варианты");
        setLoading(false);
        return;
      }
      updatedData.question = question;
      updatedData.options = options;
      updatedData.correctIndex = Number(correctIndex);
    }
    // Для COLORING, PUZZLE, DRAG_AND_DROP — пока просто сохраняем title
    // (в будущем сюда можно добавить загрузку картинок)

    const res = await fetch(`/api/teacher/task/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        data: updatedData,
      }),
    });

    if (res.ok) {
      toast.success("Задание обновлено!");
      setOpen(false);
      window.location.reload(); // или используй revalidatePath
    } else {
      toast.error("Ошибка сохранения");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center flex items-center justify-center gap-3">
            <Pencil className="w-8 h-8" />
            Редактировать задание
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* Название */}
          <div>
            <Label className="text-lg">Название задания</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl mt-2"
              placeholder="Раскрась котика..."
            />
          </div>

          {/* Специфичные поля по типу задания */}
          {task.type === "CHOOSE_ONE" && (
            <div className="space-y-6">
              <div>
                <Label className="text-lg">Вопрос</Label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="text-xl mt-2"
                  placeholder="Какое это животное?"
                />
              </div>

              <div>
                <Label className="text-lg">Варианты ответа</Label>
                <RadioGroup
                  value={correctIndex}
                  onValueChange={setCorrectIndex}
                >
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3 mt-4">
                      <RadioGroupItem value={i.toString()} />
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...options];
                          newOpts[i] = e.target.value;
                          setOptions(newOpts);
                        }}
                        placeholder={`Вариант ${i + 1}`}
                        className={`text-lg ${
                          correctIndex === i.toString()
                            ? "border-green-500 border-2"
                            : ""
                        }`}
                      />
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-sm text-gray-500 mt-2">
                  Правильный ответ выделен зелёной рамкой
                </p>
              </div>
            </div>
          )}

          {(task.type === "COLORING" ||
            task.type === "PUZZLE" ||
            task.type === "DRAG_AND_DROP") && (
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="text-6xl mb-4">
                {task.type === "COLORING" && "Paintbrush"}
                {task.type === "PUZZLE" && "Puzzle"}
                {task.type === "DRAG_AND_DROP" && "Hand"}
              </div>
              <p className="text-xl font-medium text-gray-700">
                {task.type === "COLORING" && "Раскраска"}
                {task.type === "PUZZLE" && "Пазл"}
                {task.type === "DRAG_AND_DROP" && "Перетаскивание"}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Редактирование картинки будет в следующей версии
              </p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
