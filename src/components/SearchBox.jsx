import { useState } from "react";
import { Search } from "lucide-react";

function SearchBox() {
  const [search, setSearch] = useState("");

  return (
    <>
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2"
        style={{ background: "#fff", border: "1px solid var(--line)" }}
      >
        <Search size={16} style={{ color: "var(--muted)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your collection"
          className="flex-1 bg-transparent outline-none text-sm min-w-0"
        />
      </div>
    </>
  );
}

export default SearchBox;
