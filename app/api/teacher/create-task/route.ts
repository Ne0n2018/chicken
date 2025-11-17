// app/api/teacher/create-task/route.ts — ИСПРАВЛЕННАЯ ВЕРСИЯ
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type TaskType = "COLORING" | "PUZZLE" | "CHOOSE_ONE" | "DRAG_AND_DROP";
const allowedTypes: TaskType[] = [
  "COLORING",
  "PUZZLE",
  "CHOOSE_ONE",
  "DRAG_AND_DROP",
];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json(
      { error: "Только для воспитателей" },
      { status: 401 }
    );
  }

  const { title, type, data } = await req.json();

  if (!title?.trim() || !type || !allowedTypes.includes(type as TaskType)) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      type: type as TaskType,
      data: data as any,
      isActive: true,
      teacherId: session.user.id as string,
    },
  });

  return NextResponse.json({ success: true, task });
}
