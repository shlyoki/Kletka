import { FighterCard } from '@/components/fighter-card';
import { users } from '@/lib/data';

export default function FightersPage() {
  const fighters = users.filter((user) => user.role === 'fighter');

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Fighters</h1>
        <p className="muted-subtitle max-w-2xl">
          Browse the league roster by weight class and experience level. Tap a profile to dive into bio, analytics, and finish
          trends curated for matchmaking safety.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {fighters.map((fighter) => (
          <FighterCard key={fighter.id} fighter={fighter} />
        ))}
      </section>
    </div>
  );
}
