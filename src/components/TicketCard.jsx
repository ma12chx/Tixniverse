import { MapPin, Music2 } from "lucide-react";

function TicketCard({ onClick }) {
  return (
    <button
      style={{ backgroundColor: "#fff" }}
      className={[
        "group relative flex w-full flex-col text-left",
        "rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
        "lg:flex-row",
      ].join(" ")}
      onClick={onClick}
    >
      {/* Main ticket */}
      <div className="flex flex-1 gap-4 p-5 lg:gap-5 lg:p-6">
        {/* Ticket image */}
        {/* <div
          className="
            flex h-20 w-20 shrink-0
            items-center justify-center
            rounded-xl
            bg-blue-900
            text-xl text-white/90
            lg:h-24 lg:w-24
          "
          aria-hidden="true"
        >
          <Music2 size={24} className="shrink-0" />
        </div> */}
        <img
          src="https://atkmedia.allticket.com/images/up/26909/EXO_03052026_Info_SoldOut.jpg"
          className="h-20 w-20 shrink-0 rounded-xl lg:h-24 lg:w-24"
        />

        {/* Ticket information */}
        <div className="min-w-0 flex-1">
          {/* Title + Category */}
          <div className="flex items-start justify-between gap-2 lg:gap-3">
            <h3
              className="
                min-w-0
                truncate
                text-lg font-semibold leading-tight
                lg:text-2xl
              "
            >
              EXO PLANET #6 - EXhOrizon in BANGKOK [DAY 2]
            </h3>

            <span
              className="
                mt-1 shrink-0
                select-none
                rounded
                border border-[#1B1B1B]/40
                px-1.5 py-0.5
                font-mono text-[10px]
                tracking-wide
                text-[#1B1B1B]/60
              "
            >
              Concert
            </span>
          </div>

          {/* Venue */}
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-[#1B1B1B]/60">
            <MapPin size={16} className="shrink-0" />
            <span className="truncate uppercase">Impact Arena</span>
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {/* Date */}
            <div>
              <dt className="font-mono text-[12px] text-[#1B1B1B]/45">Date</dt>
              <dd className="text-sm text-[#1B1B1B]">2026/05/17</dd>
            </div>

            {/* Time */}
            <div>
              <dt className="font-mono text-[12px] text-[#1B1B1B]/45">Time</dt>
              <dd className="text-sm text-[#1B1B1B]">16:00</dd>
            </div>

            {/* Zone */}
            <div>
              <dt className="font-mono text-[12px] text-[#1B1B1B]/45">Zone</dt>
              <dd className="text-sm text-[#1B1B1B]">EXO-L1</dd>
            </div>

            {/* Seat */}
            <div>
              <dt className="font-mono text-[12px] text-[#1B1B1B]/45">Seat</dt>
              <dd className="text-sm text-[#1B1B1B]">0506</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Perforation */}
      <div className="relative hidden w-0 lg:block" aria-hidden="true">
        <div className="absolute inset-y-3 left-0 border-l-2 border-dashed border-[#1B1B1B]/15" />

        <span
          style={{ backgroundColor: "var(--paper)" }}
          className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full"
        />

        <span
          style={{ backgroundColor: "var(--paper)" }}
          className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full"
        />
      </div>

      {/* Mobile / tablet perforation */}
      <div className="relative block h-0 w-full lg:hidden" aria-hidden="true">
        <div className="absolute inset-x-3 top-0 border-t-2 border-dashed border-[#1B1B1B]/15" />

        <span
          style={{ backgroundColor: "var(--paper)" }}
          className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
        />

        <span
          style={{ backgroundColor: "var(--paper)" }}
          className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
        />
      </div>

      {/* Admit slip */}
      <div
        className="
          flex shrink-0
          flex-row items-center justify-between
          gap-3
          px-5 py-3

          lg:w-28
          lg:flex-col
          lg:justify-center
          lg:gap-2
          lg:px-4
          lg:py-6
        "
      >
        <span className="font-display text-xs font-semibold tracking-wide text-[#1B1B1B]/60">
          ZONE
        </span>

        <div className="flex items-center gap-3 lg:flex-col lg:gap-2">
          <span className="font-display text-lg font-bold tracking-wide text-rose-700">
            EXO-L1
          </span>

          <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
            Attended
          </span>
        </div>
      </div>
    </button>
  );
}

export default TicketCard;
