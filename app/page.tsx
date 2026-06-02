import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Pill } from "@/components/design/Pill";
import { OldNewRow } from "@/components/design/OldNewRow";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero placeholder */}
        <Section className="pt-16 sm:pt-20 lg:pt-28">
          <Container>
            <div className="flex flex-col gap-6 sm:gap-8">
              <Pill variant="muted">
                <span className="bg-rezus-green h-1.5 w-1.5 rounded-full" aria-hidden="true" />
                Agence outbound B2B · Paris
              </Pill>

              <h1 className="text-foreground text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02] font-semibold tracking-tight">
                Outbound qui n&apos;a rien
                <br />à voir avec du spam.
              </h1>

              <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed sm:text-xl">
                Pour fondateurs B2B francophones qui veulent un canal d&apos;acquisition fiable.
                Construit sur des comptes nommés, vérifié fait par fait, piloté chaque semaine.
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <a href="#comparaison">
                    Voir la méthode
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/icp">Définir mon ICP gratuitement</Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* Comparaison placeholder (3 rows for testing) */}
        <Section id="comparaison" className="pb-24">
          <Container>
            <div className="mb-12 flex flex-col gap-3 sm:mb-16">
              <Pill variant="muted">La méthode en 10 points</Pill>
              <h2 className="text-foreground max-w-3xl text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.05] font-semibold tracking-tight">
                Ancien monde de l&apos;outbound. Et la nôtre.
              </h2>
            </div>

            <div className="flex flex-col">
              <OldNewRow
                number={1}
                title="Ciblage"
                oldText="Listes de 10k+ contacts achetées, envoyées en masse, sans recherche préalable."
                newText="Comptes nommés (50 à 200), choisis sur signaux d'achat vérifiés."
                sourceId="lead411_2026"
                index={0}
              />
              <OldNewRow
                number={2}
                title="Deliverability"
                oldText="Un seul domaine, brûlé en 4 à 12 mois, 16,5% des emails légitimes n'atteignent jamais l'inbox."
                newText="Infrastructure multi-domaines, warmup permanent, monitoring quotidien."
                sourceId="validity2026"
                index={1}
              />
              <OldNewRow
                number={3}
                title="Usage de l'IA"
                oldText="Full AI SDR autonome qui envoie sans relecture humaine."
                newText="IA invisible (recherche, extraction, vérification) plus humain en validation finale."
                sourceId="digitalApplied2026"
                index={2}
              />
            </div>

            <p className="text-muted-foreground mt-10 font-mono text-xs">
              [Placeholder — les 7 autres axes arrivent à l&apos;Étape 4. Survole une icône ↗ pour
              voir la source.]
            </p>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
