"use client";

/**
 * Hook de saisie vocale propre.
 *
 * - getUserMedia → MediaRecorder webm/opus (mp4 sur Safari iOS)
 * - Au stop, POST le blob à /api/icp/transcribe (gpt-4o-transcribe côté serveur)
 * - Le texte retourné est passé à onResult
 *
 * États :
 *   idle         : pas d'enregistrement
 *   recording    : capture en cours, pulse animé
 *   transcribing : audio envoyé, attente de la réponse OpenAI
 *
 * On expose `listening` (recording || transcribing) pour conserver l'API du
 * précédent hook useSpeechRecognition et garder ChatInput simple.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  onResult: (text: string) => void;
  onError?: (msg: string) => void;
};

type State = "idle" | "recording" | "transcribing";

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

function pickMimeType(): string {
  if (typeof window === "undefined" || typeof window.MediaRecorder === "undefined") return "";
  for (const m of MIME_CANDIDATES) {
    if (window.MediaRecorder.isTypeSupported(m)) return m;
  }
  return "";
}

export function useVoiceInput({ onResult, onError }: Options) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<State>("idle");
  const stateRef = useRef<State>("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cancelledRef = useRef(false);
  const mimeRef = useRef<string>("audio/webm");

  // Sync state ref pour les closures async
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Detect capability au mount
  useEffect(() => {
    const hasGUM =
      typeof navigator !== "undefined" &&
      typeof navigator.mediaDevices !== "undefined" &&
      typeof navigator.mediaDevices.getUserMedia === "function";
    const hasRecorder =
      typeof window !== "undefined" && typeof window.MediaRecorder !== "undefined";
    setSupported(hasGUM && hasRecorder);
  }, []);

  const cleanup = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      for (const t of stream.getTracks()) t.stop();
    }
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const sendToServer = useCallback(
    async (blob: Blob) => {
      const fd = new FormData();
      const ext =
        mimeRef.current.includes("mp4") || mimeRef.current.includes("m4a")
          ? "mp4"
          : mimeRef.current.includes("ogg")
            ? "ogg"
            : "webm";
      fd.append("file", blob, `voice.${ext}`);

      const res = await fetch("/api/icp/transcribe", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = (await res.json()) as { error?: string };
          if (j.error) msg = j.error;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const data = (await res.json()) as { text?: string };
      return (data.text || "").trim();
    },
    [],
  );

  const start = useCallback(async () => {
    if (stateRef.current !== "idle") return;
    cancelledRef.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const mime = pickMimeType();
      mimeRef.current = mime || "audio/webm";

      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeRef.current });
        cleanup();

        if (cancelledRef.current) {
          setState("idle");
          return;
        }

        if (blob.size < 800) {
          // Clip vide / trop court (< ~50ms d'audio Opus)
          onError?.("Enregistrement trop court, recommence.");
          setState("idle");
          return;
        }

        setState("transcribing");
        try {
          const text = await sendToServer(blob);
          if (text) onResult(text);
          else onError?.("Aucun texte détecté dans l'audio.");
        } catch (err) {
          onError?.((err as Error).message || "Erreur de transcription.");
        } finally {
          setState("idle");
        }
      };

      // Frequent timeslices pour ne pas perdre l'audio si la tab perd le focus
      rec.start(250);
      recorderRef.current = rec;
      setState("recording");
    } catch (err) {
      cleanup();
      setState("idle");
      const msg = (err as Error).message || String(err);
      if (msg.includes("NotAllowedError") || msg.includes("Permission")) {
        onError?.("Microphone refusé. Autorise l'accès dans le navigateur.");
      } else if (msg.includes("NotFoundError")) {
        onError?.("Aucun micro détecté.");
      } else {
        onError?.(msg);
      }
    }
  }, [cleanup, onError, onResult, sendToServer]);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop();
    }
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    else {
      cleanup();
      setState("idle");
    }
  }, [cleanup]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") {
        try {
          rec.stop();
        } catch {
          // ignore
        }
      }
      const stream = streamRef.current;
      if (stream) for (const t of stream.getTracks()) t.stop();
    };
  }, []);

  return {
    supported,
    listening: state !== "idle",
    recording: state === "recording",
    transcribing: state === "transcribing",
    start,
    stop,
    cancel,
  };
}
