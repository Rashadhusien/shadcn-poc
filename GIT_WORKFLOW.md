# GIT_WORKFLOW.md
## Diagnostix phase contract (binding)

This repository follows the user's phase instructions above all generic branch examples in the copied workflow:

- Initial branch is `main`; the working tree must be clean and HEAD must exist before a phase starts.
- Exactly one agent-run mutating git command is allowed per phase: `git switch -c <branch from TASKS.md>`. No add, commit, push, pull, fetch, merge, rebase, reset, restore, checkout, stash, tag, clean, config, or force options. The user stages, commits, pushes, and opens the MR.
- One phase = one branch = one commit. Phase branches are based on the prior accepted phase branch (P00 starts from `main`); the MR targets the project's agreed integration branch. Do not create an integration branch unless the user changes this contract.
- Commit subject is imperative and at most 72 characters. Use an allowed Conventional Commit type from the user prompt. Body has one bullet per task ID. Footer lines are exactly `Refs: shadcn POC, Phase NN` and `AI-Assisted: Claude Code`.
- From P01, phase gate runs `npm run verify`. Save the proposed commit message at `.handoff/phase-NN-commit.txt`; keep `.handoff/`, all license files, and `.env*` ignored (the project `.gitignore` is introduced in P01).
- At every phase end, print branch, base, verify result, commit subject, the user's commands (`git add -A`, `git commit -F .handoff/phase-NN-commit.txt`, `git push -u origin <branch>`), MR title, exactly three description lines, and manual checks. Stop until the user starts the next phase.
- General review, secret handling, MR template, and non-conflicting operational rules copied below remain in force. Where the copied workflow's branch examples conflict with this phase contract, this contract controls.

Version control rules for the project. **Every task and every phase ships through its own branch and a Merge Request (MR). Nobody merges or pushes directly to `main`** — not the developer, not an AI agent.

---

## 0. Project branch model for this port (decided by the developer, 2026-10-02; overrides §2 and §3 where they conflict)

```
main  ─●──────────────────────────────────────────────●──►  (stays at the starting point; one final merge after the last phase)
                                                      /
task     ●────●──────────●──────────●──── … ──────────●     (integration branch: every phase merges here)
                       /         /
     docs/p00-…  ●──────●   chore/p01-…  ●──●             (one branch per phase, created FROM task, merged back INTO task)
```

- **`main`** is not touched while phases run. It receives **one** merge from `task` after the last phase (P13) is approved.
- **`task`** is the integration branch. Every phase branch is created from an up-to-date `task`, and its MR targets `task`.
- **Phase branches** follow the names in TASKS.md (`<type>/pNN-<slug>`). After their MR is merged into `task`, they can be deleted.
- **Agent rule** (CLAUDE.md A3): the agent runs read-only git, plus `git switch -c <phase branch>` from `task`. Nothing else. The developer commits, pushes and merges.

---

## 1. Golden rules

1. `main` is protected. No direct commits, no direct pushes, no force-push, no local merges into `main`.
2. One task = one branch = one MR. One phase = one MR at its gate (see §3).
3. Every commit follows Conventional Commits (`feat`, `fix`, `docs`, …).
4. A branch is opened from an up-to-date `main` (or from its phase branch) and deleted after merge.
5. An MR is merged only after: pipeline/`npm run verify` green, mentor approval (Aya), and all review threads resolved.
6. AI agents (Claude Code, Cursor, Devin) **never run mutating git commands** (`add`, `commit`, `push`, `merge`, `rebase`, `reset`, `checkout -b`, `branch -d`, `tag`, config changes). At the end of each task they output the proposed branch name, commit message(s) and MR text; **the developer** runs git. Read-only commands (`status`, `diff`, `log`, `branch --show-current`) are allowed.
7. If an agent finds the current branch is `main`, it stops and tells the developer before doing any work.
8. No secrets in git: `telerik-license.txt`, `project-ui-license.txt`, `.env*`, tokens, keys. No real patient/customer data.

---

## 2. Branch model

```
main  ─────●──────────────●───────────────●──────►   (protected, only MR merges)
            \            /  \             /
             feat/B3-theme   \  phase/C-port ──┐ (optional phase branch)
                              \   ├─ feat/C1-orders-list ─(MR→phase/C-port)
                               \  └─ feat/C2-dashboard   ─(MR→phase/C-port)
                                └──────── phase MR → main at the gate
```

| Case                                | Branch from                  | MR target           |
| ----------------------------------- | ---------------------------- | ------------------- |
| Small task (default)                | `main`                       | `main`              |
| Phase with several tasks (optional) | `main` → `phase/<ID>-<slug>` | phase MR → `main`   |
| Task inside a phase branch          | `phase/<ID>-<slug>`          | `phase/<ID>-<slug>` |
| Urgent bug on merged code           | `main`                       | `main`              |

Use a phase branch only when the phase has 3+ tasks that depend on each other; otherwise go straight task → `main`.

### Naming

```
<type>/<TASK-ID>-<short-kebab-slug>        e.g.  feat/B3-theme-provider
phase/<PHASE-ID>-<short-kebab-slug>        e.g.  phase/C-feature-port
```

