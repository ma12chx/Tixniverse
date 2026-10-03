import {
  LayoutGrid,
  MicVocal,
  Users,
  Tv,
  TvMinimalPlay,
  PartyPopper,
  Ticket,
} from "lucide-react";

export const VIEW = {
  COLLECTION: "collection",
  CALENDAR: "calendar",
};

export const EVENT_TYPES = [
  { id: 1, value: "Concert", Icon: MicVocal },
  { id: 2, value: "Fan Meeting", Icon: Users },
  { id: 3, value: "Live", Icon: Tv },
  { id: 4, value: "Online Streaming", Icon: TvMinimalPlay },
  { id: 5, value: "Festival", Icon: PartyPopper },
  { id: 6, value: "Other", Icon: Ticket },
];

export const CATEGORY_OPTIONS = [
  { id: 0, value: "All", Icon: LayoutGrid },
  ...EVENT_TYPES,
];

export const STATUS = {
  upcoming: { label: "upcoming", bgColor: "bg-sky-400" },
  attended: { label: "attended", bgColor: "bg-green-600" },
  missed: { label: "missed", bgColor: "bg-red-500" },
};

export const EDIT_MODE = {
  ADD: 0,
  EDIT: 1,
};

export const FILTER_TYPES = [
  { value: 0, label: "All" },
  { value: 1, label: "Upcoming" },
  { value: 2, label: "Past" },
];
