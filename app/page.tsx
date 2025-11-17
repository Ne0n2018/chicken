// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Star, Users, Trophy, Palette, Gamepad2 } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="container mx-auto max-w-6xl text-center">
          {/* Заголовок */}
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Игровые задания
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              для дошкольников
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Развивающие игры, раскраски, пазлы и задания, которые любят дети.
            Родители видят прогресс, учителя создают свои уроки — всё в одном
            ярком месте!
          </p>

          {/* Большая кнопка */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl"
            >
              <Link href="/register" className="flex items-center gap-3">
                <Star className="w-6 h-6" />
                Создать аккаунт бесплатно
              </Link>
            </Button>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <Card className="p-8 bg-white/70 backdrop-blur shadow-xl border-purple-200">
              <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Для родителей</h3>
              <p className="text-gray-600">
                Создавайте аккаунты детям и следите за успехами в реальном
                времени
              </p>
            </Card>

            <Card className="p-8 bg-white/70 backdrop-blur shadow-xl border-pink-200">
              <Palette className="w-16 h-16 text-pink-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Для детей 3–7 лет</h3>
              <p className="text-gray-600">
                Яркие игры, раскраски, пазлы и задания с наградами
              </p>
            </Card>

            <Card className="p-8 bg-white/70 backdrop-blur shadow-xl border-yellow-200">
              <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Для воспитателей</h3>
              <p className="text-gray-600">
                Создавайте свои задания и группы детей
              </p>
            </Card>
          </div>

          {/* Нижний блок с иконками */}
          <div className="mt-20 flex flex-wrap justify-center gap-12 text-gray-600">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-purple-600" />
              <span className="text-lg">Игровая форма</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-pink-600" />
              <span className="text-lg">Конфетти и звёздочки</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <span className="text-lg">Система наград</span>
            </div>
          </div>

          {/* Финальный призыв */}
          <div className="mt-20 bg-white/80 backdrop-blur rounded-3xl p-12 shadow-2xl">
            <h3 className="text-4xl font-bold mb-6">
              Готовы начать волшебство?
            </h3>
            <Button size="lg" asChild className="text-xl px-12 py-8">
              <Link href="/register">Зарегистрироваться бесплатно</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
