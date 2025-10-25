"use client";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface ChatThreadProps {
  title: string;
  participants: string[];
  messages: { id: string; sender: string; body: string; createdAt: string }[];
  placeholder?: string;
}

export function ChatThread({ title, participants, messages, placeholder }: ChatThreadProps) {
  const [input, setInput] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;
    // In the production app this would send via websocket/notifications.
    alert(`Message queued: ${input}`);
    setInput("");
  }

  return (
    <section className="card flex h-full flex-col overflow-hidden">
      <header className="border-b border-white/5 px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">{title}</h2>
        <p className="text-xs text-white/50">{participants.join(" • ")}</p>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm text-white/70">
        {messages.map((message) => (
          <article key={message.id} className="space-y-1">
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="font-semibold text-white/70">{message.sender}</span>
              <time>{new Date(message.createdAt).toLocaleTimeString()}</time>
            </div>
            <p className="rounded-2xl bg-white/5 px-4 py-2 text-white/80 shadow-inner">{message.body}</p>
          </article>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-white/5 p-4">
        <label className="flex items-center gap-3 rounded-full border border-white/10 bg-surface-muted px-4 py-2 text-sm text-white/70">
          <span className="sr-only">Message</span>
          <input
            className="flex-1 bg-transparent focus:outline-none"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={placeholder ?? "Share updates"}
          />
          <button type="submit" className="rounded-full bg-primary/90 p-2 text-primary-foreground">
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </label>
      </form>
    </section>
  );
}
