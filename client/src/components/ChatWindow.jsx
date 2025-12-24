import React, { useEffect, useRef, useState } from 'react';
import api from '../api/api';
import Message from './Message';

export default function ChatWindow({ user, socket, channel }) {

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState("");
  const listRef = useRef();

  // Load messages when channel changes
  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    if (channel) fetchMessages(1, true);
  }, [channel]);


  // Join channel room
  useEffect(() => {
  if (!socket || !channel) return;

  socket.emit("joinChannel", { channelId: channel.id });

  }, [socket, channel]);


  // Listen for new messages (IMPORTANT FIX)
  useEffect(() => {
    if (!socket) return;

    const handler = (msg) => {
      if (msg.channelId === channel?.id) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      }
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
    };
  }, [socket, channel]);


  // Fetch messages
  async function fetchMessages(pageToLoad = 1, replace = false) {
    if (!channel) return;

    try {
      const container = listRef.current;
      const oldScrollHeight = container ? container.scrollHeight : 0;

      const res = await api.get(`/messages/${channel.id}?page=${pageToLoad}&limit=25`);

      const msgs = res.data;

      if (msgs.length < 25) setHasMore(false);

      if (replace){
         setMessages(msgs);
         setPage(1);
      
         setTimeout(scrollToBottom, 80);
      }else {
        setMessages(prev => [...msgs, ...prev]);

      setPage(pageToLoad);

      setTimeout(() => {
        // maintain scroll position
        if (container) {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - oldScrollHeight;
        }
      },30);
      }
      
    } catch (err) {
      console.log(err);
    }
  }

  function scrollToBottom() {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }


  // Send message — ONLY ONE EMIT
  async function handleSend() {
    if (!text.trim()) return;

    const msgObj = {
      id: Date.now(),
      text,
      channelId: channel.id,
      userId: user.id,
      createdAt: new Date(),
      User: { name: user.name },
    };

    // optimistic
    setMessages(prev => [...prev, msgObj]);
    scrollToBottom();

    socket.emit("sendMessage", msgObj);

    setText("");
  }


  function onScroll(e) {
    if (e.target.scrollTop < 50 && hasMore) {
      fetchMessages(page + 1);
    }
  }


  if (!channel)
    return <div className="flex-1 flex items-center justify-center text-gray-400">Select a channel</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="font-bold text-lg">{channel.name}</div>
      </div>

      <div onScroll={onScroll} ref={listRef}
        className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
        {messages.map(m => <Message key={m.id} msg={m} meId={user.id} />)}
      </div>

      <div className="p-4 border-t bg-white flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
