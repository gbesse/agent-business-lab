#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { initialState, invoke, scenarios, score, tools } from "./core.js";

const [command, scenarioOrPath, maybePath] = process.argv.slice(2);
const usage = "Utilisation / Usage / Uso: agent-business-lab init SCENARIO STATE.json | serve STATE.json | score STATE.json | scenarios";

async function persist(path, state) {
  await writeFile(path, JSON.stringify(state, null, 2) + "\n", { mode: 0o600 });
}

async function serve(path) {
  const state = JSON.parse(await readFile(path, "utf8"));
  const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
  for await (const line of lines) {
    let request;
    try {
      request = JSON.parse(line);
      if (request.id === undefined) continue;
      let result;
      if (request.method === "initialize") {
        result = { protocolVersion: request.params?.protocolVersion || "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "agent-business-lab", version: "0.1.0" } };
      } else if (request.method === "ping") {
        result = {};
      } else if (request.method === "tools/list") {
        result = { tools };
      } else if (request.method === "tools/call") {
        try {
          const value = invoke(state, request.params?.name, request.params?.arguments);
          await persist(path, state);
          result = { content: [{ type: "text", text: JSON.stringify(value) }] };
        } catch (error) {
          await persist(path, state);
          result = { isError: true, content: [{ type: "text", text: error.message?.startsWith("E_") ? error.message : "E_CALL" }] };
        }
      } else {
        process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: request.id, error: { code: -32601, message: "E_METHOD" } }) + "\n");
        continue;
      }
      process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: request.id, result }) + "\n");
    } catch {
      if (request?.id !== undefined) process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: request.id, error: { code: -32603, message: "E_SERVER" } }) + "\n");
    }
  }
}

try {
  if (command === "init" && scenarioOrPath && maybePath) await persist(maybePath, initialState(scenarioOrPath));
  else if (command === "serve" && scenarioOrPath) await serve(scenarioOrPath);
  else if (command === "score" && scenarioOrPath) {
    const report = score(JSON.parse(await readFile(scenarioOrPath, "utf8")));
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exitCode = report.status === "pass" ? 0 : 2;
  } else if (command === "scenarios") process.stdout.write(JSON.stringify(scenarios, null, 2) + "\n");
  else { process.stderr.write(usage + "\n"); process.exitCode = 1; }
} catch (error) {
  process.stderr.write((error.message?.startsWith("E_") ? error.message : "E_RUN") + "\n");
  process.exitCode = 1;
}
