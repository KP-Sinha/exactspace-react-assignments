import React, { useState, useRef, useCallback } from 'react';
import EmojiPicker from './EmojiPicker';
import MentionDropdown from './MentionDropdown';
import '../styles/MessageInput.css';

const ALL_USERS = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];

/**
 * MessageInput - Composer component supporting:
 * 1. Plain text and Enter submission
 * 2. Emoji picker inserting at cursor position
 * 3. @User mentions autocomplete with ArrowUp/Down and Enter selection
 */
function MessageInput({ onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Mention dropdown state
  const [mentionQuery, setMentionQuery] = useState(null); // string or null
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);

  const inputRef = useRef(null);

  // Check for mention trigger whenever text changes
  const checkMentionTrigger = useCallback((text, cursorPosition) => {
    // Look backward from cursor position to find '@'
    const textBeforeCursor = text.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      // Check if '@' is at the start or preceded by a whitespace
      const charBeforeAt = textBeforeCursor[lastAtIndex - 1];
      const isValidStart = lastAtIndex === 0 || /\s/.test(charBeforeAt);

      const queryAfterAt = textBeforeCursor.slice(lastAtIndex + 1);

      // Mentions query should not contain whitespace
      if (isValidStart && !/\s/.test(queryAfterAt)) {
        const matching = ALL_USERS.filter((user) =>
          user.toLowerCase().startsWith(queryAfterAt.toLowerCase())
        );

        setMentionQuery(queryAfterAt);
        setMentionStartIndex(lastAtIndex);
        setFilteredUsers(matching);
        setSelectedMentionIndex(0);
        return;
      }
    }

    // Otherwise close mention dropdown
    setMentionQuery(null);
    setMentionStartIndex(-1);
    setFilteredUsers([]);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    const cursorPos = e.target.selectionStart;
    setInputText(val);
    checkMentionTrigger(val, cursorPos);
  };

  // Select mention
  const handleSelectMention = useCallback(
    (username) => {
      if (mentionStartIndex === -1 || !inputRef.current) return;

      const beforeMention = inputText.slice(0, mentionStartIndex);
      const afterCursor = inputText.slice(inputRef.current.selectionStart || inputText.length);
      const newText = `${beforeMention}@${username} ${afterCursor}`;

      setInputText(newText);
      setMentionQuery(null);
      setMentionStartIndex(-1);
      setFilteredUsers([]);

      // Restore focus and cursor position right after the inserted mention
      const newCursorPos = beforeMention.length + username.length + 2; // for '@' and space
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    },
    [inputText, mentionStartIndex]
  );

  // Insert emoji at cursor position
  const handleSelectEmoji = useCallback(
    (emoji) => {
      const input = inputRef.current;
      if (!input) {
        setInputText((prev) => prev + emoji);
        return;
      }

      const start = input.selectionStart ?? inputText.length;
      const end = input.selectionEnd ?? inputText.length;

      const newText = inputText.slice(0, start) + emoji + inputText.slice(end);
      setInputText(newText);

      // Restore cursor position right after inserted emoji
      const nextCursorPos = start + emoji.length;
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(nextCursorPos, nextCursorPos);
      }, 0);
    },
    [inputText]
  );

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setInputText('');
    setMentionQuery(null);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    // If mention dropdown is open, intercept navigation keys
    if (mentionQuery !== null && filteredUsers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev + 1) % filteredUsers.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev === 0 ? filteredUsers.length - 1 : prev - 1
        );
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleSelectMention(filteredUsers[selectedMentionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMentionQuery(null);
        setFilteredUsers([]);
        return;
      }
    }

    // Normal message submit on Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isSendDisabled = inputText.trim().length === 0;

  return (
    <form className="message-input-form" onSubmit={handleSubmit} aria-label="Send a message">
      {/* Mention dropdown */}
      {mentionQuery !== null && filteredUsers.length > 0 && (
        <MentionDropdown
          users={filteredUsers}
          selectedIndex={selectedMentionIndex}
          onSelectUser={handleSelectMention}
        />
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <EmojiPicker
          onSelectEmoji={handleSelectEmoji}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Emoji trigger button */}
      <button
        type="button"
        className={`emoji-toggle-btn ${showEmojiPicker ? 'is-active' : ''}`}
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        aria-label="Toggle emoji picker"
        title="Add emoji"
      >
        😊
      </button>

      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Type your message... (Use @ to mention a user)"
          value={inputText}
          onChange={handleInputChange}
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
