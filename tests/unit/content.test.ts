import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
test("public profile follows current Owner baseline and has no invented records", async () => {
  assert.ok(
    existsSync("src/data/portfolio.ts"),
    "Missing approved public data",
  );
  const { profile, projects, research, posts, skills } =
    await import("../../src/data/portfolio");
  assert.equal(profile.name, "Châu Anh Dũng");
  assert.equal(profile.email, "chauanhdung@dtu.edu.vn");
  assert.equal(profile.position.en, "Cybersecurity Student");
  assert.equal(profile.education.period, "2024 – Present");
  assert.equal(projects.length, 3);
  assert.equal(
    projects[0].sourceCommit,
    "e31617ca2716665e992c475238f321e90252dd17",
  );
  assert.equal(projects[1].href, "https://happyhouselaundry.com/");
  assert.equal(
    profile.linkedIn,
    "https://www.linkedin.com/in/anh-d%C5%A9ng-ch%C3%A2u-533b98364/",
  );
  assert.deepEqual(research, []);
  assert.deepEqual(posts, []);
  assert.ok(
    skills.every((s: object) => !("percentage" in s) && !("years" in s)),
  );
  assert.ok(!("phone" in profile));
  assert.ok(!("resume" in profile));
  const publicText = JSON.stringify({
    profile,
    projects,
    research,
    posts,
    skills,
  });
  assert.doesNotMatch(
    publicText,
    /Samsung Innovation|VNNIC|CyberSubtitleTranslator|R&D Intern/i,
  );
});
