/**
 * Save/load session snapshots pour debug + régression.
 * Format JSON simple, stocké dans tmp/icp-sessions/<id>.json
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SessionState } from "../types";

const SNAPSHOT_DIR = join(process.cwd(), "tmp", "icp-sessions");

function ensureDir() {
  mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

export function snapshotPath(id: string): string {
  return join(SNAPSHOT_DIR, `${id}.json`);
}

export function saveSnapshot(state: SessionState, label?: string): string {
  ensureDir();
  const id = label || state.id;
  const path = snapshotPath(id);
  writeFileSync(path, JSON.stringify(state, null, 2), "utf-8");
  return path;
}

export function loadSnapshot(id: string): SessionState {
  const path = snapshotPath(id);
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw) as SessionState;
}
