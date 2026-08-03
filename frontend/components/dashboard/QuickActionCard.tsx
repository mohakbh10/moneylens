import React from "react";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
}: QuickActionCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        rounded-2xl
        border
        bg-card
        p-6
        cursor-pointer
        hover:bg-muted/40
        hover:-translate-y-1
        hover:shadow-md
        transition-all
        duration-200
      "
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="text-primary" size={22} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
