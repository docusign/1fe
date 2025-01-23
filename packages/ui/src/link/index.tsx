import type { AnchorHTMLAttributes, ReactNode } from "react";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  newTab?: boolean;
  href: string;
}

console.log("test");

export function Link({
  children,
  href,
  newTab,
  ...other
}: LinkProps): JSX.Element {
  return (
    <a
      href={href}
      rel={newTab ? "noreferrer" : undefined}
      target={newTab ? "_blank" : undefined}
      {...other}
    >
      {children}
    </a>
  );
}
