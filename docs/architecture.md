# Multiroom Chat Architecture

## Overview

Multiroom Chat là một ứng dụng chat real-time hỗ trợ nhiều phòng chat (rooms) sử dụng WebSocket protocol.

## System Architecture

```
┌─────────────┐
│   Client    │ (Web Browser / CLI)
│  (WebSocket)│
└──────┬──────┘
       │
       │ WebSocket Connection
       │
┌──────▼──────────────────────────┐
│      ChatServer                 │
│  ┌──────────────────────────┐  │
│  │   RoomManager             │  │
│  │  - Manage rooms           │  │
│  │  - Manage connections     │  │
│  │  - Broadcast messages     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │   Protocol               │  │
│  │  - Message encoding      │  │
│  │  - Message validation    │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │   Logger                 │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
       │
       │ (Optional)
       │
┌──────▼──────┐
│   Storage   │ (SQLite / JSON)
└─────────────┘
```

## Components

### ChatServer
- Main WebSocket server class
- Implements `MessageComponentInterface` từ Ratchet
- Xử lý connection lifecycle (onOpen, onMessage, onClose, onError)
- Route messages đến appropriate handlers

### RoomManager
- Quản lý rooms và users
- Maintains mapping: `room_name => [ClientConnection, ...]`
- Maintains mapping: `resourceId => ClientConnection`
- Handles join/leave operations
- Broadcasts messages to room members

### ClientConnection
- Wrapper cho Ratchet ConnectionInterface
- Stores metadata: username, currentRoom
- Provides convenient send/close methods

### Protocol
- Định nghĩa message format
- Encoding/decoding JSON messages
- Validation helpers
- Message type constants

### Logger
- Logging utility
- Supports different log levels (INFO, ERROR, WARNING, DEBUG)
- Can log to file or console

## Data Flow

### Join Room Sequence

```
Client                    Server
  │                         │
  │─── JOIN ───────────────>│
  │                         │─── RoomManager.joinRoom()
  │                         │─── Validate room/username
  │                         │─── Add to room
  │<── SUCCESS ─────────────│
  │                         │─── Broadcast USER_JOINED
  │                         │    to other clients
```

### Send Message Sequence

```
Client                    Server
  │                         │
  │─── MSG ────────────────>│
  │                         │─── Validate message
  │                         │─── RoomManager.broadcastToRoom()
  │                         │
  │<── MSG ─────────────────│ (to all clients in room)
  │<── MSG ─────────────────│
```

### Leave Room Sequence

```
Client                    Server
  │                         │
  │─── LEAVE ──────────────>│
  │                         │─── RoomManager.leaveRoom()
  │                         │─── Remove from room
  │<── SUCCESS ─────────────│
  │                         │─── Broadcast USER_LEFT
  │                         │    to other clients
```

## Storage (Future Enhancement)

Hiện tại server lưu state trong memory. Có thể mở rộng để lưu vào:

- **SQLite**: Lưu message history, room metadata
- **JSON File**: Simple file-based storage
- **Database**: MySQL/PostgreSQL cho production

## Deployment

### Development
```bash
php server/bin/chat-server.php
```

### Production
- Sử dụng systemd service
- Hoặc Docker container
- Có thể dùng nginx reverse proxy cho WebSocket

## Security Considerations

1. **Input Validation**: Tất cả input từ client đều được validate
2. **Rate Limiting**: (Future) Giới hạn số message per second
3. **Authentication**: (Future) Có thể thêm authentication
4. **CORS**: Config allowed origins trong config.php
5. **Message Sanitization**: Escape HTML trong web client

## Scalability

Hiện tại là single-server implementation. Để scale:

1. **Horizontal Scaling**: Sử dụng message queue (Redis/RabbitMQ) để sync giữa servers
2. **Load Balancer**: Distribute connections across multiple servers
3. **Sticky Sessions**: Ensure client luôn connect đến cùng server instance

## Monitoring

- Logs được ghi vào `server/logs/server.log`
- Dashboard có thể hiển thị stats (rooms, users, messages)
- API endpoints cho monitoring

