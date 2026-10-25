import React, { useState, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../styles/ChatApp.css';

// Predefined users as specified in the assignment
const USER_LIST = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];

/**
 * ChatApp - Main controller for state management, random user assignment,
 * message creation, and immutable like updates.
 */
function ChatApp() {
  const [messages, setMessages] = useState([]);

  // Handles sending a new message with random user assignment
  const handleSendMessage = useCallback((text) => {
    const randomIndex = Math.floor(Math.random() * USER_LIST.length);
    const assignedAuthor = USER_LIST[randomIndex];

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text,
      author: assignedAuthor,
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  // Handles incrementing likes for a specific message immutably
  const handleLike = useCallback((messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  }, []);

  return (
    <section className="chat-container" aria-label="Team Chat Application">
      <ChatHeader />
      <MessageList messages={messages} onLike={handleLike} />
      <MessageInput onSendMessage={handleSendMessage} />
    </section>
  );
}

export default ChatApp;
