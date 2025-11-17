import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b",
        className
      )}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Маленькие Звёздочки
            </h1>
          </div>
        </Link>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Войти</Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Link href="/register">Начать сейчас</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
