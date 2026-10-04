import { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";

import { supabase } from "../lib/supabaseClient";
import { rowToTicket, ticketToRow } from "../utils/Common";
import { EDIT_MODE } from "../utils/Constants";

const SELECT_QUERY =
  "id, event_name, artist, event_type, event_date, event_time, has_attended, venue, hall, zone, seat, notes, cover_url";

function showErrorMessage(text) {
  Swal.fire({
    title: "Error!",
    text: text,
    icon: "error",
    confirmButtonText: "OK",
    allowOutsideClick: false,
  });
}

function showSuccessfulMessage(text) {
  Swal.fire({
    title: "Success!",
    text: text,
    icon: "success",
    confirmButtonText: "OK",
    allowOutsideClick: false,
  });
}

export function useTickets() {
  const [ticketList, setTicketList] = useState([]);
  const [isTicketListLoaded, setIsTicketLoaded] = useState(false);

  // For re-fetching after save/delete
  const loadTickets = useCallback(async () => {
    setIsTicketLoaded(false);

    const { data, error } = await supabase
      .from("ticket")
      .select(SELECT_QUERY)
      .eq("delete_flag", false)
      .order("event_date", { ascending: false });

    if (error) {
      showErrorMessage("Failed to load tickets, please try again.");
    } else {
      setTicketList(data.map(rowToTicket));
    }

    setIsTicketLoaded(true);
  }, []);

  // Initial mount fetch
  useEffect(() => {
    let cancelled = false;

    async function fetchInitial() {
      const { data, error } = await supabase
        .from("ticket")
        .select(SELECT_QUERY)
        .eq("delete_flag", false)
        .order("event_date", { ascending: false });

      if (cancelled) return;

      if (error) {
        showErrorMessage("Failed to load tickets, please try again.");
      } else {
        setTicketList(data.map(rowToTicket));
      }

      setIsTicketLoaded(true);
    }

    fetchInitial();
    return () => {
      cancelled = true;
    };
  }, []);

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

  async function saveTicket(formTicket, mode) {
    const row = ticketToRow(formTicket);

    const { error } =
      mode === EDIT_MODE.ADD
        ? await supabase.from("ticket").insert(row)
        : await supabase.from("ticket").update(row).eq("id", formTicket.id);

    if (error) {
      showErrorMessage(
        mode === EDIT_MODE.ADD
          ? "Failed to add ticket."
          : "Failed to save changes.",
      );
      return false;
    }

    await loadTickets();
    return true;
  }

  async function deleteTicket(ticket) {
    const { error } = await supabase
      .from("ticket")
      .update({ delete_flag: true })
      .eq("id", ticket.id);

    if (error) {
      showErrorMessage("Failed to delete ticket information.");
      return false;
    }

    showSuccessfulMessage("Ticket information deleted successfully.");
    await loadTickets();

    return true;
  }

  return {
    ticketList,
    ticketsByDate,
    isTicketListLoaded,
    saveTicket,
    deleteTicket,
  };
}
