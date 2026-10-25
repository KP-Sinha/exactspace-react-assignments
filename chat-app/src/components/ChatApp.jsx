import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../styles/ChatApp.css';

// Predefined users as specified in the assignment
const USER_LIST = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];

// Server socket URL (defaults to http://127.0.0.1:4000)
const SOCKET_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://127.0.0.1:4000';

/**
 * ChatApp - Main controller supporting:
 * 1. Express.js + Socket.io real-time chat sync across tabs/clients
 * 2. Fallback to local mode if backend server is unreachable
 * 3. Random author assignment from predefined USER_LIST
 * 4. Immutable like synchronization across all connected clients
 */
function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connected' | 'connecting' | 'disconnected'
  const socketRef = useRef(null);

  // Initialize Socket.io connection with reconnect and cleanup handling
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected to backend server:', socket.id);
      setConnectionStatus('connected');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    // Receive message history on initial connection
    socket.on('init_messages', (initialMessages) => {
      if (Array.isArray(initialMessages)) {
        setMessages(initialMessages);
      }
    });

    // Receive broadcast message from server
    socket.on('new_message', (incomingMessage) => {
      setMessages((prev) => {
        // Prevent duplicate messages if already present
        if (prev.some((m) => m.id === incomingMessage.id)) {
          return prev;
        }
        return [...prev, incomingMessage];
      });
    });

    // Receive live like updates from server
    socket.on('message_liked', ({ messageId, likes }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, likes } : m))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Send message - dispatches through Socket.io when connected, with local fallback
  const handleSendMessage = useCallback(
    (text) => {
      const randomIndex = Math.floor(Math.random() * USER_LIST.length);
      const assignedAuthor = USER_LIST[randomIndex];

      const socket = socketRef.current;

      if (socket && socket.connected) {
        // Real-time broadcast through Socket.io server
        socket.emit('send_message', { text, author: assignedAuthor });
      } else {
        // Local offline fallback if server is not running
        const localMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          text,
          author: assignedAuthor,
          timestamp: new Date().toISOString(),
          likes: 0,
        };
        setMessages((prev) => [...prev, localMessage]);
      }
    },
    []
  );

  // Like message - dispatches through Socket.io when connected, with local fallback
  const handleLike = useCallback(
    (messageId) => {
      const socket = socketRef.current;

      if (socket && socket.connected) {
        // Synchronize like across all connected clients via Socket.io
        socket.emit('like_message', { messageId });
      } else {
        // Local fallback
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, likes: m.likes + 1 } : m
          )
        );
      }
    },
    []
  );

  return (
    <section className="chat-container" aria-label="Team Chat Application">
      <ChatHeader connectionStatus={connectionStatus} />
      <MessageList messages={messages} onLike={handleLike} />
      <MessageInput onSendMessage={handleSendMessage} />
    </section>
  );
}

export default ChatApp;
