---
layout: post
title: "The Best Input to My Daily Briefing Was Already on My Laptop"
date: 2026-09-05
summary: "Every Claude Code session writes a JSONL transcript to ~/.claude/projects/, and it turned out to be the most useful input to a daily briefing on my own work. It reads that alongside my git state, GitHub, my inbox and my Notion goals. A bash script gathers the facts, a Markdown file supplies the judgment."
links:
  - label: "See the project"
    url: "/projects/claude-briefing/"
    kind: primary
  - label: "View on LinkedIn"
    url: "https://www.linkedin.com/in/aurelien-darracq/"
    kind: linkedin
tags: [Claude Code, Automation, Developer Tools, Productivity, AI]
---
> **Level:** Beginner to Intermediate | **Stack:** Bash, Claude Code Skills, MCP (Gmail, Notion), Discord webhooks

> **TL;DR:** Claude Code already logs every prompt you type to a JSONL file on your disk, and that turned out to be the most useful input to a daily briefing on my own work. I built one that reads five sources and posts one screen to Discord. A bash script gathers facts, a Markdown file supplies judgment, and every input is optional. A run takes about a minute, which is the argument for letting it arrive on a schedule.

---

## What I get every morning

This is a real briefing, not a mockup. Nothing here is edited except the
formatting Discord applies to it.

```
📋 Daily briefing · Sat 05 Sep · last 1d

Airflow orchestration ready to land on streamflix

> streamflix/feature/airflow — 3 DAGs (init reference, bronze ingest,
> plus a large working tree touching spark/jobs/*, docker-compose.yml,
> airflow/, docs/). Closes #10 Add Airflow orchestration.
> 14 changed · 2 new DAGs · 6 commits ahead of develop

🔀 PRs                  📬 Inbox                🔓 Unbacked
0 open · 0 to review    2 unread · 0 to reply   1 repo

🚧 Blockers
• Decide commit boundaries before pushing — airflow/dags/* are net-new,
  but spark/jobs/bronze_ingestion.py (+69/-...), docker-compose.yml, and
  the docs churn all changed together and probably want splitting.
• Upstream not tracked locally; first push needs:

    git push -u origin feature/airflow

🔓 Exposure
• aurelpow/macbook-setup — remote configured but repo does not exist on
  GitHub; new untracked claude/ folder has no backup anywhere.

🎓 Career
• Ultimate AWS AI Practitioner course at 90% — target was 15 Aug, 21d over.
• Practice Exams AIF-C01 at 20% — target 15 Sep, 10d out; needs to move if
  the exam holds.
  AIF-C01 exam booked 30 Sep (25d).

collect.sh · window 1d
```

One screen, readable one handed. I know what I am doing today before I sit down.

Three things in there are worth pointing at, because they are the whole
argument for this tool.

**`Closes #10 Add Airflow orchestration`.** Nobody told it that. The collector
noticed the repo had uncommitted work *and* an open GitHub issue, and the model
matched the diff to the issue. That single line is the difference between a
`git status` and a briefing.

**The blocker is a decision, not a chore.** "Decide commit boundaries before
pushing" is a judgment call waiting for me. It is not "you have unsaved files".

**`aurelpow/macbook-setup` has a remote that does not exist.** That repo looks
perfectly healthy to `git`. Push would fail. An untracked `claude/` folder in it
exists on exactly one disk in the world, and I did not know that until the
briefing said so.

I did not have to ask a question to get this. I typed `/briefing`, the same one
command as yesterday, and read the answer while the coffee was still going. The
run takes about a minute, and almost all of that is the model doing the
judgment half.

---

## The fix was not automating it. It was removing the condition.

My first instinct was a tool I would run when I felt lost. I built exactly that, and I used it twice.

The problem is not that it takes a command. The problem is the word *when*. "Run it when you feel lost" is a condition you have to evaluate, and the mornings you most need context are precisely the mornings you feel fine. You open the laptop, recognise the branch name, assume you remember, and lose twenty minutes rediscovering that you had stopped halfway through a refactor.

So I stopped treating it as a rescue tool and made it unconditional. `/briefing` is now the first thing I run every morning, before mail, before the terminal I actually plan to work in. I do not decide whether I need it. On a morning when nothing changed it says so in one green line, and that is a fine price for never having to make the judgment call.

