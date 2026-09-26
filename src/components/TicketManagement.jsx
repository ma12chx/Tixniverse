import { useState } from "react";

import { X, Upload } from "lucide-react";
import Swal from "sweetalert2";

import Field from "./Field";

function testSwal() {
  Swal.fire({
    title: "Test!",
    text: "Hello, Swal",
    icon: "info",
    confirmButtonText: "OK",
  });
}

function TicketManagement({ mode, ticket, eventType, onClose }) {
  const isEdit = mode === 1;

  const title = isEdit ? "Edit ticket" : "Add ticket";
  const buttonTitle = isEdit ? "Save changes" : "Add to collection";

  const [isAttended, setIsAttended] = useState(ticket?.attended ?? false);
  const [isSaving, setIsSaving] = useState(false);

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
        <form className="px-5 py-5 flex flex-col gap-4">
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
                <Upload size={18} style={{ color: "var(--muted)" }} />
              </div>
              <input type="file" accept="image/*" className="hidden" />
              <button
                type="button"
                className="text-sm font-medium rounded-lg px-3 py-2"
                style={{
                  border: "1px solid var(--line)",
                  background: "#fff",
                }}
              >
                Choose image
              </button>
            </div>
          </div>
          {/* Event title */}
          <Field label="Event title" required>
            <input
              required
              className="stub-input"
              placeholder="Ex. Dreamcatcher World Tour"
            />
          </Field>

          {/* Artist */}
          <Field label="Artist">
            <input className="stub-input" placeholder="Ex. Dreamcatcher" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            {/* Venue */}
            <Field label="Venue">
              <input className="stub-input" />
            </Field>

            {/* Hall */}
            <Field label="Hall">
              <input className="stub-input" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Zone */}
            <Field label="Zone">
              <input className="stub-input" />
            </Field>

            {/* Seat no. */}
            <Field label="Seat no.">
              <input className="stub-input" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <Field label="Date" required>
              <input required type="date" className="stub-input font-mono" />
            </Field>

            {/* Time */}
            <Field label="Time">
              <input type="time" className="stub-input font-mono" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Event type */}
            <Field label="Event type">
              <select className="stub-input">
                {eventType.map((type) => (
                  <option key={type.value} value={type.value}>
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
                aria-checked={isAttended}
                onClick={() => setIsAttended((a) => !a)}
                className="relative inline-flex items-center h-9 w-full rounded-lg px-3"
                style={{
                  background: "#fff",
                  border: "1px solid var(--line)",
                }}
              >
                <span
                  className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors flex-shrink-0"
                  style={{
                    background: isAttended ? "var(--green)" : "var(--line)",
                  }}
                >
                  <span
                    className="inline-block h-5 w-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: isAttended
                        ? "translateX(22px)"
                        : "translateX(2px)",
                    }}
                  />
                </span>
                <span
                  className="ml-2 text-sm font-medium"
                  style={{ color: "var(--ink)" }}
                >
                  {isAttended ? "Yes" : "No"}
                </span>
              </button>
            </Field>
          </div>
          <Field label="Notes">
            <textarea
              rows={3}
              className="stub-input"
              placeholder="Dress code, memories..."
            />
          </Field>
          <div className="flex gap-2 pt-2 pb-1">
            <button
              type="button"
              onClick={testSwal}
              disabled={isSaving}
              className="flex-1 rounded-lg py-2.5 font-semibold text-sm"
              style={{
                background: "var(--purple)",
                color: "#fff",
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {buttonTitle}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketManagement;
