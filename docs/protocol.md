# Multiroom Chat Protocol

## Overview

Multiroom Chat sử dụng WebSocket protocol với JSON message format để giao tiếp giữa client và server.

## Message Format

Tất cả messages đều có format JSON:

```json
{
    "type": "MESSAGE_TYPE",
    "timestamp": 1234567890,
    "data": {
        // Message-specific data
    }
}
```

## Message Types

### Client → Server

#### JOIN
Client yêu cầu join vào một room.

```json
{
    "type": "JOIN",
    "data": {
        "room": "room_name",
        "username": "user_name"
    }
}
```

**Response:**
- `SUCCESS` với `room` và `users` list nếu thành công
- `ERROR` nếu thất bại (room name invalid, username invalid, etc.)

#### MSG
Client gửi message đến room hiện tại.

```json
{
    "type": "MSG",
    "data": {
        "room": "room_name",
        "username": "user_name",
        "content": "message content"
    }
}
```

**Response:**
- Message được broadcast đến tất cả users trong room (không có response trực tiếp)

#### LEAVE
Client rời khỏi room.

```json
{
    "type": "LEAVE",
    "data": {
        "room": "room_name",
        "username": "user_name"
    }
}
```

**Response:**
- `SUCCESS` nếu thành công

#### LIST_ROOMS
Client yêu cầu danh sách tất cả rooms.

```json
{
    "type": "LIST_ROOMS"
}
```

**Response:**
```json
{
    "type": "SUCCESS",
    "data": {
        "message": "Rooms list",
        "rooms": [
            {
                "name": "room1",
                "userCount": 5
            },
            {
                "name": "room2",
                "userCount": 2
            }
        ]
    }
}
```

#### LIST_USERS
Client yêu cầu danh sách users trong một room.

```json
{
    "type": "LIST_USERS",
    "data": {
        "room": "room_name"
    }
}
```

**Response:**
```json
{
    "type": "SUCCESS",
    "data": {
        "message": "Users in room",
        "room": "room_name",
        "users": ["user1", "user2", "user3"]
    }
}
```

### Server → Client

#### SUCCESS
Server phản hồi thành công.

```json
{
    "type": "SUCCESS",
    "data": {
        "message": "Success message",
        // Additional data
    }
}
```

#### ERROR
Server phản hồi lỗi.

```json
{
    "type": "ERROR",
    "data": {
        "message": "Error message"
    }
}
```

#### MSG
Message từ user khác trong room.

```json
{
    "type": "MSG",
    "data": {
        "room": "room_name",
        "username": "sender_username",
        "content": "message content"
    }
}
```

#### USER_JOINED
Thông báo user mới join room.

```json
{
    "type": "USER_JOINED",
    "data": {
        "room": "room_name",
        "username": "new_user"
    }
}
```

#### USER_LEFT
Thông báo user rời room.

```json
{
    "type": "USER_LEFT",
    "data": {
        "room": "room_name",
        "username": "leaving_user"
    }
}
```

## Validation Rules

### Room Name
- Chỉ chứa alphanumeric characters, underscore (_), và hyphen (-)
- Không có giới hạn độ dài cụ thể (nhưng nên giữ < 50 chars)

### Username
- Chỉ chứa alphanumeric characters, underscore (_), và hyphen (-)
- Tối đa 20 characters

### Message Content
- Không được rỗng
- Tối đa 1000 characters

## Connection Flow

1. Client kết nối WebSocket đến server
2. Server gửi welcome message (SUCCESS)
3. Client gửi JOIN message với username và room name
4. Server validate và thêm client vào room
5. Server gửi SUCCESS với danh sách users hiện tại
6. Server broadcast USER_JOINED đến các clients khác trong room
7. Client có thể gửi/nhận MSG messages
8. Khi client disconnect, server tự động remove khỏi room và broadcast USER_LEFT

## Error Handling

- Invalid message format → ERROR: "Invalid message format"
- Missing required fields → ERROR với message mô tả field thiếu
- Invalid room/username format → ERROR: "Invalid room name" hoặc "Invalid username"
- Not in room when sending message → ERROR: "You must join a room first"
- Room name required but not provided → ERROR: "Room name required"

