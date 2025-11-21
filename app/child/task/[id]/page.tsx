// app/child/task/[id]/page.tsx
import { notFound } from "next/navigation";
import ChooseOneTaskClient from "@/components/shared/child/tasks/ChooseOneTask";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { ChooseOneTask } from "@/types/task";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CHILD") notFound();

  const rawTask = await prisma.task.findUnique({
    where: { id, isActive: true },
    select: {
      id: true,
      title: true,
      type: true,
      data: true,
      description: true,
      teacher: { select: { name: true } },
      completions: {
        where: { userId: session.user.id },
        take: 1,
      },
    },
  });

  if (!rawTask || rawTask.type !== "CHOOSE_ONE") notFound();

  // ВАЖНО: Приводим тип + проверяем структуру
  const taskData = rawTask.data as any;

  if (
    typeof taskData.question !== "string" ||
    !Array.isArray(taskData.options) ||
    typeof taskData.correctIndex !== "number" ||
    taskData.correctIndex < 0 ||
    taskData.correctIndex >= taskData.options.length
  ) {
    console.error("Некорректные данные задания:", rawTask);
    notFound();
  }

  const task: ChooseOneTask = {
    id: rawTask.id,
    title: rawTask.title,
    description: rawTask.description,
    type: rawTask.type,
    isActive: true,
    teacherId: rawTask.teacher?.name ?? null,
    teacher: rawTask.teacher,
    data: {
      question: taskData.question,
      options: taskData.options,
      correctIndex: taskData.correctIndex,
      imageUrl: taskData.imageUrl ?? undefined,
    },
  };

  return <ChooseOneTaskClient task={task} />;
}
