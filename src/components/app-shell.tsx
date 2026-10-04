"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesColumn, History, House } from "lucide-react";
import { SquaresProvider } from "@/features/squares/squares-context";

const navigation = [
  { href: "/", label: "Сегодня", icon: House },
  { href: "/history", label: "История", icon: History },
  { href: "/statistics", label: "Статистика", icon: ChartNoAxesColumn },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SquaresProvider>
      <div className="app-shell">
        <header className="site-header">
          <Link href="/" className="brand" aria-label="Квадрат — на главную">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
            <span>квадрат<span className="brand-dot">.</span></span>
          </Link>
          <span className="brand-caption">Маленькие дела. Видимый результат.</span>
        </header>

        <main className="main-content">{children}</main>

        <nav className="bottom-nav" aria-label="Основная навигация">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}>
                <Icon size={21} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </SquaresProvider>
  );
}
