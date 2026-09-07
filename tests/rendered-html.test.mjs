import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const output = new URL("../out/", import.meta.url);
const readPage = (route = "") => readFile(new URL(`${route}index.html`, output), "utf8");

test("exports the Persona menu and all four scenes for direct GitHub Pages navigation", async () => {
  const home = await readPage();
  assert.match(home, /<html lang="en">/);
  assert.match(home, /<title>YAO \/ 001 — Embodied Intelligence Research<\/title>/);
  assert.match(home, /data-language="en"/);
  assert.match(home, /aria-label="View this page in English"/);
  assert.match(home, /aria-label="用中文查看此页面"/);
  assert.match(home, /ABOUT ME/);
  assert.match(home, /SIDE PROJECTS/);
  for (const route of ["about", "resume", "socials", "sideproj"]) {
    assert.match(home, new RegExp(`href="[^"]*/${route}/"`));
    const html = await readPage(`${route}/`);
    assert.match(html, new RegExp(`data-view="${route}"`));
    assert.match(html, /aria-label="Pause animations"/);
  }
});

test("retains YAO's research, real contact details, and all seven upstream PR links", async () => {
  const resume = await readPage("resume/");
  assert.match(resume, /Institute of Automation, Chinese Academy of Sciences/);
  assert.match(resume, /world models/);
  const socials = await readPage("socials/");
  assert.match(socials, /mailto:yaoyaoguonan@outlook.com/);
  assert.match(socials, /https:\/\/github.com\/YAO-001/);
  const work = await readPage("sideproj/");
  for (const pr of ["fastmcp/pull/4704", "verl/pull/7204", "AReno/pull/473", "AReaL/pull/1578", "AReaL/pull/1571", "trl/pull/6615", "verl/pull/7215"]) {
    assert.ok(work.includes(pr), `Missing original contribution ${pr}`);
  }
  for (const html of [resume, socials, work]) assert.doesNotMatch(html, /MdHu55a1n|Hussain|Indore|SkeletonPreview/);
});

test("exports local video backgrounds, reduced-motion posters, portraits and font assets", async () => {
  for (const file of ["Mainn.mp4", "Mainn_1.mp4", "main1.mp4", "main2.mp4", "main3.mp4", "menu-poster.jpg", "about-poster.jpg", "resume-poster.jpg", "socials-poster.jpg", "char1.png", "char2.png", "char3.png", "mainm.jpeg", "mainm2.jpeg", "mainf.jpeg"]) {
    await access(new URL(`persona/${file}`, output));
  }
  assert.match(await readPage(), /<video[^>]+muted=""[^>]+playsInline=""/);
});
