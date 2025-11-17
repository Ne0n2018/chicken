// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic"; // важно!

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Если сессии нет — отправляем на логин
  if (!session?.user) {
    redirect("/login");
  }

  // Если сессия есть — проверяем роль и редиректим точно
  const role = session.user.role as string;

  if (role === "PARENT") redirect("/parent");
  if (role === "TEACHER") redirect("/teacher");
  if (role === "CHILD") redirect("/child");

  // На всякий случай (если роль сломалась)
  redirect("/login");
}
