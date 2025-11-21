// components/child/tasks/ChooseOneTask.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import confetti from "canvas-confetti";
import { ChooseOneTask } from "@/types/task";

type Props = {
  task: ChooseOneTask; // ← Теперь 100% правильный тип!
};

export default function ChooseOneTaskClient({ task }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = async (index: number) => {
    if (answered) return;

    setSelected(index);
    setAnswered(true);
    const correct = index === task.data.correctIndex;
    setIsCorrect(correct);

    // Конфетти при правильном ответе
    if (correct) {
      confetti({
        particleCount: 300,
        spread: 100,
        origin: { y: 0.6 },
      });
    }

    // Сохраняем результат
    await fetch("/api/child/complete-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: task.id,
        correct,
        stars: correct ? 3 : 1,
      }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center p-8">
      <Card className="max-w-4xl w-full bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-12">
        <h1 className="text-6xl font-bold text-center text-purple-800 mb-12 drop-shadow-lg">
          {task.title}
        </h1>

        <div className="text-center mb-16">
          <p className="text-5xl font-medium text-gray-800">
            {task.data.question}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {task.data.options.map((option, i) => {
            const isSelected = selected === i;
            const showCorrect = answered && i === task.data.correctIndex;
            const showWrong = answered && isSelected && !isCorrect;

            return (
              <Button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={`h-40 text-4xl font-bold transition-all transform hover:scale-105 ${
                  showCorrect
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-2xl"
                    : showWrong
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : isSelected
                    ? "bg-purple-600 text-white"
                    : "bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500"
                }`}
              >
                {option}
                {showCorrect && " Correct"}
                {showWrong && " Cross"}
              </Button>
            );
          })}
        </div>

        {answered && (
          <div className="text-center mt-16">
            <p
              className={`text-6xl font-bold mb-8 ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect ? "Правильно!" : "Не совсем..."}
            </p>
            <p className="text-4xl mb-8">
              {isCorrect
                ? "Ты получил 3 звёздочки!"
                : "Попробуй ещё раз в следующий раз!"}
            </p>
            <a href="/child">
              <Button
                size="lg"
                className="text-4xl px-16 py-10 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                ← К заданиям
              </Button>
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}
