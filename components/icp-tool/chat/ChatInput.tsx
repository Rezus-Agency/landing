"use client";

import { useEffect, useRef } from "react";
import { MicIcon, SendIcon, StopRecIcon } from "@/components/icp-tool/ui/icons";
import { useSpeechRecognition } from "./useSpeechRecognition";

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

  const { supported, listening, start, stop } = useSpeechRecognition({
    onResult: (text) => {
      const sep = value && !value.endsWith(" ") ? " " : "";
      onChange((value + sep + text).slice(0, 4000));
    },
  });

  const canSend = value.trim().length > 0 && !disabled;

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  };

  return (
    <div className={`chat-input__box ${listening ? "listening" : ""}`}>
      <textarea
        ref={taRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Votre réponse"
      />
      <button
        type="button"
        className={`chat-mic ${listening ? "rec" : ""}`}
        onClick={() => (listening ? stop() : start())}
        disabled={!supported || disabled}
        title={
          supported
            ? listening
              ? "Arrêter la dictée"
              : "Dicter votre réponse"
            : "Dictée non supportée par votre navigateur"
        }
        aria-label={listening ? "Arrêter la dictée" : "Dicter"}
      >
        {listening ? <StopRecIcon /> : <MicIcon />}
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
