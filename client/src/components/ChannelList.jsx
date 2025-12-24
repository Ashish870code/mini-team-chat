import React, { useState, useEffect } from "react";

export default function ChannelList({ channels, onSelect, onViewMembers, onlineUsers, members }) {
  const [selectedId, setSelectedId] = useState(null);

   useEffect(() => { }, [members]);

  function handleSelect(ch) {
    setSelectedId(ch.id);
    onSelect(ch);
  }

  return (
    <div className="p-3">
      {channels.map((c) => (
        <div
          key={c.id}
          className={`flex justify-between items-center p-3 border-b cursor-pointer hover:bg-gray-100
            ${selectedId === c.id ? "bg-gray-200" : ""}`}
          onClick={() => handleSelect(c)}
        >
          {/* LEFT: Channel Name */}
          <div>
            <div className="font-medium">#{c.name}</div>
            <div className="text-xs text-gray-500">{c.members} members</div>
          </div>

          {/* RIGHT: View Members button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewMembers(c);
            }}
            className="text-blue-600 text-sm hover:underline"
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
}