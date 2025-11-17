// app/api/child/complete-task/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const { taskId, stars } = await req.json();
  const childId = session.user.id as string;

  await prisma.taskCompletion.update({
    where: { userId_taskId: { userId: childId, taskId } },
    data: {
      completed: true,
      stars,
    },
  });

  return NextResponse.json({ success: true });
}
