import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  return (
    <footer
      className={cn("bg-gray-900 text-white py-10 text-center", className)}
    >
      <div className="container mx-auto">
        <p>© 2025 Маленькие Звёздочки — развивашки для самых маленьких</p>
      </div>
    </footer>
  );
};