A run takes about a minute, which is short enough to wait for and long enough to be annoying at a cold terminal. That is the honest case for scheduling it, and the repo ships a launchd job that has the briefing on your phone before you sit down.

The framing still changed the product, though. A rescue tool answers "what was I doing?". A daily briefing has to answer a harder question: **"what is different today?"** Almost every design decision below came out of that.

---

## The input most people do not know they have

Every Claude Code session writes a JSONL file to `~/.claude/projects/`. One line per message. Your prompts, the assistant's replies, timestamps, all of it. It is sitting on your disk right now.

```bash
ls ~/.claude/projects/
# -Users-you-Developer-projects-streamflix/
# -Users-you-Developer-tools-claude-briefing/

head -c 300 ~/.claude/projects/*/[0-9a-f]*.jsonl
# {"type":"user","timestamp":"2026-09-05T15:24:11Z","message":{"content":"..."}}
```

That is a log of what you were thinking, in your own words. Not a commit message written after the fact. The actual question you asked at 7pm on Friday.

My collector parses those files and pulls two things per session: the prompts I typed, and the last thing the assistant said. That last assistant message is usually the highest value line in the whole briefing, because it is normally a status report. "Let me check a few loose ends before writing up: lint state, container names, and the producer prerequisite." One sentence, and I know exactly where I stopped.

---

## Five sources, because git is only half your morning

Your own disk tells you what *you* were doing. It says nothing about what other people started waiting on while you were away, and that is usually the more urgent half.

| input | what it answers | how it is read |
|---|---|---|
| Local git state | What was I in the middle of? | `git` in the script |
| Claude Code transcripts | What was I *thinking*? | JSONL files on disk |
| GitHub | Who is blocked on me? | `gh` CLI in the script |
| Gmail | What needs a reply? | MCP connector |
| Notion | What did I say I would study? | MCP connector |

**GitHub** answers the question git cannot. Open pull requests, anything waiting on my review, open issues. The best line it produces is a cross reference: open issues on repos that *also* have uncommitted work on disk. If an issue describes the exact diff sitting on my laptop, that is the most useful sentence in the briefing, so the script groups those separately and the skill leads with them.

**Gmail** answers whether a human is actually waiting on me. It searches unread inbox mail inside the window, and it is told to surface only mail that needs a reply. Newsletters and product announcements get a count at most. GitHub notification mail is ignored outright, because it duplicates the section above it.

**Notion** holds my certifications, projects and study targets. It is the one input that is never about today, so it sits second to last and is never allowed to set the colour.

---

## A bash script cannot read your inbox

Here is where the design got interesting.

GitHub has a CLI. `gh pr list` works in a shell script, so the collector calls it directly. Gmail and Notion do not work that way. They are **MCP servers**, which means the only thing that can call them is the model itself. There is no command I can put in `collect.sh` that returns my unread mail.

That constraint turned out to be clarifying rather than annoying. It meant the split between script and prose was not a style preference I could waffle over. It was forced by what each layer can physically reach.

```
collect.sh   git, filesystem, gh          things a shell can call
SKILL.md     Gmail, Notion, and judgment  things only the model can call
```

Connecting them is a one time setup. Notion is a remote MCP server you add from the terminal:

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

Then run `/mcp` inside Claude Code and log in through the browser. Gmail is different: it is a claude.ai connector, so you enable it once on the web under Settings then Connectors, and Claude Code picks it up automatically because you are signed in with the same account.

---

## Split the facts from the judgment

My first version was one big prompt. "Look at my git repos and tell me what I was doing." It was slow, it was expensive, it re-derived the same `git status` five different ways, and the answer changed every time I ran it.

The fix was to cut the tool in half.

**`collect.sh` gathers facts.** Pure bash and a bit of Python. No model involved. It walks my dev folder, finds every git repo, and reports uncommitted diffs, unpushed branches, recent commits, GitHub state and those session transcripts. It is deterministic, it is free, and I can run it by hand to see exactly what the model will see.

**`SKILL.md` supplies judgment.** Prose, not code. It tells Claude what counts as a blocker, what to ignore, and how to write the result.

