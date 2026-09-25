import { useState } from "react";

import NavBar from "./components/NavBar.jsx";
import TicketManagement from "./components/TicketManagement.jsx";
import TicketDetail from "./components/TicketDetail.jsx";

import CollectionView from "./views/Collection.jsx";
import CalendarView from "./views/Calendar.jsx";

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
  const [selectedView, setSelectedView] = useState(VIEW.COLLECTION);

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

  // For Calendar view
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // --------------------------------------------------
  // Collection View
  // --------------------------------------------------

  function handleViewChange(view) {
    setSelectedView(view);

    // Close category dropdown when switching views
    setDropdownOpen(false);
  }

  // --------------------------------------------------
  // Category
  // --------------------------------------------------

  function handleCategoryChange(category) {
    setSelectedCategory(category);

    // Filter tickets by category: TO-DO
  }

  // --------------------------------------------------
  // Add / Edit ticket
  // --------------------------------------------------

  function handleAddTicket() {
    setTicketPopup({
      isOpen: true,
      mode: EDIT_MODE.ADD,
      ticket: null,
    });
  }

  function handleEditTicket(ticket) {
    // Close ticket detail
    setTicketDetail(null);

    setTicketPopup({
      isOpen: true,
      mode: EDIT_MODE.EDIT,
      ticket: ticket,
    });
  }

  function handleDeleteTicket(ticket) {
    setTicketDetail(ticket);
    console.log("Delete ticketId: ", ticket.id);
  }

  function handleCloseTicketManagement() {
    setTicketPopup({
      isOpen: false,
      mode: EDIT_MODE.ADD,
      ticket: null,
    });
  }

  // --------------------------------------------------
  // Ticket details
  // --------------------------------------------------

  function handleOpenTicketDetails(ticket) {
    setTicketDetail(ticket);
  }

  function handleCloseTicketDetails() {
    setTicketDetail(null);
  }

  return (
    <div className="tixniverse-app min-h-screen w-full">
      {/* Navigation bar */}
      <NavBar
        view={selectedView}
        onViewChange={handleViewChange}
        onAddTicket={handleAddTicket}
      />

      {/* Collection */}
      {selectedView === VIEW.COLLECTION && (
        <CollectionView
          dropdownOpen={dropdownOpen}
          onDropdownChange={setDropdownOpen}
          categoryOptions={CATEGORY_OPTIONS}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onAddTicket={handleAddTicket}
          onOpenTicketDetails={handleOpenTicketDetails}
        />
      )}

      {/* Calendar */}
      {selectedView === VIEW.CALENDAR && (
        <CalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onSelectEvent={handleOpenTicketDetails}
        />
      )}

      {/* Add / Edit Ticket popup */}
      {ticketPopup.isOpen && (
        <TicketManagement
          mode={ticketPopup.mode}
          ticket={ticketPopup.ticket}
          eventType={CATEGORY_OPTIONS}
          onClose={handleCloseTicketManagement}
        />
      )}

      {/* Ticket Detail popup */}
      {ticketDetail && (
        <TicketDetail
          ticketInfo={ticketDetail}
          onEdit={handleEditTicket}
          onDelete={handleDeleteTicket}
          onClose={handleCloseTicketDetails}
        />
      )}
    </div>
  );
}

export default App;
