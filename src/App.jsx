import { useState, useEffect, useMemo } from "react";

import {
  LayoutGrid,
  MicVocal,
  Users,
  Tv,
  TvMinimalPlay,
  PartyPopper,
  Ticket,
} from "lucide-react";

import Swal from "sweetalert2";
import { supabase } from "./lib/supabaseClient.js";

import NavBar from "./components/NavBar.jsx";
import TicketManagement from "./components/TicketManagement.jsx";
import TicketDetail from "./components/TicketDetail.jsx";

import CollectionView from "./views/Collection.jsx";
import CalendarView from "./views/Calendar.jsx";

const VIEW = {
  COLLECTION: "collection",
  CALENDAR: "calendar",
};

const EVENT_TYPES = [
  { id: 1, value: "Concert", Icon: MicVocal },
  { id: 2, value: "Fan Meeting", Icon: Users },
  { id: 3, value: "Live", Icon: Tv },
  { id: 4, value: "Online Streaming", Icon: TvMinimalPlay },
  { id: 5, value: "Festival", Icon: PartyPopper },
  { id: 6, value: "Other", Icon: Ticket },
];

const CATEGORY_OPTIONS = [
  { id: 0, value: "All", Icon: LayoutGrid },
  ...EVENT_TYPES,
];

const FILTER_TYPES = [
  { value: 0, label: "All" },
  { value: 1, label: "Upcoming" },
  { value: 2, label: "Past" },
];

const EDIT_MODE = {
  ADD: 0,
  EDIT: 1,
};

function getTodayInThaiTimeZone(timeZone = "Asia/Bangkok") {
  return Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getEventStatusLabel(eventDateStr, hasAttended) {
  const today = getTodayInThaiTimeZone();

  if (eventDateStr > today) return "upcoming";

  return hasAttended ? "attended" : "missed";
}

/* ---------- db <-> ui mapping ---------- */
function rowToTicket(row) {
  return {
    id: row.id,
    eventName: row.event_name,
    artist: row.artist,
    eventTypeId: row.event_type,
    eventDate: row.event_date,
    eventTime: row.event_time ? row.event_time.slice(0, 5) : "",
    hasAttended: row.has_attended,
    status: getEventStatusLabel(row.event_date, row.has_attended),
    venue: row.venue,
    hall: row.hall,
    zone: row.zone,
    seat: row.seat,
    notes: row.notes,
    cover: row.cover_url,
  };
}

function ticketToRow(ticket) {
  return {
    event_name: ticket.eventName,
    artist: ticket.artist || null,
    event_type: ticket.eventTypeId,
    event_date: ticket.eventDate,
    event_time: ticket.eventTime || null,
    has_attended: ticket.hasAttended ?? false,
    venue: ticket.venue || null,
    hall: ticket.hall || null,
    zone: ticket.zone || null,
    seat: ticket.seat || null,
    notes: ticket.notes || null,
    cover_url: ticket.cover || null,
  };
}

function App() {
  const [selectedView, setSelectedView] = useState(VIEW.COLLECTION);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    CATEGORY_OPTIONS[0].id,
  );

  // For Collection view
  const [ticketList, setTicketList] = useState([]);
  const [isTicketListLoaded, setIsTicketLoaded] = useState(false);

  // Search filter
  const [filterStatus, setFilterStatus] = useState(FILTER_TYPES[0].value);

  // Category filter: Use to compute counts
  const categoryFilteredList = useMemo(() => {
    // Category: All -> return all tickets
    if (selectedCategoryId === CATEGORY_OPTIONS[0].id) return ticketList;

    return ticketList.filter(
      (ticket) => ticket.eventTypeId === selectedCategoryId,
    );
  }, [ticketList, selectedCategoryId]);

  const upcomingCount = useMemo(
    () =>
      categoryFilteredList.filter(
        (ticket) => ticket.status === FILTER_TYPES[1].label,
      ).length,
    [categoryFilteredList],
  );

  const pastCount = categoryFilteredList.length - upcomingCount;

  // Category + status combined
  const filteredTicketList = useMemo(() => {
    // Filter: Upcoming
    if (filterStatus === FILTER_TYPES[1].value) {
      return categoryFilteredList.filter(
        (ticket) => ticket.status === FILTER_TYPES[1].label,
      );
    }

    // Filter: Past
    if (filterStatus === FILTER_TYPES[2].value) {
      return categoryFilteredList.filter(
        (ticket) => ticket.status !== FILTER_TYPES[1].label,
      );
    }

    return categoryFilteredList;
  }, [categoryFilteredList, filterStatus]);

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

  async function loadTickets() {
    setIsTicketLoaded(false);

    const { data, error } = await supabase
      .from("ticket")
      .select("*, event_type_rel:event_type(type_name)")
      .eq("delete_flag", false)
      .order("event_date", { ascending: true });

    if (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to load tickets, please try again.",
        icon: "error",
        confirmButtonText: "OK",
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
        .order("event_date", { ascending: true });

      // component unmounted or effect re-ran before this resolved
      if (cancelled) return;

      if (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to load tickets, please try again.",
          icon: "error",
          confirmButtonText: "OK",
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

  function handleDeleteTicket(ticket) {
    setTicketDetail(ticket);
    console.log("Delete ticketId: ", ticket.id);
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
        });

        return;
      } else {
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
          });

          return;
        }
      }

      await loadTickets();
      handleCloseTicketManagement();
    }
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
    console.log("Selected ticket:", ticket);
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
          categoryOptions={CATEGORY_OPTIONS}
          eventTypes={EVENT_TYPES}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={handleCategoryChange}
          onAddTicket={handleAddTicket}
          onOpenTicketDetails={handleOpenTicketDetails}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          upcomingCount={upcomingCount}
          pastCount={pastCount}
        />
      )}

      {/* Calendar */}
      {selectedView === VIEW.CALENDAR && (
        <CalendarView
          tickets={filteredTicketList}
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
          eventType={EVENT_TYPES}
          onClose={handleCloseTicketManagement}
          onSave={handleSaveTicket}
        />
      )}

      {/* Ticket Detail popup */}
      {ticketDetail && (
        <TicketDetail
          ticketInfo={ticketDetail}
          eventTypes={EVENT_TYPES}
          onEdit={handleEditTicket}
          onDelete={handleDeleteTicket}
          onClose={handleCloseTicketDetails}
        />
      )}
    </div>
  );
}

export default App;
