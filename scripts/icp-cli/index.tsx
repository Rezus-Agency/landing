/**
 * ICP Discovery CLI — REPL interactif Ink.
 *
 * Usage:
 *   pnpm icp:chat                    # nouvelle session
 *   pnpm icp:chat --save run-001     # sauvegarde sous nom donné en fin
 *
 * Layout :
 *   ┌─ header (cost + searches + finalized state) ──┐
 *   │ chat history (auto-scroll)                    │
 *   │ ...                                            │
 *   │ panel summary (à la demande, /panel)           │
 *   ├─ input bar ────────────────────────────────────┤
 *   │ > _                                            │
 *   └────────────────────────────────────────────────┘
 *
 * Commandes :
 *   /panel    affiche l'état du panel ICP en construction
 *   /save id  sauvegarde la session sous tmp/icp-sessions/<id>.json
 *   /quit     quitte (auto-save si --save passé en arg)
 */
import { config as loadEnv } from "dotenv";
import { Box, Text, render, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import React, { useEffect, useState } from "react";
import { freshSession, runTurn } from "../../lib/llm-core/agent/orchestrator";
import { saveSnapshot } from "../../lib/llm-core/agent/snapshot";
import type {
  AgentEvent,
  PanelPatch,
  SearchResult,
  SessionState,
} from "../../lib/llm-core/types";

loadEnv({ path: ".env.local" });

// --------- Parse CLI args ---------
const argv = process.argv.slice(2);
const saveLabelArg = (() => {
  const i = argv.indexOf("--save");
  return i >= 0 ? argv[i + 1] : undefined;
})();

// --------- Types affichage ---------
type DisplayItem =
  | { kind: "user"; text: string }
  | { kind: "bot"; text: string; intent?: string; model?: string }
  | { kind: "search"; query: string; reason: string; result?: SearchResult }
  | { kind: "panel"; patch: PanelPatch }
  | { kind: "finalize"; summary: string }
  | { kind: "info"; text: string }
  | { kind: "error"; text: string };

// --------- Hook : utilise l'orchestrator + collecte les events ---------
function useChat(state: SessionState) {
  const [items, setItems] = useState<DisplayItem[]>([
    { kind: "info", text: "ICP Discovery REPL. Tape /help pour les commandes, /quit pour sortir." },
  ]);
  const [busy, setBusy] = useState(false);
  // Force re-render quand totalUsd change (state mutated in-place)
  const [, setTick] = useState(0);

  const submit = async (userMessage: string) => {
    if (busy) return;
    if (!userMessage.trim()) return;

    // Commandes locales
    if (userMessage.startsWith("/")) {
      const [cmd, ...rest] = userMessage.split(" ");
      if (cmd === "/help") {
        setItems((p) => [
          ...p,
          {
            kind: "info",
            text:
              "Commandes :\n  /panel        affiche le panel ICP\n  /save <id>    sauvegarde sous tmp/icp-sessions/<id>.json\n  /cost         affiche le coût session\n  /quit         quitte",
          },
        ]);
      } else if (cmd === "/panel") {
        const lines: string[] = [];
        const sections = ["synthese", "identite", "psychologie", "marche", "challenges", "avantages"] as const;
        for (const s of sections) {
          const v = state.panel[s];
          if (!v) {
            lines.push(`  ${s.padEnd(14)} : (vide)`);
          } else {
            lines.push(`  ${s.padEnd(14)} [${v.confidence}] ${v.bullets.length} bullets, ${v.sources.length} src`);
            v.bullets.forEach((b) => lines.push(`     • ${b.slice(0, 100)}`));
          }
        }
        setItems((p) => [...p, { kind: "info", text: "Panel ICP :\n" + lines.join("\n") }]);
      } else if (cmd === "/save") {
        const id = rest.join(" ").trim() || state.id;
        const path = saveSnapshot(state, id);
        setItems((p) => [...p, { kind: "info", text: `Snapshot sauvegardé : ${path}` }]);
      } else if (cmd === "/cost") {
        setItems((p) => [
          ...p,
          {
            kind: "info",
            text: `Cost session : $${state.totalUsd.toFixed(4)} (${state.searchCount} searches, ${state.toolCalls.length} tool calls)`,
          },
        ]);
      } else if (cmd === "/quit") {
        if (saveLabelArg) {
          const path = saveSnapshot(state, saveLabelArg);
          setItems((p) => [...p, { kind: "info", text: `Auto-save : ${path}` }]);
        }
        process.exit(0);
      } else {
        setItems((p) => [...p, { kind: "info", text: `Commande inconnue : ${cmd}` }]);
      }
      return;
    }

    setItems((p) => [...p, { kind: "user", text: userMessage }]);
    setBusy(true);

    const botItem: DisplayItem = { kind: "bot", text: "" };
    setItems((p) => [...p, botItem]);

    try {
      for await (const event of runTurn(state, userMessage, { cache: true })) {
        handleEvent(event, botItem, setItems);
        setTick((t) => t + 1);
      }
    } catch (err) {
      setItems((p) => [...p, { kind: "error", text: (err as Error).message }]);
    } finally {
      setBusy(false);
    }
  };

  return { items, busy, submit };
}

function handleEvent(
  ev: AgentEvent,
  botItem: DisplayItem,
  setItems: React.Dispatch<React.SetStateAction<DisplayItem[]>>,
) {
  switch (ev.type) {
    case "turn_start":
      if (botItem.kind === "bot") {
        botItem.intent = ev.intent;
        botItem.model = ev.model;
        setItems((p) => [...p]);
      }
      break;
    case "text":
      if (botItem.kind === "bot") {
        botItem.text += ev.delta;
        setItems((p) => [...p]);
      }
      break;
    case "search_start":
      setItems((p) => [
        ...p,
        { kind: "search", query: ev.query, reason: ev.reason },
      ]);
      break;
    case "search_result":
      setItems((p) => {
        const arr = [...p];
        for (let i = arr.length - 1; i >= 0; i--) {
          const it = arr[i];
          if (it.kind === "search" && it.query === ev.result.query && !it.result) {
            arr[i] = { ...it, result: ev.result };
            break;
          }
        }
        return arr;
      });
      // Et on prépare une nouvelle bulle bot pour la suite
      setItems((p) => [...p, { kind: "bot", text: "" }]);
      // (Note : les events texte suivants ciblent botItem qui est la référence
      // initiale — pour simplifier, on ne re-cible pas la nouvelle bulle ici.)
      break;
    case "panel_patch":
      setItems((p) => [...p, { kind: "panel", patch: ev.patch }]);
      setItems((p) => [...p, { kind: "bot", text: "" }]);
      break;
    case "finalize_signal":
      setItems((p) => [...p, { kind: "finalize", summary: ev.segment_summary }]);
      break;
    case "error":
      setItems((p) => [...p, { kind: "error", text: `[${ev.code}] ${ev.message}` }]);
      break;
    case "turn_done":
    case "cost":
    case "thinking":
      // ignored pour l'affichage
      break;
  }
}

// --------- Composants ---------

function Header({ state, busy }: { state: SessionState; busy: boolean }) {
  return (
    <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1}>
      <Box justifyContent="space-between">
        <Text bold color="cyanBright">Rezus ICP Discovery</Text>
        <Text dimColor>session: {state.id}</Text>
      </Box>
      <Box gap={2}>
        <Text>
          <Text dimColor>cost: </Text>
          <Text color="green">${state.totalUsd.toFixed(4)}</Text>
        </Text>
        <Text>
          <Text dimColor>searches: </Text>
          <Text color="yellow">{state.searchCount}</Text>
        </Text>
        <Text>
          <Text dimColor>turns: </Text>
          <Text color="cyan">{state.toolCalls.length === 0 && state.messages.length === 0 ? 0 : Math.ceil(state.messages.filter((m) => m.role === "user").length)}</Text>
        </Text>
        {state.finalized && <Text color="greenBright">✓ FINALIZED</Text>}
        {busy && <Text color="yellow">⏳ thinking…</Text>}
      </Box>
    </Box>
  );
}

