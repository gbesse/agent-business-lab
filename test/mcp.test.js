import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { initialState, score } from "../src/core.js";

test("stdio MCP lists tools and persists a business action", async () => {
  const directory = await mkdtemp(join(tmpdir(), "business-lab-"));
  const path = join(directory, "state.json");
  await writeFile(path, JSON.stringify(initialState("quote-followup")));
  const process = spawn("node", ["src/cli.js", "serve", path], { cwd: new URL("..", import.meta.url), stdio: ["pipe", "pipe", "ignore"] });
  const lines = createInterface({ input: process.stdout });
  const received = [];
  lines.on("line", (line) => received.push(JSON.parse(line)));
  const send = (id, method, params = {}) => process.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  const waitFor = async (id) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      const found = received.find((item) => item.id === id);
      if (found) return found;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error("E_TIMEOUT");
  };
  try {
    send(1, "initialize", { protocolVersion: "2025-06-18" });
    assert.equal((await waitFor(1)).result.serverInfo.name, "agent-business-lab");
    send(2, "tools/list");
    assert.ok((await waitFor(2)).result.tools.some((tool) => tool.name === "message_draft"));
    send(3, "tools/call", { name: "message_draft", arguments: { object_id: "q1", body: "Follow-up" } });
    assert.equal((await waitFor(3)).result.isError, undefined);
    assert.equal(score(JSON.parse(await readFile(path, "utf8"))).status, "pass");
  } finally {
    process.stdin.end();
    process.kill();
    await rm(directory, { recursive: true, force: true });
  }
});
