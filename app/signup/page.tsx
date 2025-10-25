import Link from "next/link";

const weightClasses = ["Flyweight", "Bantamweight", "Featherweight", "Lightweight", "Welterweight", "Middleweight", "Light Heavyweight", "Heavyweight"];
const rulesets = ["MMA", "Kickboxing", "Boxing", "Grappling"];

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">Join MMA Friends League</h1>
        <p className="text-sm text-white/60">
          Build your fighter profile, share availability, and sign digital waivers faster than you can tape your hands.
        </p>
      </header>
      <form className="card space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-xs uppercase text-white/40">Full name</span>
            <input className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" placeholder="Kai Rivera" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-xs uppercase text-white/40">Email</span>
            <input type="email" className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" placeholder="you@example.com" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-xs uppercase text-white/40">Phone</span>
            <input className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" placeholder="(555) 012-3456" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-xs uppercase text-white/40">Role</span>
            <select className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2">
              <option>Fighter</option>
              <option>Organizer</option>
              <option>Judge</option>
              <option>Spectator</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-xs uppercase text-white/40">Weight class</span>
            <select className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2">
              {weightClasses.map((weight) => (
                <option key={weight}>{weight}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-xs uppercase text-white/40">Preferred ruleset</span>
            <select className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2">
              {rulesets.map((ruleset) => (
                <option key={ruleset}>{ruleset}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase text-white/40">Medical notes (private)</span>
          <textarea className="min-h-[120px] w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" placeholder="Disclose recent injuries, surgeries, or concerns for organizer review." />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-xs uppercase text-white/40">Emergency contact (private)</span>
          <input className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" placeholder="Ava Rivera • (555) 201-0100" />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
          <p>
            By joining you agree to the <Link href="#" className="text-primary">community code</Link> and safety guidelines.
          </p>
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow">
            Continue
          </button>
        </div>
      </form>
      <div className="text-center text-xs text-white/50">
        Prefer single sign-on?
        <div className="mt-3 flex justify-center gap-3 text-sm">
          <button className="rounded-full border border-white/20 px-4 py-2 text-white/70">Continue with Google</button>
          <button className="rounded-full border border-white/20 px-4 py-2 text-white/70">Continue with Apple</button>
        </div>
      </div>
    </div>
  );
}
