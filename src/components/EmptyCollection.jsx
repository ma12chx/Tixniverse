import { Ticket, Plus } from "lucide-react";

function EmptyCollection({ onAddTicket }) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">
      <Ticket size={38} style={{ color: "var(--muted)" }} />
      <h3 className="font-bold text-lg mt-4">Your collection is empty</h3>
      <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
        Add the first show, fan meet, or event you want to remember.
      </p>
      <button
        className="mt-5 flex items-center gap-1.5 rounded-full px-4 py-2 font-medium text-sm bg-[var(--purple)] hover:bg-indigo-600 text-white cursor-pointer transition-colors"
        onClick={onAddTicket}
      >
        <Plus size={16} /> Add your first ticket
      </button>
    </div>
  );
}

export default EmptyCollection;