```
project/
  collect.sh    deterministic scan, no LLM, prints plain text
  SKILL.md      what matters, how to say it, where to send it
  post.sh       delivery, reads JSON on stdin, POSTs to a webhook
```

The model only does the part that actually needs a model. That made the tool cheap, fast and testable. If the briefing is missing information, I fix the script. If the briefing has the wrong opinion, I fix the prose. Two different problems, two different files.

Claude Code calls this a **skill**: a folder with a `SKILL.md` inside it. Symlink it into `~/.claude/skills/` and it becomes a slash command you can run from any directory.

```bash
git clone https://github.com/aurelpow/claude-briefing.git
ln -s "$(pwd)/claude-briefing" ~/.claude/skills/briefing
```

---

## Running it: by hand, or on a schedule

How I actually use it. Open the laptop, open a terminal anywhere, and run one
command:

```
$ claude
> /briefing
```

You do not need to be in any particular directory. The skill lives in
`~/.claude/skills/briefing`, and it scans `~/Developer` no matter where you
launched from.

### Where the minute goes

A run takes about a minute, and the two halves are lopsided. `collect.sh` is
the fast one: six to nine seconds on my machine, most of it waiting on GitHub
to answer. Everything else is the model reading five sources and deciding what
matters, running on **Opus at high reasoning effort**.

That split is a deliberate trade. The judgment is the part I actually want, and
I would rather wait a minute for a good one than get a fast bad one. Drop to a
smaller model or a lower effort setting and it gets quicker and blunter, which
for a tool whose entire job is deciding what to leave out is the wrong direction.

### Better: let it arrive on its own

A minute is short enough to wait for and long enough to be annoying at a cold
terminal, which is a good reason not to wait at all. The repo ships a launchd
job for weekdays at 08:00 so the briefing is on your phone before you sit down:

```bash
sed "s|/Users/YOU|$HOME|g" briefing.plist > ~/Library/LaunchAgents/com.claude.briefing.plist
launchctl load ~/Library/LaunchAgents/com.claude.briefing.plist
```

The obvious objection is that your laptop is shut at 08:00. That turns out not
to matter, because a closed lid is only sleep, and a sleeping Mac can be woken
on a schedule with the display still off:

```bash
sudo pmset repeat wakeorpoweron MTWRF 07:55:00
```

It wakes at 07:55, launchd fires at 08:00, and the briefing is on your phone
before you touch the machine. Keep it plugged in, because macOS throttles
scheduled wakes on battery. Without that line the job is not lost, just late:
launchd coalesces the missed interval and runs it once when the machine next
wakes, which for a briefing you read when you sit down is arguably correct
anyway.

A **fully powered off** machine is a different story. Nothing runs, and I would
not trust scheduled power-on from a real shutdown on an Apple Silicon laptop.

The interesting part is why that limit matters less than it sounds. **A machine
that is off cannot change its own working tree.** Your diffs, your branches and
your session transcripts are frozen the instant it sleeps. So last night's
`collect.sh` output is still perfectly accurate at 08:00, and only the GitHub,
mail and Notion half needs a live query in the morning. A scheduled cloud
routine reading a private snapshot could cover the whole briefing with the
laptop shut.

I have not built that, because the snapshot would carry every repo and branch
name I own, which needs somewhere private to live. But the constraint is a
design choice, not a wall.

---

## Writing the rules was harder than writing the code

The bash took an afternoon. The prose took much longer, because **a daily briefing that reports everything is a briefing you stop reading by Thursday.**

Four rules did most of the work.

**Uncommitted work is the headline, not a problem.** My first version opened with "you have uncommitted changes in 3 repos." That is a nag, not a briefing. The point is not that work is uncommitted, it is what the work *is*. So the skill is told, in as many words, never to open with "you should commit this."

**Colour encodes whether anything got worse.** Discord embeds have a coloured bar. Red for blocked, amber for work in progress, green for all clear. The trap is obvious in hindsight: if red means "anything looks bad", it is red every single morning, and then red means nothing. So red is reserved for things that became true *today*. Someone is now blocked on me. Work became unbacked overnight.

