import { useRef, useState } from "react";

import { X, Upload } from "lucide-react";
import Swal from "sweetalert2";

import Field from "./Field";

import { supabase } from "../lib/supabaseClient.js";

function buildInitialForm(ticket) {
  return {
    id: ticket?.id ?? null,
    eventName: ticket?.eventName ?? "",
    artist: ticket?.artist ?? "",
    eventTypeId: ticket?.eventTypeId ?? 1, // Default: Concert
    eventDate: ticket?.eventDate ?? "",
    eventTime: ticket?.eventTime ?? "",
    hasAttended: ticket?.hasAttended ?? false,
    venue: ticket?.venue ?? "",
    hall: ticket?.hall ?? "",
    zone: ticket?.zone ?? "",
    seat: ticket?.seat ?? "",
    notes: ticket?.notes ?? "",
    cover: ticket?.cover ?? "",
    coverFile: null,
  };
}

async function uploadCover(file) {
  const extension = file.name.split(".").pop();
  const path = `${Date.now()} - ${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const { error } = await supabase.storage.from("covers").upload(path, file, {
    contentType: file.type,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("covers").getPublicUrl(path);

  return data.publicUrl;
}

function TicketManagement({ mode, ticket, eventType, onClose, onSave }) {
  const isEdit = mode === 1;

  const title = isEdit ? "Edit ticket" : "Add ticket";
  const buttonTitle = isEdit ? "Save changes" : "Add to collection";

  const [formData, setFormData] = useState(() => buildInitialForm(ticket));
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  function set(field, value) {
    setFormData((form) => ({ ...form, [field]: value }));
  }

  function handleCoverPick(file) {
    const previewUrl = URL.createObjectURL(file);
    setFormData((form) => ({ ...form, cover: previewUrl, coverFile: file }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Form has error
    if (!formData.eventName || !formData.eventDate) {
      Swal.fire({
        title: "Missing info",
        text: "Event title and date are required.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    setIsSaving(true);

    try {
      let coverUrl = formData.cover;
      if (formData.coverFile) {
        coverUrl = await uploadCover(formData.coverFile);
      }

      await onSave({
        id: formData.id,
        eventName: formData.eventName,
        artist: formData.artist,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        eventTypeId: Number(formData.eventTypeId),
        hasAttended: formData.hasAttended,
        venue: formData.venue,
        hall: formData.hall,
        zone: formData.zone,
        seat: formData.seat,
        notes: formData.notes,
        cover: coverUrl,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to save ticket information, please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(28,37,65,0.55)" }}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-y-auto"
        style={{ background: "var(--paper)", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 flex items-center justify-between px-5 py-4"
          style={{
            background: "var(--paper)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <h2 className="font-display font-bold text-lg"> {title} </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {/* TODO - onSubmit() */}
        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wide block mb-1.5"
              style={{ color: "var(--muted)" }}
            >
              Cover
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{
                  background: "#fff",
                  border: "1px solid var(--line)",
                }}
              >
                {formData.cover ? (
                  <img
                    src={formData.cover}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload size={18} style={{ color: "var(--muted)" }} />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) =>
                  e.target.files[0] && handleCoverPick(e.target.files[0])
                }
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium rounded-lg px-3 py-2 cursor-pointer"
                style={{
                  border: "1px solid var(--line)",
                  background: "#fff",
                }}
              >
                Choose image
              </button>

              {/* Cover exists, display "Remove" button */}
              {formData.cover && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((form) => ({
                      ...form,
                      cover: "",
                      coverFile: null,
                    }))
                  }
                  className="text-sm font-medium cursor-pointer"
                  style={{ color: "var(--red)" }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Event title */}
          <Field label="Event title" required>
            <input
              required
              value={formData.eventName}
              onChange={(event) => set("eventName", event.target.value)}
              className="stub-input"
              placeholder="Ex. Dreamcatcher World Tour"
            />
          </Field>

          {/* Artist */}
          <Field label="Artist">
            <input
              value={formData.artist}
              onChange={(event) => set("artist", event.target.value)}
              className="stub-input"
              placeholder="Ex. Dreamcatcher"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            {/* Venue */}
            <Field label="Venue">
              <input
                value={formData.venue}
                onChange={(event) => set("venue", event.target.value)}
                className="stub-input"
              />
            </Field>

            {/* Hall */}
            <Field label="Hall">
              <input
                value={formData.hall}
                onChange={(event) => set("hall", event.target.value)}
                className="stub-input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Zone */}
            <Field label="Zone">
              <input
                value={formData.zone}
                onChange={(event) => set("zone", event.target.value)}
                className="stub-input"
              />
            </Field>

            {/* Seat */}
            <Field label="Seat">
              <input
                value={formData.seat}
                onChange={(event) => set("seat", event.target.value)}
                className="stub-input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <Field label="Date" required>
              <input
                required
                value={formData.eventDate}
                onChange={(event) => set("eventDate", event.target.value)}
                type="date"
                className="stub-input font-mono"
              />
            </Field>

            {/* Time */}
            <Field label="Time">
              <input
                type="time"
                value={formData.eventTime}
                onChange={(event) => set("eventTime", event.target.value)}
                className="stub-input font-mono"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Event type */}
            <Field label="Event type">
              <select
                value={formData.eventTypeId}
                onChange={(event) => set("eventTypeId", event.target.value)}
                className="stub-input"
              >
                {eventType.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.value}
                  </option>
                ))}
              </select>
            </Field>

            {/* Attended toggle */}
            <Field label="Attended">
              <button
                type="button"
                role="switch"
                aria-checked={formData.hasAttended}
                onClick={() => set("hasAttended", !formData.hasAttended)}
                className="relative inline-flex items-center h-9 w-full rounded-lg px-3"
                style={{
                  background: "#fff",
                  border: "1px solid var(--line)",
                }}
              >
                <span
                  className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors flex-shrink-0"
                  style={{
                    background: formData.hasAttended
                      ? "var(--green)"
                      : "var(--line)",
                  }}
                >
                  <span
                    className="inline-block h-5 w-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: formData.hasAttended
                        ? "translateX(22px)"
                        : "translateX(2px)",
                    }}
                  />
                </span>
                <span
                  className="ml-2 text-sm font-medium"
                  style={{ color: "var(--ink)" }}
                >
                  {formData.hasAttended ? "Yes" : "No"}
                </span>
              </button>
            </Field>
          </div>

          {/* Notes */}
          <Field label="Notes">
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(event) => set("notes", event.target.value)}
              className="stub-input"
              placeholder="Dress code, memories..."
            />
          </Field>

          {/* Button group */}
          <div className="flex gap-2 pt-2 pb-1">
            {/* Submit button */}
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-lg py-2.5 font-semibold text-sm cursor-pointer"
              style={{
                background: "var(--purple)",
                color: "#fff",
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? "Saving..." : buttonTitle}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketManagement;
