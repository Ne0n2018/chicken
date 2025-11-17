// app/child/task/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ChooseOneTask from "@/components/shared/child/tasks/ChooseOneTask";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CHILD") redirect("/login");

  const { id } = await params; // Next.js 15+ — params асинхронный
  const childId = session.user.id as string;

  // Загружаем задание и прогресс ребёнка
  const task = await prisma.task.findUnique({
    where: { id, isActive: true },
    include: {
      teacher: { select: { name: true } },
    },
  });

  if (!task || task.type !== "CHOOSE_ONE") {
    return <div className="text-center pt-20 text-4xl">Задание не найдено</div>;
  }

  // Создаём или получаем прогресс ребёнка
  const completion = await prisma.taskCompletion.upsert({
    where: {
      userId_taskId: { userId: childId, taskId: id },
    },
    update: {},
    create: {
      userId: childId,
      taskId: id,
      completed: false,
      stars: 0,
    },
  });

  // Если уже выполнено — показываем результат
  if (completion.completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center p-8">
        <div className="text-center bg-white/90 backdrop-blur rounded-3xl p-16 shadow-2xl">
          <div className="text-9xl mb-8">Trophy</div>
          <h1 className="text-6xl font-bold text-purple-800 mb-6">Молодец!</h1>
          <p className="text-4xl text-green-600 mb-8">
            Ты получил {completion.stars} звёздочек!
          </p>
          <a href="/child" className="text-3xl text-purple-600 underline">
            ← Вернуться к заданиям
          </a>
        </div>
      </div>
    );
  }

  return (
    <ChooseOneTask task={task} completion={completion} childId={childId} />
  );
}
