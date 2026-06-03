/**
 * Markdown léger : **bold**, *italic*, \n\n → <p>, \n → <br>.
 * Pas de remark/rehype, le contenu est contrôlé (SCRIPT fixe).
 * Retourne du JSX directement (pas du HTML stringifié, donc pas de risque XSS).
 */
import { Fragment, type ReactNode } from "react";

function applyInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Tokenize bold and italic. Use a regex with alternation.
  const re = /\*\*([^*]+?)\*\*|(^|[\s(])\*([^*\n]+?)\*(?=[\s.,;:!?)]|$)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let idx = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    if (m[1] !== undefined) {
      parts.push(<b key={`${keyPrefix}-b-${idx++}`}>{m[1]}</b>);
    } else if (m[3] !== undefined) {
      parts.push(m[2]);
      parts.push(<em key={`${keyPrefix}-i-${idx++}`}>{m[3]}</em>);
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function formatMessage(text: string): ReactNode {
  const paragraphs = text.split(/\n\n/);
  return paragraphs.map((p, pi) => {
    const lines = p.split("\n");
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