**Do not report what has not changed.** Unfiltered, my Notion section printed the same three certifications every morning forever. Now only two things earn a line: a target date inside fourteen days, and rows created since the last run. Everything else is noise wearing a hat.

**Say only what you actually know.** Notion's query interface exposes a `createdTime` field but no `lastEditedTime`. So if I flip a certification from Planned to Studying, my tool genuinely cannot see it. The skill is instructed to say "added" and never "updated", because claiming to have noticed an edit would be a quiet lie about coverage.

That last one is the rule I am most glad I wrote down.

---

## Why it lands in Discord

The briefing could just print to my terminal. I send it to Discord instead for two reasons: it follows me to my phone without any extra work, and it leaves a scrollable history, so I can look back at what last Tuesday looked like. The embed format also gives me a title, a coloured bar, inline stat tiles and full width fields for free, which is a lot of structure for no UI work.

Worth saying plainly, because the sender name misleads people: **there is no bot here.** A Discord webhook is just a URL that accepts a POST. You create one in four clicks from a channel's settings, with no application to register and no OAuth. The name you type when creating it becomes the message author, which is why mine posts as `Claude-Bot`, and Discord tags every webhook message with `APP` automatically.

The skill builds a JSON embed and pipes it to a small script:

```bash
~/.claude/skills/briefing/post.sh <<'JSON'
{ "title": "...", "color": 15774258, "fields": [ ... ] }
JSON
```

**A webhook, not a bot token.** The URL lives in a file with `chmod 600`. I already had a Discord bot wired up through an MCP server and it would have worked fine. I did not use it. An unattended job that only ever writes one message to one channel should hold the credential that can *only* do that. If a webhook URL leaks, the damage is spam in one channel. A bot token is full authority across the whole server.

There was a practical reason too. That MCP server runs in Docker and only attaches when a Claude Code session starts. A job scheduled for 08:00 cannot assume Docker Desktop is awake. A webhook is a plain HTTPS POST with nothing to be down.

**No Discord?** The skill falls back to creating a Gmail draft with the same content and states in the first line why. Since Gmail is already connected for reading the inbox, that fallback costs zero extra setup.

---

## The rule that keeps it running

**Every optional input degrades to one line.** No `gh` installed, no auth, or no wifi each cost a single line of output instead of failing the run. Gmail down costs one line. Notion missing costs nothing at all, because a missing study tracker is not news first thing in the morning.

For something scheduled, this matters more than it sounds. A daily job that fails loudly when one connector is down does not just miss one morning. It trains you to ignore it, and then you turn it off.

---

## The bug I shipped

Worth admitting, because it is a good lesson about testing your own assumptions.

The collector calls `git diff` to find uncommitted work. `git diff` does not show **staged** changes. So a repo where I had run `git add` on everything but not committed yet showed up as having no real changes, and got skipped entirely.

For a tool whose headline feature is "surface uncommitted work", that is a real hole. It only surfaced because I staged some files while cleaning the repo up for release and watched the project vanish from its own briefing. The fix is `git diff HEAD`.

Your tool is only as good as the state you actually tested it in.

---

## Try it yourself

1. Clone it and symlink the folder into `~/.claude/skills/briefing`.
2. Run `./collect.sh 1` on its own first. No model, no cost, no connectors needed. See what it finds on your own disk.
3. Add the inputs you want. `gh auth login` for GitHub. The Gmail connector on claude.ai for mail. `claude mcp add --transport http notion https://mcp.notion.com/mcp` for Notion. Every one is optional.
4. Read `SKILL.md` and change the rules. That file is opinions, and they are mine. Yours will differ.
5. Point it at a Discord webhook, or skip it and let it write you a Gmail draft.
6. Optionally load the launchd job, if you would rather it arrived without being asked. I run it by hand and never bothered.

The repo is on [GitHub](https://github.com/aurelpow/claude-briefing) under MIT.

---

## Your turn

The thing that surprised me was not the automation. It was that the highest value input was my own prompts from Friday afternoon, sitting in a JSONL file I did not know existed.

So, two questions. Did you know Claude Code was writing that transcript? And if you had one screen every morning describing your own work, what would you want on it that a `git status` cannot tell you?
