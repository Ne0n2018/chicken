// components/child/TaskCard.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  type: string;
};

type TaskCardProps = {
  task: Task;
  completion: {
    completed: boolean;
    stars: number;
    attempts?: number;
  } | null;
  childId: string;
};

export default function TaskCard({ task, completion }: TaskCardProps) {
  const isCompleted = completion?.completed ?? false;
  const typeConfig = {
    CHOOSE_ONE: {
      emoji: "Target",
      color: "from-green-400 to-emerald-400",
      bg: "bg-green-100",
    },
  };

  const config =
    typeConfig[task.type as keyof typeof typeConfig] || typeConfig.CHOOSE_ONE;

  return (
    <Link href={`/child/task/${task.id}`}>
      <Card
        className={`p-10 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl border-4 border-white ${config.bg}`}
      >
        <div className="text-center">
          <div
            className={`w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-9xl shadow-xl`}
          >
            {config.emoji}
          </div>
          <h3 className="text-4xl font-bold text-purple-800 mb-4">
            {task.title}
          </h3>
          {isCompleted ? (
            <div className="text-6xl">CheckCircle</div>
          ) : (
            <Button
              size="lg"
              className="text-3xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Играть!
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
}
