import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

type Child = {
  id: string;
  name: string | null;
  image: string | null;
  completions: any[];
  groupsAsChild: { name: string; teacher: { name: string | null } }[];
};

export default function ChildCard({ child }: { child: Child }) {
  const totalStars = child.completions.reduce(
    (sum, c) => sum + (c.stars || 0),
    0
  );
  const completedTasks = child.completions.filter((c) => c.completed).length;
  const group = child.groupsAsChild[0];

  return (
    <Card className="p-6 hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur">
      <div className="flex items-start justify-between mb-4">
        <Avatar className="w-20 h-20 border-4 border-purple-200">
          <AvatarImage src={child.image || undefined} />
          <AvatarFallback className="text-4xl bg-gradient-to-br from-purple-400 to-pink-400 text-white">
            {child.name?.[0] || "Star"}
          </AvatarFallback>
        </Avatar>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl font-bold text-purple-700">
              {totalStars}
            </span>
          </div>
          <p className="text-sm text-gray-600">звёздочек</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-purple-800 mb-2">{child.name}</h3>

      {group ? (
        <div className="mb-3">
          <Badge variant="secondary" className="mb-2">
            {group.name}
          </Badge>
          <p className="text-sm text-gray-600">
            Воспитатель: {group.teacher.name}
          </p>
        </div>
      ) : (
        <Badge variant="outline" className="mb-3 text-orange-600">
          Ещё не в группе
        </Badge>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span>{completedTasks} заданий выполнено</span>
      </div>
    </Card>
  );
}
