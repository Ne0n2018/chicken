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

    const { taskId, correct } = await req.json();
    const childId = session.user.id;
    const stars = correct ? 3 : 1;

    // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
    // ВАЖНО: upsert — создаёт запись, если её нет, иначе обновляет
    await prisma.taskCompletion.upsert({
        where: {
            userId_taskId: {  // ← составной уникальный ключ из schema.prisma
                userId: childId,
                taskId,
            },
        },
        create: {
            userId: childId,
            taskId,
            completed: true,
            stars,
            attempts: 1,
            completedAt: new Date(),
        },
        update: {
            completed: true,
            stars,                    // перезаписываем (можно логику сложнее)
            attempts: { increment: 1 },
            completedAt: new Date(),
        },
    });
    // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

    return NextResponse.json({ success: true });
}