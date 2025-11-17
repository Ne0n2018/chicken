// app/parent/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Trophy, UserCheck } from "lucide-react";
import AddChildDialog from "@/components/shared/parent/AddChildDialog";

export default async function ParentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PARENT") redirect("/login");

  const userId = session.user.id as string;

  // Загружаем детей родителя
  const children = await prisma.user.findMany({
    where: {
      childLinks: {
        some: { parentId: userId },
      },
    },
    include: {
      teacher: { select: { name: true, email: true } },
      completions: true,
    },
  });

  // Загружаем всех учителей для формы
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-3">
            Привет, {session.user.name?.split(" ")[0]}!
          </h1>
          <p className="text-xl text-gray-700">Твои маленькие звёздочки</p>
        </div>

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">Мои дети</h2>

          <AddChildDialog teachers={teachers}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg"
            >
              <Plus className="w-6 h-6 mr-2" />
              Добавить ребёнка
            </Button>
          </AddChildDialog>
        </div>

        {children.length === 0 ? (
          <Card className="p-16 text-center bg-white/80 backdrop-blur">
            <div className="text-9xl mb-6">Sparkles</div>
            <h3 className="text-3xl font-bold mb-4">Пока нет детей</h3>
            <p className="text-lg text-gray-600 mb-8">
              Добавь своего малыша и следи за его успехами!
            </p>
            <AddChildDialog teachers={teachers}>
              <Button size="lg" className="text-xl px-10 py-6">
                Добавить первого ребёнка
              </Button>
            </AddChildDialog>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {children.map((child) => {
              const stars = child.completions.reduce(
                (s, c) => s + (c.stars || 0),
                0
              );
              const completed = child.completions.filter(
                (c) => c.completed
              ).length;

              return (
                <Card
                  key={child.id}
                  className="p-6 hover:shadow-2xl transition-all bg-white/90 backdrop-blur border-2 border-purple-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-purple-800">
                      {child.name}
                    </h3>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-7 h-7 text-yellow-500" />
                        <span className="text-3xl font-bold text-purple-700">
                          {stars}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">звёздочек</p>
                    </div>
                  </div>

                  {child.teacher ? (
                    <div className="flex items-center gap-2 mb-4">
                      <UserCheck className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">
                        {child.teacher.name || child.teacher.email}
                      </span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="mb-4 text-orange-600">
                      Без воспитателя
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>{completed} заданий выполнено</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
