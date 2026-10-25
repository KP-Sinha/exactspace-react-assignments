import React from 'react';
import { getUserColor, formatTime } from '../utils';

/**
 * MessageItem - Renders an individual chat message with author, avatar, text, and like button.
 */
function MessageItem({ message, onLike }) {
  const { id, text, author, timestamp, likes } = message;
  const initial = author ? author.charAt(0).toUpperCase() : '?';
  const avatarBg = getUserColor(author);
  const formattedTime = formatTime(timestamp);

  return (
    <article className="message-item" aria-labelledby={`message-author-${id}`}>
      <div 
        className="message-avatar" 
        style={{ backgroundColor: avatarBg }}
        aria-hidden="true"
        title={author}
      >
        {initial}
      </div>

      <div className="message-card">
        <div className="message-meta">
          <span id={`message-author-${id}`} className="message-author">{author}</span>
          <time className="message-time" dateTime={new Date(timestamp).toISOString()}>
            {formattedTime}
          </time>
        </div>

        <div className="message-body">
          <p className="message-text">{text}</p>
          <div className="message-actions">
            <button
              type="button"
              className={`like-button ${likes > 0 ? 'has-likes' : ''}`}
              onClick={() => onLike(id)}
              aria-label={`Like message by ${author}. Currently ${likes} likes`}
            >
              <svg 
                className="like-icon" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span className="like-count">{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default React.memo(MessageItem);
