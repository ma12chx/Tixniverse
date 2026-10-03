import { EVENT_TYPES, STATUS } from "./Constants.js";
import { getDateInThaiTimeZone } from "./DateUtils.js";

export function getEventType(eventTypeId) {
  return EVENT_TYPES.find((type) => type.id === Number(eventTypeId));
}

export function getEventStatusLabel(eventDateStr, hasAttended) {
  const today = getDateInThaiTimeZone(new Date());

  if (eventDateStr > today) return STATUS["upcoming"]["label"];

  return hasAttended ? STATUS["attended"]["label"] : STATUS["missed"]["label"];
}

export function rowToTicket(row) {
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

export function ticketToRow(ticket) {
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
