"use client";

import { useEffect, useState } from "react";
import "./motion.css";

type Language = "en" | "zh";

const projects = [
  {
    number: "01",
    subtitle: "FASTMCP · PR #4704",
    discipline: "Agent Runtime · MCP",
    status: "MERGED",
    url: "https://github.com/PrefectHQ/fastmcp/pull/4704",
    en: {
      title: "Recoverable tool errors in CodeMode",
      description:
        "Fixed FastMCP CodeMode so tool exceptions flow through guest try/except, preserving intermediate results while keeping uncaught ToolError semantics explicit.",
      stats: "3 files · +122 / −65 · merged Aug 2026",
    },
    zh: {
      title: "让 CodeMode 的工具错误可以被恢复",
      description:
        "修复 FastMCP CodeMode 中工具异常绕过 guest try/except 的问题，让沙箱程序能够捕获失败的工具调用、保留中间结果并继续执行，同时让未捕获错误仍以清晰的 ToolError 暴露。",
      stats: "3 个文件 · +122 / −65 · 2026.08 已合并",
    },
  },
  {
    number: "02",
    subtitle: "VERL · PR #7204",
    discipline: "Agentic RL · Observability",
    status: "MERGED",
    url: "https://github.com/verl-project/verl/pull/7204",
    en: {
      title: "Per-turn generation tracing for Agentic RL",
      description:
        "Added prompt_text and response_text to every LLM turn in asynchronous Agent Loops, allowing MLflow, Weave, and Trackio to reconstruct multi-turn trajectories without changing the public API.",
      stats: "4 files · +111 / −25 · merged Aug 2026",
    },
    zh: {
      title: "补齐 Agentic RL 的逐轮生成追踪",
      description:
        "为异步 Agent Loop 的每轮 LLM 生成补充 prompt_text 与 response_text，使 MLflow、Weave 和 Trackio 能够还原真实的多轮轨迹，同时保持原有 API 与返回对象不变。",
      stats: "4 个文件 · +111 / −25 · 2026.08 已合并",
    },
  },
  {
    number: "03",
    subtitle: "ARENO · PR #473",
    discipline: "GPU Kernels · Verification",
    status: "MERGED",
    url: "https://github.com/inclusionAI/AReno/pull/473",
    en: {
      title: "GPU numerical references for native Attention",
      description:
        "Built GPU equivalence tests for varlen prefill and paged decode attention against independent PyTorch SDPA math, covering gradients, GQA, causal and sliding-window masks, and KV-cache updates.",
      stats: "1 file · +228 / −0 · merged Aug 2026",
    },
    zh: {
      title: "为原生 Attention 建立 GPU 数值基准",
      description:
        "以 PyTorch SDPA math 为独立参考，为 varlen prefill 与 paged decode attention 建立 GPU 数值等价测试，覆盖梯度、GQA、因果与滑动窗口掩码、KV cache 更新等关键路径。",
      stats: "1 个文件 · +228 / −0 · 2026.08 已合并",
    },
  },
  {
    number: "04",
    subtitle: "AREAL · PR #1578",
    discipline: "Distributed RL · Infrastructure",
    status: "MERGED",
    url: "https://github.com/areal-project/AReaL/pull/1578",
    en: {
      title: "Reliable launch environments for TMS Offload",
      description:
        "Resolved the stdbuf and LD_PRELOAD collision in multi-GPU TMS offload, centralized local command construction, and validated the complete initialize → offload → destroy lifecycle.",
      stats: "4 files · +324 / −23 · merged Aug 2026",
    },
    zh: {
      title: "修复 TMS Offload 的启动环境冲突",
      description:
        "解决多 GPU TMS offload 场景中 stdbuf 注入与 LD_PRELOAD 冲突的问题，统一本地启动命令构造，并验证 initialize → offload → destroy 的完整生命周期。",
      stats: "4 个文件 · +324 / −23 · 2026.08 已合并",
    },
  },
  {
    number: "05",
    subtitle: "AREAL · PR #1571",
    discipline: "FSDP · Systems Reliability",
    status: "DRAFT",
    url: "https://github.com/areal-project/AReaL/pull/1571",
    en: {
      title: "Race-safe teardown for FSDP / TMS training",
      description:
        "Designed re-entrant resume and cleanup, phased worker shutdown, monitored barriers, and TERM-to-KILL process-group escalation for teardown races after TMS offload, validated on two GPUs.",
      stats: "10 files · +1,102 / −121 · draft",
    },
    zh: {
      title: "让 FSDP / TMS 训练可以可靠退出",
      description:
        "针对 TMS offload 后的训练 teardown race，设计可重入的资源恢复、分阶段 worker 退出、受监控 barrier 与进程组 TERM-to-KILL 升级，并用双 GPU 场景验证无孤儿进程与残留显存。",
      stats: "10 个文件 · +1,102 / −121 · 草稿",
    },
  },
  {
    number: "06",
    subtitle: "HUGGING FACE TRL · PR #6615",
    discipline: "RL Post-training · Memory",
    status: "DRAFT",
    url: "https://github.com/huggingface/trl/pull/6615",
    en: {
      title: "Lower-memory GRPO and RLOO training",
      description:
        "Added opt-in activation offloading to GRPOTrainer and RLOOTrainer, extending memory optimization to reinforcement-learning post-training paths without changing default behavior.",
      stats: "7 files · +100 / −8 · draft",
    },
    zh: {
      title: "降低 GRPO 与 RLOO 的训练显存压力",
      description:
        "为 GRPOTrainer 与 RLOOTrainer 增加可选的 activation offloading，在不改变默认行为的前提下，把现有内存优化能力延伸到强化学习后训练路径。",
      stats: "7 个文件 · +100 / −8 · 草稿",
    },
  },
  {
    number: "07",
    subtitle: "VERL · PR #7215",
    discipline: "FSDP · Optimizer",
    status: "OPEN",
    url: "https://github.com/verl-project/verl/pull/7215",
    en: {
      title: "Selective weight decay under FSDP",
      description:
        "Fixed incorrect weight decay on bias and normalization parameters in FSDP, with standard parameter groups, legacy-checkpoint compatibility, and FSDP1/FSDP2 regression coverage.",
      stats: "11 files · +304 / −17 · open",
    },
    zh: {
      title: "在 FSDP 中正确应用选择性 Weight Decay",
      description:
        "修复 FSDP 优化器对 bias 与 normalization 参数错误施加 weight decay 的问题，引入标准参数分组策略、旧检查点兼容选项与覆盖 FSDP1/FSDP2 的回归验证。",
      stats: "11 个文件 · +304 / −17 · 待合并",
    },
  },
] as const;