- `<type>` is one of the commit types below. `<TASK-ID>` matches `TASKS.md` (A, B1, B3, C2, D4 …).
- Lowercase, hyphens only, max ~50 characters, no spaces, no personal names.

Examples: `docs/A-angular-analysis`, `chore/B1-scaffold-vite-ts`, `feat/B5-app-shell`, `feat/C1-orders-table`, `fix/C1-orders-mobile-overflow`, `test/C1-orders-table-tests`, `refactor/B6-status-badge-tokens`.

---

## 3. Phase ↔ MR mapping (Diagnostix shadcn port)

| Phase             | Branching                           | MR(s)                                                     |
| ----------------- | ----------------------------------- | --------------------------------------------------------- |
| A — Analysis      | `docs/A-angular-analysis`           | 1 MR (docs only)                                          |
| B — Foundation    | tasks `B1…B6` (each its own branch) | 1 MR per task; optional `phase/B-foundation` MR at Gate B |
| C — Feature port  | tasks per feature/wave (`C1…Cn`)    | 1 MR per feature; optional phase MR at each wave gate     |
| D — QA & evidence | `test/D1-…`, `docs/D4-…`            | 1 MR per task                                             |

A gate report (see the master prompt) is attached to the corresponding MR description.

---

## 4. Commit convention (Conventional Commits 1.0)

```
<type>(<scope>): <subject>

<body — what and why, wrapped at ~72 chars>

<footer>
```

**Types**

| Type       | Use for                                                              |
| ---------- | -------------------------------------------------------------------- |
| `feat`     | new user-facing capability or component                              |
| `fix`      | bug fix                                                              |
| `docs`     | documentation only (`docs/`, README, markdown)                       |
| `style`    | formatting only, no logic change (whitespace, semicolons)            |
| `refactor` | code change that neither fixes a bug nor adds a feature              |
| `perf`     | performance improvement                                              |
| `test`     | add/adjust tests or stories                                          |
| `build`    | build system or dependencies (`package.json`, Vite config)           |
| `ci`       | CI/pipeline config                                                   |
| `chore`    | maintenance that fits nothing else (scaffolding, tooling, gitignore) |
| `revert`   | reverts a previous commit                                            |

**Scopes (lowercase, pick one):** `theme`, `shell`, `kit`, `grid`, `dashboard`, `orders`, `cases`, `workflow`, `patients`, `doctors`, `clinics`, `billing`, `documents`, `settings`, `auth`, `data`, `router`, `a11y`, `tests`, `storybook`, `deps`, `docs`, `config`.

**Subject:** imperative mood, lowercase start, no trailing period, ≤ 72 characters.

**Footer (as applicable):**

```
Refs: IMP-FE-003, Task B3
AI-Assisted: Claude Code
BREAKING CHANGE: <description>      # only when needed; or use "!" after the scope
```

**Examples**

```
chore(config): scaffold vite react typescript project
feat(theme): add light dark system theme provider
feat(orders): add responsive orders grid with card fallback
fix(orders): prevent horizontal scroll on mobile card list
test(orders): cover search filter sort and pagination
docs(docs): add angular parity matrix
build(deps): add kendo grid and dialogs packages
refactor(kit): extract status badge semantic mapping
```

Rules: small atomic commits (one logical change each); no "wip" / "fix stuff" / "update"; do not mix unrelated changes; do not commit generated or vendored files.

---

## 5. Task lifecycle (developer)

```bash
# 1. Sync and branch
git switch main && git pull --ff-only
git switch -c feat/B3-theme-provider          # or: git switch phase/C-port && git pull && git switch -c feat/C1-orders-table

# 2. Work, commit small and often (see §4)
git add -p
git commit -m "feat(theme): add light dark system theme provider"

# 3. Verify before every push
npm run verify                                 # lint + typecheck + test (must be green)

# 4. Push the TASK branch (never main)
git push -u origin feat/B3-theme-provider

# 5. Open the Merge Request (draft until ready)
#    Title = the final conventional commit message (it becomes the squash commit)
#    Target = main (or the phase branch), fill the MR template (§7)

# 6. Review: Aya comments → fix with NEW commits on the same branch (no force-push once review started, unless agreed)
# 7. Merge: only via the MR button after approval + green pipeline → squash, delete source branch
# 8. Cleanup
git switch main && git pull --ff-only
git branch -d feat/B3-theme-provider
# 9. Update TASKS.md and AI_USAGE_LOG.md (must already be in the MR)
```

**Keeping a branch current:** `git fetch origin && git rebase origin/main` on your own unreviewed branch; once the MR is under review use `git merge origin/main` instead (no history rewriting). If you must force-push your own task branch, use `git push --force-with-lease`, never plain `--force`, never on `main` or a shared phase branch.

**Merge strategy:** squash-merge task MRs (one clean conventional commit per task on `main`); phase MRs use a merge commit so the phase is visible in history. `[OPEN DECISION]` confirm this default with Aya.

---

## 6. AI agent protocol (Claude Code / Cursor / Devin)

