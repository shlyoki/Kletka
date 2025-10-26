'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Role } from '@prisma/client';
import { useToast } from './toast-provider';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface EventChatProps {
  eventId: string;
  currentUser?: { id: string; name: string; role: Role } | null;
}

type ChatMessage = {
  id: string;
  senderId: string;
  role: Role;
  body: string;
  createdAt: string;
  sender?: { name?: string | null };
};

export function EventChat({ eventId, currentUser }: EventChatProps) {
  const { push } = useToast();
  const { data, mutate } = useSWR<{ messages: ChatMessage[] }>(`/api/events/${eventId}/chat`, fetcher, {
    refreshInterval: 30000,
  });
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const socketRef = useRef<WebSocket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('WebSocket' in window)) {
      return;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}/api/events/${eventId}/chat`);
    socketRef.current = socket;

    socket.addEventListener('message', (event) => {
      try {
        const payload = JSON.parse(String(event.data ?? '{}'));
        if (payload.type === 'message') {
          mutate((current) => {
            const existing = current?.messages ?? [];
            return { messages: [...existing, payload.data] };
          });
          listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
        }
        if (payload.type === 'typing') {
          setTypingUsers(new Set(payload.users ?? []));
        }
      } catch (error) {
        console.error('chat payload error', error);
      }
    });

    socket.addEventListener('close', () => {
      socketRef.current = null;
    });

    return () => {
      socket.close();
    };
  }, [eventId, mutate]);

  const messages = useMemo(() => data?.messages ?? [], [data]);

  useEffect(() => {
    if (messages.length === 0) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  const canPost = currentUser && [Role.ORGANIZER, Role.FIGHTER, Role.JUDGE].includes(currentUser.role);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    socketRef.current.send(trimmed.slice(0, 500));
    setInput('');
  };

  const broadcastTyping = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(
      JSON.stringify({ type: 'typing', user: currentUser?.name ?? 'Guest' }),
    );
  };

  return (
    <section className="card flex h-[420px] flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-xs uppercase tracking-wide text-white/60">
        <div>
          <p className="font-semibold text-white/80">Event war room</p>
          <p className="text-[11px] text-white/40">Coaches, judges, and organizers coordinate in real time.</p>
        </div>
        {typingUsers.size > 0 && (
          <p className="text-[11px] text-primary">{Array.from(typingUsers).join(', ')} typing…</p>
        )}
      </header>
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm text-white/80">
        {messages.length === 0 && <p className="text-sm text-white/50">No chatter yet—break the ice with an update.</p>}
        {messages.map((message) => (
          <article key={message.id} className="space-y-1">
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="font-semibold text-white/70">{message.sender?.name ?? 'Participant'}</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/40">
                {message.role.toLowerCase()}
              </span>
              <time>{new Date(message.createdAt).toLocaleTimeString()}</time>
            </div>
            <p className="rounded-2xl bg-white/5 px-4 py-2 text-white/80 shadow-inner">{message.body}</p>
          </article>
        ))}
      </div>
      <form
        className="border-t border-white/10 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canPost) {
            push({ title: 'Read only', description: 'Join as a fighter, judge, or organizer to message in chat.' });
            return;
          }
          sendMessage();
        }}
      >
        <label className="flex items-center gap-3 rounded-full border border-white/10 bg-surface-muted px-4 py-2 text-sm text-white/70">
          <span className="sr-only">Message</span>
          <input
            className="flex-1 bg-transparent focus:outline-none"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              broadcastTyping();
            }}
            placeholder={canPost ? 'Share a quick update for your team…' : 'Chat available to rostered participants'}
            disabled={!canPost}
          />
          <button type="submit" className="rounded-full bg-primary/90 p-2 text-primary-foreground" disabled={!canPost}>
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </label>
      </form>
    </section>
  );
}
