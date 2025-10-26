import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

const chatChannels = new Map<string, Set<WebSocket>>();
const typingPresence = new Map<string, Set<string>>();

type WebSocketPairCtor = new () => { 0: WebSocket; 1: WebSocket };

function getChannel(eventId: string) {
  if (!chatChannels.has(eventId)) {
    chatChannels.set(eventId, new Set());
  }
  return chatChannels.get(eventId)!;
}

function getTyping(eventId: string) {
  if (!typingPresence.has(eventId)) {
    typingPresence.set(eventId, new Set());
  }
  return typingPresence.get(eventId)!;
}

function broadcast(eventId: string, payload: any) {
  const channel = getChannel(eventId);
  for (const ws of channel) {
    try {
      ws.send(JSON.stringify(payload));
    } catch (error) {
      console.error('chat send failed', error);
    }
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } }
) {
  const messages = await prisma.eventChatMessage.findMany({
    where: { eventId: params.eventId },
    include: { sender: true },
    orderBy: { createdAt: 'asc' },
    take: 50,
  });
  return NextResponse.json({ messages });
}

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (![Role.ORGANIZER, Role.FIGHTER, Role.JUDGE].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const pairCtor = (globalThis as any).WebSocketPair as WebSocketPairCtor | undefined;
  if (!pairCtor) {
    return NextResponse.json({ error: 'WebSocket not supported in this runtime' }, { status: 501 });
  }
  const pair = new pairCtor();
  const client = pair[0];
  const server = pair[1];
  const channel = getChannel(params.eventId);
  const typing = getTyping(params.eventId);

  (server as any).accept?.();
  channel.add(server);

  server.addEventListener('message', async (event: MessageEvent) => {
    const raw = String(event.data ?? '');
    try {
      const payload = JSON.parse(raw);
      if (payload?.type === 'typing') {
        const userName = String(payload.user ?? '').trim();
        if (userName) {
          typing.add(userName);
          broadcast(params.eventId, { type: 'typing', users: Array.from(typing) });
          setTimeout(() => {
            typing.delete(userName);
            broadcast(params.eventId, { type: 'typing', users: Array.from(typing) });
          }, 2500);
        }
        return;
      }
    } catch {
      // fall through to treat as message text
    }

    const body = raw.slice(0, 500).trim();
    if (!body) return;
    const message = await prisma.eventChatMessage.create({
      data: {
        eventId: params.eventId,
        senderId: session.user.id,
        role: session.user.role,
        body,
      },
      include: { sender: true },
    });
    broadcast(params.eventId, { type: 'message', data: message });
  });

  server.addEventListener('close', () => {
    channel.delete(server);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  } as any);
}
