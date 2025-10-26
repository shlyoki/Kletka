<<<<<<< HEAD
export default function MessagesPage() {
  return (
    <div className="flex h-[60vh] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 text-center">
      <div className="space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/40">
          <span className="text-2xl">💬</span>
        </div>
        <h2 className="text-xl font-semibold text-white">Messages coming soon</h2>
        <p className="text-sm text-white/50">Chat with other fighters and organizers. For now, use event-specific chat in event details.</p>
      </div>
=======
import { ChatThread } from "@/components/chat-thread";

export default function MessagesPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <ChatThread
        title="Warehouse Warriors 5"
        participants={["Organizer", "Judges", "Timekeeper"]}
        messages={[
          { id: "1", sender: "Organizer", body: "Doors open at 6:30p. QR check-in is live.", createdAt: "2024-03-18T14:00:00Z" },
          { id: "2", sender: "Judge Marcus", body: "Copy that. Bringing printed scorecards as backup.", createdAt: "2024-03-18T14:02:00Z" },
          { id: "3", sender: "Timekeeper", body: "Round clock synced and ready for live text updates.", createdAt: "2024-03-18T14:04:00Z" }
        ]}
      />
      <ChatThread
        title="Bout: Kai vs Lena"
        participants={["Kai", "Lena", "Organizer"]}
        messages={[
          { id: "4", sender: "Kai", body: "Checked weight 154. Hydration on point.", createdAt: "2024-03-18T13:30:00Z" },
          { id: "5", sender: "Organizer", body: "Approved. Remember to sign the waiver before check-in.", createdAt: "2024-03-18T13:40:00Z" }
        ]}
      />
>>>>>>> origin/main
    </div>
  );
}
