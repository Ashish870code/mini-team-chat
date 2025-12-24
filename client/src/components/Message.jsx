import React from 'react';

export default function Message({ msg, meId }) {
  const isMe = msg.userId === meId;
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] p-3 rounded-lg ${isMe ? 'bg-blue-600 text-white' : 'bg-white'}`}>
        <div className="text-sm font-semibold">{msg.User?.name ?? 'Unknown'}</div>
        <div className="mt-1">{msg.text}</div>
        <div className="text-xs text-gray-400 mt-2 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</div>
      </div>
    </div>
  )
}