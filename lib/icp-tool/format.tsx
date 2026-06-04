/**
 * Mini-markdown pour les messages du bot.
 *   - **bold** et *italic* inline
 *   - \n\n → <p>, \n → <br>
 *   - lignes "- " ou "• " ou "* " consécutives → <ul>
 *   - lignes "1. " ou "1) " consécutives → <ol>
 *   - sanitize : insert space après [.!?] avant majuscule collée
 * Pas de remark/rehype, contenu LLM filtré côté serveur, retour JSX direct (XSS-safe).
 */
import { Fragment, type ReactNode } from "react";

function applyInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*\*([^*]+?)\*\*|(^|[\s(])\*([^*\n]+?)\*(?=[\s.,;:!?)]|$)|`([^`\n]+?)`/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let idx = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    if (m[1] !== undefined) {
      parts.push(<b key={`${keyPrefix}-b-${idx++}`}>{m[1]}</b>);
    } else if (m[3] !== undefined) {
      parts.push(m[2]);
      parts.push(<em key={`${keyPrefix}-i-${idx++}`}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      parts.push(
        <code key={`${keyPrefix}-c-${idx++}`} className="msg__code">
          {m[4]}
        </code>,
      );
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

const BULLET_RE = /^[-•–*]\s+(.+)$/;
const NUM_RE = /^(\d+)[.)]\s+(.+)$/;

function sanitize(text: string): string {
  // Cas : "rien d'autre.Maintenant" → "rien d'autre. Maintenant"
  // On laisse les abréviations type "U.S.A" tranquilles (capital + . + capital n'est PAS touché
  // si la regex regarde [.!?] + maj sans espace). On insère une espace, pas un saut de paragraphe.
  let out = text.replace(/([.!?])([A-ZÀ-Ý])/g, "$1 $2");
  // Normalise les sauts internes : 3+ \n → 2 (un saut de paragraphe et basta)
  out = out.replace(/\n{3,}/g, "\n\n");
  return out;
}

export function formatMessage(text: string): ReactNode {
  const cleaned = sanitize(text || "");
  const paragraphs = cleaned.split(/\n{2,}/);

  return paragraphs.map((p, pi) => {
    const lines = p.split("\n").filter((l) => l.length > 0 || true); // garde les vides intermédiaires

    const nonEmpty = lines.filter((l) => l.trim());
    // Détecte une liste si >= 2 lignes non vides et toutes commencent par bullet
    const isBulletList =
      nonEmpty.length >= 2 && nonEmpty.every((l) => BULLET_RE.test(l.trim()));
    const isNumList =
      nonEmpty.length >= 2 && nonEmpty.every((l) => NUM_RE.test(l.trim()));

    if (isBulletList) {
      return (
        <ul key={`p-${pi}`} className="msg__list">
          {nonEmpty.map((l, li) => {
            const m = l.trim().match(BULLET_RE);
            const content = m ? m[1] : l.trim();
            return (
              <li key={li}>{applyInline(content, `p${pi}-li${li}`)}</li>
            );
          })}
        </ul>
      );
    }

    if (isNumList) {
      return (
        <ol key={`p-${pi}`} className="msg__list">
          {nonEmpty.map((l, li) => {
            const m = l.trim().match(NUM_RE);
            const content = m ? m[2] : l.trim();
            return (
              <li key={li}>{applyInline(content, `p${pi}-li${li}`)}</li>
            );
          })}
        </ol>
      );
    }

    return (
      <p key={`p-${pi}`}>
        {lines.map((line, li) => (
          <Fragment key={`l-${li}`}>
            {li > 0 && <br />}
            {applyInline(line, `p${pi}-l${li}`)}
          </Fragment>
        ))}
      </p>
    );
  });
}

export function siteInitials(site: string): string {
  return site
    .replace(/^www\./, "")
    .split(".")[0]
    .slice(0, 2)
    .toUpperCase();
}
