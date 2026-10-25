import React from 'react';
import '../styles/ChatHeader.css';

/**
 * ChatHeader - Displays the active channel name, description, and real-time socket connection badge.
 */
function ChatHeader({ connectionStatus = 'connected' }) {
  // connectionStatus: 'connected' | 'connecting' | 'disconnected'
  const statusConfig = {
    connected: { label: 'Live Server', className: 'status-connected' },
    connecting: { label: 'Connecting...', className: 'status-connecting' },
    disconnected: { label: 'Offline', className: 'status-disconnected' },
  };

  const current = statusConfig[connectionStatus] || statusConfig.connected;

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

      <div className={`chat-status-indicator ${current.className}`} role="status">
        <span className="chat-status-dot" aria-hidden="true"></span>
        <span className="chat-status-text">{current.label}</span>
      </div>
    </header>
  );
}

export default ChatHeader;
