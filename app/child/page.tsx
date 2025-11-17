// app/child/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { Trophy, Sparkles, Cloud } from "lucide-react";
import TaskCard from "@/components/shared/child/TaskCard";

export default async function ChildDashboard() {
  const session = await getServerSession(authOptions);

  // Защита: только CHILD может зайти
  if (!session || session.user.role !== "CHILD") {
    redirect("/login");
  }

  const childId = session.user.id as string;

  const child = await prisma.user.findUnique({
    where: { id: childId },
    include: {
      completions: {
        include: { task: true },
      },
      teacher: {
        select: { name: true },
      },
    },
  });

  if (!child) redirect("/login");

  // Активные задания
  const tasks = await prisma.task.findMany({
    where: {
      teacherId: child.teacherId!,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const completions = await prisma.taskCompletion.findMany({
    where: { userId: childId },
  });

  // Собираем вместе
  const activeTasks = tasks.map((task) => {
    const completion = completions.find((c) => c.taskId === task.id);
    return {
      task,
      completion: completion || { completed: false, stars: 0 },
    };
  });

  // Общее количество звёздочек
  const totalStars = child.completions.reduce(
    (sum, c) => sum + (c.stars || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 pt-16 pb-20 overflow-hidden">
      {/* Декоративные облака */}
      <div className="fixed inset-0 pointer-events-none">
        <Cloud className="absolute top-10 left-10 w-32 h-32 text-white/60 animate-bounce" />
        <Cloud className="absolute top-32 right-20 w-40 h-40 text-white/50 animate-bounce delay-1000" />
        <Cloud className="absolute bottom-40 left-1/3 w-36 h-36 text-white/40 animate-bounce delay-500" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Приветствие */}
        <div className="text-center mb-16 mt-12">
          <h1 className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 mb-6 drop-shadow-lg">
            Привет, {child.name?.split(" ")[0]}!
          </h1>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-5xl">
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur rounded-full px-8 py-4 shadow-xl">
              <Trophy className="w-16 h-16 text-yellow-500 drop-shadow" />
              <span className="font-bold text-purple-800">{totalStars}</span>
            </div>

            {child.teacher && (
              <p className="text-3xl text-purple-700 bg-white/70 backdrop-blur rounded-full px-6 py-3">
                Воспитатель: {child.teacher.name}
              </p>
            )}
          </div>
        </div>

        {/* Заголовок заданий */}
        <h2 className="text-6xl font-bold text-center mb-16 text-purple-800 drop-shadow">
          Твои задания
        </h2>

        {/* Нет заданий */}
        {activeTasks.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-48 h-48 mx-auto mb-10 text-purple-400 animate-pulse" />
            <p className="text-5xl font-bold text-purple-700 mb-4">
              Пока нет новых заданий
            </p>
            <p className="text-3xl text-gray-600">
              Скоро воспитатель пришлёт что-то интересное!
            </p>
          </div>
        ) : (
          /* Сетка заданий */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
            {activeTasks.map(({ completion, task }) => (
              <TaskCard
                key={task.id}
                task={task}
                completion={completion}
                childId={childId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
