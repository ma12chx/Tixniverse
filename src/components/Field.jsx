function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--muted)" }}
      >
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

export default Field;
