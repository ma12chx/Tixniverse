import SearchBox from "../components/SearchBox.jsx";
import SearchFilter from "../components/SearchFilter.jsx";
import EmptyCollection from "../components/EmptyCollection.jsx";
import TicketCard from "../components/TicketCard.jsx";

function Collection({
  tickets,
  IsTicketsLoaded,
  dropdownOpen,
  onDropdownChange,
  categoryOptions,
  eventTypes,
  selectedCategoryId,
  onCategoryChange,
  onAddTicket,
  onOpenTicketDetails,
  filterStatus,
  onFilterChange,
  upcomingCount,
  pastCount,
}) {
  return (
    <>
      {/* Search + Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 min-w-0">
            <SearchBox />
          </div>

          <SearchFilter
            filterStatus={filterStatus}
            onFilterChange={onFilterChange}
            upcomingCount={upcomingCount}
            pastCount={pastCount}
            dropdownOpen={dropdownOpen}
            onDropdownChange={onDropdownChange}
          />
        </div>
      </div>

      {/* Category buttons */}
      {dropdownOpen && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex flex-nowrap gap-2 overflow-x-auto justify-start sm:justify-center pb-2 scrollbar-hide">
            {categoryOptions.map(({ id, value, Icon }) => (
              <button
                key={id}
                onClick={() => onCategoryChange(id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                style={{
                  background: selectedCategoryId === id ? "var(--ink)" : "#fff",
                  color:
                    selectedCategoryId === id ? "var(--paper)" : "var(--ink)",
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {!IsTicketsLoaded ? (
          <p
            className="text-sm text-center py-20"
            style={{ color: "var(--muted)" }}
          >
            Loading your collection…
          </p>
        ) : tickets.length === 0 ? (
          <EmptyCollection onAddTicket={onAddTicket} />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-5">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                eventTypes={eventTypes}
                ticket={ticket}
                onClick={() => onOpenTicketDetails(ticket)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Collection;
