// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.error || "Ошибка регистрации");
      setLoading(false);
      return;
    }

    toast.success("Аккаунт создан! Входим...");

    // Автовход после регистрации
    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.ok) {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 px-4 mt-20">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Приветствуем!</h1>
          <p className="text-gray-600 mt-2">Создайте аккаунт за 20 секунд</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Как вас зовут?</Label>
            <Input
              name="name"
              required
              placeholder="Анна Иванова"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              required
              placeholder="anna@example.com"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="минимум 6 символов"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Кто вы?</Label>
            <Select name="role" defaultValue="PARENT">
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PARENT">Родитель</SelectItem>
                <SelectItem value="TEACHER">Воспитатель / Учитель</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={loading}
          >
            {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Уже есть аккаунт? </span>
          <Link
            href="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Войти
          </Link>
        </div>
      </Card>
    </div>
  );
}
