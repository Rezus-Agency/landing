import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

const SIZE = { width: 1200, height: 630 };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? SITE.tagline;
  const eyebrow = searchParams.get("eyebrow") ?? "Rezus Agency · Outbound B2B";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#211e1a",
        backgroundImage:
          "radial-gradient(120% 70% at 50% 0%, rgba(204, 158, 65, 0.18), transparent 60%)",
        padding: "80px 96px",
        position: "relative",
        color: "#ecede9",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Top: logo */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span
          style={{
            fontSize: 44,
            fontWeight: 600,
            letterSpacing: -1,
            color: "#ecede9",
          }}
        >
          Rezus
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#9b958a",
            paddingBottom: 4,
          }}
        >
          Agency
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "monospace",
          fontSize: 22,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: "#b8b3a8",
          marginBottom: 28,
        }}
      >
        <span
          style={{
            display: "flex",
            width: 36,
            height: 2,
            backgroundColor: "#cc9e41",
          }}
        />
        {eyebrow}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 84,
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: -2,
          color: "#fafaf7",
          maxWidth: 1000,
          display: "flex",
        }}
      >
        {title}
      </div>

      {/* Bottom-right accent strip */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 8,
          background: "linear-gradient(180deg, rgba(204,158,65,0.6), rgba(204,158,65,0.05))",
        }}
      />
    </div>,
    {
      ...SIZE,
    },
  );
}
