// components/teacher/task-forms/ChooseOneTaskForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function ChooseOneTaskForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState("0");

  const handleSubmit = async () => {
    if (!title.trim() || !question.trim() || options.some((o) => !o.trim())) {
      toast.error("Заполните все поля");
      return;
    }

    const res = await fetch("/api/teacher/create-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        type: "CHOOSE_ONE",
        data: { question, options, correctIndex: Number(correctIndex) },
      }),
    });

    if (res.ok) {
      redirect("/dashboard");
    } else {
      toast.error("Ошибка создания задания");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-lg">Название задания</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Кто это на картинке?"
          className="text-xl mt-2"
        />
      </div>

      <div>
        <Label className="text-lg">Вопрос</Label>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Какое это животное?"
          className="text-xl mt-2"
        />
      </div>

      <div>
        <Label className="text-lg">Варианты ответа</Label>
        <RadioGroup value={correctIndex} onValueChange={setCorrectIndex}>
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-4 mt-4">
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
      </div>

      <div className="flex justify-end gap-4 pt-8">
        <Button variant="outline" size="lg" onClick={onClose}>
          Отмена
        </Button>
        <Button
          size="lg"
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-xl px-12"
        >
          Создать задание
        </Button>
      </div>
    </div>
  );
}
