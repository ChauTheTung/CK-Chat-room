# Multiroom Chat - Full Java Application

Ứng dụng chat real-time hoàn toàn bằng Java sử dụng Spring Boot.

## ✅ Tính năng

- ✅ **100% Java** - Backend và frontend đều serve từ Java
- ✅ **Spring Boot** - Framework Java hiện đại
- ✅ **WebSocket** - Real-time messaging với STOMP
- ✅ **Tự chứa** - Không cần Apache, PHP, hay server khác
- ✅ **Dễ chạy** - Chỉ cần Java và Maven

## 📋 Yêu cầu

- **Java 17** hoặc cao hơn
- **Maven 3.6+**

## 🚀 Cách chạy

### Cách 1: Dùng script (Dễ nhất)

```cmd
cd chat-app-java
run.bat
```

### Cách 2: Chạy thủ công

```cmd
cd chat-app-java
mvn clean package
java -jar target/chat-app-1.0.0.jar
```

### Cách 3: Chạy với Maven

```cmd
cd chat-app-java
mvn spring-boot:run
```

## 🌐 Sử dụng

1. Chạy server (một trong các cách trên)
2. Mở browser: `http://localhost:8080`
3. Nhập username và room name
4. Bắt đầu chat!

## 📁 Cấu trúc

```
chat-app-java/
├── pom.xml                                    # Maven config
├── run.bat                                    # Script chạy
├── src/main/java/com/multiroomchat/
│   ├── ChatApplication.java                  # Main class
│   ├── config/
│   │   └── WebSocketConfig.java              # WebSocket config
│   ├── controller/
│   │   └── ChatController.java               # REST & WebSocket controller
│   └── model/
│       ├── ChatMessage.java                  # Message model
│       └── MessageType.java                  # Message type enum
└── src/main/resources/
    ├── application.properties                # Config
    └── static/                               # Frontend files
        ├── index.html
        ├── css/style.css
        └── js/app.js
```

## 🔧 Cấu hình

File `application.properties`:
- `server.port=8080` - Port server
- Có thể thay đổi port nếu cần

## ✅ Ưu điểm

- ✅ **Không cần PHP** - Tất cả đều Java
- ✅ **Không cần Apache** - Spring Boot có built-in server
- ✅ **Không cần cấu hình phức tạp** - Chạy là xong
- ✅ **Hiệu suất tốt** - Java performance
- ✅ **Dễ deploy** - Chỉ cần 1 file JAR

## 🎯 So sánh với PHP version

| Tính năng | PHP Version | Java Version |
|-----------|-------------|--------------|
| Backend | PHP + Ratchet | Java + Spring Boot |
| Web Server | Cần Apache/PHP | Built-in (Spring Boot) |
| WebSocket | Ratchet | Spring WebSocket |
| Chạy | 2 server (Apache + PHP) | 1 server (Java) |
| Deploy | Phức tạp | Đơn giản (1 JAR) |

## 📝 Lưu ý

- Client vẫn dùng HTML/JavaScript (vì browser chỉ hiểu HTML/JS)
- Nhưng tất cả được serve từ Java server
- Không cần PHP hay Apache nữa!

---

Chúc bạn thành công! 🎉

