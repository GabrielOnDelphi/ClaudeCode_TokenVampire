---
name: monitor
description: Launch ClaudeTokenVampire tray app to monitor Claude Code token usage in real time
disable-model-invocation: true
---

# ClaudeTokenVampire — Token Usage Monitor

Launch ClaudeTokenVampire to monitor your Claude Code 5-hour session token window.
Windows only. Runs as a system-tray app.

```powershell
Start-Process "${CLAUDE_PLUGIN_ROOT}/bin/ClaudeTokenVampire.exe"
```

ClaudeTokenVampire shows:
- Total tokens in the current 5-hour session (input + output + cache)
- Per-bucket bar chart spanning `session_start -> session_end`, color-coded by usage level
- Cache hit rate and cache tier status (warm/cold)
- Estimated cost per model, plus the model mix for the session
- Anthropic's own usage percentage next to the locally computed one (Pro/Max plans)
- Time until the session hard-resets (single reset, not per-message expiry)
- The 7-day cap alongside the session
- Per-project breakdown
- Your top tool calls over the last 7 days
- Your recent Claude Code sessions — read one, or reopen it in its own terminal after a crash
