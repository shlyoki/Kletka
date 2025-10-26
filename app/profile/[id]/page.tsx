import { notFound } from "next/navigation";
<<<<<<< HEAD
import { users } from "@/lib/data";
=======
import { media, users } from "@/lib/data";
>>>>>>> origin/main
import { ProfileCard } from "@/components/profile-card";

interface ProfilePageProps {
  params: { id: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const user = users.find((entry) => entry.id === params.id);
  if (!user) return notFound();

<<<<<<< HEAD
  return (
    <div className="space-y-8">
      <ProfileCard user={user} />
=======
  const spotlightMedia = media.filter((item) => item.uploaderId === user.id || item.boutId === user.id);

  return (
    <div className="space-y-8">
      <ProfileCard user={user} />
      <section className="card space-y-4 p-6">
        <header>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Highlights</h2>
          <p className="text-xs text-white/50">Only friends and organizers can view medical notes and emergency contacts.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {spotlightMedia.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10">
              <div className="aspect-video bg-surface-muted/80">
                <span className="flex h-full items-center justify-center text-xs uppercase tracking-wide text-white/30">
                  {item.type === "photo" ? "Photo placeholder" : "Video placeholder"}
                </span>
              </div>
              <div className="space-y-1 p-4 text-sm text-white/70">
                <p className="font-semibold text-white">{item.caption}</p>
                <p className="text-xs text-white/40">Tags: {item.tags.join(", ")}</p>
              </div>
            </article>
          ))}
          {spotlightMedia.length === 0 && <p className="text-sm text-white/60">No media yet. Upload post-event highlights to share with friends.</p>}
        </div>
      </section>
>>>>>>> origin/main
    </div>
  );
}