const researchQuestions = [
  {
    index: "01",
    en: {
      title: "How can world models enter the embodied decision loop?",
      text: "How can environmental prediction support long-horizon planning, causal reasoning, counterfactual imagination, and closed-loop control—not just generation?",
    },
    zh: {
      title: "世界模型如何真正进入具身决策回路？",
      text: "如何让环境预测不只服务于生成，而能支持长期规划、因果推理、反事实想象与闭环控制。",
    },
  },
  {
    index: "02",
    en: {
      title: "How can robots keep learning from data and interaction?",
      text: "How can imitation learning, reinforcement learning, and online experience be combined so policies improve efficiently and robustly under real-world constraints?",
    },
    zh: {
      title: "机器人怎样从数据与交互中持续学习？",
      text: "如何把模仿学习、强化学习与在线经验结合起来，让策略在真实约束下更高效、更稳健地改进。",
    },
  },
  {
    index: "03",
    en: {
      title: "What is the next abstraction for agentic embodied systems?",
      text: "How should perception, memory, planning, tools, and action be coordinated so agents transfer across tasks while retaining interpretable boundaries in open worlds?",
    },
    zh: {
      title: "Agentic 具身架构的下一层抽象是什么？",
      text: "如何协调感知、规划、记忆、工具和动作，使智能体能够跨任务迁移，并在开放世界里保持可解释的行为边界。",
    },
  },
] as const;

const recentMerges = [
  {
    label: "FastMCP #4704",
    url: "https://github.com/PrefectHQ/fastmcp/pull/4704",
  },
  {
    label: "verl #7204",
    url: "https://github.com/verl-project/verl/pull/7204",
  },
  {
    label: "AReno #473",
    url: "https://github.com/inclusionAI/AReno/pull/473",
  },
];

const toolkit = [
  "Python",
  "PyTorch",
  "FSDP",
  "Reinforcement Learning",
  "Robot Learning",
  "Distributed Systems",
  "MCP",
];

