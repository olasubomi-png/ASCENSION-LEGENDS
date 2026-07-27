---
name: Git push blocked
description: GitHub remote push times out in Replit shell; workaround and context
---

# Git Push — Blocked in Replit Shell

## Observation
`git push origin main` hangs and times out (exit -1) when run via ShellExec.
The remote is `https://github.com/olasubomi-png/ASCENSION-LEGENDS`.

## Why
GitHub HTTPS push requires authentication (PAT or SSH key). None is configured in the Replit environment for this repo.

## How to apply
- Always make the commit locally — the work is preserved.
- Note in the task completion that the commit is local and the user must push, OR use the `git-remote` skill to set up credentials via a GitHub integration before attempting push.
- Check the `git-remote` skill for the correct way to configure push access if needed in a future sprint.
