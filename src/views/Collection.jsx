import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import SearchBox from "../components/SearchBox.jsx";
import SearchFilter from "../components/SearchFilter.jsx";
import EmptyCollection from "../components/EmptyCollection.jsx";
import TicketCard from "../components/TicketCard.jsx";

import { CATEGORY_OPTIONS } from "../utils/Constants.js";

const PAGE_SIZE = 5;

function Collection({
  tickets,
  IsTicketsLoaded,
  dropdownOpen,
  onDropdownChange,
  selectedCategoryId,
  onCategoryChange,
  onAddTicket,
  onOpenTicketDetails,
  filterStatus,
  onFilterChange,
  upcomingCount,
  pastCount,
  searchInput,
  onSearchChange,
  isSearchFiltering,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Track the ticket array that last rendered
  // If there's change such as category, status, or filter changed, ticket was added/edited
  // Reset to page 1
  const [prevTickets, setPrevTickets] = useState(tickets);

  if (tickets !== prevTickets) {
    setPrevTickets(tickets);
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(tickets.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedTickets = tickets.slice(startIndex, startIndex + PAGE_SIZE);

  function goToPage(page) {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth " });
  }

  return (
    <>
      {/* Search + Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 min-w-0">
            <SearchBox
              searchInput={searchInput}
              onSearchChange={onSearchChange}
            />
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
            {CATEGORY_OPTIONS.map(({ id, value, Icon }) => (
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
          <EmptyCollection
            isSearchFiltering={isSearchFiltering}
            onAddTicket={onAddTicket}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-5">
              {paginatedTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => onOpenTicketDetails(ticket)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    border: "1px solid var(--line)",
                    background: "#fff",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                <span
                  className="text-sm font-mono"
                  style={{ color: "var(--muted)" }}
                >
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    border: "1px solid var(--line)",
                    background: "#fff",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Collection;
