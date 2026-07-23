import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"article">) {
  return <article className={`ui-card ${className}`} {...props} />;
}

export function CardContent({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return <div className={`ui-card-content ${className}`} {...props} />;
}
