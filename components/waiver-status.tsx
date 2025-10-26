import Link from "next/link";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface WaiverStatusProps {
  signed: boolean;
  signedAt?: string;
}

export function WaiverStatus({ signed, signedAt }: WaiverStatusProps) {
  return (
    <div className="card flex items-center gap-4 p-4 text-sm">
      {signed ? (
        <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
      ) : (
        <ExclamationCircleIcon className="h-6 w-6 text-amber-400" />
      )}
      <div>
        <p className="font-semibold text-white">
          {signed ? "Waiver completed" : "Waiver required"}
        </p>
        <p className="text-xs text-white/60">
          {signed ? `Signed on ${signedAt ? new Date(signedAt).toLocaleString() : "—"}` : "Sign to unlock check-in and scoring."}
        </p>
      </div>
      {!signed && (
        <Link
          href="/safety#waiver"
          className="ml-auto inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow"
        >
          Sign now
        </Link>
      )}
    </div>
  );
}
