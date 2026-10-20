import Link from "next/link";
import type { HeaderProps } from "@/components/site/header-types";
import { cn } from "@/lib/utils";

export function DesktopHeader({
  mark,
  name,
  navigation,
  current,
}: HeaderProps) {
  return (
    <header className="desktop-header">
      <Link className="brand-lockup" href="/" aria-label={`${name} 首页`}>
        <span className="brand-mark">{mark}</span>
        <span className="brand-copy">{name}</span>
      </Link>
      <nav className="desktop-nav" aria-label="主导航">
        {navigation.map((item, index) => (
          <Link
            className={cn(current === item.href && "is-current")}
            href={item.href}
            key={item.href}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
