"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/methode", label: "Méthode" },
  { href: "/icp", label: "ICP Tool" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setStuck(window.scrollY > 8);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className={cn("nav", stuck && "is-stuck", mobileOpen && "is-open")}>
      <Container as="div" className="nav__inner">
        <Logo />

        <nav className="nav__links" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const isCurrent = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn("nav__link", isCurrent && "is-current")}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/contact" className="btn btn--primary btn--sm nav__menuCta">
            Réserver un appel
          </Link>
        </nav>

        <div className="nav__right">
          <Link href="/contact" className="btn btn--primary btn--sm nav__cta">
            Réserver un appel
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
            className="nav__toggle"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </Container>
      <div className="nav__progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
    </header>
  );
}
