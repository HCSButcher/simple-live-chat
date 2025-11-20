import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, { autoConnect: false });

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const connect = ({ username, role }) => {
    socket.connect();
    if (username) socket.emit("user_join", { username, role });
  };

  const sendMessage = (message, to = null, isPrivate = false) => {
    socket.emit("send_message", { message, to, isPrivate });
  };

  const setTyping = (typing) => socket.emit("typing", typing);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("receive_message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );
    socket.on("private_message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );
    socket.on("user_list", (list) => setUsers(list));
    socket.on("typing_users", (list) => setTypingUsers(list));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive_message");
      socket.off("private_message");
      socket.off("user_list");
      socket.off("typing_users");
    };
  }, []);

  return {
    socket,
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    sendMessage,
    setTyping,
  };
};