function ItemView({ item }: { item: DisplayItem }) {
  switch (item.kind) {
    case "user":
      return (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="blueBright">You</Text>
          <Text>{item.text}</Text>
        </Box>
      );
    case "bot":
      return (
        <Box flexDirection="column" marginTop={1}>
          <Box>
            <Text bold color="cyanBright">Rezus</Text>
            {item.intent && (
              <Text dimColor> [{item.intent}|{item.model}]</Text>
            )}
          </Box>
          <Text>{item.text}</Text>
        </Box>
      );
    case "search":
      return (
        <Box flexDirection="column" marginTop={1} paddingLeft={1}>
          <Text color="cyan">🔍 search: {item.query}</Text>
          <Text dimColor>   {item.reason}</Text>
          {item.result && !item.result.error && (
            <Text color="green">   ✓ {item.result.results.length} sources via {item.result.provider} ({item.result.latencyMs}ms)</Text>
          )}
          {item.result?.error && (
            <Text color="red">   ✗ {item.result.error}</Text>
          )}
        </Box>
      );
    case "panel":
      return (
        <Box flexDirection="column" marginTop={1} paddingLeft={1}>
          <Text color="magenta">
            📋 panel.{item.patch.section}{" "}
            <Text color={item.patch.confidence === "verified" ? "green" : item.patch.confidence === "inferred" ? "yellow" : "gray"}>
              [{item.patch.confidence}]
            </Text>
          </Text>
          {item.patch.bullets.map((b, i) => (
            <Text key={i} dimColor>   • {b}</Text>
          ))}
        </Box>
      );
    case "finalize":
      return (
        <Box marginTop={1} padding={1} borderStyle="double" borderColor="green">
          <Text bold color="greenBright">✓ FINALIZE : </Text>
          <Text>{item.summary}</Text>
        </Box>
      );
    case "info":
      return <Text dimColor>{item.text}</Text>;
    case "error":
      return <Text color="red">⚠ {item.text}</Text>;
  }
}

function App() {
  const { exit } = useApp();
  const [state] = useState<SessionState>(() => freshSession("interactive"));
  const [input, setInput] = useState("");
  const { items, busy, submit } = useChat(state);

  useInput((_, key) => {
    if (key.ctrl && _ === "c") exit();
  });

  const handleSubmit = (value: string) => {
    setInput("");
    submit(value);
  };

  return (
    <Box flexDirection="column">
      <Header state={state} busy={busy} />
      <Box flexDirection="column" paddingX={1} paddingY={1}>
        {items.slice(-30).map((it, i) => (
          <ItemView key={i} item={it} />
        ))}
      </Box>
      <Box borderStyle="single" borderColor="gray" paddingX={1}>
        <Text color="cyan">{busy ? "⏳" : "❯"} </Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder={busy ? "patiente…" : "ta réponse, ou /help"}
        />
      </Box>
    </Box>
  );
}

render(<App />);
