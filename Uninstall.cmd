@echo off
echo Uninstalling ClaudeTokenVampire plugin...
echo.
node "%~dp0setup.js" uninstall
if errorlevel 1 (
    echo.
    echo Uninstall FAILED.
    pause
    exit /b 1
)
echo.
echo Next step: run /reload-plugins in Claude Code
pause
