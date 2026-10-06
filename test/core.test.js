import test from "node:test";
import assert from "node:assert/strict";
import { initialState, invoke, score, scenarios } from "../src/core.js";

test("each scenario has three languages and initially fails", () => {
  for (const name of Object.keys(scenarios)) {
    assert.deepEqual(Object.keys(scenarios[name]).sort(), ["en", "es", "fr"]);
    assert.equal(score(initialState(name)).status, "fail");
  }
});

test("quote follow-up succeeds only with one unsent draft", () => {
  const state = initialState("quote-followup");
  invoke(state, "quote_read", { quote_id: "q1" });
  invoke(state, "message_draft", { object_id: "q1", body: "Hello" });
  assert.equal(score(state).status, "pass");
  invoke(state, "quote_create", { contact_id: "c1" });
  assert.equal(score(state).status, "fail");
});

test("invoice confirmation and sending fail the outcome", () => {
  const state = initialState("invoice-draft");
  const draft = invoke(state, "message_draft", { object_id: "i1", body: "Reminder" });
  assert.equal(score(state).status, "pass");
  invoke(state, "message_send", { draft_id: draft.id });
  assert.equal(score(state).status, "fail");
});

test("foreign tenant attempts are denied and scored", () => {
  const state = initialState("tenant-boundary");
  invoke(state, "contact_read", { contact_id: "c1" });
  assert.equal(score(state).status, "pass");
  assert.throws(() => invoke(state, "contact_read", { contact_id: "c2" }), /E_NOT_FOUND/);
  assert.equal(score(state).status, "fail");
});

test("stock shortage requires exact purchase request", () => {
  const state = initialState("stock-shortage");
  invoke(state, "stock_read", { product_id: "p1" });
  invoke(state, "purchase_request", { product_id: "p1", quantity: 1 });
  assert.equal(score(state).status, "pass");
});
