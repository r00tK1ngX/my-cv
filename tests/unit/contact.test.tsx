import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
test("contact composes an encoded mailto without server delivery claims", async () => {
  assert.ok(
    existsSync("src/components/contact-page.tsx"),
    "Static contact missing",
  );
  const { ContactPage } = await import("../../src/components/contact-page");
  const { composeMailto } = await import("../../src/lib/contact");
  const uri = composeMailto({
    name: "Dũng & Test",
    email: "someone@example.com",
    subject: "Hello & security",
    message: "Hi\nTest?",
  });
  assert.ok(uri.startsWith("mailto:chauanhdung@gmail.com?"));
  const query = new URLSearchParams(uri.split("?")[1]);
  assert.equal(query.get("subject"), "Hello & security");
  assert.match(query.get("body")!, /Dũng & Test/);
  const html = renderToStaticMarkup(<ContactPage locale="en" />);
  assert.match(html, /Open email app/);
  assert.match(html, /mailto:chauanhdung@gmail.com/);
  assert.doesNotMatch(
    html,
    /Message Sent|Message delivered|resend|type="tel"/i,
  );
});
