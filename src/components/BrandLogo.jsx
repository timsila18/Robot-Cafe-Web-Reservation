import logoDark from "../assets/brand/robot-cafe-logo-dark.png";
import logoLight from "../assets/brand/robot-cafe-logo-light.png";
import { cn } from "../utils/cn";

export default function BrandLogo({ className = "", imageClassName = "", variant = "auto" }) {
  const source = variant === "light" ? logoLight : logoDark;

  return (
    <span className={cn("brand-logo inline-flex min-w-0 items-center", className)}>
      <img
        src={source}
        alt="Robot Cafe"
        className={cn("h-10 w-auto max-w-full object-contain", imageClassName)}
      />
    </span>
  );
}
