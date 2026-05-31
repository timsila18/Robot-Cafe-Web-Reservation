import logo from "../assets/brand/robot-cafe-logo.png";
import { cn } from "../utils/cn";

export default function BrandLogo({ className = "", imageClassName = "", plain = false }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <span className={cn(!plain && "rounded-2xl bg-white px-3 py-2 shadow-glow")}>
        <img
          src={logo}
          alt="Robot Cafe"
          className={cn("h-10 w-auto object-contain", imageClassName)}
        />
      </span>
    </span>
  );
}
