"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import type { HeaderProps } from "@/components/site/header-types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function MobileHeader({ mark, name, navigation, current }: HeaderProps) {
  return (
    <header className="mobile-header">
      <Link className="mobile-brand" href="/" aria-label={`${name} 首页`}>
        <span>{mark}</span>
        <small>{name}</small>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="menu-button"
            type="button"
            aria-label="打开导航菜单"
          >
            <Menu size={20} strokeWidth={1.8} />
            <span>菜单</span>
          </button>
        </SheetTrigger>
        <SheetContent className="mobile-menu" side="right">
          <SheetHeader className="mobile-menu-head">
            <SheetTitle>{name}</SheetTitle>
            <SheetDescription>作品、文章与正在生长的笔记。</SheetDescription>
          </SheetHeader>
          <nav className="mobile-menu-nav" aria-label="移动端主导航">
            <SheetClose asChild>
              <Link className={cn(current === "/" && "is-current")} href="/">
                <span>00</span>首页
              </Link>
            </SheetClose>
            {navigation.map((item, index) => (
              <SheetClose asChild key={item.href}>
                <Link
                  className={cn(current === item.href && "is-current")}
                  href={item.href}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
          <p className="mobile-menu-foot">阅读、实践与长期记录。</p>
        </SheetContent>
      </Sheet>
    </header>
  );
}
