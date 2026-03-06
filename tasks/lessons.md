# Lessons Learned

Insights and patterns discovered during development of 00Claude.

## Repository Bootstrap

- Always fill in license copyright placeholders before the first public push.
- Establish `CLAUDE.md` early so the AI assistant has authoritative guidance
  from the first interaction.
- Smoke-check scripts must be updated in lockstep with any new required files
  to prevent CI drift.
- Keep all governance files (LICENSE, SECURITY, CODE_OF_CONDUCT) consistent
  with real contact information from day one.
