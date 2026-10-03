import { useState, useEffect, useMemo } from "react";

import Swal from "sweetalert2";
import { supabase } from "./lib/supabaseClient.js";

import NavBar from "./components/NavBar.jsx";
import TicketManagement from "./components/TicketManagement.jsx";
import TicketDetail from "./components/TicketDetail.jsx";

import CollectionView from "./views/Collection.jsx";
import CalendarView from "./views/Calendar.jsx";

import { rowToTicket, ticketToRow } from "./utils/Common.js";

import {
  VIEW,
  CATEGORY_OPTIONS,
  EDIT_MODE,
  FILTER_TYPES,
} from "./utils/Constants.js";

function App() {
  const [selectedView, setSelectedView] = useState(VIEW.COLLECTION);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    CATEGORY_OPTIONS[0].id,
  );

  // For Collection view
  const [ticketList, setTicketList] = useState([]);
  const [isTicketListLoaded, setIsTicketLoaded] = useState(false);

  // Search input + status filter
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState(FILTER_TYPES[0].value);

  // Category filter: Use to compute counts
  const categoryFilteredList = useMemo(() => {
    // Category: All -> return all tickets
    if (selectedCategoryId === CATEGORY_OPTIONS[0].id) {
      return ticketList;
    }

    return ticketList.filter(
      (ticket) => ticket.eventTypeId === selectedCategoryId,
    );
  }, [ticketList, selectedCategoryId]);

  const upcomingCount = useMemo(
    () =>
      categoryFilteredList.filter(
        (ticket) => ticket.status === FILTER_TYPES[1].label.toLowerCase(),
      ).length,
    [categoryFilteredList],
  );

  const pastCount = categoryFilteredList.length - upcomingCount;

  // Search + Category + status combined
  const filteredTicketList = useMemo(() => {
    const keyword = searchInput.trim().toLowerCase();

    if (!keyword && filterStatus === FILTER_TYPES[0].value) {
      return categoryFilteredList;
    }

    return categoryFilteredList.filter((ticket) => {
      // Search filter
      const matchesSearch =
        !keyword ||
        [
          ticket.eventName,
          ticket.artist,
          ticket.venue,
          ticket.hall,
          ticket.zone,
          ticket.seat,
          ticket.notes,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(keyword),
        );

      // Status filter
      const matchesStatus =
        filterStatus === FILTER_TYPES[0].value || // All
        (filterStatus === FILTER_TYPES[1].value &&
          ticket.status === FILTER_TYPES[1].label.toLowerCase()) || // Upcoming
        (filterStatus === FILTER_TYPES[2].value &&
          ticket.status !== FILTER_TYPES[1].label.toLowerCase()); // Past

      return matchesSearch && matchesStatus;
    });
  }, [categoryFilteredList, filterStatus, searchInput]);

  // Check whether any search or filter is active
  const isSearchFiltering =
    searchInput.trim() !== "" ||
    selectedCategoryId !== CATEGORY_OPTIONS[0].id ||
    filterStatus !== FILTER_TYPES[0].value;

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

  const ticketsByDate = useMemo(() => {
    const ticketMap = {};

    ticketList.forEach((ticket) => {
      if (!ticket.eventDate) return;
      (ticketMap[ticket.eventDate] = ticketMap[ticket.eventDate] || []).push(
        ticket,
      );
    });

    return ticketMap;
  }, [ticketList]);

  // --------------------------------------------------
  // Collection View
  // --------------------------------------------------

  function handleViewChange(view) {
    setSelectedView(view);

    // Close category dropdown when switching views
    setDropdownOpen(false);
  }

  async function loadTickets() {
    setIsTicketLoaded(false);

    const { data, error } = await supabase
      .from("ticket")
      .select("*, event_type_rel:event_type(type_name)")
      .eq("delete_flag", false)
      .order("event_date", { ascending: false });

    if (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to load tickets, please try again.",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } else {
      setTicketList(data.map(rowToTicket));
    }

    setIsTicketLoaded(true);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialTickets() {
      const { data, error } = await supabase
        .from("ticket")
        .select("*, event_type_rel:event_type(type_name)")
        .eq("delete_flag", false)
        .order("event_date", { ascending: false });

      // component unmounted or effect re-ran before this resolved
      if (cancelled) return;

      if (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to load tickets, please try again.",
          icon: "error",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      } else {
        setTicketList(data.map(rowToTicket));
      }

      setIsTicketLoaded(true);
    }

    loadInitialTickets();

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------------------------------------
  // Category filter
  // --------------------------------------------------

  function handleCategoryChange(categoryId) {
    setSelectedCategoryId(categoryId);
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

  async function handleDeleteTicket(ticket) {
    const { error } = await supabase
      .from("ticket")
      .update({ delete_flag: true })
      .eq("id", ticket.id);

    if (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete ticket information.",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });

      return;
    }

    Swal.fire({
      title: "Success!",
      text: "Ticket information deleted successfully.",
      icon: "success",
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });

    await loadTickets();
    handleCloseTicketDetails();
  }

  async function handleSaveTicket(ticket) {
    const rowData = ticketToRow(ticket);

    // Get currently logged -in Supabase user
    // const {
    //   data: { user },
    //   error: userError,
    // } = await supabase.auth.getUser();

    // if (userError || !user) {
    //   Swal.fire({
    //     title: "Error!",
    //     text: "You must be logged in to save a ticket.",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //   });
    //   return;
    // }

    // Add new ticket info.
    if (ticketPopup.mode === EDIT_MODE.ADD) {
      const { error } = await supabase.from("ticket").insert({
        ...rowData,
        // user_id: user.id,
      });

      if (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to add ticket information.",
          icon: "error",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        return;
      }

      Swal.fire({
        title: "Success!",
        text: "Ticket information added successfully.",
        icon: "success",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } else {
      // Edit existing ticket info.
      const { error } = await supabase
        .from("ticket")
        .update(rowData)
        .eq("id", ticket.id);

      if (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to update ticket information.",
          icon: "error",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      }

      Swal.fire({
        title: "Success!",
        text: "Ticket information updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }

    await loadTickets();
    handleCloseTicketManagement();
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
          tickets={filteredTicketList}
          IsTicketsLoaded={isTicketListLoaded}
          dropdownOpen={dropdownOpen}
          onDropdownChange={setDropdownOpen}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={handleCategoryChange}
          onAddTicket={handleAddTicket}
          onOpenTicketDetails={handleOpenTicketDetails}
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
          onSelectEvent={handleOpenTicketDetails}
        />
      )}

      {/* Add / Edit Ticket popup */}
      {ticketPopup.isOpen && (
        <TicketManagement
          mode={ticketPopup.mode}
          ticket={ticketPopup.ticket}
          onClose={handleCloseTicketManagement}
          onSave={handleSaveTicket}
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
