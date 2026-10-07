import { Galaxy, LayoutGrid, CalendarDays, Plus, LogOut } from "lucide-react";

const VIEW = {
  COLLECTION: "collection",
  CALENDAR: "calendar",
};

function NavBar({ view, onViewChange, onAddTicket, onSignOut }) {
  return (
    <header className="sticky top-0 z-20" style={{ background: "var(--ink)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Galaxy size={24} style={{ color: "var(--green)" }} />
          <h3
            className="text-lg sm:text-xl font-pixel"
            style={{ color: "var(--paper)" }}
          >
            Ti<span style={{ color: "var(--green)" }}>x</span>niverse
          </h3>
        </div>

        <div
          className="flex items-center gap-1 rounded-full p-1"
          style={{ background: "rgba(244,237,224,0.12)" }}
        >
          <button
            onClick={() => onViewChange(VIEW.COLLECTION)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
            style={{
              background:
                view === VIEW.COLLECTION ? "var(--paper)" : "transparent",
              color: view === VIEW.COLLECTION ? "var(--ink)" : "var(--paper)",
            }}
          >
            <LayoutGrid size={14} />
            <span className="hidden sm:inline">Collection</span>
          </button>
          <button
            onClick={() => onViewChange(VIEW.CALENDAR)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
            style={{
              background:
                view === VIEW.CALENDAR ? "var(--paper)" : "transparent",
              color: view === VIEW.CALENDAR ? "var(--ink)" : "var(--paper)",
            }}
          >
            <CalendarDays size={14} />
            <span className="hidden sm:inline">Calendar</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Add Ticket button */}
          <button
            onClick={onAddTicket}
            className="flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-2 font-medium bg-[var(--purple)] hover:bg-indigo-600 text-sm text-white"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add ticket</span>
          </button>

          {/* Sign Out button */}
          <button
            onClick={onSignOut}
            className="p-2 rounded-full cursor-pointer text-white"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
