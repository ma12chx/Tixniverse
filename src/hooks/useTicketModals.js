import { useState } from "react";
import { EDIT_MODE } from "../utils/Constants";

export function useTicketModals() {
  const [ticketPopup, setTicketPopup] = useState({
    isOpen: false,
    mode: EDIT_MODE.ADD,
    ticket: null,
  });

  const [ticketDetail, setTicketDetail] = useState(null);

  function openAddTicket() {
    setTicketPopup({
      isOpen: true,
      mode: EDIT_MODE.ADD,
      ticket: null,
    });
  }

  function openEditTicket(ticket) {
    setTicketPopup({
      isOpen: true,
      mode: EDIT_MODE.EDIT,
      ticket: ticket,
    });
  }

  function closeTicketManagement() {
    setTicketPopup({
      isOpen: false,
      mode: EDIT_MODE.ADD,
      ticket: null,
    });
  }

  function openTicketDetails(ticket) {
    setTicketDetail(ticket);
  }

  function closeTicketDetails() {
    setTicketDetail(null);
  }

  return {
    ticketPopup,
    ticketDetail,
    openAddTicket,
    openEditTicket,
    closeTicketManagement,
    openTicketDetails,
    closeTicketDetails,
  };
}
