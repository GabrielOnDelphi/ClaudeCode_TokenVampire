@echo off
echo Installing ClaudeTokenVampire plugin...
echo.
node "%~dp0setup.js" install
if errorlevel 1 (
    echo.
    echo Installation FAILED.
    pause
    exit /b 1
)
echo.
echo Next step: run /reload-plugins in Claude Code
pause
