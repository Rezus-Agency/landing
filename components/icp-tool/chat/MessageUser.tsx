"use client";

interface Props {
  text: string;
  initials: string;
}

export function MessageUser({ text, initials }: Props) {
  return (
    <div className="msg msg--user">
      <span className="msg__av">{initials}</span>
      <div className="msg__body">{text}</div>
    </div>
  );
}
