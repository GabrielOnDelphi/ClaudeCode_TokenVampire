# Claude TokenVampire

An app that monitors your Claude Code token usage in real time.
Anthropic doesn't show you how much of your current 5-hour session quota you've consumed - ClaudeTokenVampire does.

![ClaudeTokenVampire - Logo](Logo.jpg)

> **Full documentation (user manual, settings, tips, roadmap) lives on the website:**
> **[gabrielmoraru.com/my-delphi-code/token-vampire](https://gabrielmoraru.com/my-delphi-code/token-vampire/)**

## How Anthropic's 5-hour window works

**Session-based, not sliding.** Your 5-hour clock starts on your first message and runs for exactly 5 hours, then the counter hard-resets. The next session starts on the first message after that reset.

Source: [Anthropic support article 12429409](https://support.claude.com/en/articles/12429409-manage-extra-usage-for-paid-claude-plans) - *"Your plan's included usage limit will reset every five hours once you reach it."*

![ClaudeTokenVampire - Screenshot](ScreenShot.jpg)

## What it does

- Tracks **all billable token types**: input, output, cache creation, cache reads
- Shows the **current 5-hour session** as a bar chart, with a countdown to the hard reset
- Shows Anthropic's **own** percentage, read from Claude Code's statusline (Pro/Max only), beside this PC's own count
- Estimates **cost per model** - Opus, Sonnet, Haiku and Fable are each priced at their own rate
- Tracks the **7-day weekly cap** next to the 5-hour session
- Shows **cache hit rate** and warns before a cold cache makes the next message expensive
- **Per project** - the same chart and stats for each project
- **Top tool calls** - the tools your sessions use most over the last 7 days, with their estimated cost
- **Recent sessions** - read a past session and reopen it in its own terminal. Written after a power failure killed eleven sessions at once
- **Restore several sessions at once** - tick them and reopen them in one go
- **Cost per session** in the Recent sessions list, and **cost per prompt** in its transcript viewer - see which prompt burned the tokens
- **API value** - what your Claude Code use would cost at API list prices, per month and model, with a "Copy as text" button
- Runs quietly in the **system tray**, scans in the background, never freezes
- **USES 0 TOKENS by default** - runs entirely offline, no API calls. The optional auto-ping is opt-in and costs tokens on every ping

## Views

- **All Projects** - the current session across everything
- **Tools** - the top 10 tool calls over the last 7 days
- **Per Project** - the same chart, one project at a time
- **Recent sessions** - your latest sessions, to read or reopen
- **API value** - your use priced at API list prices, per month

## Install

1. Copy this folder somewhere permanent (e.g. `C:\Tools\ClaudeTokenVampire`)
2. Double-click `Install.cmd`
3. In Claude Code, run: `/reload-plugins`

**Launch (two ways):**
- **Fast:** Type `launch vampire`, `start vampire`, or `token monitor` in Claude Code (instant, no thinking delay)
- **Skill:** Type `/claudetokenvampire:monitor` in Claude Code (~5 sec, loads full context)

See `How to install.txt` for troubleshooting.

## Requirements

- Windows 10/11 (macOS coming soon)
- Claude Code (no API keys needed)
- No external libraries needed

## Safety

- Opens files in read-only shared mode - never interferes with Claude Code
- Totally local. No data is sent anywhere
- No API key required

## Documentation

The user manual, the settings reference, the tips and the roadmap are on the website:

**[gabrielmoraru.com/my-delphi-code/token-vampire](https://gabrielmoraru.com/my-delphi-code/token-vampire/)**

## Stars are free

Click the "Star" - but only if you think the project deserves it :)
High-starred projects get priority for new features.

---

*If AI-assisted Delphi development interests you, see my book [Delphi in all its glory – AI-Assisted Development for Delphi](https://www.amazon.com/Delphi-all-its-glory-AI-assisted/dp/B0GTDXDGDK).*
