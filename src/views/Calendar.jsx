import { ChevronLeft, ChevronRight, Clock, Ticket, Star } from "lucide-react";

const DAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_COLORS = {
  upcoming: "bg-sky-400",
  attended: "bg-green-600",
  missed: "bg-red-500",
};

function getMonthGrid(currentDate) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const startWeekDay = firstDay.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const cells = [];

  for (let index = 0; index < startWeekDay; index++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(currentYear, currentMonth, day));
  }

  return cells;
}

function getDateKey(date, timeZone = "Asia/Bangkok") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatDatePretty(dateStr) {
  if (!dateStr) {
    return "";
  }

  const date = new Date(dateStr + "T00:00:00");

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Calendar({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  ticketsByDate,
  onSelectEvent,
  eventTypes,
}) {
  const currentMonthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells = getMonthGrid(currentDate);
  const todayStr = getDateKey(new Date());
  const dayList = selectedDate ? ticketsByDate[selectedDate] || [] : [];

  const getEventTypeIcon = (eventTypeId) => {
    return (
      eventTypes.find((type) => type.id === Number(eventTypeId))?.Icon || Ticket
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        {/* Prev month button */}
        <button
          onClick={() =>
            setCurrentDate(
              (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1),
            )
          }
          className="p-2 rounded-lg"
          style={{ border: "1px solid var(--line)", background: "#fff" }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Month label */}
        <h2 className="font-display font-bold text-lg">{currentMonthLabel}</h2>

        {/* Next month button */}
        <button
          onClick={() =>
            setCurrentDate(
              (date) => new Date(date.getFullYear(), date.getMonth() + 1, 1),
            )
          }
          className="p-2 rounded-lg"
          style={{ border: "1px solid var(--line)", background: "#fff" }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1">
        {DAY_LABEL.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs font-semibold uppercase py-1"
            style={{ color: "var(--muted)" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((date, index) => {
          if (!date) return <div key={index} />;

          const dateKey = getDateKey(date);
          const eventDateMarker = ticketsByDate[dateKey] || [];
          const isToday = dateKey === todayStr;
          const isSelected = dateKey === selectedDate;

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(dateKey)}
              className="relative aspect-square rounded-lg flex items-center justify-center cursor-pointer"
              style={{
                background: isSelected ? "var(--ink)" : "#fff",
                border: isToday
                  ? "1.5px solid var(--purple)"
                  : "1px solid var(--line)",
                color: isSelected ? "var(--paper)" : "var(--ink)",
              }}
            >
              <span className="text-sm">{date.getDate()}</span>

              <div
                className="absolute flex justify-center gap-1"
                style={{ top: "calc(50% + 12px)" }}
              >
                {eventDateMarker.slice(0, 1).map((event, idx) => (
                  <span
                    key={idx}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--purple)" }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Event list of selected date */}
      {selectedDate && (
        <div className="mt-6">
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--muted)" }}
          >
            {formatDatePretty(selectedDate)}
          </p>

          {dayList.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No events on this date.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {dayList.map((ticket) => {
                const EventTypeIcon = getEventTypeIcon(ticket.eventTypeId);

                return (
                  <button
                    key={ticket.id}
                    onClick={() => onSelectEvent(ticket)}
                    className="flex items-center gap-3 rounded-lg p-2.5 text-left"
                    style={{
                      border: "1px solid var(--line)",
                      background: "#fff",
                    }}
                  >
                    {/* Cover or Event Type Icon */}
                    <div
                      className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--ink), #33406b)",
                        color: "#fff",
                      }}
                    >
                      {ticket.cover ? (
                        <img
                          src={ticket.cover}
                          alt={ticket.eventName || "Event Cover"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <EventTypeIcon size={20} />
                      )}
                    </div>

                    {/* Ticket Info */}
                    <div className="flex-1 min-w-0">
                      {/* Event Name */}
                      <p className="text-sm font-semibold truncate">
                        {ticket.eventName || "-"}
                      </p>

                      {/* Event Time */}
                      {ticket.eventTime && (
                        <p className="flex items-center gap-1.5 mt-1 text-sm">
                          <Clock size={14} className="shrink-0" />
                          <span>{ticket.eventTime || "-"}</span>
                        </p>
                      )}
                    </div>

                    {/* Event Status */}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize flex-shrink-0 text-white ${
                        STATUS_COLORS[ticket.status] || "bg-gray-500"
                      }`}
                    >
                      {ticket.status || "unknown"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendar;
