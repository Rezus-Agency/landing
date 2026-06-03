"use client";

import type { Source } from "@/lib/icp-tool/types";
import { formatMessage } from "@/lib/icp-tool/format";
import { ExternalIcon } from "@/components/icp-tool/ui/icons";

interface Props {
  text: string;
  sources?: Source[];
}

export function MessageBot({ text, sources }: Props) {
  return (
    <div className="msg msg--bot">
      <span className="msg__av">R</span>
      <div className="msg__body">
        {formatMessage(text)}
        {sources && sources.length > 0 && (
          <div className="msg__sources">
            {sources.map((s, i) => (
              <a
                key={i}
                className="src-chip"
                href={s.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalIcon />
                <span>{s.title}</span>
                <span className="site">· {s.site}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
