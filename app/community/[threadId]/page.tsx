import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ThreadScope } from '@prisma/client';
import { ReplyForm } from './reply-form';

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

export default async function ThreadDetailPage({ params }: { params: { threadId: string } }) {
  const session = await auth();
  const scopes = scopesForRole(session.user.role);
  const thread = await prisma.thread.findUnique({
    where: { id: params.threadId },
    include: {
      author: true,
      posts: {
        orderBy: { createdAt: 'asc' },
        include: { author: true },
      },
    },
  });

  if (!thread) {
    return notFound();
  }
  if (!scopes.includes(thread.roleScope)) {
    return notFound();
  }

  const posts = thread.posts as Array<{
    id: string;
    body: string;
    createdAt: Date;
    author?: { name?: string | null } | null;
  }>;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Link href="/community" className="text-xs uppercase tracking-wide text-primary">
          ← Back to community
        </Link>
        <h1 className="text-3xl font-semibold text-white">{thread.title}</h1>
        <p className="text-sm text-white/60">By {thread.author?.name ?? 'Unknown'} • {new Date(thread.createdAt).toLocaleString()}</p>
      </header>
      <article className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] text-white/80">
        <p>{thread.body}</p>
      </article>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">Replies</h2>
        <div className="space-y-3">
          {posts.length === 0 && <p className="text-sm text-white/50">No replies yet. Start the conversation.</p>}
          {posts.map((post) => (
            <div key={post.id} className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/80">
              <header className="flex items-center justify-between text-xs text-white/40">
                <span>{post.author?.name ?? 'Member'}</span>
                <time>{new Date(post.createdAt).toLocaleString()}</time>
              </header>
              <p className="mt-3 whitespace-pre-line text-white/80">{post.body}</p>
            </div>
          ))}
        </div>
      </section>
      <ReplyForm threadId={thread.id} />
    </div>
  );
}
