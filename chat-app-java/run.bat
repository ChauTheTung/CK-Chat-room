@echo off
chcp 65001 >nul
echo ========================================
echo Multiroom Chat - Full Java Application
echo ========================================
echo.

REM Check if Maven is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Maven khong tim thay!
    echo.
    echo Vui long cai dat Maven: https://maven.apache.org/download.cgi
    echo.
    pause
    exit /b 1
)

REM Check if Java is installed
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Java khong tim thay!
    echo.
    echo Vui long cai dat Java 17 hoac cao hon
    echo.
    pause
    exit /b 1
)

echo [*] Dang build project...
call mvn clean package -q

if %ERRORLEVEL% NEQ 0 (
    echo [X] Build that bai!
    echo.
    echo Vui long kiem tra lai:
    echo   1. Java 17+ da duoc cai dat
    echo   2. Maven da duoc cai dat
    echo   3. Internet connection (de download dependencies)
    echo.
    pause
    exit /b 1
)

echo [*] Dang khoi dong server...
echo.
echo ========================================
echo Server se chay tai: http://localhost:8080
echo WebSocket: ws://localhost:8080/chat
echo.
echo Nhan Ctrl+C de dung server
echo ========================================
echo.

java -jar target\chat-app-1.0.0.jar

pause

