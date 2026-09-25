import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const DAY_LABEL = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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

function formatTimePretty(time) {
  if (!time) {
    return "";
  }

  const [hour, month] = time.split(":");
  let hh = parseInt(hour, 10);
  const ap = hh >= 12 ? "PM" : "AM";

  hh = hh % 12;

  if (hh === 0) {
    hh = 12;
  }

  return `${hh}:${month} ${ap}`;
}

function Calendar({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  tickets,
  onSelectEvent,
}) {
  const currentMonthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells = getMonthGrid(currentDate);
  const todayStr = getDateKey(new Date());

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
            className="text-center text-xs font-semibold font-mono py-1"
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
          const isToday = dateKey === todayStr;
          const isSelected = dateKey === selectedDate;

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(dateKey)}
              className="aspect-square rounded-lg flex items-center justify-center cursor-pointer"
              style={{
                background: isSelected ? "var(--ink)" : "#fff",
                border: isToday
                  ? "1.5px solid var(--red)"
                  : "1px solid var(--line)",
                color: isSelected ? "var(--paper)" : "var(--ink)",
              }}
            >
              <span className="text-sm">{date.getDate()}</span>
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
          {/* No events on this date - TODO */}
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No events on this date.
          </p>

          {/* Event list - TODO */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() =>
                onSelectEvent({
                  id: 1,
                  eventName: "EXO PLANET #6 - EXhOrizon in BANGKOK [DAY 2]",
                  venue: "Impact Arena",
                  date: "2026/05/17",
                  time: "16:00",
                  category: "Concert",
                  zone: "EXO-L1",
                  status: 1,
                })
              }
              className="flex items-center gap-3 rounded-lg p-2.5 text-left"
              style={{
                border: "1px solid var(--line)",
                background: "#fff",
              }}
            >
              <div
                className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--ink), #33406b)",
                }}
              >
                {/* TODO */}
                <img
                  src="https://atkmedia.allticket.com/images/up/26909/EXO_03052026_Info_SoldOut.jpg"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Ticket details */}
              <div className="flex-1 min-w-0">
                {/* Event name */}
                <p className="text-sm font-semibold truncate">
                  EXO PLANET #6 - EXhOrizon in BANGKOK [DAY 2]
                </p>

                {/* Event time */}
                <p className="flex items-center gap-1.5 mt-1 text-sm font-mono">
                  <Clock size={14} className="shrink-0" />
                  <span className="min-w-0">{formatTimePretty("16:00")}</span>
                </p>
              </div>

              {/* Event status (badge) */}
              <span className="rounded-full px-2 py-0.5 text-xs bg-green-600 text-white font-semibold flex-shrink-0">
                Attended
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
