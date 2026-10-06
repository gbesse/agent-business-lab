# Agent Business Lab

[Français](README.md) · [Español](README.es.md)

A local MCP lab for measuring an agent's business outcome using entirely synthetic data. Four scenarios check a quote follow-up without duplication, an unsent invoice reminder, tenant separation, and a stock shortage. Scoring uses final state and recorded attempts, not the agent's prose.

## Try it

    node src/cli.js scenarios
    node src/cli.js init quote-followup demo.state.json
    node src/cli.js serve demo.state.json
    node src/cli.js score demo.state.json
    npm test

The serve command is a stdio MCP server. Configure your MCP client to launch node with src/cli.js serve and the absolute state-file path. Give the agent the task shown by scenarios in your chosen language. Tools and descriptions are available in French, English, and Spanish. Initialize a fresh state file for each run.

Scoring exits 0 on pass and 2 on failure. Data is fictitious; this repository does not connect to incwo or Bruno. Compare agents with the same scenario and reset states. The scenarios do not certify a platform or cover every business rule.

OpenClaw and Hermes can launch a stdio MCP server. Cloud agents need a compatible transport or a hosted adapter: this first version has no direct Muse, dots, or OCE access.

MIT licensed.
