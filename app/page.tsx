const projects = [
  {
    number: "01",
    title: "让 CodeMode 的工具错误可以被恢复",
    subtitle: "FASTMCP · PR #4704",
    discipline: "Agent Runtime · MCP",
    status: "MERGED",
    description:
      "修复 FastMCP CodeMode 中工具异常绕过 guest try/except 的问题，让沙箱程序能够捕获失败的工具调用、保留中间结果并继续执行，同时让未捕获错误仍以清晰的 ToolError 暴露。",
    stats: "3 files · +122 / −65 · merged 2026.08",
    url: "https://github.com/PrefectHQ/fastmcp/pull/4704",
  },
  {
    number: "02",
    title: "补齐 Agentic RL 的逐轮生成追踪",
    subtitle: "VERL · PR #7204",
    discipline: "Agentic RL · Observability",
    status: "MERGED",
    description:
      "为异步 Agent Loop 的每轮 LLM 生成补充 prompt_text 与 response_text，使 MLflow、Weave 和 Trackio 能够还原真实的多轮轨迹，同时保持原有 API 与返回对象不变。",
    stats: "4 files · +111 / −25 · merged 2026.08",
    url: "https://github.com/verl-project/verl/pull/7204",
  },
  {
    number: "03",
    title: "为原生 Attention 建立 GPU 数值基准",
    subtitle: "ARENO · PR #473",
    discipline: "GPU Kernels · Verification",
    status: "MERGED",
    description:
      "以 PyTorch SDPA math 为独立参考，为 varlen prefill 与 paged decode attention 建立 GPU 数值等价测试，覆盖梯度、GQA、因果与滑动窗口掩码、KV cache 更新等关键路径。",
    stats: "1 file · +228 / −0 · merged 2026.08",
    url: "https://github.com/inclusionAI/AReno/pull/473",
  },
  {
    number: "04",
    title: "修复 TMS Offload 的启动环境冲突",
    subtitle: "AREAL · PR #1578",
    discipline: "Distributed RL · Infrastructure",
    status: "MERGED",
    description:
      "解决多 GPU TMS offload 场景中 stdbuf 注入与 LD_PRELOAD 冲突的问题，统一本地启动命令构造，并验证 initialize → offload → destroy 的完整生命周期。",
    stats: "4 files · +324 / −23 · merged 2026.08",
    url: "https://github.com/areal-project/AReaL/pull/1578",
  },
  {
    number: "05",
    title: "让 FSDP / TMS 训练可以可靠退出",
    subtitle: "AREAL · PR #1571",
    discipline: "FSDP · Systems Reliability",
    status: "DRAFT",
    description:
      "针对 TMS offload 后的训练 teardown race，设计可重入的资源恢复、分阶段 worker 退出、受监控 barrier 与进程组 TERM-to-KILL 升级，并用双 GPU 场景验证无孤儿进程与残留显存。",
    stats: "10 files · +1,102 / −121 · open draft",
    url: "https://github.com/areal-project/AReaL/pull/1571",
  },
  {
    number: "06",
    title: "降低 GRPO 与 RLOO 的训练显存压力",
    subtitle: "HUGGING FACE TRL · PR #6615",
    discipline: "RL Post-training · Memory",
    status: "DRAFT",
    description:
      "为 GRPOTrainer 与 RLOOTrainer 增加可选的 activation offloading，在不改变默认行为的前提下，把现有内存优化能力延伸到强化学习后训练路径。",
    stats: "7 files · +100 / −8 · open draft",
    url: "https://github.com/huggingface/trl/pull/6615",
  },
  {
    number: "07",
    title: "在 FSDP 中正确应用选择性 Weight Decay",
    subtitle: "VERL · PR #7215",
    discipline: "FSDP · Optimizer",
    status: "OPEN",
    description:
      "修复 FSDP 优化器对 bias 与 normalization 参数错误施加 weight decay 的问题，引入标准参数分组策略、旧检查点兼容选项与覆盖 FSDP1/FSDP2 的回归验证。",
    stats: "11 files · +304 / −17 · open",
    url: "https://github.com/verl-project/verl/pull/7215",
  },
];

