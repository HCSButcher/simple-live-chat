import React, { useState } from "react";

export default function Login({ onLogin, socketHook }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("farmer");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    socketHook.connect({ username: username.trim(), role });
    onLogin({ username: username.trim(), role });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Join Chat</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="farmer">Farmer</option>
            <option value="foodbank">Foodbank</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
