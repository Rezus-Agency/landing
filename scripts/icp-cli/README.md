# ICP Discovery — CLI dev harness

REPL interactif + scripts de test isolés pour développer le moteur LLM
avant de le brancher à l'UI Next.js (Phase 2).

## Pré-requis

`.env.local` à la racine du projet avec 3 clés :

```bash
ANTHROPIC_API_KEY=sk-ant-...
LINKUP_API_KEY=...
TAVILY_API_KEY=tvly-...
```

## Commandes disponibles

```bash
# Sanity checks
pnpm icp:smoke                  # vérifie que les 3 APIs répondent
pnpm icp:search "ta requête"    # test isolé du tool search_web

# Test d'un tour seul
pnpm icp:turn "message du founder"

# Test multi-tours scripté (3 tours pré-définis HR Tech)
pnpm icp:multi

# REPL interactif (le vrai outil de dev)
pnpm icp:chat
pnpm icp:chat --save run-001    # auto-save en fin de session
```

## REPL — commandes internes

Une fois dans `pnpm icp:chat`, tape :

| Commande | Effet |
|---|---|
| `/help` | Liste les commandes |
| `/panel` | Affiche l'état du panel ICP en construction (6 sections) |
| `/save <id>` | Sauvegarde la session sous `tmp/icp-sessions/<id>.json` |
| `/cost` | Affiche le coût session + nombre de searches |
| `/quit` | Quitte (auto-save si `--save` fourni) |

## Architecture

```
lib/llm-core/
  agent/
    orchestrator.ts     # boucle principale streaming + tool use
    router.ts           # Haiku classifier → choisit Sonnet ou Opus
    tools-schema.ts     # définitions Anthropic des 8 tools
    snapshot.ts         # save/load JSON
  tools/
    search-web.ts       # Linkup primaire + Tavily fallback
  prompts/
    system.fr.ts        # system prompt 4k tokens (cacheable)
  cost.ts               # pricing par modèle + helpers
  types.ts              # AgentEvent, SessionState, etc.

scripts/icp-cli/
  smoke.ts              # smoke test 3 APIs
  test-search.ts        # test isolé search_web
  test-turn.ts          # 1 tour
  test-multi.ts         # 3 tours scriptés
  index.tsx             # REPL Ink interactif
```

## Modèles utilisés (routing automatique)

| Intent (Haiku classifier) | Modèle | Coût indicatif |
|---|---|---|
| `weak_claim` | Opus 4.8 | $5 / $25 / MTok |
| `ready_to_finalize` | Opus 4.8 | idem |
| `discovery` / `greeting` / `research_request` | Sonnet 4.6 | $3 / $15 / MTok |
| (routing classifier) | Haiku 4.5 | $1 / $5 / MTok |

## Coût session typique observé

- 3 tours scriptés HR Tech : ~$0.36 (3 searches Linkup)
- Estimation 12 tours complets : ~$0.80 - $2.00

## Out of scope Phase 1

- API route `/api/icp/chat` (vient en Phase 2)
- Brancher l'UI Zustand store aux events SSE (Phase 2)
- Synthèse finale du document (Phase 3)
- Déploiement + monitoring (Phase 4)
