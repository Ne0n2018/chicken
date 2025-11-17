// app/parent/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ParentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PARENT") redirect("/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8 mt-20">
      <h1 className="text-4xl font-bold text-purple-800">
        Привет, {session.user.name || "Родитель"}!
      </h1>
      <p className="text-xl mt-4">Это дашборд родителя</p>
      <p className="mt-8 text-3xl">Скоро тут будут твои дети</p>
    </div>
  );
}
