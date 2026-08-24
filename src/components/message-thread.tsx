"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { sendMessage } from "@/lib/actions/musician";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Msg = {
  id: string;
  senderRole: string;
  body: string;
  createdAt: Date | string;
};

export function MessageThread({
  bookingId,
  initialMessages,
  viewerRole,
}: {
  bookingId: string;
  initialMessages: Msg[];
  viewerRole: "musician" | "client";
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  function handleSend() {
    if (!text.trim()) return;
    const body = text;
    setText("");
    startTransition(async () => {
      await sendMessage(bookingId, body);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), senderRole: viewerRole, body, createdAt: new Date() },
      ]);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-96 flex-col gap-3 overflow-y-auto rounded-2xl border border-line bg-cream-soft p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
              m.senderRole === viewerRole
                ? "self-end bg-ink text-cream"
                : "self-start bg-paper text-ink border border-line"
            )}
          >
            <p>{m.body}</p>
            <p className="mt-1 text-[10px] opacity-60">{formatDate(m.createdAt)}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe un mensaje…"
          className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm outline-none focus:border-coral"
        />
        <button
          onClick={handleSend}
          disabled={pending || !text.trim()}
          className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark disabled:opacity-60"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
