import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const NAV_GROUPS = [
  {
    label: "Site",
    links: [
      { href: "/methode", label: "Méthode" },
      { href: "/icp", label: "Outil ICP" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "Pour qui",
    links: [
      { href: "/cold-email-saas", label: "Cold email SaaS" },
      { href: "/agence-cold-email-france", label: "Agence cold email France" },
      { href: "/agence-prospection-paris", label: "Agence prospection Paris" },
    ],
  },
  {
    label: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/politique-confidentialite", label: "Confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-border/60 mt-24 border-t" role="contentinfo">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand block */}
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Outbound B2B pensé pour durer. Pour fondateurs tech francophones qui veulent un canal
              fiable, pas une machine à spam.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <a
                href="https://www.linkedin.com/company/rezus-agency"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Rezus Agency"
                className="text-muted-foreground hover:text-foreground hover:bg-card/60 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <h4 className="text-foreground text-sm font-medium">{group.label}</h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border/60 mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-muted-foreground font-mono text-xs">
            © 2026 Rezus Agency · Paris, France
          </p>
          <p className="text-muted-foreground/70 font-mono text-xs">
            Outbound qui n&apos;a rien à voir avec du spam
          </p>
        </div>
      </Container>
    </footer>
  );
}
