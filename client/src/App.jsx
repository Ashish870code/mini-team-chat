import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { io } from 'socket.io-client';
import { setAuthToken } from './api/api';

const API_WS = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [socket, setSocket] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      // store token
      localStorage.setItem('token', token);
      // connect socket
      const s = io(API_WS, { query: { userId: user.id } });

      setSocket(s);
      s.on('connect_error', (err) => console.error('Socket error', err));
      return () => s.disconnect();
    } else {
      setAuthToken(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    socket.on("presenceUpdate", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    return () =>
      socket.off("PresenceUpdate");
    } ,[socket]);

  useEffect(() => {
    if (!user && localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);

  function handleLogin({ token, user }) {
    setToken(token);
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (socket) socket.disconnect();
  }

  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold mb-4">Mini Team Chat</h1>
          <Login onLogin={handleLogin} />
          <div className="mt-4 text-center text-sm text-gray-500">or</div>
          <Register onRegister={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <Sidebar user={user} socket={socket} onlineUsers={onlineUsers} onLogout={handleLogout} setActiveChannel={setActiveChannel} activeChannel={activeChannel}/>
      <ChatWindow user={user} socket={socket} channel={activeChannel} />
    </div>
  );
}