import { useState } from "react";

import NavBar from "./components/NavBar.jsx";
import TicketManagement from "./components/TicketManagement.jsx";
import TicketDetail from "./components/TicketDetail.jsx";

import LoginView from "./views/Login.jsx";
import CollectionView from "./views/Collection.jsx";
import CalendarView from "./views/Calendar.jsx";

import { VIEW } from "./utils/Constants.js";

import { useAuth } from "./hooks/useAuth.js";
import { useTickets } from "./hooks/useTickets.js";
import { useTicketFilters } from "./hooks/useTicketFilters.js";
import { useTicketModals } from "./hooks/useTicketModals.js";

function App() {
  const [selectedView, setSelectedView] = useState(VIEW.COLLECTION);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const { session, authLoading, signIn, signInError, signingIn, signOut } =
    useAuth();

  const {
    ticketList,
    ticketsByDate,
    isTicketListLoaded,
    saveTicket,
    deleteTicket,
  } = useTickets();

  const {
    dropdownOpen,
    setDropdownOpen,
    closeDropdown,
    selectedCategoryId,
    setSelectedCategoryId,
    searchInput,
    setSearchInput,
    filterStatus,
    setFilterStatus,
    filteredTicketList,
    upcomingCount,
    pastCount,
    isSearchFiltering,
  } = useTicketFilters(ticketList);

  const {
    ticketPopup,
    ticketDetail,
    openAddTicket,
    openEditTicket,
    closeTicketManagement,
    openTicketDetails,
    closeTicketDetails,
  } = useTicketModals();

  function handleViewChange(view) {
    setSelectedView(view);
    closeDropdown();
  }

  async function handleSaveTicket(formTicket) {
    const ok = await saveTicket(formTicket, ticketPopup.mode);
    if (ok) closeTicketManagement();
  }

  async function handleDeleteTicket(ticket) {
    const ok = await deleteTicket(ticket);
    if (ok) closeTicketDetails();
  }

  if (authLoading) {
    return <div className="tixniverse-app min-h-screen w-full" />;
  }

  if (!session) {
    return (
      <LoginView onSignIn={signIn} error={signInError} loading={signingIn} />
    );
  }

  return (
    <div className="tixniverse-app min-h-screen w-full">
      {/* Navigation bar */}
      <NavBar
        view={selectedView}
        onViewChange={handleViewChange}
        onAddTicket={openAddTicket}
        onSignOut={signOut}
      />

      {/* Collection */}
      {selectedView === VIEW.COLLECTION && (
        <CollectionView
          tickets={filteredTicketList}
          IsTicketsLoaded={isTicketListLoaded}
          dropdownOpen={dropdownOpen}
          onDropdownChange={setDropdownOpen}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          onAddTicket={openAddTicket}
          onOpenTicketDetails={openTicketDetails}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          upcomingCount={upcomingCount}
          pastCount={pastCount}
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          isSearchFiltering={isSearchFiltering}
        />
      )}

      {/* Calendar */}
      {selectedView === VIEW.CALENDAR && (
        <CalendarView
          ticketsByDate={ticketsByDate}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onSelectEvent={openTicketDetails}
        />
      )}

      {/* Add / Edit Ticket popup */}
      {ticketPopup.isOpen && (
        <TicketManagement
          mode={ticketPopup.mode}
          ticket={ticketPopup.ticket}
          onClose={closeTicketManagement}
          onSave={handleSaveTicket}
        />
      )}

      {/* Ticket Detail popup */}
      {ticketDetail && (
        <TicketDetail
          ticketInfo={ticketDetail}
          onEdit={openEditTicket}
          onDelete={handleDeleteTicket}
          onClose={closeTicketDetails}
        />
      )}
    </div>
  );
}

export default App;
