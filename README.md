# Claude TokenVampire

An app that monitors your Claude Code token usage in real time.
Anthropic doesn't tell you how much of your 5-hour rolling quota you've consumed — ClaudeTokenVampire does.

![ClaudeTokenVampire - Logo](Logo.jpg)

## Why not just use claude.ai/settings/usage?

Anthropic's usage page shows a progress bar and "Resets in X hours" — but a rolling window **has no reset moment**, so that bar is [fundamentally misleading](ReadMe%20-How%20Anthropic%20Lies%20To%20You.md). Two users at 100% can have completely different recovery times (15 minutes vs 5 hours) and the progress bar shows the same thing for both.

![ClaudeTokenVampire - Screenshot](ScreenShot.jpg)

## What it does

It puts you in control of your expensive Claude Code tokens:
- Tracks **all token types**: input, output, cache creation, cache reads
- Shows a **5-hour [rolling window](https://gabrielmoraru.com/the-5-hour-mirage-anthropics-diabolical-moving-goalposts-subscription/)** with per-hour bar chart
- Color-coded bars: green → yellow → red as you approach your limit
- Estimates **cost** (configurable $/1M token rates)
- Shows **cache hit rate** and warns when the 5-minute cache gap expires!
- Counts down until the oldest tokens **evaporate** from the window
- Runs quietly in the **system tray** — click the icon to show/hide
- **USES 0 TOKENS** — runs entirely offline, no API calls, no Claude queries


## Install
Install then type _launch vampire_ to see your token usage.
See "How to install.txt" for details.

## Views

- **All Projects** — combined rolling 5h view across everything
- **Per Project** — same chart broken down by project

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

- It opens files in read-only shared mode so it never interferes with Claude Code. 
- Totally local.
- No data is sent anywhere.
- No tokens are wasted.
- No API key required.


## Stars are free

Click the "Star" but ONLY if you think the project deserves it :)
This will encourage future development. 

In the near future: 
- Minimize to systray 
- Show window in "minimal" mode (only show critical info)
- Beep when getting closer to reach maximum quota
- Show waring when you are using Claude during peak hours 
- Rate limit prediction — project velocity forward: "at this pace, limit in 47 min." 
- Budget enforcement via hooks
- Real-time activity indicator — tray icon color change when Claude active.
- Tool call analytics - "Top 10 tool calls" stat.
- Session search — keyword search across sessions. 
- Support for multiple computers (when you use your account in two computers)


----

# User manual 

## All Projects Tab

### Stats Panel (top)

| Label | Meaning |
|-------|---------|
| **Total tokens (5h)** | Sum of all tokens (input + output + cache creation + cache read) in the last 5 hours. Shown as `used / limit`. |
| **Messages** | Number of assistant responses in the 5h window. |
| **Cache hit rate** | `cache_read / (cache_read + input)`. Higher = cheaper. 99%+ is normal for long sessions. |
| **Estimated cost** | USD estimate based on token counts and per-million rates (configurable in Settings). |
| **Next expiry in** | Minutes until the oldest message in the window "falls off" (older than 5h). Usage drops when messages expire. |
| **Cache status** | Two cache tiers shown separately. **5m cache** (SubAgents/tools) = warm if last message < 5 min ago. **1h cache** (main conversation) = warm if last message < 1 hour ago. Orange = 5m cold but 1h still warm. Red = both cold (full rebuild on next message). |
| **Web searches / fetches** | Count of web_search and web_fetch tool calls in the window. |
| **Cache 1h / 5m** | Breakdown of cache creation tokens by tier: 1-hour ephemeral vs 5-minute ephemeral. Display only — already included in total. |

### Chart (bottom)

Each bar = one 15-minute bucket. The full 5h window has 20 bars; the chart also shows 20 older bars (grayed out) for context — 40 bars total spanning 10 hours.

**Y-axis** scales to your per-bucket budget (limit / 20). So if your limit is 88M, the Y-axis tops out at 4.4M per bar.

**Bar colors** (when limit is set):
- Green: < 50% of Y-axis max
- Yellow: 50–75%
- Orange: 75–90%
- Red: >= 90%

**Bar colors** (no limit set): blue (auto-scale mode).
A value label appears above each bar showing the token count for that 15-minute interval.


## Settings

| Setting | Default | Notes |
|---------|---------|-------|
| Max tokens (5h window) | 88,000,000 | Your estimated 5h rolling limit. Set to 0 if unknown (chart switches to auto-scale blue). |
| Cost: input tokens ($/1M) | 3.00 | Anthropic's price per 1M input tokens |
| Cost: output tokens ($/1M) | 15.00 | Per 1M output tokens |
| Cost: cache read ($/1M) | 0.30 | Per 1M cache-read tokens |
| Cost: cache creation ($/1M) | 3.75 | Per 1M cache-creation tokens |
| Refresh interval (seconds) | 60 | How often to re-scan session files. Minimum 10. |
| Start minimized to tray | off | Hide window on app startup |
| Start with Windows | off | Launch at Windows login |

![ClaudeTokenVampire - Screenshot](Screenshot Settings.jpg)


## Tips

- **"CACHE COLD" warning**: Two tiers. **5-min cache** (SubAgents/tools): expires after 5 min idle — step away briefly and SubAgent calls get more expensive. **1-hour cache** (main conversation): expires after 60 min idle — the full prompt rebuild only hits when you've been away for over an hour. Orange = SubAgent cache cold, main cache still warm. Red = both cold.
- **Next expiry**: When this hits 0, your oldest messages roll off and total usage drops. Useful to know if you're near the limit — just wait.
- **Per-hour chart**: Helps spot usage spikes. A single heavy hour (large bar) suggests a big refactor or long conversation.
- **Cost estimate**: Approximate. Real billing may differ. Useful for relative comparison.

