import React, { useState } from 'react';
import api, { setAuthToken } from '../api/api';

export default function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e?.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setAuthToken(res.data.token);
      onRegister(res.data);
    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.error || 'Register failed');
    }
  };

  return (
    <form onSubmit={submit} className="mt-4">
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <input className="w-full mb-2 p-2 border rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="w-full mb-2 p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full mb-2 p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="w-full p-2 bg-green-600 text-white rounded" type="submit">Register</button>
    </form>
  );
}