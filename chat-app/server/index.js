import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173';

const app = express();
app.use(cors({ origin: [CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Predefined allowed users from assignment spec
const VALID_USERS = new Set(['Alan', 'Bob', 'Carol', 'Dean', 'Elin']);

// In-memory message store for active session synchronization
// Note: This in-memory store is non-persistent and resets when the server process restarts.
let messages = [];

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Send current message history to the newly connected client
  socket.emit('init_messages', messages);

  // Handle incoming new message broadcast
  socket.on('send_message', (payload, callback) => {
    try {
      if (!payload || typeof payload !== 'object') {
        if (callback) callback({ error: 'Invalid payload' });
        return;
      }

      const { text, author } = payload;
      const trimmedText = typeof text === 'string' ? text.trim() : '';

      if (!trimmedText) {
        if (callback) callback({ error: 'Message text cannot be empty' });
        return;
      }

      // Validate author against user list (fallback to Alan if invalid)
      const validAuthor = VALID_USERS.has(author) ? author : 'Alan';

      const newMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        text: trimmedText,
        author: validAuthor,
        timestamp: new Date().toISOString(),
        likes: 0,
      };

      messages.push(newMessage);

      // Keep recent 200 messages in memory
      if (messages.length > 200) {
        messages = messages.slice(-200);
      }

      // Broadcast new message to ALL connected clients
      io.emit('new_message', newMessage);

      if (callback) callback({ success: true, message: newMessage });
    } catch (err) {
      console.error('[Socket.io] Error handling send_message:', err);
      if (callback) callback({ error: 'Internal server error' });
    }
  });

  // Handle like increments
  socket.on('like_message', ({ messageId }, callback) => {
    try {
      if (!messageId) {
        if (callback) callback({ error: 'Missing messageId' });
        return;
      }

      const target = messages.find((m) => m.id === messageId);
      if (target) {
        target.likes += 1;
        // Broadcast updated like event to ALL clients
        io.emit('message_liked', { messageId, likes: target.likes });
        if (callback) callback({ success: true, likes: target.likes });
      } else {
        if (callback) callback({ error: 'Message not found' });
      }
    } catch (err) {
      console.error('[Socket.io] Error handling like_message:', err);
      if (callback) callback({ error: 'Internal server error' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[Chat Server] Express & Socket.io server running on http://127.0.0.1:${PORT}`);
});
