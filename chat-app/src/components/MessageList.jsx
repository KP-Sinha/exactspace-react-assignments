import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import '../styles/MessageList.css';

/**
 * MessageList - Renders the scrollable message thread or a friendly empty state.
 */
function MessageList({ messages, onLike }) {
  const bottomRef = useRef(null);

  // Automatically scroll to bottom whenever a new message is added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <section 
      className="message-list" 
      aria-label="Chat messages thread"
      tabIndex={0}
    >
      {messages.length === 0 ? (
        <div className="message-list-empty">
          <div className="empty-state-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h2 className="empty-state-title">No messages yet</h2>
          <p className="empty-state-desc">
            Type something below and hit Send to start the conversation! A team member will be randomly assigned to your message.
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} onLike={onLike} />
        ))
      )}
      <div ref={bottomRef} aria-hidden="true" />
    </section>
  );
}

export default MessageList;
