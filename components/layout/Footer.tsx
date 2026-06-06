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

const COLUMNS = [
  {
    label: "Produit",
    links: [
      { href: "/methode", label: "Méthode" },
      { href: "/icp", label: "ICP Tool" },
    ],
  },
  {
    label: "Agence",
    links: [
      { href: "/contact", label: "Contact" },
      {
        href: "https://www.linkedin.com/company/rezus-agency",
        label: "LinkedIn",
        external: true,
      },
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
    <footer className="footer" role="contentinfo">
      <Container>
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p>
              Agence d&apos;outbound B2B pour les boîtes tech francophones. Du ciblage, pas du
              volume.
            </p>
            <a
              href="https://www.linkedin.com/company/rezus-agency"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Rezus Agency"
              className="text-muted-foreground hover:text-foreground bg-card/40 hover:bg-card inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
          </div>

          <div className="footer__cols">
            {COLUMNS.map((group) => (
              <div key={group.label} className="footer__col">
                <h2>{group.label}</h2>
                {group.links.map((link) =>
                  "external" in link && link.external ? (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Rezus Agency · France</span>
          <a href="mailto:contact@rezus-agency.com">contact@rezus-agency.com</a>
        </div>
      </Container>
    </footer>
  );
}
