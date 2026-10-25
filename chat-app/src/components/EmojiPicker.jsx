import React, { useEffect, useRef } from 'react';
import { EMOJI_CATEGORIES } from '../emojiData';
import '../styles/EmojiPicker.css';

/**
 * EmojiPicker - Popover with categorized emojis.
 * Accessible with outside-click detection and Escape key handler.
 */
function EmojiPicker({ onSelectEmoji, onClose }) {
  const popoverRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="emoji-picker-popover"
      role="dialog"
      aria-label="Emoji picker"
    >
      <div className="emoji-picker-header">
        <span className="emoji-picker-title">Pick an emoji</span>
        <button
          type="button"
          className="emoji-picker-close"
          onClick={onClose}
          aria-label="Close emoji picker"
        >
          &times;
        </button>
      </div>

      <div className="emoji-picker-body">
        {EMOJI_CATEGORIES.map((cat) => (
          <div key={cat.name} className="emoji-category">
            <div className="emoji-category-title">{cat.name}</div>
            <div className="emoji-grid">
              {cat.emojis.map((emoji, index) => (
                <button
                  key={`${cat.name}-${index}`}
                  type="button"
                  className="emoji-btn"
                  onClick={() => onSelectEmoji(emoji)}
                  aria-label={`Insert emoji ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmojiPicker;
