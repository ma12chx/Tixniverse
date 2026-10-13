# Tixniverse
A personal web application for collecting and keeping track of event tickets (concerts, fan meetings, festivals and more), built with React.js and Supabase (2026).

## Features
- **Ticket management:** add, edit and delete tickets with event name, artist, event type, date, time, venue, hall, zone, seat, notes and a cover image
- **Attended tracking:** a toggle for whether you went, with the status (Upcoming, Attended, Missed) derived from the event date in Thai time (Asia/Bangkok)
- **Collection view:** a card grid with pagination
- **Filters:** All / Upcoming / Past, plus filtering by event type (Concert, Fan Meeting, Live, Online Streaming, Festival, Other)
- **Calendar view:** browse past and upcoming events by month and open any ticket from a selected day
- **Private by design:** password sign-in for a single owner account, with Row Level Security on the database
- **Soft delete:** deleting a ticket sets a `delete_flag` instead of removing the row

## Tech stack

| Area | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Icons / UI | lucide-react, SweetAlert2 |
| Backend | Supabase (Postgres, Auth, Storage) |
| CI/CD | GitHub Actions, GitHub Pages |

## Demo
https://ma12chx.github.io/Tixniverse/
