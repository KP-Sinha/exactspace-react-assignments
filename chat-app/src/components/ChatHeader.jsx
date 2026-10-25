import React from 'react';
import '../styles/ChatHeader.css';

/**
 * ChatHeader - Displays the active channel name, description, and status.
 */
function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="chat-header-info">
        <div className="chat-header-icon" aria-hidden="true">
          #
        </div>
        <div className="chat-header-details">
          <h1>Team Chat</h1>
          <p>Introductions</p>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
