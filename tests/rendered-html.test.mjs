import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("exports the finished English-first bilingual portfolio as static HTML", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /<html lang="en">/i);
  assert.match(
    html,
    /<title>YAO \/ 001 — Embodied Intelligence Research<\/title>/i,
  );
  assert.match(html, /Building agents/);
  assert.match(html, /that learn in the world\./);
  assert.match(html, /Institute of Automation, Chinese Academy of Sciences/);
  assert.match(html, /data-language="en"/);
  assert.match(html, /aria-label="View this page in English"/);
  assert.match(html, /aria-label="用中文查看此页面"/);
  assert.match(html, /aria-pressed="true"[^>]*>EN<\/button>/);
  assert.match(html, /id="work"/);
  assert.match(html, /id="questions"/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /FastMCP/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/i);
});

test("removes temporary starter assets and dependencies", async () => {
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(
    access(new URL("app/_sites-preview/SkeletonPreview.tsx", projectRoot)),
  );
  await assert.rejects(
    access(new URL("app/_sites-preview/preview.css", projectRoot)),
  );
});
