import React from "react";

export default function ChannelMembersModal({ open, onClose, members, onlineUsers }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-5 w-80 rounded shadow">
        <h2 className="text-lg font-bold mb-3">Channel Members</h2>

        {members.map((m) => (
          <div key={m.User.id} className="flex items-center mb-2">
            
            {/* Online Indicator */}
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                onlineUsers.includes(m.User.id) ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>

            <div>
              <div className="font-medium">{m.User.name}</div>
              <div className="text-xs text-gray-500">{m.User.email}</div>
            </div>
          </div>
        ))}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}