import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ThreadScope } from '@prisma/client';

function scopesForRole(role: string) {
  switch (role) {
    case 'ORGANIZER':
      return [ThreadScope.ALL, ThreadScope.ORGANIZERS];
    case 'FIGHTER':
      return [ThreadScope.ALL, ThreadScope.FIGHTERS];
    case 'JUDGE':
      return [ThreadScope.ALL, ThreadScope.JUDGES];
    default:
      return [ThreadScope.ALL];
  }
}

export default async function CommunityPage() {
  const session = await auth();
  const scopes = scopesForRole(session.user.role);
  const threads = await prisma.thread.findMany({
    where: { OR: scopes.map((scope) => ({ roleScope: scope })) },
    include: {
      author: true,
      posts: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Community hub</p>
          <h1 className="text-3xl font-semibold text-white">Forums &amp; Q&amp;A</h1>
          <p className="max-w-2xl text-sm text-white/60">
            Swap training tips, coordinate bout logistics, and help new members. Threads respect role visibility so organizers,
            fighters, and judges can focus on what matters.
          </p>
        </div>
        <Link
          href="/community/create"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow"
        >
          Start thread
        </Link>
      </header>
      <section className="space-y-4">
        {threads.length === 0 && (
          <p className="text-sm text-white/60">No discussions yet. Open a thread to welcome everyone in your scope.</p>
        )}
        {threads.map((thread) => (
          <article
            key={thread.id}
            className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:border-primary/40"
          >
            <header className="flex flex-wrap items-center justify-between gap-3">
              <Link href={`/community/${thread.id}`} className="text-xl font-semibold text-white">
                {thread.title}
              </Link>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/50">
                {thread.roleScope.toLowerCase()}
              </span>
            </header>
            <p className="mt-3 text-sm text-white/70">{thread.body}</p>
            <footer className="mt-4 flex flex-wrap items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-2">
                <span>By {thread.author?.name ?? 'Unknown'}</span>
                <span>•</span>
                <span>Updated {new Date(thread.updatedAt).toLocaleString()}</span>
              </div>
              <Link href={`/community/${thread.id}`} className="text-primary">
                View discussion ({thread.posts.length} replies)
              </Link>
            </footer>
          </article>
        ))}
      </section>
    </div>
  );
}
