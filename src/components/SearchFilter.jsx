import { ChevronDown, ChevronUp } from "lucide-react";
import { FILTER_TYPES } from "../utils/Constants.js";

function SearchFilter({
  filterStatus,
  onFilterChange,
  upcomingCount,
  pastCount,
  dropdownOpen,
  onDropdownChange,
}) {
  function handleFilterChange() {
    if (filterStatus === FILTER_TYPES[0].value) {
      // All -> Upcoming
      onFilterChange(FILTER_TYPES[1].value);
    } else if (filterStatus === FILTER_TYPES[1].value) {
      // Upcoming -> Past
      onFilterChange(FILTER_TYPES[2].value);
    } else {
      // Back to All
      onFilterChange(FILTER_TYPES[0].value);
    }
  }

  function getFilterButtonTitle() {
    if (filterStatus === FILTER_TYPES[0].value) {
      // All
      return FILTER_TYPES[0].label;
    } else if (filterStatus === FILTER_TYPES[1].value) {
      // Upcoming
      return `${FILTER_TYPES[1].label} (${upcomingCount})`;
    } else {
      // Pasr
      return `${FILTER_TYPES[2].label} (${pastCount})`;
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
