import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

const chatChannels = new Map<string, Set<WebSocket>>();

type WebSocketPairCtor = new () => { 0: WebSocket; 1: WebSocket };

function getChannel(eventId: string) {
  if (!chatChannels.has(eventId)) {
    chatChannels.set(eventId, new Set());
  }
  return chatChannels.get(eventId)!;
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

  server.accept();
  channel.add(server);

  server.addEventListener('message', async (event: MessageEvent) => {
    const body = String(event.data ?? '').slice(0, 500);
    if (!body.trim()) return;
    const message = await prisma.eventChatMessage.create({
      data: {
        eventId: params.eventId,
        senderId: session.user.id,
        role: session.user.role,
        body,
      },
      include: { sender: true },
    });
    const payload = JSON.stringify({ type: 'message', data: message });
    for (const ws of channel) {
      try {
        ws.send(payload);
      } catch (error) {
        console.error('chat send failed', error);
      }
    }
  });

  server.addEventListener('close', () => {
    channel.delete(server);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  } as any);
}
