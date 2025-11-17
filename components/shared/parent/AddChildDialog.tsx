// components/parent/AddChildDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type Teacher = { id: string; name: string | null; email: string | null };

type Props = {
  children: React.ReactNode;
  teachers: Teacher[];
};

export default function AddChildDialog({ children, teachers }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !teacherId) {
      toast.error("Заполните все поля");
      return;
    }

    const res = await fetch("/api/parent/create-child", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, teacherId }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(`${name} успешно добавлен!`);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setTeacherId("");
      window.location.reload();
    } else {
      toast.error(data.error || "Ошибка создания");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Добавить ребёнка
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <Label>Имя ребёнка</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Саша, Маша..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Email ребёнка</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sasha@example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Пороль ребенка</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Воспитатель</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите воспитателя" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name || t.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
          >
            Создать аккаунт ребёнка
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
