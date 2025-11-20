import React, { useState } from "react";
import { useSocket } from "./socket/socket";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";

export default function App() {
  const socketHook = useSocket();
  const [user, setUser] = useState(null);

  if (!user)
    return <Login onLogin={setUser} socketHook={socketHook} />;

  return <ChatRoom socketHook={socketHook} user={user} />;
}
