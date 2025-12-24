import React, { useEffect, useState } from "react";
import api from "../api/api";
import ChannelList from "./ChannelList";
import ChannelMembersModal from "./ChannelMembersModal";

export default function Sidebar({ user, socket, onlineUsers, onLogout, setActiveChannel, activeChannel }) {
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState("");
  const [membersModal, setMembersModal] = useState(false);
  const [members, setMembers] = useState([]);

  // Load channels
  useEffect(() => {
    fetchChannels();
  }, []);

  // FIX: socket events (typos removed)
  useEffect(() => {
    if (!socket) return;

    socket.on("presenceUpdate", (list) => {
      // parent mein state update hoga
      // no local update here
    });

    return () => {
      socket.off("presenceUpdate");
    };
  }, [socket]);

  // Fetch all channels
  async function fetchChannels() {
    try {
      const res = await api.get("/channel");
      setChannels(res.data);
    } catch (err) {
      console.error("Fetch channels error:", err);
    }
  }

  // Create channel
  async function createChannel() {
    if (!name.trim()) return;

    try {
      const res = await api.post("/channel", {
        name,
        userId: user.id, // creator = member
      });

      setName("");
      await fetchChannels(); // reload list
    } catch (e) {
      console.error("Create channel error:", e);
    }
  }

  // Select channel -> join room
  async function selectChannel(c) {
    try {
      await api.post(`/channel/${c.id}/join`, { userId: user.id });

      if (socket) {
        socket.emit("joinChannel",{channelId: c.id});
      }

      setActiveChannel(c);
      await fetchChannels();
    } catch (e) {
      console.error("Select channel error:", e);
    }
  }

  // Leave channel -> leave room
  async function leaveChannel(channel) {
    try {
      await api.delete(`/channel/${channel.id}/leave`, { data: { userId: user.id } });

      setChannels((prev) => prev.filter((c) => c.id !== channel.id));

      setActiveChannel(null);

      if (socket) 
        socket.emit("leaveChannel", channel.id);
      } catch (e) {
      console.error("Leave channel error:", e);
    }
  }

  // Open members modal
  async function openMembersModal(channel) {
    try {
      const res = await api.get(`/channel/${channel.id}/members`);
      setMembers(res.data);
      setMembersModal(true);
    } catch (err) {
      console.error("Members fetch error:", err);
    }
  }

  return (
    <div className="w-72 bg-white border-r flex flex-col">
      {/* USER INFO */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>

          <div>
            <div className="font-bold">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-3 h-3 rounded-full ${
                  onlineUsers.includes(user.id) ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
              <span className="text-xs text-gray-500">
                {onlineUsers.includes(user.id) ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <button onClick={onLogout} className="mt-3 text-sm text-red-600">
          Logout
        </button>
      </div>

      {/* CREATE CHANNEL */}
      <div className="p-3">
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border rounded"
            placeholder="New channel"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={createChannel} className="px-3 bg-blue-600 text-white rounded">
            Add
          </button>
        </div>
      </div>

      {/* CHANNEL LIST */}
      <div className="flex-1 overflow-auto">
        <ChannelList
          channels={channels}
          onSelect={selectChannel}        // ⭐ FIXED
          onViewMembers={openMembersModal}
          onlineUsers={onlineUsers}

           />

        {activeChannel && (
          <button
            onClick={() => leaveChannel(activeChannel)}
            className="w-full p-2 bg-gray-100 border-t text-sm" >
            Leave Channel
            </button>
        )}   

        <ChannelMembersModal
          open={membersModal}
          onClose={() => setMembersModal(false)}
          members={members}
          onlineUsers={onlineUsers}
        />
      </div>
    </div>
  );
}