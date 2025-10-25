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
    </div>
  );
}
