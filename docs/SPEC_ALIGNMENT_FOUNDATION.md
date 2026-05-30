# Spec Alignment Foundation

## Purpose

This document is the execution brief for PR1 of the spec-alignment track.
Its job is to keep the repository aligned around one implementation truth while the remaining compliance work is completed.

## Governing references

- Master issue: `#286`
- PR1: `#287`
- PR2: `#288`
- PR3: `#289`
- PR4: `#290`
- Governing product reference: the Arabic master specification

## PR1 outcome

PR1 is complete only when the repository has a reliable compliance foundation:

- one canonical data and service model for compliance-critical entities
- one execution truth for central services and permissions boundaries
- no stale repo-local audit document contradicts the current implementation state
- follow-up PRs can build on current truth instead of reconstructing it

## What PR1 should fix first

1. Drift between repo-local readiness documents and actual code.
2. Drift between service documentation and actual service capabilities.
3. Drift between canonical central entity boundaries and the implementation paths that use them.
4. Drift between event or permission assumptions and the code that enforces them.

## What PR1 should not do

- redesign workspaces
- add speculative integrations
- split into many micro changes just for neatness
- implement broad UX work that belongs to later compliance PRs

## Implementation rule

If a change does not reduce compliance ambiguity or establish a stronger implementation truth, it is out of scope for PR1.
