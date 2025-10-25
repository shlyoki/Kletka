import { notFound } from "next/navigation";
import { users } from "@/lib/data";
import { ProfileCard } from "@/components/profile-card";

interface ProfilePageProps {
  params: { id: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const user = users.find((entry) => entry.id === params.id);
  if (!user) return notFound();

  return (
    <div className="space-y-8">
      <ProfileCard user={user} />
    </div>
  );
}
