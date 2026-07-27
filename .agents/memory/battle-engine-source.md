---
name: Battle Engine Source
description: Source-material limitation and implementation boundary for Sprint 3 battle work
---

The uploaded Sprint 3 archive is an index and master prompt, not the detailed chapter transcript. The detailed formulas used for the first implementation therefore come from Book 1 and the existing stat model; future changes should treat the pure seeded engine as the stable resolution boundary and add integrations around it.

**Why:** The archive explicitly says the full detailed text is in the prior conversation, but that transcript is not included in the imported files.

**How to apply:** When extending battle behavior, verify new rules against the available Book 1 docs and preserve deterministic replay inputs/outputs until a fuller Sprint 3 specification is supplied.