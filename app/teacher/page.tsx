// app/teacher/page.tsx — обновлённая версия с заданиями
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {Pencil, Scroll, Trash2, Users} from "lucide-react";
import CreateTaskDialog from "@/components/shared/teacher/CreateTaskDialog";
import EditTaskDialog from "@/components/shared/teacher/EditTaskDialog";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") redirect("/login");

  const teacherId = session.user.id as string;

  const students = await prisma.user.findMany({
    where: { teacherId },
    select: { id: true, name: true },
  });

  const tasks = await prisma.task.findMany({
    where: { teacherId },
    orderBy: { createdAt: "desc" },
  });

  async function deleteTask(id: string) {
    "use server";
    await prisma.task.delete({ where: { id } });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-5xl font-bold text-center mb-12 text-purple-800">
          Привет, {session.user.name?.split(" ")[0]}!
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <p className="text-3xl font-bold">{students.length} детей</p>
          </Card>
          <Card className="p-8 text-center flex items-center justify-center flex-col">
            <Scroll className=" w-16 h-16 mx-auto mb-4 text-purple-600" />
            <p className="text-3xl font-bold">{tasks.length} заданий</p>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-purple-800">Мои задания</h2>
          <CreateTaskDialog>
            <Button
              size="lg"
              className="text-xl px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              + Новое задание
            </Button>
          </CreateTaskDialog>
        </div>

        <div className="grid gap-6">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="p-6 flex justify-between items-center hover:shadow-xl transition-all"
            >
              <div>
                <h3 className="text-2xl font-bold text-purple-800">
                  {task.title}
                </h3>
                <p className="text-gray-600">
                  {task.type === "CHOOSE_ONE" && "Выбери правильный"}
                </p>
                <p className="text-sm text-gray-500">
                  Создано: {new Date(task.createdAt).toLocaleDateString("ru")}
                </p>
              </div>

              <div className="flex gap-3">
                <EditTaskDialog task={task}>
                  <Button size="icon" variant="outline">
                    <Pencil className="w-5 h-5" />
                  </Button>
                </EditTaskDialog>

                <form action={deleteTask.bind(null, task.id)}>
                  <Button size="icon" variant="destructive">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
