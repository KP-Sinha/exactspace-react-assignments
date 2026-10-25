import React, { useState } from 'react';
import '../styles/MessageInput.css';

/**
 * MessageInput - Composer component handling text input, Enter key submits, and Send button.
 */
function MessageInput({ onSendMessage }) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isSendDisabled = inputText.trim().length === 0;

  return (
    <form className="message-input-form" onSubmit={handleSubmit} aria-label="Send a message">
      <div className="input-wrapper">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message here... (Press Enter to send)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message content"
          autoComplete="off"
        />
      </div>
      <button 
        type="submit" 
        className="send-button" 
        disabled={isSendDisabled}
        aria-label="Send message"
      >
        <span>Send</span>
        <svg 
          className="send-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
}

export default MessageInput;
