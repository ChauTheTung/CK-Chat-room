# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY ỨNG DỤNG Chat Room

Tệp này mô tả nhanh cách cài đặt, build và chạy ứng dụng chat (Java / Spring WebSocket) trong repository.

## Yêu cầu trước

- Java JDK 11 hoặc 17 (kiểm tra: `java -version`).
- Maven (kiểm tra: `mvn -v`).
- Dành cho Windows: có sẵn `run.bat` để khởi động nhanh.

## Cấu trúc chính của project

- Thư mục mã nguồn: `chat-app-java/src/main/java`.
- File cấu hình/ tài nguyên front-end: `chat-app-java/src/main/resources/static` (HTML/CSS/JS).
- File pom: `chat-app-java/pom.xml`.

## Build (dùng Maven)

Mở terminal (bash.exe, PowerShell hoặc CMD) trong thư mục `chat-app-java`:

```bash
cd c:/Users/DELL/Downloads/CK-Chat-room-main/CK-Chat-room-main/chat-app-java
mvn clean package -DskipTests
```

Sau khi build thành công, file jar sẽ nằm trong `chat-app-java/target/` (ví dụ `chat-app-1.0.0.jar`).

## Chạy ứng dụng

1. Chạy bằng Java trực tiếp:

```bash
java -jar target/chat-app-1.0.0.jar
# hoặc nếu đang ở root repo:
# java -jar chat-app-java/target/chat-app-1.0.0.jar
```

2. Hoặc dùng script Windows (nếu muốn chạy trong cmd):

```powershell
cd "c:/Users/DELL/Downloads/CK-Chat-room-main/CK-Chat-room-main/chat-app-java"
run.bat
```

3. Mở trình duyệt và truy cập:

- http://localhost:8080/ (nếu ứng dụng dùng cổng mặc định 8080)

Giao diện front-end tĩnh nằm trong `src/main/resources/static/index.html` và JS ở `static/js/app.js` sẽ kết nối tới WebSocket endpoint.

## Cấu hình (tùy chỉnh)

- Nếu cần thay đổi cổng, sửa file `application.properties` (có thể ở `src/main/resources/application.properties` hoặc `target/classes/application.properties`) bằng: `server.port=PORT_NUMBER`.
- Nếu cần thay đổi endpoint WebSocket, xem `WebSocketConfig.java` trong `com.multiroomchat.config`.

## Chạy trong môi trường phát triển

- Để nhanh debug trong IDE (IntelliJ/ Eclipse): import project Maven, chạy class `com.multiroomchat.model.ChatApplication` (chứa phương thức main).

## Vấn đề thường gặp & khắc phục

- Build lỗi do JDK: Kiểm tra `JAVA_HOME` và `java -version`.
- Port 8080 đang dùng: đổi `server.port` hoặc tắt tiến trình đang chiếm port.
- Trình duyệt không kết nối WebSocket: kiểm tra Console của devtools, đảm bảo endpoint và path trong `app.js` khớp với endpoint do `WebSocketConfig` khai báo.
- Tĩnh không load CSS/JS: chắc chắn bạn mở đúng đường dẫn `http://localhost:8080/` (Spring Boot phục vụ tài nguyên static từ `resources/static`).

## Kiểm tra nhanh (smoke test)

1. Build jar (như trên).
2. Chạy jar.
3. Truy cập `http://localhost:8080/` và gửi tin nhắn thử trong giao diện web. Xác nhận tin nhắn xuất hiện và không có lỗi WebSocket trong console.

## Gợi ý nâng cao (tùy chọn)

- Docker: tạo `Dockerfile` để đóng gói jar và chạy container (nếu muốn, mình có thể thêm mẫu).
- Các cải tiến: cấu hình logging, HTTPS, cấu hình reverse-proxy (nginx) cho môi trường production.

## Liên hệ & bổ sung

Nếu bạn muốn mình thêm hướng dẫn tạo `Dockerfile`, file cấu hình môi trường (.env) hoặc hướng dẫn deploy lên VPS/Heroku, nói mình biết — mình sẽ bổ sung.

---

File này được tạo tự động để giúp bạn nhanh chóng cài đặt và chạy ứng dụng chat có trong repository.

