"use client";

export function TypingIndicator() {
  return (
    <div className="msg msg--bot">
      <span className="msg__av">R</span>
      <div className="msg__body">
        <div className="typing" aria-label="L'outil rédige…">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
