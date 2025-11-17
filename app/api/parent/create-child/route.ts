// app/api/parent/create-child/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const { name, email, teacherId, password } = await req.json();

  if (!name || !email || !teacherId || !password) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email уже используется" },
      { status: 400 }
    );
  }

  const child = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "CHILD",
      teacherId: teacherId, // ← прямое указание учителя

      // Привязываем родителя
      childLinks: {
        create: {
          parentId: session.user.id as string,
        },
      },
    },
  });

  return NextResponse.json({ success: true, child });
}
