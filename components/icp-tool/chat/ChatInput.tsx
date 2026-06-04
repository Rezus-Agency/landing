"use client";

import { useEffect, useRef } from "react";
import { MicIcon, SendIcon, StopRecIcon } from "@/components/icp-tool/ui/icons";
import { useVoiceInput } from "./useVoiceInput";
import { toast } from "@/components/icp-tool/ui/ToastProvider";

interface Props {
  value: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export function ChatInput({
  value,
  disabled,
  placeholder = "Répondez à l'outil…",
  onChange,
  onSubmit,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 150) + "px";
  }, [value]);

  const { supported, listening, recording, transcribing, start, stop } = useVoiceInput({
    onResult: (text) => {
      const sep = value && !value.endsWith(" ") ? " " : "";
      onChange((value + sep + text).slice(0, 4000));
      // Focus le textarea pour que l'utilisateur puisse éditer / envoyer
      taRef.current?.focus();
    },
    onError: (msg) => {
      toast(msg, "error");
    },
  });

  const canSend = value.trim().length > 0 && !disabled && !transcribing;

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  };

  const onMicClick = () => {
    if (transcribing) return;
    if (recording) stop();
    else void start();
  };

  const micTitle = !supported
    ? "Dictée non supportée par ce navigateur"
    : transcribing
      ? "Transcription en cours…"
      : recording
        ? "Cliquer pour terminer la dictée"
        : "Dicter votre réponse (gpt-4o-transcribe)";

  return (
    <div className={`chat-input__box ${listening ? "listening" : ""}`}>
      <textarea
        ref={taRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={transcribing ? "Transcription en cours…" : placeholder}
        disabled={disabled || transcribing}
        aria-label="Votre réponse"
      />
      <button
        type="button"
        className={`chat-mic ${recording ? "rec" : ""} ${transcribing ? "pending" : ""}`}
        onClick={onMicClick}
        disabled={!supported || disabled || transcribing}
        title={micTitle}
        aria-label={recording ? "Arrêter la dictée" : "Dicter"}
        aria-busy={transcribing}
      >
        {transcribing ? (
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              border: "2px solid currentColor",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
        ) : recording ? (
          <StopRecIcon />
        ) : (
          <MicIcon />
        )}
      </button>
      <button
        type="button"
        className="chat-send"
        onClick={onSubmit}
        disabled={!canSend}
        aria-label="Envoyer"
      >
        <SendIcon />
      </button>
    </div>
  );
}
