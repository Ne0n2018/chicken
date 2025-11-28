"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {LogOut, User, Settings, Sparkles} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type UserType = {
  name?: string | null;
  email?: string | null;
  role?: string;
};

export default function UserDropdown({ user }: { user: UserType }) {
  const initials = user.name?.[0] || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="font-semibold text-sm">
              {user.name || "Пользователь"}
            </p>
            <p className="text-xs text-gray-500">
              {user.role === "PARENT" && "Родитель"}
              {user.role === "TEACHER" && "Воспитатель"}
              {user.role === "CHILD" && "Ребёнок"}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user.role === "PARENT" && (
          <DropdownMenuItem asChild>
            <Link
              href="/parent"
              className="flex items-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              Мои дети
            </Link>
          </DropdownMenuItem>
        )}
        {user.role === "TEACHER" && (
          <DropdownMenuItem asChild>
            <Link
              href="/teacher"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Панель учителя
            </Link>
          </DropdownMenuItem>
        )}
        {user.role === "CHILD" && (
          <DropdownMenuItem asChild>
            <Link
              href="/child"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sparkles/>
              Играть!
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
