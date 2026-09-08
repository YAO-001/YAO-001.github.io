import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
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

test("exports labeled controls and structured contact and contribution dossiers", async () => {
  for (const route of ["", "about/", "resume/", "socials/", "sideproj/"]) {
    const html = await readPage(route);
    assert.match(html, /class="language-switch"/);
    assert.match(html, /class="motion-control"/);
    assert.match(html, /aria-pressed="true" aria-label="View this page in English"/);
  }
  const contact = await readPage("socials/");
  assert.match(contact, /aria-labelledby="contact-title"/);
  assert.match(contact, /<h2 id="contact-title">GITHUB<\/h2>/);
  assert.match(contact, /class="contact-field selected" aria-pressed="true"/);
  assert.equal([...contact.matchAll(/class="contact-field(?: selected)?"/g)].length, 3);
  assert.match(contact, /aria-label="Previous contact"/);
  assert.match(contact, /aria-label="Next contact"/);
  const work = await readPage("sideproj/");
  assert.match(work, /aria-labelledby="project-detail-title"/);
  assert.match(work, /<h2 id="project-detail-title">Recoverable tool errors in CodeMode<\/h2>/);
  assert.match(work, /class="pr-status" data-status="MERGED"/);
});

test("exports lightweight media without shipping original videos", async () => {
  for (const file of ["Mainn.mp4", "Mainn_1.mp4", "main1.mp4", "main2.mp4", "main3.mp4", "menu-poster.webp", "about-poster.webp", "resume-poster.webp", "socials-poster.webp", "char1.webp", "char2.webp", "char3.webp", "mainm.webp", "mainm2.webp", "mainf.webp"]) {
    await access(new URL(`persona/optimized/${file}`, output));
  }
  await assert.rejects(access(new URL("persona/Mainn.mp4", output)));
  await assert.rejects(access(new URL("media-source/", output)));
});

test("first paint prioritizes the poster and menu font without fetching video", async () => {
  for (const [route, poster] of [["", "menu"], ["about/", "about"], ["resume/", "resume"], ["socials/", "socials"], ["sideproj/", "menu"]]) {
    const html = await readPage(route);
    assert.doesNotMatch(html, /<video\b/);
    const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => tag);
    assert.ok(links.some((tag) => tag.includes('as="image"') && tag.includes(`${poster}-poster.webp`)));
    const fonts = links.filter((tag) => tag.includes('as="font"'));
    assert.equal(fonts.length, 1, "Only the first-screen menu font should be preloaded");
    assert.ok(fonts[0].includes('.woff2'));
    assert.ok((await stat(new URL(`persona/optimized/${poster}-poster.webp`, output))).size < 80 * 1024);
  }
});

test("backgrounds stay within the transfer budget and support progressive playback", async () => {
  let total = 0;
  for (const file of ["Mainn.mp4", "Mainn_1.mp4", "main1.mp4", "main2.mp4", "main3.mp4"]) {
    const bytes = await readFile(new URL(`persona/optimized/${file}`, output));
    total += bytes.length;
    assert.ok(bytes.length < 4 * 1024 * 1024, `${file} exceeds the 4 MiB video budget`);
    const boxes = [];
    for (let offset = 0; offset + 8 <= bytes.length;) {
      let size = bytes.readUInt32BE(offset);
      const type = bytes.toString("ascii", offset + 4, offset + 8);
      if (size === 1) size = Number(bytes.readBigUInt64BE(offset + 8));
      if (size === 0) size = bytes.length - offset;
      assert.ok(size >= 8 && offset + size <= bytes.length, `${file} contains a broken MP4 box`);
      boxes.push(type);
      offset += size;
    }
    assert.ok(boxes.includes("moov") && boxes.includes("mdat"));
    assert.ok(boxes.indexOf("moov") < boxes.indexOf("mdat"), `${file} is missing faststart metadata`);
  }
  assert.ok(total < 10 * 1024 * 1024, "Backgrounds exceed the combined 10 MiB transfer budget");
});
