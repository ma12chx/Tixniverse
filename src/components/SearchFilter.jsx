import { ChevronDown, ChevronUp } from "lucide-react";

const FILTER_OPTIONS = {
  ALL: 0,
  UPCOMING: 1,
  PAST: 2,
};

function SearchFilter({
  filterStatus,
  onFilterChange,
  upcomingCount,
  pastCount,
  dropdownOpen,
  onDropdownChange,
}) {
  function handleFilterChange() {
    if (filterStatus === FILTER_OPTIONS.ALL) {
      onFilterChange(FILTER_OPTIONS.UPCOMING);
    } else if (filterStatus === FILTER_OPTIONS.UPCOMING) {
      onFilterChange(FILTER_OPTIONS.PAST);
    } else {
      onFilterChange(FILTER_OPTIONS.ALL);
    }
  }

  function getFilterButtonTitle() {
    if (filterStatus === FILTER_OPTIONS.ALL) {
      return "All";
    } else if (filterStatus === FILTER_OPTIONS.UPCOMING) {
      return `Upcoming (${upcomingCount})`;
    } else {
      return `Past (${pastCount})`;
    }
  }

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
          onClick={() => onDropdownChange(!dropdownOpen)}
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
