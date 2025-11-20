import React, { useState } from "react";

export default function ChatRoom({ socketHook, user }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    socketHook.sendMessage(message);
    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socketHook.setTyping(e.target.value.length > 0);
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-white p-4 border-r overflow-y-auto">
        <h3 className="font-bold mb-4">Online Users</h3>
        <ul className="flex flex-col gap-2">
          {socketHook.users.map((u) => (
            <li key={u._id} className="flex justify-between">
              <span>{u.username}</span>
              {u.username === user.username && <span>(You)</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto mb-2 space-y-2">
          {socketHook.messages.map((msg) => (
            <div
              key={msg._id || msg.timestamp}
              className={`p-2 rounded ${
                msg.sender === user.username
                  ? "bg-blue-100 self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              <strong>{msg.sender}</strong>: {msg.message}
              <div className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-2 text-sm text-gray-500">
          {socketHook.typingUsers.filter((n) => n !== user.username).join(", ")}
          {socketHook.typingUsers.filter((n) => n !== user.username).length > 0
            ? " is typing..."
            : ""}
        </div>

        <div className="flex gap-2">
          <input
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
