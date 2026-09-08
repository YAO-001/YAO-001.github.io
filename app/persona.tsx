"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { copy, projects, recentMerges, researchQuestions, toolkit } from "./portfolio-data";
import { usePreferences } from "./preferences";
import { Background } from "./scene-background";

export type View = "home" | "about" | "resume" | "socials" | "sideproj";
const asset = (file: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/persona/optimized/${file}`;
const portraits = ["mainm.webp", "mainm2.webp", "mainf.webp"];
const menuItems = [
  { page: "about", label: "ABOUT ME", zh: "关于我", size: 80, x: 0, y: 0, skew: -6, skewY: 10 },
  { page: "resume", label: "RESUME", zh: "研究档案", size: 66, x: 20, y: 8, skew: -11, skewY: -10 },
  { page: "github", label: "GITHUB LINK", zh: "GITHUB 主页", size: 68, x: 8, y: 6, skew: 0, skewY: -4 },
  { page: "socials", label: "SOCIALS", zh: "联系我", size: 74, x: 16, y: 8, skew: -3, skewY: 5 },
  { page: "sideproj", label: "SIDE PROJECTS", zh: "开源贡献", size: 56, x: 10, y: 6, skew: -4, skewY: 7 },
] as const;

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => { window.removeEventListener("hashchange", callback); window.removeEventListener("popstate", callback); };
}
// Keep existing shared anchors usable alongside the reference's exported routes.
const hashViews: Record<string, View> = {
  "#top": "home", "#home": "home", "#about": "about", "#questions": "resume", "#work": "sideproj", "#contact": "socials",
};

function useKeyboard(onKey: (event: KeyboardEvent) => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.altKey || event.ctrlKey || event.metaKey || target.closest("input, textarea, select, [contenteditable], .site-controls")) return;
      if (event.key === "Enter" && target.closest("a, button, summary")) return;
      onKey(event);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);
}
function openExternal(url: string) { window.open(url, "_blank", "noopener,noreferrer"); }
function focusItem(selector: string, index: number) {
  document.querySelectorAll<HTMLElement>(selector)[index]?.focus();
}

function Hints({ reveal = false, home = false }: { reveal?: boolean; home?: boolean }) {
  const { language } = usePreferences();
  const zh = language === "zh";
  return <div className={home ? "p3-hint mounted" : "sc-footer mounted"} aria-hidden="true">
    <div className="hint-row"><kbd>↑↓</kbd><span>{zh ? "选择" : home ? "NAVIGATE" : "SELECT"}</span></div>
    <div className="hint-row"><kbd>↵</kbd><span>{zh ? "确认" : reveal ? "REVEAL" : home ? "CONFIRM" : "OPEN"}</span></div>
    {!home && <div className="hint-row"><kbd>ESC</kbd><span>{zh ? "返回" : "BACK"}</span></div>}
  </div>;
}

function MainMenu() {
  const { language } = usePreferences();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [animation, setAnimation] = useState(0);
  const activate = (index: number) => { setActive(index); setAnimation((value) => value + 1); };
  useKeyboard((event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(".p3-menu a", Math.max(0, Math.min(menuItems.length - 1, active + (event.key === "ArrowUp" ? -1 : 1))));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const page = menuItems[active].page;
      if (page === "github") openExternal("https://github.com/YAO-001"); else router.push(`/${page}/`);
    }
  });
  return <div className="p3-overlay">
    <h1 className="p3-name-tag"><span>YAO&apos;s</span><span>Persona</span></h1>
    <div className="p3-stripe" /><div className="p3-stripe2" />
    <nav className="p3-menu" aria-label={copy[language].navLabel}>
      {menuItems.map((item, index) => {
        const selected = active === index;
        const label = language === "en" ? item.label : item.zh;
        const width = item.label.length * item.size * 0.6 + 80;
        const height = item.size * 0.94;
        const triangle = `polygon(0px 0px, ${width}px ${height * 0.5}px, 0px ${height}px)`;
        return <Link key={item.page} href={item.page === "github" ? "https://github.com/YAO-001" : `/${item.page}/`}
          target={item.page === "github" ? "_blank" : undefined} rel={item.page === "github" ? "noopener noreferrer" : undefined}
          className={`p3-row mounted${selected ? " active" : ""}`} onMouseEnter={() => activate(index)} onFocus={() => activate(index)}
          style={{ marginRight: item.x, marginTop: item.y, animationDelay: `${index * 55}ms` }}>
          <span className="p3-glow" />
          <span className="p3-skew-wrap" style={{ transform: `skewX(${item.skew}deg) skewY(${item.skewY}deg)` }}>
            <span key={`${selected}-${animation}`} className={`p3-shadow-tri${selected ? " pop" : ""}`} style={{ width, height, clipPath: triangle }} />
            <span className="p3-highlight" style={{ width, height, clipPath: triangle, transform: `translateY(-50%) scaleX(${selected ? 1 : 0})` }} />
            <span className="p3-label-wrap" style={{ opacity: selected ? 1 : Math.max(0.5, 1 - Math.abs(index - active) * 0.2) }}>
              <span className="p3-label-base p3-label-dark" style={{ fontSize: item.size }}>{label}</span>
              <span aria-hidden="true" className="p3-label-base p3-label-bright" style={{ fontSize: item.size, clipPath: triangle }}>{label}</span>
            </span>
          </span>
        </Link>;
      })}
    </nav><Hints home />
  </div>;
}

function PartyRow({ index, label, active, onSelect, onOpen, href, role, selectOnTouch = false }: {
  index: number; label: string; active: boolean; onSelect: () => void; onOpen?: () => void; href?: string; role?: string; selectOnTouch?: boolean;
}) {
  const content = <>
    {!role && <Image className="sc-char" src={asset(`char${index + 1}.webp`)} alt="" width={[1601, 1760, 1760][index]} height={[685, 676, 675][index]} style={{ width: "auto" }} />}
    <span className="sc-bar-fill" /><span className="sc-bar-shade" />
    <span className="sc-bar-content"><span className="sc-role">{role || (index === 0 ? "LEADER" : "PARTY")}</span>
      <span className="sc-main"><span className="sc-main-top"><span className="sc-label">{label}</span></span></span>
    </span>
  </>;
  return <div className={`sc-bar-outer mounted${active ? " active" : ""}`} style={{ animationDelay: `${index * 80}ms` }}>
    <span className="sc-bar-red" />
    {href ? <a className="sc-bar" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
      onMouseEnter={onSelect} onFocus={onSelect} onClick={(event) => {
        if (selectOnTouch && event.detail !== 0 && window.matchMedia("(hover: none)").matches) { event.preventDefault(); onSelect(); }
      }}>{content}</a> :
      <button type="button" className="sc-bar" onClick={onOpen} onMouseEnter={onSelect} onFocus={onSelect}>{content}</button>}
  </div>;
}

function About() {
  const { language } = usePreferences();
  const zh = language === "zh";
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const labels = zh ? ["关于我", "技术栈", "研究方向"] : ["ABOUT ME", "TECH STACK", "CURRENTLY LEARNING"];
  const upper = [
    ["YAO / 001", zh ? "中科院自动化所 · 研究实习生" : "Research Intern · CASIA", zh ? "具身智能与世界模型" : "Embodied Intelligence & World Models"],
    ["Python · PyTorch · FSDP", "Reinforcement Learning · Robot Learning", "Distributed Systems · MCP"],
    researchQuestions.map((question) => question[language].title),
  ];
  const lower = [zh ? "让智能体，在世界里学习。" : "Building agents that learn in the world.",
    zh ? "FastMCP · verl · AReaL · TRL · AReno 开源协作" : "Open-source collaboration: FastMCP · verl · AReaL · TRL · AReno",
    zh ? "感知 · 记忆 · 规划 · 工具 · 行动 · 学习" : "Perception · Memory · Planning · Tools · Action · Learning"];
  useKeyboard((event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape", "Backspace"].includes(event.key)) event.preventDefault();
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const next = Math.max(0, Math.min(2, active + (event.key === "ArrowUp" ? -1 : 1)));
      setActive(next);
      focusItem(revealed ? ".sc-tab-navigation button" : ".sc-root button", next);
    }
    if (event.key === "Enter" || event.key === "ArrowRight") setRevealed(true);
    if (event.key === "ArrowLeft") { if (revealed) setRevealed(false); else router.push("/"); }
    if (event.key === "Escape" || event.key === "Backspace") router.push("/");
  });
  return <>
    <h1 className="sr-only">{labels[0]}</h1>
    <nav className="sc-root" aria-label={zh ? "个人档案" : "Profile sections"}>
      {labels.map((label, index) => <PartyRow key={label} label={label} index={index} active={active === index}
        onSelect={() => setActive(index)} onOpen={() => { setActive(index); setRevealed(true); }} />)}
    </nav>
    {revealed && <>
      <div className="sc-dim" />
      <section className="sc-reveal-panel mounted" aria-label={labels[active]}>
        <div className="sc-tab-navigation" role="tablist" aria-label={zh ? "档案分页" : "Profile tabs"}>
          {labels.map((label, index) => <button type="button" key={label} role="tab" aria-selected={index === active}
            aria-controls="profile-panel" id={`profile-tab-${index}`} className={`sc-tab-button${index === active ? " active" : ""}`}
            onClick={() => setActive(index)}>{label}</button>)}
        </div>
        <div role="tabpanel" id="profile-panel" aria-labelledby={`profile-tab-${active}`}>
          <div className="sc-reveal-upper-bar">{upper[active].map((line) => <p className="sc-reveal-upper-line" key={line}>{line}</p>)}</div>
          <p className="sc-reveal-lower-bar">{lower[active]}</p>
        </div>
      </section>
      <div className="sc-right-nav">
        <span className="sc-nav-arrow left" aria-hidden="true">◄</span>
        <button type="button" className="sc-nav-btn" aria-label={zh ? "上一项" : "Previous profile"} onClick={() => setActive((active + 2) % 3)}>LB</button>
        <span className="sc-nav-dot" />
        <button type="button" className="sc-nav-btn" aria-label={zh ? "下一项" : "Next profile"} onClick={() => setActive((active + 1) % 3)}>RB</button>
        <span className="sc-nav-arrow right" aria-hidden="true">►</span>
      </div>
      <div className="sc-main-portrait-shell mounted"><Image key={active} className="sc-main-portrait" src={asset(portraits[active])} alt="" width={1080} height={1920} /></div>
      <button type="button" className="close-reveal" onClick={() => setRevealed(false)}>{zh ? "关闭详情 ×" : "CLOSE ×"}</button>
    </>}
    <Hints reveal />
  </>;
}

function Resume({ initialTab = 0 }: { initialTab?: number }) {
  const { language } = usePreferences();
  const zh = language === "zh";
  const text = copy[language];
  const router = useRouter();
  const [active, setActive] = useState(initialTab);
  const labels = zh ? ["个人档案", "技术栈", "研究方向", "开源贡献"] : ["PROFILE", "SKILLS", "RESEARCH", "CONTRIBUTIONS"];
  const subtitles = zh ? ["中科院自动化所 / 研究实习", "语言与研究工具", "具身智能与世界模型", "公开 Pull Requests"] :
    ["CASIA / Research Intern", "Languages & Research Tools", "Embodied Intelligence / World Models", "Public Pull Requests"];
  const counts = [1, toolkit.length, researchQuestions.length, projects.length];
  const intro = `${text.introLeadPrefix}${text.institute}${text.introLeadSuffix}`;
  const rows: { title: string; meta?: string; eyebrow?: string; description?: string; href?: string; status?: string }[] = active === 0 ? [
    { title: "YAO / 001", meta: "CASIA" }, { title: zh ? "具身智能" : "Embodied Intelligence", meta: "AI" },
    { title: zh ? "世界模型" : "World Models", meta: "RL" }, { title: "GitHub / YAO-001", href: "https://github.com/YAO-001" },
  ] : active === 1 ? toolkit.map((title) => ({ title })) : active === 2 ? researchQuestions.map((question) => ({ title: question[language].title, description: question[language].text })) :
    projects.map((project) => ({ title: project[language].title, eyebrow: project.subtitle, meta: text.status[project.status], href: project.url, status: project.status }));
  const notes = active === 0 ? [intro, text.introSecondary, text.aboutFirst, text.aboutSecond] : active === 1 ? [text.aboutSecond] :
    [];
  useKeyboard((event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if ((event.target as HTMLElement).closest(".resume-detail-panel")) return;
      event.preventDefault();
      focusItem(".resume-stack button", Math.max(0, Math.min(labels.length - 1, active + (event.key === "ArrowUp" ? -1 : 1))));
    }
    if (["ArrowLeft", "Escape", "Backspace"].includes(event.key)) { event.preventDefault(); router.push("/"); }
  });
  return <div className="resume-overlay">
    <nav className="resume-stack" aria-label={zh ? "研究档案" : "Resume sections"}>
      <div className="resume-list-heading"><p className="resume-list-eyebrow">YAO / 001</p><h1 className="resume-list-tag">{zh ? "研究档案" : "RESUME"}</h1></div>
      {labels.map((label, index) => <button type="button" key={index} className={`resume-card-wrap${active === index ? " active" : ""}`}
        style={{ animationDelay: `${index * 55}ms` }} onClick={() => setActive(index)} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} aria-pressed={active === index} aria-controls="resume-detail-panel">
        <span className="resume-card"><span className="resume-badge"><span className="resume-badge-text">{["I", "II", "III", "IV"][index]}</span></span>
          <span className="resume-card-inner"><span className="resume-title">{label}</span><span className="resume-rank">
            <span className="resume-rank-number">{String(counts[index]).padStart(2, "0")}</span><span className="resume-rank-label">{zh ? "条目" : counts[index] === 1 ? "ITEM" : "ITEMS"}</span>
          </span></span><span className="resume-subtitle-bar"><span className="resume-subtitle">{subtitles[index]}</span></span>
        </span>
      </button>)}
    </nav>
    <section id="resume-detail-panel" className="resume-detail-panel" aria-labelledby="resume-detail-title">
      <div className="resume-detail-top">
        <span className="resume-detail-top-index" aria-hidden="true">0{active + 1}</span>
        <div className="resume-detail-heading"><p className="resume-detail-caption">{subtitles[active]}</p><h2 id="resume-detail-title" className="resume-detail-top-title">{labels[active]}</h2></div>
        <span className="resume-detail-top-mark" aria-hidden="true">//</span>
      </div>
      <div className="resume-detail-content" key={active} tabIndex={0} aria-label={zh ? `${labels[active]}内容` : `${labels[active]} details`}>
        {active === 3 && <div className="resume-contribution-key" aria-label={zh ? "所选 PR 状态汇总" : "Selected PR status summary"}>
          {(["MERGED", "OPEN", "DRAFT"] as const).map((status) => <span className="resume-summary-status" data-status={status} key={status}>
            <span className="resume-status-dot" aria-hidden="true" />{text.status[status]}<strong>{projects.filter((project) => project.status === status).length}</strong>
          </span>)}
        </div>}
        <div className={`resume-detail-list${active === 3 ? " resume-contribution-list" : ""}`}>{rows.map((row, index) => {
          const content = <><span className="resume-detail-row-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="resume-detail-row-copy">{row.eyebrow && <span className="resume-detail-row-eyebrow">{row.eyebrow}</span>}
              <span className="resume-detail-row-title">{row.title}</span>{row.description && <span className="resume-detail-row-description">{row.description}</span>}
            </span>
            {(row.meta || row.href) && <span className="resume-detail-row-meta">
              {row.meta && <span className="resume-detail-status" data-status={row.status}>{row.status && <span className="resume-status-dot" aria-hidden="true" />}{row.meta}</span>}
              {row.href && <span className="resume-detail-row-arrow" aria-hidden="true">↗</span>}
            </span>}</>;
          return row.href ? <a className="resume-detail-row" data-status={row.status} key={row.title} href={row.href} target="_blank" rel="noopener noreferrer">{content}</a> :
            <div className="resume-detail-row" key={row.title}>{content}</div>;
        })}</div>
        {notes.length > 0 && <div className="resume-detail-bottom"><h3 className="resume-detail-bottom-title">{zh ? "详细介绍" : "DETAILS"}</h3>
          <div className="resume-detail-bullets">{notes.map((note) => <p className="resume-detail-bullet" key={note}>{note}</p>)}</div>
          {active === 0 && <div className="recent-merges"><p>{text.recentLabel}</p>{recentMerges.map((merge) => <a href={merge.url} key={merge.label} target="_blank" rel="noopener noreferrer">{merge.label} ↗</a>)}</div>}
        </div>}
        {active === 3 && <p className="resume-snapshot"><span>{zh ? "状态快照" : "STATUS SNAPSHOT"}<time dateTime="2026-08-30">2026.08.30</time></span>
          {zh ? "精选自 YAO-001 的公开贡献。点击条目查看原始 PR；以上状态以快照日期为准。" : "Selected public contributions by YAO-001. Open a row for the original PR. Statuses reflect the snapshot date."}
        </p>}
      </div>
    </section><Hints />
  </div>;
}

function Socials() {
  const { language } = usePreferences();
  const zh = language === "zh";
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [info, setInfo] = useState(0);
  const [right, setRight] = useState(false);
  const items = [
    { label: "GITHUB", href: "https://github.com/YAO-001", details: [["USER", "YAO-001"], ["ROLE", zh ? "研究实习生" : "Research Intern"], ["FOCUS", zh ? "具身智能" : "Embodied AI"]] },
    { label: zh ? "电子邮箱" : "EMAIL", href: "mailto:yaoyaoguonan@outlook.com", details: [["MAIL", "yaoyaoguonan@outlook.com"], ["RESEARCH", "CASIA"], ["FOCUS", zh ? "世界模型" : "World Models"]] },
  ];
  useKeyboard((event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape", "Backspace"].includes(event.key)) event.preventDefault();
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const step = event.key === "ArrowUp" ? -1 : 1;
      focusItem(right ? ".social-details button" : ".sc-root a", Math.max(0, Math.min(right ? 2 : items.length - 1, (right ? info : active) + step)));
    }
    if (event.key === "ArrowRight") { setRight(true); setInfo(0); }
    if (event.key === "ArrowLeft") { if (right) setRight(false); else router.push("/"); }
    if (event.key === "Escape" || event.key === "Backspace") router.push("/");
    if (event.key === "Enter") { if (items[active].href.startsWith("mailto:")) window.location.href = items[active].href; else openExternal(items[active].href); }
  });
  return <>
    <h1 className="sr-only">{zh ? "联系我" : "SOCIALS"}</h1>
    <nav className="sc-root" aria-label={copy[language].linksLabel}>{items.map((item, index) => <PartyRow key={item.label} index={index}
      label={item.label} href={item.href} active={active === index} onSelect={() => { setActive(index); setRight(false); }} />)}</nav>
    <div className="sc-right-nav">
      <span className="sc-nav-arrow left" aria-hidden="true">◄</span>
      <button type="button" className="sc-nav-btn" aria-label={zh ? "上一联系方式" : "Previous contact"} onClick={() => setActive((active + 1) % 2)}>LB</button>
      <span className="sc-nav-label">{items[active].label}</span>
      <button type="button" className="sc-nav-btn" aria-label={zh ? "下一联系方式" : "Next contact"} onClick={() => setActive((active + 1) % 2)}>RB</button>
      <span className="sc-nav-arrow right" aria-hidden="true">►</span>
    </div>
    <div className="social-details">{items[active].details.map(([label, value], index) => <button type="button" key={`${active}-${label}`} className={`sc-info-bar-wrap${info === index ? " selected" : ""}`}
      style={{ top: `${155 + index * 68}px`, animationDelay: `${index * 50}ms` }} onMouseEnter={() => setInfo(index)} onFocus={() => setInfo(index)} onClick={() => { setInfo(index); setRight(true); }}>
      <span className="sc-info-bar"><span className="sc-info-bar-text">{label}</span><span className={`sc-info-bar-count${label === "MAIL" ? " email-value" : ""}`}>{value}</span></span>
    </button>)}</div><Hints />
  </>;
}

function Projects() {
  const { language } = usePreferences();
  const zh = language === "zh";
  const text = copy[language];
  const router = useRouter();
  const [active, setActive] = useState(0);
  const selected = projects[active];
  useKeyboard((event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "Escape", "Backspace", "Enter"].includes(event.key)) event.preventDefault();
    if (event.key === "ArrowUp" || event.key === "ArrowDown") focusItem(".sp-btn-list a", Math.max(0, Math.min(projects.length - 1, active + (event.key === "ArrowUp" ? -1 : 1))));
    if (["ArrowLeft", "Escape", "Backspace"].includes(event.key)) router.push("/");
    if (event.key === "Enter") openExternal(projects[active].url);
  });
  return <>
    <div className="sp-container mounted">
      <h1 className="sp-title">{zh ? "开源贡献" : "SIDE PROJECTS"}</h1>
      <nav className="sp-btn-list" aria-label={zh ? "开源贡献" : "Open-source contributions"}>{projects.map((project, index) =>
        <PartyRow index={index} key={project.number} label={project.subtitle} role={project.number} href={project.url}
          selectOnTouch active={active === index} onSelect={() => setActive(index)} />)}</nav>
      <a className="project-view-all" href="https://github.com/pulls?q=is%3Apr+author%3AYAO-001" target="_blank" rel="noopener noreferrer">{zh ? "查看全部 →" : "VIEW ALL →"}</a>
    </div>
    <section className="project-description" key={selected.number} aria-label={selected[language].title} tabIndex={0}>
      <p className="project-kicker">{selected.discipline}</p><h2>{selected[language].title}</h2><p>{selected[language].description}</p>
      <div className="project-facts"><span>{text.status[selected.status]}</span><span>{selected[language].stats}</span></div>
      <a className="project-pr-link" href={selected.url} target="_blank" rel="noopener noreferrer">{text.viewPr}</a>
      <p className="project-snapshot">{text.workIntro}</p>
    </section><Hints />
  </>;
}

function Transition({ view }: { view: View }) {
  const variant = view === "about" ? "about" : view === "socials" ? "socials" : "default";
  return <div className={`transition-overlay transition-${variant}`} aria-hidden="true">{[0, 1, 2].map((index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}</div>;
}

export default function Persona({ initialView }: { initialView: View }) {
  const { language, setLanguage, paused, toggleMotion } = usePreferences();
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");
  const view = hashViews[hash] || initialView;
  const zh = language === "zh";
  let content: ReactNode;
  if (view === "about") content = <About />;
  else if (view === "resume") content = <Resume key={hash} initialTab={hash === "#questions" ? 2 : 0} />;
  else if (view === "socials") content = <Socials />;
  else if (view === "sideproj") content = <Projects />;
  else content = <MainMenu />;
  return <div className="persona-app" data-language={language} data-motion={paused ? "paused" : "playing"} data-view={view}>
    <a className="skip-link" href="#content" onClick={(event) => { event.preventDefault(); document.getElementById("content")?.focus(); }}>{copy[language].skip}</a>
    <div className="site-controls" role="group" aria-label={copy[language].languageLabel}>
      <button type="button" onClick={toggleMotion} aria-pressed={paused} aria-label={zh ? "暂停动画" : "Pause animations"}>{paused ? (zh ? "动态已关" : "Motion off") : (zh ? "动态已开" : "Motion on")}</button>
      <button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"} aria-label={copy[language].chooseEnglish}>EN</button><span>/</span>
      <button type="button" onClick={() => setLanguage("zh")} aria-pressed={language === "zh"} aria-label={copy[language].chooseChinese}>中文</button>
    </div>
    <main id="content" tabIndex={-1} className={`scene ${view === "sideproj" ? "projects" : view}-scene`} key={view}>
      <Background scene={view} /><Transition view={view} /><div className="scene-content">{content}</div>
      {view !== "home" && <Link href="/" className="back-link">{zh ? "← 返回" : "← BACK"}</Link>}
    </main>
  </div>;
}