const researchQuestions = [
  {
    index: "01",
    title: "世界模型如何真正进入具身决策回路？",
    text: "如何让环境预测不只服务于生成，而能支持长期规划、因果推理、反事实想象与闭环控制。",
  },
  {
    index: "02",
    title: "机器人怎样从数据与交互中持续学习？",
    text: "如何把模仿学习、强化学习与在线经验结合起来，让策略在真实约束下更高效、更稳健地改进。",
  },
  {
    index: "03",
    title: "Agentic 具身架构的下一层抽象是什么？",
    text: "如何协调感知、规划、记忆、工具和动作，使智能体能够跨任务迁移，并在开放世界里保持可解释的行为边界。",
  },
];

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

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#content">
        跳到正文
      </a>

      <div className="page-shell" id="top">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="回到首页顶部">
            YAO / 001 <sup>26</sup>
          </a>

          <p className="edition">RESEARCH · OPEN SOURCE · 2026</p>

          <nav className="primary-nav" aria-label="主导航">
            <a href="#work">开源↘</a>
            <a href="#questions">研究↘</a>
            <a href="#about">关于↘</a>
            <a href="#contact">联系↘</a>
          </nav>
        </header>

        <main id="content">
          <section className="hero" aria-labelledby="hero-title">
            <aside className="hero-rail" aria-label="近期合并的开源贡献">
              <div>
                <p className="micro-label">RECENT MERGES / 近期合并</p>
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
                RESEARCH INTERN @ CASIA
              </div>
            </aside>

            <div className="hero-copy">
              <p className="eyebrow">具身智能研究 · OPEN-SOURCE CONTRIBUTOR</p>
              <h1 id="hero-title">
                让智能体，
                <br />
                <em>在世界里学习。</em>
              </h1>

              <div className="intro-grid">
                <p className="intro-lead">
                  我目前在<a href="#about">中国科学院自动化研究所</a>实习，主要围绕具身智能与世界模型、机器人学习与强化学习，以及面向 Agentic 的下一代具身智能架构开展研究。
                </p>
                <p>
                  在 GitHub 上，我通过开源协作，把 RL 后训练、Agent 运行时和分布式系统中的工程问题转化为可复现、可验证的实验。
                </p>
              </div>

              <a className="text-link" href="#work">
                查看开源工作 <span aria-hidden="true">↘</span>
              </a>
            </div>

            <div className="orbit-mark" aria-hidden="true">
              <span>✣</span>
            </div>

            <p className="margin-note" aria-hidden="true">
              EMBODIED INTELLIGENCE · WORLD MODELS · AGENTIC SYSTEMS
            </p>
          </section>

          <section className="section-block" id="work" aria-labelledby="work-title">
            <header className="section-header">
              <p className="section-index">01 / UPSTREAM WORK</p>
              <div>
                <h2 id="work-title">
                  把研究问题，
                  <br />
                  变成可验证的系统。
                </h2>
                <p className="section-intro">
                  精选自 GitHub 账号 YAO-001 的公开 Pull Requests。状态与统计更新于 2026.08.30，点击每一行查看工作摘要与原始 PR。
                </p>
              </div>
            </header>

            <div className="project-list">
              {projects.map((project, index) => (
                <details className="project-item" key={project.number} open={index === 0}>
                  <summary>
                    <span className="project-number">{project.number}</span>
                    <span className="project-title">
                      {project.title}
                      <small>{project.subtitle}</small>
                    </span>
                    <span className="project-discipline">{project.discipline}</span>
                    <span className={`project-status status-${project.status.toLowerCase()}`}>
                      {project.status}
                    </span>
                    <span className="project-toggle" aria-hidden="true">
                      ＋
                    </span>
                  </summary>
                  <div className="project-detail">
                    <p>{project.description}</p>
                    <div className="project-detail-meta">
                      <p className="project-note">{project.stats}</p>
                      <a
                        className="project-pr-link"
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        VIEW PULL REQUEST ↗
                      </a>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section
            className="section-block notes-section"
            id="questions"
            aria-labelledby="questions-title"
          >
            <header className="section-header compact">
              <p className="section-index">02 / CURRENT QUESTIONS</p>
              <div>
                <h2 id="questions-title">当前真正关心的问题。</h2>
              </div>
            </header>

            <div className="notes-grid">
              {researchQuestions.map((question) => (
                <article className="note-card" key={question.index}>
                  <div className="note-meta">
                    <span>{question.index}</span>
                    <span>RESEARCH / 2026</span>
                  </div>
                  <h3>{question.title}</h3>
                  <p>{question.text}</p>
                  <span className="note-arrow" aria-hidden="true">
                    ↗
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="about-section" id="about" aria-labelledby="about-title">
            <div className="about-stamp" aria-hidden="true">
              <span>CASIA</span>
              <small>RESEARCH INTERN</small>
            </div>

            <div className="about-copy">
              <p className="section-index">03 / ABOUT</p>
              <h2 id="about-title">研究具身，也研究让研究可靠运行的系统。</h2>
              <div className="about-text">
                <p>
                  我的研究兴趣位于具身智能、世界模型、机器人学习与强化学习的交叉处。我希望探索一种更完整的 Agentic 具身架构：它能够感知、记忆、规划、调用工具，并通过与世界持续交互来学习。
                </p>
                <p>
                  与此同时，我长期参与开源协作，贡献覆盖 FastMCP、verl、AReaL、TRL 与 AReno。对我而言，可靠的训练基础设施、可观测的智能体轨迹和明确的工具边界，本身就是智能系统研究的一部分。
                </p>
              </div>

              <ul className="toolkit" aria-label="技术关键词">
                {toolkit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <footer className="site-footer" id="contact">
          <div>
            <p className="micro-label">SAY HELLO / 联系</p>
            <a className="contact-link" href="mailto:yaoyaoguonan@outlook.com">
              yaoyaoguonan@outlook.com <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="footer-links" aria-label="社交链接">
            <a href="https://github.com/YAO-001" target="_blank" rel="noreferrer">
              GitHub↗
            </a>
            <a href="#top">回到顶部↑</a>
          </div>

          <p className="colophon">
            EMBODIED INTELLIGENCE · OPEN SOURCE
            <br />
            LAST UPDATE · AUG 2026
          </p>
        </footer>
      </div>
    </>
  );
}
