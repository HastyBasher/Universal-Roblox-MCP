@echo off
echo ========================================
echo Roblox Unified MCP - Build & Install
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Installing dependencies...
call pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Building all packages...
call pnpm build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/3] Verifying build...
if exist "packages\server\dist\index.js" (
    echo SUCCESS: Build complete!
    echo.
    echo Server entry point: packages\server\dist\index.js
    echo.
    echo Add this to your MCP client config:
    echo   "command": "node"
    echo   "args": ["c:\\Users\\warcr\\.cursor\\roblox-mcps\\roblox-unified-mcp\\packages\\server\\dist\\index.js"]
) else (
    echo ERROR: Build output not found
    pause
    exit /b 1
)

echo.
pause
