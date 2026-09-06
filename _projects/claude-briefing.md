---
layout: project
title: "Claude Briefing: A Daily Briefing on Your Own Engineering Work"
thumb: /assets/img/project/claude-briefing-banner.png
date: 2026-09-05
permalink: /projects/claude-briefing/
repo: https://github.com/aurelpow/claude-briefing
external_url: https://github.com/aurelpow/claude-briefing
summary: "A Claude Code skill that answers one question every morning: what is different today? It reads five sources, a bash script gathers the facts and a Markdown file supplies the judgment, then posts one screen to Discord."
tags: [Claude Code, Bash, Automation, MCP, Discord, Developer Tools, Productivity]
---

A **Claude Code skill** that produces a daily briefing on your own engineering work. You type `/briefing` and get one screen covering your git state, your Claude Code session transcripts, GitHub, your inbox and your Notion goals 🧭.

The design rule behind every decision: a briefing answers **"what is different today?"**, not "what is going on?". A briefing that reports the same true facts every morning is one you stop reading by Thursday.

---

## 🔑 Key Highlights

- **Five inputs, one screen** 🗂️: local git state, Claude Code JSONL transcripts, GitHub (`gh`), Gmail and Notion.
- **Facts and judgment are separate files** ✂️: `collect.sh` is deterministic bash with no model involved, `SKILL.md` is prose that decides what matters. Missing information is a script bug, a wrong opinion is a prose bug.
- **The transcript input** 📝: every Claude Code session already writes a JSONL log to `~/.claude/projects/`. The last assistant message of a session is usually a status report, which is the highest value line in the whole briefing.
- **Cross referencing** 🔍: open GitHub issues on repos that *also* have uncommitted work on disk get their own section, because that pairing is the most useful thing the tool can surface.
- **Every input is optional** 🧯: no `gh`, no auth, no wifi or a dead connector each cost one line of output instead of failing the run.
- **Least privilege delivery** 🔒: a Discord webhook URL, not a bot token. If it leaks, the damage is spam in one channel.

---

## 🏗️ How It Is Built

```
claude-briefing/
  collect.sh    deterministic scan, no LLM, prints plain text
  SKILL.md      what matters, how to say it, where to send it
  post.sh       delivery, reads JSON on stdin, POSTs to a webhook
  briefing.plist  optional launchd job, weekdays at 08:00
```

The split is not a style preference. GitHub has a CLI, so `collect.sh` calls `gh` directly. Gmail and Notion are **MCP servers**, which means only the model can reach them. What each layer can physically call decided where the line went.

| input | what it answers | how it is read |
|---|---|---|
| Local git state | What was I in the middle of? | `git` in the script |
| Claude Code transcripts | What was I *thinking*? | JSONL files on disk |
| GitHub | Who is blocked on me? | `gh` CLI in the script |
| Gmail | What needs a reply? | MCP connector |
| Notion | What did I say I would study? | MCP connector |

---

## 🚀 Quick Start

```bash
git clone https://github.com/aurelpow/claude-briefing.git
ln -s "$(pwd)/claude-briefing" ~/.claude/skills/briefing
```

Then run the collector on its own first. No model, no cost, no connectors needed:

```bash
./collect.sh 1
```

Add the inputs you want after that. `gh auth login` for GitHub, the Gmail connector on claude.ai for mail, and `claude mcp add --transport http notion https://mcp.notion.com/mcp` for Notion. Every one is optional.

---

## 🔮 Next Steps

- Detect **staged** changes, not just unstaged ones, so a fully staged repo stops reading as clean.
- A scheduled cloud routine over a private snapshot, so the whole briefing works with the laptop shut.
- Per-source windows, so mail and git do not have to share the same lookback.

---

Full write up of the design decisions, the rules that were harder to write than the code, and the bug I shipped: [The Best Input to My Daily Briefing Was Already on My Laptop]({{ '/2026/09/05/daily-briefing-claude-code-skill.html' | relative_url }}).
