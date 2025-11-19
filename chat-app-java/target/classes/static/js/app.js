/**
 * WebSocket client using STOMP over SockJS
 */

const ChatClient = {
    stompClient: null,
    username: null,
    currentRoom: null,
    isConnected: false,

    initializeElements() {
        this.joinSection = document.getElementById('join-section');
        this.usernameInput = document.getElementById('username');
        this.roomInput = document.getElementById('room');
        this.joinBtn = document.getElementById('join-btn');
        this.chatSection = document.getElementById('chat-section');
        this.roomNameSpan = document.querySelector('#room-name span');
        this.leaveBtn = document.getElementById('leave-btn');
        this.messagesDiv = document.getElementById('messages');
        this.messageInput = document.getElementById('message-input');
        this.sendBtn = document.getElementById('send-btn');
        this.usersList = document.getElementById('users-list');
        this.refreshUsersBtn = document.getElementById('refresh-users-btn');
        this.statusDiv = document.getElementById('status');
    },

    attachEventListeners() {
        this.joinBtn.addEventListener('click', () => this.handleJoin());
        this.leaveBtn.addEventListener('click', () => this.handleLeave());
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.refreshUsersBtn.addEventListener('click', () => this.refreshUsers());

        this.roomInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleJoin();
        });
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
    },

    connect() {
        const socket = new SockJS('/chat');
        this.stompClient = Stomp.over(socket);
        
        this.stompClient.connect({}, (frame) => {
            this.isConnected = true;
            console.log('✅ Connected: ' + frame);
            this.updateStatus('Connected', 'success');

            // Subscribe to public messages
            this.stompClient.subscribe('/topic/public', (message) => {
                this.handleMessage(JSON.parse(message.body));
            });
        }, (error) => {
            console.error('❌ Connection error:', error);
            this.updateStatus('Connection error', 'error');
            this.isConnected = false;
        });
    },

    handleJoin() {
        const username = this.usernameInput.value.trim();
        const room = this.roomInput.value.trim();

        if (!username || !room) {
            this.updateStatus('Please enter username and room name', 'error');
            return;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username) || username.length > 20) {
            this.updateStatus('Invalid username (max 20 chars, alphanumeric only)', 'error');
            return;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(room)) {
            this.updateStatus('Invalid room name', 'error');
            return;
        }

        if (!this.isConnected) {
            this.connect();
            setTimeout(() => {
                if (this.isConnected) {
                    this.sendJoin(username, room);
                }
            }, 500);
        } else {
            this.sendJoin(username, room);
        }
    },

    sendJoin(username, room) {
        if (!this.stompClient || !this.isConnected) {
            this.updateStatus('Not connected', 'error');
            return;
        }

        const chatMessage = {
            type: 'JOIN',
            sender: username,
            room: room,
            content: username + ' joined!',
            timestamp: Date.now()
        };

        this.stompClient.send("/app/chat.addUser", {}, JSON.stringify(chatMessage));
        this.username = username;
        this.currentRoom = room;
        this.showChatSection();
        this.roomNameSpan.textContent = room;
        this.updateStatus('Joined room: ' + room, 'success');
    },

    handleLeave() {
        if (this.stompClient && this.isConnected && this.currentRoom) {
            const chatMessage = {
                type: 'LEAVE',
                sender: this.username,
                room: this.currentRoom,
                content: this.username + ' left!',
                timestamp: Date.now()
            };
            this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        }

        if (this.stompClient) {
            this.stompClient.disconnect();
        }

        this.isConnected = false;
        this.currentRoom = null;
        this.username = null;
        this.showJoinSection();
    },

    handleSendMessage() {
        const content = this.messageInput.value.trim();
        if (!content || !this.isConnected || !this.currentRoom) {
            return;
        }

        if (content.length > 1000) {
            this.updateStatus('Message too long (max 1000 chars)', 'error');
            return;
        }

        const chatMessage = {
            type: 'CHAT',
            sender: this.username,
            room: this.currentRoom,
            content: content,
            timestamp: Date.now()
        };

        this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        this.messageInput.value = '';
    },

    handleMessage(message) {
        if (message.type === 'JOIN') {
            this.addSystemMessage(message.sender + ' joined the room');
        } else if (message.type === 'LEAVE') {
            this.addSystemMessage(message.sender + ' left the room');
        } else if (message.type === 'CHAT') {
            if (message.room === this.currentRoom) {
                this.addMessage(message.sender, message.content, message.timestamp);
            }
        }
    },

    addMessage(username, content, timestamp) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        const isOwn = username === this.username;
        messageDiv.classList.add(isOwn ? 'own-message' : 'other-message');

        const time = timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="username">${this.escapeHtml(username)}</span>
                <span class="timestamp">${time}</span>
            </div>
            <div class="message-content">${this.escapeHtml(content)}</div>
        `;

        this.messagesDiv.appendChild(messageDiv);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    },

    addSystemMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.textContent = content;
        this.messagesDiv.appendChild(messageDiv);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    },

    refreshUsers() {
        // TODO: Implement user list
        this.updateStatus('User list feature coming soon', 'info');
    },

    showJoinSection() {
        this.joinSection.classList.remove('hidden');
        this.chatSection.classList.add('hidden');
        this.messagesDiv.innerHTML = '';
        this.usersList.innerHTML = '';
    },

    showChatSection() {
        this.joinSection.classList.add('hidden');
        this.chatSection.classList.remove('hidden');
        this.messageInput.focus();
    },

    updateStatus(message, type = 'info') {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `status status-${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                this.statusDiv.textContent = '';
                this.statusDiv.className = 'status';
            }, 3000);
        }
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    ChatClient.initializeElements();
    ChatClient.attachEventListeners();
});

