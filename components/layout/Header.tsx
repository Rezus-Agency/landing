"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/methode", label: "Méthode" },
  { href: "/icp", label: "Outil ICP" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled || mobileOpen
          ? "bg-background/85 border-border/60 border-b backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <Container className="flex h-14 items-center justify-between sm:h-16">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <Button asChild size="sm" className="rounded-full">
            <Link href="/contact">Réserver un call</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((s) => !s)}
          className="text-foreground hover:bg-card/60 inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {/* Mobile drawer */}
      <div
        className={cn(
          "border-border/60 bg-background overflow-hidden border-t transition-all duration-200 md:hidden",
          mobileOpen ? "max-h-[calc(100dvh-3.5rem)]" : "max-h-0 border-transparent",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-foreground hover:bg-card/60 rounded-md px-3 py-3 text-base font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-3 rounded-full" onClick={() => setMobileOpen(false)}>
            <Link href="/contact">Réserver un call</Link>
          </Button>
        </Container>
      </div>
    </header>
  );
}
