"use client";

/**
 * Toast system pour l'outil ICP.
 * - <ToastHost /> à mount une seule fois (dans le layout).
 * - toast("msg") fonction module-level, callable depuis n'importe où.
 * - Auto-dismiss 3s, fadeout 300ms.
 */

import { useEffect, useState } from "react";
import { CheckIcon, InfoIcon, XIcon } from "./icons";

type ToastType = "success" | "error" | "info";

type ToastEntry = {
  id: number;
  msg: string;
  type: ToastType;
  out?: boolean;
};

type Listener = (entries: ToastEntry[]) => void;

const listeners = new Set<Listener>();
let stack: ToastEntry[] = [];
let nextId = 1;

function emit() {
  for (const l of listeners) l(stack);
}

export function toast(msg: string, type: ToastType = "success") {
  const id = nextId++;
  stack = [...stack, { id, msg, type }];
  emit();
  setTimeout(() => {
    stack = stack.map((t) => (t.id === id ? { ...t, out: true } : t));
    emit();
    setTimeout(() => {
      stack = stack.filter((t) => t.id !== id);
      emit();
    }, 320);
  }, 3000);
}

export function ToastHost() {
  const [entries, setEntries] = useState<ToastEntry[]>(stack);

  useEffect(() => {
    const l: Listener = (e) => setEntries([...e]);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  if (entries.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {entries.map((t) => (
        <div key={t.id} className={`toast toast--${t.type} ${t.out ? "out" : ""}`}>
          <span className="toast__ic">
            {t.type === "error" ? <XIcon /> : t.type === "info" ? <InfoIcon /> : <CheckIcon />}
          </span>
          <span className="toast__msg">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
