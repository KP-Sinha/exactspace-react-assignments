import React from 'react';
import { getUserColor } from '../utils';
import '../styles/MentionDropdown.css';

/**
 * MentionDropdown - Suggestion dropdown showing filtered users when '@' is typed.
 */
function MentionDropdown({ users, selectedIndex, onSelectUser }) {
  if (!users || users.length === 0) return null;

  return (
    <ul
      className="mention-dropdown"
      role="listbox"
      aria-label="User mention suggestions"
    >
      {users.map((user, index) => {
        const isSelected = index === selectedIndex;
        const initial = user.charAt(0).toUpperCase();
        const avatarBg = getUserColor(user);

        return (
          <li
            key={user}
            role="option"
            aria-selected={isSelected}
            className={`mention-item ${isSelected ? 'is-selected' : ''}`}
            onMouseDown={(e) => {
              // Prevent input blur before click finishes
              e.preventDefault();
              onSelectUser(user);
            }}
          >
            <div
              className="mention-avatar-mini"
              style={{ backgroundColor: avatarBg }}
              aria-hidden="true"
            >
              {initial}
            </div>
            <span className="mention-name">
              <span className="mention-tag">@</span>
              {user}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default MentionDropdown;
