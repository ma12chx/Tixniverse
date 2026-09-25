import { X, MapPin, Pencil, Trash } from "lucide-react";

function TicketDetail({ ticketInfo, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${ticketInfo?.eventName} ticket details`}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-black/70 p-3 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "#fff" }}
        className="
          relative
          w-full
          max-w-md
          min-w-0
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]
        "
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Close ticket details"
          className="
            absolute
            right-3
            top-3
            z-10
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-black/10
            text-white
            transition-colors
            hover:bg-black/20
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-white/70
          "
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Cover */}
        <img
          src="https://atkmedia.allticket.com/images/up/26909/EXO_03052026_Info_SoldOut.jpg"
          alt={ticketInfo?.eventName || "Event cover"}
          className="
            block
            aspect-[16/9]
            w-full
            shrink-0
            object-cover
            sm:aspect-[16/9]
          "
        />

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
            {/* Event name + category */}
            <div className="flex items-start gap-2">
              <h3
                className="
                  min-w-0
                  flex-1
                  font-display
                  text-base
                  font-semibold
                  leading-tight
                  text-[#1B1B1B]
                  sm:text-lg
                "
              >
                {ticketInfo?.eventName}
              </h3>

              <span
                className="
                  mt-0.5
                  max-w-[35%]
                  shrink-0
                  truncate
                  select-none
                  rounded
                  border
                  border-[#1B1B1B]/40
                  px-1.5
                  py-0.5
                  font-mono
                  text-[10px]
                  tracking-wide
                  text-[#1B1B1B]/60
                "
              >
                {ticketInfo?.category}
              </span>
            </div>

            {/* Venue */}
            <p
              className="
                mt-3
                flex
                min-w-0
                items-center
                gap-1.5
                text-sm
                text-[#1B1B1B]/60
              "
            >
              <MapPin size={16} className="shrink-0" />

              <span className="min-w-0 text-[#1B1B1B]">
                {ticketInfo?.venue}
              </span>
            </p>

            {/* Date / Time */}
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 sm:mt-3">
              <div>
                <dt className="font-mono text-[12px] text-[#1B1B1B]/45">
                  Date
                </dt>

                <dd className="text-md text-[#1B1B1B]">{ticketInfo?.date}</dd>
              </div>

              <div>
                <dt className="font-mono text-[12px] text-[#1B1B1B]/45">
                  Time
                </dt>

                <dd className="text-base text-[#1B1B1B]">{ticketInfo?.time}</dd>
              </div>
            </dl>

            {/* Zone / Seat */}
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 sm:mt-3">
              <div>
                <dt className="font-mono text-[12px] text-[#1B1B1B]/45">
                  Zone
                </dt>

                <dd className="text-base text-[#1B1B1B]">{ticketInfo?.zone}</dd>
              </div>

              <div>
                <dt className="font-mono text-[12px] text-[#1B1B1B]/45">
                  Seat
                </dt>

                <dd className="text-base text-[#1B1B1B]">0506</dd>
              </div>
            </dl>

            {/* Note */}
            <dl className="mt-3 sm:mt-3">
              <div>
                <dt className="font-mono text-[12px] text-[#1B1B1B]/45">
                  Note
                </dt>

                <dd className="text-xs text-[#1B1B1B] xs:text-base">
                  Dress code: Black
                </dd>
              </div>
            </dl>
          </div>

          {/* Perforation */}
          <div className="relative" aria-hidden="true">
            <div className="border-t-2 border-dashed border-[#1B1B1B]/15" />

            <span
              style={{ backgroundColor: "#111827" }}
              className="absolute -left-3 -top-3 h-6 w-6 rounded-full"
            />

            <span
              style={{ backgroundColor: "#111827" }}
              className="absolute -right-3 -top-3 h-6 w-6 rounded-full"
            />
          </div>

          {/* Badge */}
          <div className="flex flex-col items-center gap-2 px-4 py-3 sm:px-6 sm:py-3">
            <span className="rounded-full bg-green-600 px-2 py-0.5 text-sm font-medium text-white">
              Attended
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-[#1B1B1B]/10 px-4 py-3 sm:px-6 sm:py-4">
          {/* Edit */}
          <button
            type="button"
            className="
            flex flex-1
            items-center
            justify-center
            gap-1.5
            rounded-xl
            border
            border-[#1B1B1B]/15
            px-3
            py-2.5
            text-sm
            font-medium
            text-[#1B1B1B]
            transition-colors
            hover:bg-[#1B1B1B]/5
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-offset-2
          "
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>

          {/* Delete */}
          <button
            type="button"
            className="
            flex flex-1
            items-center
            justify-center
            gap-1.5
            rounded-xl
            bg-rose-600
            px-3
            py-2.5
            text-sm
            font-medium
            text-white
            transition-colors
            hover:bg-rose-700
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-rose-600
          "
          >
            <Trash size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
