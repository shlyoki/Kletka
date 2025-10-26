export default function MediaPage() {
  return (
    <div className="flex h-[60vh] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 text-center">
      <div className="space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/40">
          <span className="text-2xl">📸</span>
        </div>
        <h2 className="text-xl font-semibold text-white">No media yet</h2>
        <p className="text-sm text-white/50">Photos and videos from events will appear here once uploads are approved.</p>
      </div>
    </div>
  );
}
