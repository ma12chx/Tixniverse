import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

const FILTER_OPTIONS = {
  ALL: 0,
  UPCOMING: 1,
  PAST: 2,
};

function SearchFilter({ onDropdownChange }) {
  const [filterStatus, setFilterStatus] = useState(FILTER_OPTIONS.ALL);

  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleFilterChange = () => {
    if (filterStatus === FILTER_OPTIONS.ALL) {
      setFilterStatus(FILTER_OPTIONS.UPCOMING);

      // Show upcoming tickets: TO-DO
    } else if (filterStatus === FILTER_OPTIONS.UPCOMING) {
      setFilterStatus(FILTER_OPTIONS.PAST);

      // Show past tickets: TO-DO
    } else {
      setFilterStatus(FILTER_OPTIONS.ALL);

      // Show all tickets: TO-DO
    }
  };

  const getFilterButtonTitle = () => {
    if (filterStatus === FILTER_OPTIONS.ALL) {
      return "All";
    } else if (filterStatus === FILTER_OPTIONS.UPCOMING) {
      return `Upcoming (${upcomingCount})`;
    } else {
      return `Past (${pastCount})`;
    }
  };

  const handleDropdownChange = () => {
    const newState = !dropdownOpen;

    setDropdownOpen(newState);
    onDropdownChange(newState);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* All, Upcoming, Past */}
      <div
        className="flex rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--line)" }}
      >
        <button
          onClick={handleFilterChange}
          className="px-3 py-1.5 text-sm font-medium"
          style={{
            background: "var(--ink)",
            color: "var(--paper)",
          }}
        >
          {getFilterButtonTitle()}
        </button>
      </div>

      {/* Category Dropdown */}
      <div
        className="flex rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--line)" }}
      >
        <button
          onClick={handleDropdownChange}
          className="px-3 py-2 text-sm font-medium"
          style={{
            background: "#fff",
            color: "var(--ink)",
          }}
        >
          {dropdownOpen ? (
            <ChevronUp size={16} style={{ color: "var(--muted)" }} />
          ) : (
            <ChevronDown size={16} style={{ color: "var(--muted)" }} />
          )}
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;
