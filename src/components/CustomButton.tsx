import { cn } from "@/utils/functions/cn";
import type { LucideIcon } from "lucide-react"; // Import the type for the icon

type CustomButtonProps = {
  className?: string;
  icon?: LucideIcon; // Type for the icon prop
  label: string;
  title: string;
  onClick: () => void;
};

export const CustomButton = ({ className, icon: Icon, label, title, onClick }: CustomButtonProps) => {
  return (
    <button
      className={cn("flex justify-center items-center w-full md:w-auto p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-nowrap", className)}
      title={title}
      type="button"
      onClick={onClick}
    >
      {Icon && <Icon className="mr-2 h-5 w-5 inline" />}
      {label}
    </button>
  );
};