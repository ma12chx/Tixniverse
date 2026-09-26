import SearchBox from "../components/SearchBox.jsx";
import SearchFilter from "../components/SearchFilter.jsx";
import EmptyCollection from "../components/EmptyCollection.jsx";
import TicketCard from "../components/TicketCard.jsx";

function Collection({
  dropdownOpen,
  onDropdownChange,
  categoryOptions,
  selectedCategory,
  onCategoryChange,
  onAddTicket,
  onOpenTicketDetails,
}) {
  return (
    <>
      {/* Search + Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 min-w-0">
            <SearchBox />
          </div>

          <SearchFilter onDropdownChange={onDropdownChange} />
        </div>
      </div>

      {/* Category buttons */}
      {dropdownOpen && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex flex-nowrap gap-2 overflow-x-auto justify-start sm:justify-center pb-2 scrollbar-hide">
            {categoryOptions.map(({ value, Icon }) => (
              <button
                key={value}
                onClick={() => onCategoryChange(value)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                style={{
                  background:
                    selectedCategory === value ? "var(--ink)" : "#fff",
                  color:
                    selectedCategory === value ? "var(--paper)" : "var(--ink)",
                  border: "1px solid var(--line)",
                }}
              >
                <Icon size={14} />
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <EmptyCollection onAddTicket={onAddTicket} />

        <TicketCard
          onClick={() =>
            onOpenTicketDetails({
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
        />
      </div>
    </>
  );
}

export default Collection;