Before starting a task the agent:

1. Runs `git branch --show-current`. If it is `main` → **stop** and ask the developer to create the task branch.
2. Confirms the branch name matches §2 and the task ID in `TASKS.md`.

While working the agent only edits files; it does not stage or commit.

At the end of the task the agent outputs, in this exact block:

```
## Git handoff
Branch:   feat/B3-theme-provider
Target:   main
Commits (run in this order):
  1. feat(theme): add light dark system theme provider
  2. test(theme): cover theme provider persistence
  3. docs(docs): document kendo theme variable map
MR title: feat(theme): add light dark system theme provider
MR description: <filled from the template in §7>
Verify:   npm run verify → <result>
AI log:   AI_USAGE_LOG.md updated ✓
```

The developer reviews the diff, then runs the commits and opens the MR.

---

## 7. Merge Request template

Save as `.gitlab/merge_request_templates/Default.md` (GitLab) — or `.github/pull_request_template.md` on GitHub.

```markdown
## Summary

<!-- 1–3 sentences: what and why -->

## Task / Phase

- Task ID: <e.g. B3> Phase: <A|B|C|D>
- SRS / parity rows covered: <FR-… / PARITY_MATRIX rows>

## Changes

-

## How to test

1. `npm ci && npm run verify`
2. <manual steps, routes, themes (light + dark), widths 390 / 1024 / 1440>

## Evidence

- verify output:
- axe (light + dark): 0 violations ☐
- screenshots (light / dark, mobile / desktop):

## Deviations from spec / parity

<!-- none, or list with reason; also add to docs/DEVIATIONS.md -->

## [NEEDS VERIFICATION] items

<!-- none, or list -->

## Checklist

- [ ] Branch is a task branch (not `main`) and named per GIT_WORKFLOW.md
- [ ] Commits follow Conventional Commits
- [ ] `npm run verify` green
- [ ] No secrets / license files / real data committed
- [ ] `AI_USAGE_LOG.md` updated (and `TASKS.md` ticked)
- [ ] No hard-coded colors in features/components (theme tokens only)
- [ ] Docs updated if behavior or decisions changed
```

---

## 8. Enforcement

### 8.1 Server side (authoritative — configure once by a maintainer)

GitLab → Settings → Repository → Protected branches, `main`:

- Allowed to push: **No one**. Allowed to merge: **Maintainers** (via MR only). Force push: **off**.

Settings → Merge requests:

- Require approval: **1** (mentor). Pipelines must succeed. All threads must be resolved.
- Squash commits: **encourage/require**. Delete source branch on merge: **on**.
- Merge commit message must be a Conventional Commit (MR title).

### 8.2 Local guard rails (convenience — bypassable with `--no-verify`, so not a substitute for 8.1)

```bash
mkdir -p .githooks && git config core.hooksPath .githooks
```

`.githooks/pre-commit` — block commits on `main`:

```sh
#!/bin/sh
branch=$(git symbolic-ref --short HEAD 2>/dev/null)
if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  echo "✖ Committing directly to '$branch' is not allowed. Create a task branch: git switch -c feat/<TASK-ID>-<slug>"
  exit 1
fi
exit 0
```

`.githooks/pre-push` — block pushes to `main`:

```sh
#!/bin/sh
while read local_ref local_sha remote_ref remote_sha; do
  case "$remote_ref" in
    refs/heads/main|refs/heads/master)
      echo "✖ Direct push to main is blocked. Push your task branch and open a Merge Request."
      exit 1 ;;
  esac
done
exit 0
```

`.githooks/commit-msg` — enforce Conventional Commits (no dependencies):

```sh
#!/bin/sh
first=$(head -n1 "$1")
case "$first" in Merge*|Revert*|fixup!*|squash!*) exit 0 ;; esac
pattern='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?!?: .{1,72}$'
if ! echo "$first" | grep -Eq "$pattern"; then
  echo "✖ Commit message must be: <type>(<scope>): <subject>   e.g. feat(orders): add orders grid"
  echo "  types: feat fix docs style refactor perf test build ci chore revert"
  exit 1
fi
exit 0
```

Then `chmod +x .githooks/*`. Commit the `.githooks/` folder so the hooks are shared.

### 8.3 `.gitignore` must include

```
node_modules/
dist/
coverage/
storybook-static/
.env
.env.*
telerik-license.txt
project-ui-license.txt
*.log
.DS_Store
```

---

## 9. Snippet for `CLAUDE.md` / `AGENTS.md` (replaces any older git rule)

```markdown
## Git rules (see GIT_WORKFLOW.md)

- Never run mutating git commands (add, commit, push, merge, rebase, reset, checkout -b, tag). Read-only git is fine.
- Before any work: run `git branch --show-current`. If it is `main`, stop and ask me to create the task branch.
- Work only on the current task branch. Never touch `main`.
- At the end of every task print the "Git handoff" block (branch, target, ordered Conventional Commit messages, MR title, MR description, verify result).
- Commit types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert. Subject: imperative, ≤72 chars.
- Never include secrets, license files or real data in any change.
```
