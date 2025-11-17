// app/api/teacher/task/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// ВАЖНО: params теперь Promise → нужно await!
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Promise!
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
  // ОБЯЗАТЕЛЬНО: распаковываем params
  const { id } = await params;
  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

  // Проверяем, что задание принадлежит этому учителю
  const task = await prisma.task.findUnique({
    where: { id },
    select: { id: true, teacherId: true },
  });

  if (!task || task.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Задание не найдено" }, { status: 404 });
  }

  const { title, data } = await req.json();

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "Название обязательно" },
      { status: 400 }
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title: title.trim(),
      ...(data !== undefined && { data }), // обновляем data только если передали
    },
  });

  return NextResponse.json({ success: true, task: updatedTask });
}

// Если захочешь DELETE — тоже с await params
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    select: { teacherId: true },
  });

  if (!task || task.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Задание не найдено" }, { status: 404 });
  }

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
