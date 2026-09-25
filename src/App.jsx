import { useState } from "react";

import NavBar from "./components/NavBar.jsx";
import SearchBox from "./components/SearchBox.jsx";
import SearchFilter from "./components/SearchFilter.jsx";
import EmptyCollection from "./components/EmptyCollection.jsx";
import TicketCard from "./components/TicketCard.jsx";
import TicketManagement from "./components/TicketManagement.jsx";
import TicketDetail from "./components/TicketDetail.jsx";

const VIEW = {
  COLLECTION: "collection",
  CALENDAR: "calendar",
};

const CATEGORY_OPTIONS = [
  "All",
  "Concert",
  "Fan Meeting",
  "Live",
  "Online Streaming",
  "Festival",
  "Sports",
  "Other",
];

const EDIT_MODE = {
  ADD: 0,
  EDIT: 1,
};

function App() {
  const [view, setView] = useState(VIEW.COLLECTION);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0]);

  // Add / Edit ticket popup
  const [ticketPopup, setTicketPopup] = useState({
    isOpen: false,
    mode: EDIT_MODE.ADD,
    ticket: null,
  });

  // Ticket detail popup
  const [ticketDetail, setTicketDetail] = useState(null);

  // --------------------------------------------------
  // View
  // --------------------------------------------------

  const handleViewChange = (newView) => {
    setView(newView);

    // Close category dropdown when switching views
    setDropdownOpen(false);
  };

  // --------------------------------------------------
  // Category
  // --------------------------------------------------

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    // Filter tickets by category: TO-DO
  };

  // --------------------------------------------------
  // Add / Edit ticket
  // --------------------------------------------------

  const handleAddTicket = () => {
    setTicketPopup({
      isOpen: true,
      mode: EDIT_MODE.ADD,
      ticket: null,
    });
  };

  const handleCloseTicket = () => {
    setTicketPopup({
      isOpen: false,
      mode: EDIT_MODE.ADD,
      ticket: null,
    });
  };

  // --------------------------------------------------
  // Ticket details
  // --------------------------------------------------

  const handleOpenTicketDetails = (ticket) => {
    setTicketDetail(ticket);
  };

  const handleCloseTicketDetails = () => {
    setTicketDetail(null);
  };

  return (
    <div className="tixniverse-app min-h-screen w-full">
      {/* Navigation bar */}
      <NavBar
        view={view}
        onViewChange={handleViewChange}
        onAddTicket={handleAddTicket}
      />

      {/* Collection */}
      {view === VIEW.COLLECTION && (
        <>
          {/* Search + Filter */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
            <div className="flex items-center gap-2 w-full">
              {/* Search Box */}
              <div className="flex-1 min-w-0">
                <SearchBox />
              </div>

              {/* All / Upcoming / Past + Dropdown */}
              <SearchFilter onDropdownChange={setDropdownOpen} />
            </div>
          </div>

          {/* Category buttons */}
          {dropdownOpen && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
              <div
                className="
                  flex
                  flex-nowrap
                  gap-2
                  overflow-x-auto
                  justify-start
                  sm:justify-center
                  pb-2
                  scrollbar-hide
                "
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className="
                      px-3 py-1.5
                      text-sm font-medium
                      rounded-lg
                      whitespace-nowrap
                      shrink-0
                    "
                    style={{
                      background:
                        selectedCategory === category ? "var(--ink)" : "#fff",
                      color:
                        selectedCategory === category
                          ? "var(--paper)"
                          : "var(--ink)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            {/* Empty collection */}
            <EmptyCollection onAddTicket={handleAddTicket} />

            {/* Ticket */}
            <TicketCard
              onClick={() =>
                handleOpenTicketDetails({
                  id: 1,
                  eventName: "EXO PLANET #6 - EXhOrizon in BANGKOK [DAY 2]",
                  venue: "Impact Arena",
                  date: "2026/05/17",
                  time: "16:00",
                  category: "Concert",
                  zone: "EXO-L1",
                  status: "Attended",
                })
              }
            />
          </div>
        </>
      )}

      {/* Add / Edit Ticket popup */}
      {ticketPopup.isOpen && (
        <TicketManagement
          mode={ticketPopup.mode}
          ticket={ticketPopup.ticket}
          eventType={CATEGORY_OPTIONS}
          onClose={handleCloseTicket}
        />
      )}

      {/* Ticket Detail popup */}
      {ticketDetail && (
        <TicketDetail
          ticketInfo={ticketDetail}
          onClose={handleCloseTicketDetails}
        />
      )}
    </div>
  );
}

export default App;
