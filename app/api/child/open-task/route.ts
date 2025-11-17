// app/api/child/open-task/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const { taskId } = await req.json();
  const childId = session.user.id as string;

  // Создаём запись, если ещё нет
  const completion = await prisma.taskCompletion.upsert({
    where: {
      userId_taskId: { userId: childId, taskId },
    },
    update: {},
    create: {
      userId: childId,
      taskId,
      completed: false,
      stars: 0,
    },
  });

  return NextResponse.json({ success: true, completion });
}
