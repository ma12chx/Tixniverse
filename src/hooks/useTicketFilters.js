import { useState, useMemo } from "react";
import { CATEGORY_OPTIONS, FILTER_TYPES } from "../utils/Constants";

export function useTicketFilters(ticketList) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    CATEGORY_OPTIONS[0].id,
  );

  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState(FILTER_TYPES[0].value);

  const categoryFilteredList = useMemo(() => {
    if (selectedCategoryId === CATEGORY_OPTIONS[0].id) return ticketList;
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

  const isSearchFiltering =
    searchInput.trim() !== "" ||
    selectedCategoryId !== CATEGORY_OPTIONS[0].id ||
    filterStatus !== FILTER_TYPES[0].value;

  return {
    dropdownOpen,
    setDropdownOpen,
    closeDropdown: () => setDropdownOpen(false),
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
  };
}
