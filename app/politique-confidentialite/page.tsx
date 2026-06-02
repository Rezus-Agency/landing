import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { BreadcrumbIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment Rezus Agency collecte et traite vos données personnelles (RGPD).",
  alternates: { canonical: "/politique-confidentialite" },
  robots: { index: true, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <>
      <Header />

      <main>
        <section className="phero" style={{ paddingBottom: "clamp(24px, 3vw, 40px)" }}>
          <div className="phero__bg" aria-hidden="true">
            <div className="hero__grid" />
          </div>
          <div className="wrap phero__inner phero__inner--legal">
            <Reveal as="span">
              <Link href="/" className="breadcrumb">
                <BreadcrumbIcon />
                Accueil
              </Link>
            </Reveal>
            <Reveal as="div" delay={1}>
              <h1 style={{ marginTop: "var(--s-5)" }}>Politique de confidentialité</h1>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p className="lede" style={{ marginTop: "var(--s-4)", maxWidth: "56ch" }}>
                On collecte le minimum, on l&apos;explique clairement, et on ne revend rien. Voici
                le détail, traitement par traitement.
              </p>
            </Reveal>
            <Reveal as="p" delay={2} className="legal__updated">
              Dernière mise à jour : 01/06/2026
            </Reveal>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "clamp(32px, 4vw, 56px)" }}>
          <div className="wrap legal">
            <div className="legal__body">
              <Reveal className="legal-block" id="responsable">
                <h2>1. Responsable du traitement</h2>
                <p>Le responsable du traitement des données personnelles est :</p>
                <dl>
                  <dt>Responsable</dt>
                  <dd>Rezus Agency, Osaühing (OÜ) de droit estonien</dd>
                  <dt>Siège social</dt>
                  <dd>
                    <span className="tofill">adresse complète en Estonie</span>
                  </dd>
                  <dt>Code d&apos;immatriculation</dt>
                  <dd>
                    Äriregister <span className="tofill">XXXXXXXX</span>
                  </dd>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:hello@rezus.agency">hello@rezus.agency</a>
                  </dd>
                  <dt>Téléphone</dt>
                  <dd>
                    <span className="tofill">+372 XXXX XXXX</span>
                  </dd>
                </dl>
                <p>
                  Rezus Agency n&apos;a pas désigné de Délégué à la protection des données (DPO).
                  Pour toute question relative à vos données, vous pouvez écrire à{" "}
                  <a href="mailto:hello@rezus.agency">hello@rezus.agency</a>.
                </p>
                <p>
                  Le traitement des données est régi par le Règlement (UE) 2016/679 (RGPD),
                  directement applicable dans tous les États membres de l&apos;Union européenne,
                  ainsi que par la loi estonienne sur la protection des données personnelles
                  (Isikuandmete kaitse seadus).
                </p>
              </Reveal>

              <Reveal className="legal-block" id="donnees">
                <h2>2. Données collectées et sources</h2>
                <p>Nous collectons les données strictement nécessaires à chaque traitement :</p>
                <ul>
                  <li>
                    <strong>Formulaire de contact</strong> : prénom, nom, email professionnel,
                    entreprise (facultatif) et contenu du message. Collecte directe auprès de vous.
                  </li>
                  <li>
                    <strong>Compte ICP Tool</strong> : email, mot de passe (haché), nom et
                    entreprise. Collecte directe lors de votre inscription.
                  </li>
                  <li>
                    <strong>Prospection commerciale B2B</strong> : nom, fonction, email
                    professionnel, entreprise. Données professionnelles publiques collectées
                    indirectement depuis des sources accessibles (profils LinkedIn publics, sites
                    web des entreprises ciblées, annuaires professionnels B2B).
                  </li>
                  <li>
                    <strong>Prise de rendez-vous (Calendly)</strong> : prénom, nom, email, créneau
                    choisi, notes éventuelles. Collecte directe au moment de la réservation.
                  </li>
                  <li>
                    <strong>Navigation (analytics)</strong> : pages consultées, durée des sessions,
                    source de trafic, type de navigateur (adresse IP anonymisée).
                  </li>
                </ul>
              </Reveal>

              <Reveal className="legal-block" id="finalites">
                <h2>3. Finalités</h2>
                <ul>
                  <li>
                    <strong>Répondre à vos demandes</strong> de contact et organiser un éventuel
                    rendez-vous.
                  </li>
                  <li>
                    <strong>Gérer votre compte</strong> ICP Tool et vous permettre d&apos;utiliser
                    l&apos;outil.
                  </li>
                  <li>
                    <strong>Mener une prospection B2B</strong> pertinente vers des décideurs dont la
                    fonction professionnelle correspond à notre offre.
                  </li>
                  <li>
                    <strong>Mesurer l&apos;audience</strong> du site de manière agrégée et améliorer
                    son contenu.
                  </li>
                  <li>
                    <strong>Sécurité du site</strong> : prévenir les abus et atteintes techniques.
                  </li>
                </ul>
              </Reveal>

              <Reveal className="legal-block" id="base">
                <h2>4. Bases légales</h2>
                <p>Selon le traitement, nous nous appuyons sur :</p>
                <ul>
                  <li>
                    <strong>Exécution de mesures précontractuelles</strong> à votre demande (art.
                    6.1.b RGPD) : formulaire de contact, prise de rendez-vous, inscription au compte
                    ICP Tool.
                  </li>
                  <li>
                    <strong>Exécution du contrat</strong> (art. 6.1.b RGPD) : utilisation de
                    l&apos;ICP Tool une fois le compte créé.
                  </li>
                  <li>
                    <strong>Intérêt légitime</strong> (art. 6.1.f RGPD) : prospection B2B vers des
                    professionnels, mesure d&apos;audience, sécurité du site.
                  </li>
                  <li>
                    <strong>Obligation légale</strong> (art. 6.1.c RGPD) : conservation des factures
                    et données comptables.
                  </li>
                </ul>
                <p>
                  Pour la prospection B2B, l&apos;intérêt légitime a été validé après un test de
                  mise en balance : (1) intérêt commercial réel de Rezus Agency à prospecter des
                  professionnels susceptibles d&apos;être intéressés par nos services, (2)
                  prospection ciblée nécessaire à cet intérêt, (3) impact limité sur les droits des
                  destinataires (données professionnelles, opposition possible à tout moment, durée
                  de conservation limitée). Conformément à la recommandation de la CNIL, la
                  prospection vise uniquement des emails professionnels et offre un droit
                  d&apos;opposition simple et immédiat.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="duree">
                <h2>5. Durées de conservation</h2>
                <dl>
                  <dt>Demandes de contact</dt>
                  <dd>3 ans à compter du dernier échange, puis suppression ou anonymisation.</dd>
                  <dt>Compte ICP Tool</dt>
                  <dd>
                    Pendant toute la durée du compte actif et jusqu&apos;à votre demande de
                    suppression. Suppression sous 30 jours après la demande.
                  </dd>
                  <dt>Prospection B2B</dt>
                  <dd>
                    3 ans à compter du dernier contact ou jusqu&apos;à votre opposition (réception
                    immédiate, traitement sous 48 h ouvrées).
                  </dd>
                  <dt>Prise de rendez-vous (Calendly)</dt>
                  <dd>18 mois à compter de la date du rendez-vous, puis suppression.</dd>
                  <dt>Mesure d&apos;audience</dt>
                  <dd>Données anonymisées agrégées, 90 jours maximum.</dd>
                  <dt>Données comptables et factures</dt>
                  <dd>10 ans (obligation légale, art. L.123-22 Code de commerce).</dd>
                </dl>
              </Reveal>

              <Reveal className="legal-block" id="destinataires">
                <h2>6. Destinataires et sous-traitants</h2>
                <p>
                  Vos données ne sont jamais revendues. Elles sont accessibles uniquement à
                  l&apos;équipe Rezus Agency et à nos sous-traitants techniques, qui agissent
                  exclusivement sur nos instructions et sont liés par un accord de traitement des
                  données (DPA) conforme au RGPD :
                </p>
                <ul>
                  <li>
                    <strong>Vercel Inc.</strong> (États-Unis) : hébergement du site et de
                    l&apos;application. Vercel Inc. est certifié{" "}
                    <strong>Data Privacy Framework (DPF)</strong>, mécanisme d&apos;adéquation
                    validé par la Commission européenne le 10 juillet 2023.
                  </li>
                  <li>
                    <strong>Calendly LLC</strong> (États-Unis) : prise de rendez-vous. Les
                    transferts sont encadrés par les <strong>clauses contractuelles types</strong>{" "}
                    de la Commission européenne (décision 2021/914).
                  </li>
                  <li>
                    <strong>Plausible Analytics ehf.</strong> (Estonie, Union européenne) : mesure
                    d&apos;audience sans cookie ni identifiant persistant. Aucun transfert hors UE.
                  </li>
                  <li>
                    <strong>Outil d&apos;envoi d&apos;emails</strong> :{" "}
                    <span className="tofill">prestataire à compléter</span> (utilisé pour les
                    réponses au formulaire et la prospection commerciale).
                  </li>
                </ul>
              </Reveal>

              <Reveal className="legal-block" id="transferts">
                <h2>7. Transferts de données hors Union européenne</h2>
                <p>
                  Certaines de vos données sont traitées par des prestataires établis aux
                  États-Unis. Ces transferts sont encadrés par des mécanismes de protection
                  conformes au RGPD :
                </p>
                <ul>
                  <li>
                    <strong>Vercel Inc.</strong> bénéficie du{" "}
                    <strong>Data Privacy Framework (DPF)</strong>, considéré par la Commission
                    européenne comme offrant un niveau de protection adéquat (décision
                    d&apos;adéquation du 10 juillet 2023).
                  </li>
                  <li>
                    <strong>Calendly LLC</strong> applique les{" "}
                    <strong>clauses contractuelles types</strong> (CCT) de la Commission européenne
                    (décision 2021/914), accompagnées de mesures techniques et organisationnelles
                    complémentaires.
                  </li>
                </ul>
                <p>Vous conservez l&apos;intégralité de vos droits RGPD malgré ces transferts.</p>
              </Reveal>

              <Reveal className="legal-block" id="prospection">
                <h2>8. Prospection commerciale B2B</h2>
                <p>
                  Nous prospectons par email des professionnels dont la fonction est en lien direct
                  avec nos services. Cette prospection s&apos;appuie sur notre intérêt légitime
                  (art. 6.1.f RGPD), conformément à la recommandation de la CNIL relative à la
                  prospection commerciale par voie électronique.
                </p>
                <p>
                  <strong>Droit d&apos;opposition immédiat</strong> : vous pouvez à tout moment
                  refuser de recevoir nos messages commerciaux en répondant{" "}
                  <strong>« STOP »</strong> à tout email reçu, ou en écrivant à{" "}
                  <a href="mailto:hello@rezus.agency">hello@rezus.agency</a>. Votre demande est
                  traitée sous 48 h ouvrées et n&apos;est suivie d&apos;aucune réinjection
                  ultérieure.
                </p>
                <p>
                  Si vous recevez un message à une adresse personnelle par erreur, signalez-le par
                  retour de mail : nous supprimerons l&apos;adresse immédiatement.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="cookies">
                <h2>9. Cookies et mesure d&apos;audience</h2>
                <p>
                  Ce site n&apos;utilise{" "}
                  <strong>aucun cookie publicitaire ni de suivi tiers</strong>. Les seuls cookies
                  déposés sont strictement nécessaires au fonctionnement du site (session,
                  préférences techniques).
                </p>
                <p>
                  La mesure d&apos;audience est assurée par <strong>Plausible Analytics</strong>,
                  outil européen privacy-first qui ne dépose aucun cookie et n&apos;utilise pas
                  d&apos;identifiant persistant. Cet outil bénéficie de l&apos;exemption de
                  consentement reconnue par la CNIL pour les solutions de mesure d&apos;audience
                  strictement anonymes.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="profilage">
                <h2>10. Décisions automatisées et profilage</h2>
                <p>
                  Rezus Agency <strong>n&apos;utilise pas</strong> de décision entièrement
                  automatisée, ni de profilage, produisant des effets juridiques à votre égard ou
                  vous affectant de manière significative (art. 22 RGPD).
                </p>
              </Reveal>

              <Reveal className="legal-block" id="droits">
                <h2>11. Vos droits</h2>
                <p>
                  Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des
                  droits suivants sur vos données personnelles :
                </p>
                <ul>
                  <li>
                    <strong>Droit d&apos;accès</strong> (art. 15) : obtenir confirmation que vos
                    données sont traitées et en recevoir une copie.
                  </li>
                  <li>
                    <strong>Droit de rectification</strong> (art. 16) : faire corriger des données
                    inexactes ou incomplètes.
                  </li>
                  <li>
                    <strong>Droit à l&apos;effacement</strong> (art. 17) : demander la suppression
                    de vos données.
                  </li>
                  <li>
                    <strong>Droit à la limitation</strong> (art. 18) : restreindre temporairement le
                    traitement.
                  </li>
                  <li>
                    <strong>Droit d&apos;opposition</strong> (art. 21) : refuser un traitement fondé
                    sur l&apos;intérêt légitime, notamment la prospection.
                  </li>
                  <li>
                    <strong>Droit à la portabilité</strong> (art. 20) : récupérer vos données dans
                    un format structuré et lisible par machine.
                  </li>
                  <li>
                    <strong>Droit de retrait du consentement</strong> à tout moment lorsqu&apos;un
                    traitement est fondé sur votre consentement.
                  </li>
                  <li>
                    <strong>Droit de définir des directives</strong> relatives au sort de vos
                    données après votre décès.
                  </li>
                </ul>
                <p>
                  Pour exercer ces droits, écrivez à{" "}
                  <a href="mailto:hello@rezus.agency">hello@rezus.agency</a> en précisant le droit
                  que vous souhaitez exercer. Nous vous répondrons dans un délai maximum de{" "}
                  <strong>30 jours</strong>, conformément à l&apos;article 12.3 du RGPD.
                </p>
                <p>
                  Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une
                  réclamation auprès de l&apos;autorité de contrôle compétente. Rezus Agency étant
                  une société de droit estonien, l&apos;autorité de contrôle principale est :
                </p>
                <dl>
                  <dt>Andmekaitse Inspektsioon (AKI)</dt>
                  <dd>Tatari 39, 10134 Tallinn, Estonie</dd>
                  <dt>Téléphone</dt>
                  <dd>+372 627 4135</dd>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:info@aki.ee">info@aki.ee</a>
                  </dd>
                  <dt>Site</dt>
                  <dd>
                    <a href="https://www.aki.ee" target="_blank" rel="noopener noreferrer">
                      aki.ee
                    </a>
                  </dd>
                </dl>
                <p>
                  Conformément à l&apos;article 77 du RGPD, vous avez également le droit de saisir
                  l&apos;autorité de contrôle de votre pays de résidence. Pour les utilisateurs
                  résidant en France, il s&apos;agit de la <strong>CNIL</strong> :
                </p>
                <dl>
                  <dt>Commission Nationale de l&apos;Informatique et des Libertés</dt>
                  <dd>3 place de Fontenoy, TSA 80715, 75334 Paris cedex 07</dd>
                  <dt>Téléphone</dt>
                  <dd>+33 (0)1 53 73 22 22</dd>
                  <dt>Site</dt>
                  <dd>
                    <a
                      href="https://www.cnil.fr/fr/plaintes"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      cnil.fr/fr/plaintes
                    </a>
                  </dd>
                </dl>
              </Reveal>

              <Reveal className="legal-block" id="securite">
                <h2>12. Sécurité</h2>
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                  pour garantir la sécurité de vos données : chiffrement TLS, hachage des mots de
                  passe, accès restreint aux données, journalisation des accès, mises à jour
                  régulières des dépendances.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="conséquences">
                <h2>13. Conséquences en cas de refus</h2>
                <p>
                  Les données marquées comme obligatoires dans nos formulaires sont nécessaires pour
                  traiter votre demande. Si vous refusez de les fournir, nous ne pourrons pas
                  répondre à votre sollicitation, créer votre compte, ou organiser un rendez-vous.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="modifications">
                <h2>14. Modifications de la politique</h2>
                <p>
                  Cette politique peut être mise à jour pour refléter une évolution de nos
                  traitements ou de la réglementation. La date de dernière mise à jour figure en
                  haut de la page. Pour toute modification substantielle, nous vous en informerons
                  par les canaux appropriés.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