const copy = {
  en: {
    skip: "Skip to content",
    topLabel: "Back to the top",
    navLabel: "Primary navigation",
    nav: {
      work: "Open source↘",
      questions: "Research↘",
      about: "About↘",
      contact: "Contact↘",
    },
    languageLabel: "Choose language",
    chooseEnglish: "View this page in English",
    chooseChinese: "用中文查看此页面",
    recentLabel: "RECENT MERGES",
    recentAria: "Recently merged open-source contributions",
    availability: "RESEARCH INTERN @ CASIA",
    eyebrow: "EMBODIED INTELLIGENCE · OPEN-SOURCE CONTRIBUTOR",
    heroLine1: "Building agents",
    heroLine2: "that learn in the world.",
    introLeadPrefix: "I am a research intern at ",
    institute: "the Institute of Automation, Chinese Academy of Sciences",
    introLeadSuffix:
      ", working on embodied intelligence and world models, robot learning and reinforcement learning, and next-generation agentic architectures for embodied systems.",
    introSecondary:
      "On GitHub, I turn engineering questions in RL post-training, agent runtimes, and distributed systems into reproducible, testable experiments through open-source collaboration.",
    cta: "Explore upstream work",
    workIndex: "01 / UPSTREAM WORK",
    workHeading1: "Turning research questions",
    workHeading2: "into verifiable systems.",
    workIntro:
      "Selected public pull requests by YAO-001. Status and statistics last checked on 2026.08.30. Open a row for the summary and original PR.",
    viewPr: "VIEW PULL REQUEST ↗",
    status: { MERGED: "MERGED", DRAFT: "DRAFT", OPEN: "OPEN" },
    questionsIndex: "02 / CURRENT QUESTIONS",
    questionsHeading: "The questions I am working through.",
    questionMeta: "RESEARCH / 2026",
    aboutIndex: "03 / ABOUT",
    aboutHeading:
      "I study embodied intelligence—and the systems that make the research reliable.",
    aboutFirst:
      "My research interests sit at the intersection of embodied intelligence, world models, robot learning, and reinforcement learning. I want to explore a more complete agentic embodied architecture—one that can perceive, remember, plan, use tools, act, and learn through continued interaction with the world.",
    aboutSecond:
      "Alongside research, I contribute to FastMCP, verl, AReaL, TRL, and AReno. Reliable training infrastructure, observable agent trajectories, and explicit tool boundaries are not secondary concerns to me; they are part of the research problem.",
    toolkitLabel: "Technical focus",
    contactLabel: "SAY HELLO",
    linksLabel: "Social links",
    backTop: "Back to top↑",
  },
  zh: {
    skip: "跳到正文",
    topLabel: "回到首页顶部",
    navLabel: "主导航",
    nav: {
      work: "开源↘",
      questions: "研究↘",
      about: "关于↘",
      contact: "联系↘",
    },
    languageLabel: "选择语言",
    chooseEnglish: "View this page in English",
    chooseChinese: "用中文查看此页面",
    recentLabel: "RECENT MERGES / 近期合并",
    recentAria: "近期合并的开源贡献",
    availability: "中科院自动化所 · 研究实习生",
    eyebrow: "具身智能研究 · OPEN-SOURCE CONTRIBUTOR",
    heroLine1: "让智能体，",
    heroLine2: "在世界里学习。",
    introLeadPrefix: "我目前在",
    institute: "中国科学院自动化研究所",
    introLeadSuffix:
      "实习，主要围绕具身智能与世界模型、机器人学习与强化学习，以及面向 Agentic 的下一代具身智能架构开展研究。",
    introSecondary:
      "在 GitHub 上，我通过开源协作，把 RL 后训练、Agent 运行时和分布式系统中的工程问题转化为可复现、可验证的实验。",
    cta: "查看开源工作",
    workIndex: "01 / UPSTREAM WORK",
    workHeading1: "把研究问题，",
    workHeading2: "变成可验证的系统。",
    workIntro:
      "精选自 GitHub 账号 YAO-001 的公开 Pull Requests。状态与统计更新于 2026.08.30，点击每一行查看工作摘要与原始 PR。",
    viewPr: "查看原始 PULL REQUEST ↗",
    status: { MERGED: "已合并", DRAFT: "草稿", OPEN: "待合并" },
    questionsIndex: "02 / CURRENT QUESTIONS",
    questionsHeading: "当前真正关心的问题。",
    questionMeta: "研究 / 2026",
    aboutIndex: "03 / ABOUT",
    aboutHeading: "研究具身，也研究让研究可靠运行的系统。",
    aboutFirst:
      "我的研究兴趣位于具身智能、世界模型、机器人学习与强化学习的交叉处。我希望探索一种更完整的 Agentic 具身架构：它能够感知、记忆、规划、调用工具，并通过与世界持续交互来学习。",
    aboutSecond:
      "与此同时，我长期参与开源协作，贡献覆盖 FastMCP、verl、AReaL、TRL 与 AReno。对我而言，可靠的训练基础设施、可观测的智能体轨迹和明确的工具边界，本身就是智能系统研究的一部分。",
    toolkitLabel: "技术关键词",
    contactLabel: "SAY HELLO / 联系",
    linksLabel: "社交链接",
    backTop: "回到顶部↑",
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeView, setActiveView] = useState("home");
  const [motionPaused, setMotionPaused] = useState(false);
  const currentCopy = copy[language];

  useEffect(() => {
    const syncView = () => {
      const id = window.location.hash.slice(1);
      if (id === "content") return;
      setActiveView(["work", "questions", "about", "contact"].includes(id) ? id : "home");
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    syncView();
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  }, [language]);

  return (
    <>
      <a className="skip-link" href="#content">
        {currentCopy.skip}
      </a>

      <div className="page-shell" id="top" data-language={language} data-view={activeView} data-motion={motionPaused ? "paused" : "playing"}>
        <div className="ambient-field" aria-hidden="true">
          <div className="ambient-ring" />
          <div className="water-ripples"><i /><i /><i /></div>
          <div className="rising-particles">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>
          <span className="giant-type">YAO</span>
        </div>
        <div className="scene-wipe" key={activeView} aria-hidden="true"><i /><i /></div>
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label={currentCopy.topLabel}>
            YAO / 001 <sup>26</sup>
          </a>

          <p className="edition">RESEARCH · OPEN SOURCE · 2026</p>

          <div className="header-actions">
            <nav className="primary-nav" aria-label={currentCopy.navLabel}>
              {[
                ["home", language === "en" ? "PROFILE" : "个人档案"],
                ["work", language === "en" ? "OPEN SOURCE" : "开源贡献"],
                ["questions", language === "en" ? "RESEARCH" : "研究方向"],
                ["about", language === "en" ? "ABOUT" : "关于我"],
                ["contact", language === "en" ? "CONTACT" : "联系"],
              ].map(([id, label], index) => (
                <a key={id} href={id === "home" ? "#top" : `#${id}`} aria-current={activeView === id ? "page" : undefined}
                  onKeyDown={(event) => {
                    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
                    event.preventDefault();
                    const links = event.currentTarget.parentElement?.querySelectorAll<HTMLAnchorElement>("a");
                    const next = event.key === "Home" ? 0 : event.key === "End" ? 4 : (index + (event.key === "ArrowDown" ? 1 : 4)) % 5;
                    links?.[next]?.focus();
                  }}><small>0{index + 1}</small><span>{label}</span><b aria-hidden="true">↗</b></a>
              ))}
            </nav>

            <div className="language-switch" role="group" aria-label={currentCopy.languageLabel}>
              <button type="button" className="motion-control" aria-pressed={motionPaused}
                aria-label={language === "en" ? "Pause animations" : "暂停动画"}
                onClick={() => setMotionPaused((paused) => !paused)}>
                {motionPaused ? (language === "en" ? "Motion off" : "动态已关") : (language === "en" ? "Motion on" : "动态已开")}
              </button>
              <button
                type="button"
                className={language === "en" ? "is-active" : undefined}
                aria-pressed={language === "en"}
                aria-label={currentCopy.chooseEnglish}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                className={language === "zh" ? "is-active" : undefined}
                aria-pressed={language === "zh"}
                aria-label={currentCopy.chooseChinese}
                onClick={() => setLanguage("zh")}
              >
                中文
              </button>
            </div>
          </div>
        </header>

        <main id="content">
          <section className="hero" aria-labelledby="hero-title" hidden={activeView !== "home"}>
            <aside className="hero-rail" aria-label={currentCopy.recentAria}>
              <div>
                <p className="micro-label">{currentCopy.recentLabel}</p>
                <ul className="plain-list">
                  {recentMerges.map((item) => (
                    <li key={item.label}>
                      <span aria-hidden="true">✳</span>
                      <a href={item.url} target="_blank" rel="noreferrer">
                        {item.label} <small>↗</small>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="availability">
                <span className="status-dot" aria-hidden="true" />
                {currentCopy.availability}
              </div>
            </aside>

            <div className="hero-copy">
              <p className="eyebrow">{currentCopy.eyebrow}</p>
              <h1 id="hero-title">
                {currentCopy.heroLine1}
                <br />
                <em>{currentCopy.heroLine2}</em>
              </h1>

              <div className="intro-grid">
                <p className="intro-lead">
                  {currentCopy.introLeadPrefix}
                  <a href="#about">{currentCopy.institute}</a>
                  {currentCopy.introLeadSuffix}
                </p>
                <p>{currentCopy.introSecondary}</p>
              </div>

              <a className="text-link" href="#work">
                {currentCopy.cta} <span aria-hidden="true">↘</span>
              </a>
            </div>

            <div className="orbit-mark" aria-hidden="true">
              <span>✣</span>
            </div>

            <p className="margin-note" aria-hidden="true">
              EMBODIED INTELLIGENCE · WORLD MODELS · AGENTIC SYSTEMS
            </p>
          </section>

          <section className="section-block" id="work" aria-labelledby="work-title" hidden={activeView !== "work"}>
            <header className="section-header">
              <p className="section-index">{currentCopy.workIndex}</p>
              <div>
                <h2 id="work-title">
                  {currentCopy.workHeading1}
                  <br />
                  {currentCopy.workHeading2}
                </h2>
                <p className="section-intro">{currentCopy.workIntro}</p>
              </div>
            </header>

            <div className="project-list">
              {projects.map((project, index) => {
                const translatedProject = project[language];

                return (
                  <details className="project-item" key={project.number} open={index === 0}>
                    <summary>
                      <span className="project-number">{project.number}</span>
                      <span className="project-title">
                        {translatedProject.title}
                        <small>{project.subtitle}</small>
                      </span>
                      <span className="project-discipline">{project.discipline}</span>
                      <span className={`project-status status-${project.status.toLowerCase()}`}>
                        {currentCopy.status[project.status]}
                      </span>
                      <span className="project-toggle" aria-hidden="true">
                        ＋
                      </span>
                    </summary>
                    <div className="project-detail">
                      <p>{translatedProject.description}</p>
                      <div className="project-detail-meta">
                        <p className="project-note">{translatedProject.stats}</p>
                        <a
                          className="project-pr-link"
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {currentCopy.viewPr}
                        </a>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>

          <section
            className="section-block notes-section"
            id="questions"
            hidden={activeView !== "questions"}
            aria-labelledby="questions-title"
          >
            <header className="section-header compact">
              <p className="section-index">{currentCopy.questionsIndex}</p>
              <div>
                <h2 id="questions-title">{currentCopy.questionsHeading}</h2>
              </div>
            </header>

            <div className="notes-grid">
              {researchQuestions.map((question) => {
                const translatedQuestion = question[language];

                return (
                  <article className="note-card" key={question.index}>
                    <div className="note-meta">
                      <span>{question.index}</span>
                      <span>{currentCopy.questionMeta}</span>
                    </div>
                    <h3>{translatedQuestion.title}</h3>
                    <p>{translatedQuestion.text}</p>
                    <span className="note-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="about-section" id="about" aria-labelledby="about-title" hidden={activeView !== "about"}>
            <div className="about-stamp" aria-hidden="true">
              <span>CASIA</span>
              <small>RESEARCH INTERN</small>
            </div>

            <div className="about-copy">
              <p className="section-index">{currentCopy.aboutIndex}</p>
              <h2 id="about-title">{currentCopy.aboutHeading}</h2>
              <div className="about-text">
                <p>{currentCopy.aboutFirst}</p>
                <p>{currentCopy.aboutSecond}</p>
              </div>

              <ul className="toolkit" aria-label={currentCopy.toolkitLabel}>
                {toolkit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <footer className="site-footer" id="contact" hidden={activeView !== "contact"}>
          <div>
            <p className="micro-label">{currentCopy.contactLabel}</p>
            <a className="contact-link" href="mailto:yaoyaoguonan@outlook.com">
              yaoyaoguonan@outlook.com <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="footer-links" aria-label={currentCopy.linksLabel}>
            <a href="https://github.com/YAO-001" target="_blank" rel="noreferrer">
              GitHub↗
            </a>
            <a href="#top">{currentCopy.backTop}</a>
          </div>

          <p className="colophon">
            EMBODIED INTELLIGENCE · OPEN SOURCE
            <br />
            LAST UPDATE · AUG 2026
          </p>
        </footer>
        <div className="system-bar"><span>YAO / 001 — {language === "en" ? "RESEARCH PORTFOLIO" : "研究档案"}</span><span>{language === "en" ? "↑ ↓ Navigate · Enter Select" : "↑ ↓ 选择 · Enter 确认"}</span><a href="https://github.com/YAO-001" target="_blank" rel="noreferrer">GITHUB ↗</a></div>
      </div>
    </>
  );
}
