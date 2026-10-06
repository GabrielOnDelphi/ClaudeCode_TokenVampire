# Claude TokenVampire

An app that monitors your Claude Code token usage in real time.
Anthropic doesn't show you how much of your current 5-hour session quota you've consumed — ClaudeTokenVampire does.

![ClaudeTokenVampire - Logo](Logo.jpg)

> **Full documentation lives on the website:**
> **[gabrielmoraru.com/my-delphi-code/token-vampire](https://gabrielmoraru.com/my-delphi-code/token-vampire/)**

## How Anthropic's 5-hour window actually works

**Session-based, not sliding.** Your 5-hour clock starts on your first message and runs for exactly 5 hours regardless of activity, at which point the counter hard-resets. The next session starts on the first message after that reset. Anthropic uses the word "rolling" in their docs but means "cycles session-to-session", not "continuously sliding".

Source: [Anthropic support article 12429409](https://support.claude.com/en/articles/12429409-manage-extra-usage-for-paid-claude-plans) — *"Your plan's included usage limit will reset every five hours once you reach it."*

![ClaudeTokenVampire - Screenshot](ScreenShot.jpg)

## What it does

It puts you in control of your Claude Code tokens:
- Tracks **all billable token types**: input, output, cache creation, cache reads
- Shows the **current 5-hour session** with a per-bucket bar chart from `session_start → session_end`
- Color-coded bars: green → yellow → red as you approach your limit
- Estimates **cost per model** — Opus, Sonnet, Haiku and Fable are each priced at their own rate, and a "Models used" row shows the mix
- Shows Anthropic's **own** percentage, read from Claude Code's statusline (Pro/Max only). By default it leads the 5-hour bar and the weekly row, because it counts your whole account (every PC, claude.ai); this PC's own count is shown beside it. Settings > "Main bar shows" switches the bar to this PC's count
- Counts **each reply once** — Claude Code writes one reply as several log lines, and counting every line made totals about 2.5x too high before version 1.2.0
- Shows **cache hit rate** and warns when the 5-minute cache gap expires
- Counts down until the session **hard-resets** (all tokens reset at once, not gradually)
- Tracks the **7-day weekly cap** with its own configurable limit and ratio bar
- **Top tool calls** — ranks the tools your sessions hit most over the last 7 days, with calls / cost / avg duration
- **Recent sessions** — lists your latest Claude Code sessions with their `/rename` names, lets you read one, and reopens it in its own terminal. Written after a power failure killed eleven sessions at once
- Scans in the background with a disk cache, so the window never freezes, even with gigabytes of session logs
- Runs quietly in the **system tray** — click the icon to show/hide
- **USES 0 TOKENS by default** — runs entirely offline, no API calls, no Claude queries (the optional auto-ping feature is opt-in and costs tokens on every ping, see below)

## Features

### Data Engine
- Parses all billable token types: input, output, cache creation, cache read
- Sorts entries by timestamp; skips non-`assistant` entries
- One entry per reply (`message.id` + `requestId`), even when Claude Code writes the reply as several lines or a subagent log repeats it
- Reads session logs whose full path is longer than 260 characters
- Reads only the bytes appended since the last scan; logs untouched for more than 8 days are skipped
- **Detects the current 5-hour session**: first message where no predecessor exists within 5h; session runs for exactly 5h from there
- Aggregates only entries inside `[SessionStart, SessionEnd]` — matches what Anthropic counts
- Per-project breakdown, sorted descending by token usage
- Configurable bucket width (2-60 minutes per chart bar)

### Computed Stats (per session, global and per-project)
- Total tokens: input + output + cache creation + 10% of cache read (an estimate: Anthropic does not publish how cache reads count against the quota)
- Per-type token breakdown
- Message count (assistant turns) in current session
- Cache hit rate: `cache_read / (cache_read + input)`
- Cost estimate in USD, each reply priced at its own model's published rate; four configurable $/1M rates cover models the app does not know yet
- Minutes until session hard-reset (`SessionEnd - Now`)
- Idle minutes since the last message
- Cache gap warning with per-tier detection (5m and 1h shown as two separate gradient bars on the cache-status row)
- Cache tier breakdown: 1h ephemeral vs 5m ephemeral tokens
- Web search and web fetch counts
- **7-day total tokens** (true sliding window) with optional weekly cap

### All Projects Tab
- Combined stats across all projects
- Five gradient progress bars: token usage, cache hit rate, session-reset countdown, cache 1h warmth, cache 5m warmth (last two share the cache-status row side-by-side)
- Bar chart spanning the current session window (left edge = `SessionStart`, right edge = `SessionEnd`)
- Configurable bucket width
- Color-coded bars: green → yellow → orange → red by % of per-slot budget
- Auto-scale blue mode when no limit is configured
- Token value labels above each active bar
- Y-axis with token count labels
- X-axis with hour offsets (`start`, `+1h`, `+2h`, `+3h`, `+4h`, `end (reset)`)
- 10% horizontal grid lines; vertical hour-mark grid lines
- Legend (color key or auto-scale note)
- Cache status row: two side-by-side gradient bars (1h tier fills available width, 5m tier fixed-width on the right) plus a short "Xm idle" label — each bar fills as its tier ages toward expiry
- **Models used** row: the model mix for the session, largest share first, with each model's own cost
- Detailed tooltips on every stat label

### Per Project Tab
- Project list: active projects (with token counts) and inactive known projects (gray, separated)
- Per-project stats: tokens, messages, cache hit rate, cost, expiry, cache status
- Per-project bar chart (same renderer, filtered data)
- Selection preserved across automatic refreshes

### Tools Tab
- Top-10 tool calls over the last 7 days
- Three columns: **Calls** / **Cost (est.)** / **Avg ms**, each resizable
- Lazy refresh: scan only fires when you open the tab — never burns CPU in the background
- Cost attribution: each turn's output tokens split evenly across the turn's tool_uses, priced at **that turn's model's** output rate
- Pairs `tool_use` and `tool_result` JSONL entries for accurate duration measurement

### Recent Sessions Tab

Born from a real power failure that killed eleven open sessions at once. The transcripts survive that; the terminals do not.

- Lists your most recently used Claude Code sessions, **newest first** — so everything one crash killed shows up as a tight band at the top
- **Read a session**: click a row and its conversation appears below the grid. Tool calls, tool results, thinking blocks and system reminders are stripped out, so what you see is what was actually said
- **Reopen a session**: double-click a row (or press the button) and it comes back in its own terminal, in its original folder, via `claude --resume`
- Hover a row for the full working-directory path
- A session that is still running is marked `running now`; reopening it asks you first — two Claude Code windows on one transcript is not something you want
- Shows the name you gave a session with `/rename`
- Headless runs (`claude -p`, Agent SDK) are hidden unless you tick "Show automated sessions"
- Choose how many sessions to list (5 to 200, remembered between runs)
- Subagent transcripts are excluded: they look like sessions but cannot be resumed

### Auto-Ping (Optional, Opt-In)
- Disabled by default to keep the "0 tokens" promise intact
- Smart trigger: pings Claude only when no session is active (fires immediately on the first such tick — bypasses the interval gate), or when the current session is within 30 minutes of its hard-reset
- User-configurable interval (30 to 240 minutes, default 60)
- Spawns `claude -p --model haiku "hi"` headless via `cmd.exe` — no visible window, detached
- The ping runs with your hooks switched off (`disableAllHooks`), so no beep and no window jumps to the front; hooks forced by an administrator policy still run
- The ping does not inherit TokenVampire's own Claude Code session variables, so it saves its transcript and its tokens show up in the totals
- After 3 consecutive spawn failures it disables itself for the run; re-arms (clearing the failure latch and re-enabling boundary-fire) when you toggle Auto-Ping back ON in Settings
- Costs real tokens: each ping is a full Claude Code start, which still loads your CLAUDE.md files. One measured ping used about 44,000 tokens (almost all of it cache traffic, not the reply), now billed at the Haiku rate

### Vote Prompt (One-Time)
- After your 3rd launch, asks once whether you want to help shape the next feature
- Three buttons: Vote now (opens GitHub Discussions), Remind me later (7 days), Never (permanent)
- ESC / X-button defaults to "Remind me later" — never re-fires on the same launch

### General UI
- Status bar: last scan time, session files scanned, messages in 5h, active project count
- Manual refresh button
- Settings dialog
- FMX skin / theme picker (multiple built-in skins)
- Auto-refresh timer (configurable interval, default 60 s)
- Form position auto-saved and restored (LightSaber TLightForm)
- User configurable time per bar (default: one bar = 15 minutes)

### Plugin & Distribution
- Claude Code plugin installed via Node.js (no admin required)
- Skill: `/claudetokenvampire:monitor`
- Hook-based **instant launch** (bypasses the model entirely): type _launch vampire_, _start vampire_, or _token monitor_
- Windows directory junctions for skill cache discovery (no admin, zero-copy, stays in sync)
- `Install.cmd` / `Uninstall.cmd` wrappers for double-click install

## Views

- **All Projects** — combined current-session view across everything
- **Tools** — Top-10 tool calls over the last 7 days
- **Per Project** — same chart broken down by project
- **Recent sessions** — your latest sessions, to read or reopen

## Install

1. Copy this folder somewhere permanent (e.g. `C:\Tools\ClaudeTokenVampire`)
2. Double-click `Install.cmd`
3. In Claude Code, run: `/reload-plugins`

**Launch (two ways):**
- **Fast:** Type `launch vampire`, `start vampire`, or `token monitor` in Claude Code (instant, no thinking delay)
- **Skill:** Type `/claudetokenvampire:monitor` in Claude Code (~5 sec, loads full context)

See `How to install.txt` for troubleshooting.

## Requirements

- Windows 10/11
- Claude Code (no API keys needed)
- No external libraries needed

## Platform support

| Platform | Status |
|----------|--------|
| Windows  | Available now |
| macOS    | Coming soon |

The codebase uses FMX (FireMonkey), which is cross-platform. The macOS port mainly requires swapping `%USERPROFILE%\.claude\` for `~/.claude/`.

## Safety

- Opens files in read-only shared mode — never interferes with Claude Code.
- Totally local.
- No data is sent anywhere.
- No tokens are wasted (auto-ping is opt-in; when enabled, each ping costs tokens).
- No API key required.

## Documentation

The **full user manual, settings reference, tips, roadmap and the "How Anthropic Lies To You" essay** are on the website:

**[gabrielmoraru.com/my-delphi-code/token-vampire](https://gabrielmoraru.com/my-delphi-code/token-vampire/)**

## Stars are free

Click the "Star" — but only if you think the project deserves it :)
High-starred projects get priority for new features.

---

*If AI-assisted Delphi development interests you, see my book [Delphi in all its glory – AI-Assisted Development for Delphi](https://www.amazon.com/Delphi-all-its-glory-AI-assisted/dp/B0GTDXDGDK).*
