"use client";

import { useEffect, useState } from "react";

const chapters = [
  ["01", "作品", "#projects"],
  ["02", "文章", "#essays"],
  ["03", "关于", "#about"],
] as const;

export function DesktopChapterBar() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState("projects");

  useEffect(() => {
    const hero = document.getElementById("top-content");
    if (!hero) return;

    const updateVisibility = () => {
      setVisible(hero.getBoundingClientRect().bottom <= 56);
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    const sections = ["projects", "essays", "about"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          )[0];
        if (active) setCurrent(active.target.id);
      },
      { rootMargin: "-25% 0px -55%", threshold: [0.08, 0.3, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      className={`desktop-chapter-bar${visible ? " is-visible" : ""}`}
      aria-label="快捷章节导航"
    >
      <div className="desktop-chapter-inner">
        <a className="desktop-back-top" href="#top">
          <span aria-hidden="true">↑</span>
          <span>返回顶部</span>
        </a>
        <div className="desktop-chapter-links">
          {chapters.map(([number, label, href]) => (
            <a
              className="desktop-chapter-link"
              href={href}
              aria-current={current === href.slice(1) ? "true" : undefined}
              key={href}
            >
              <span>{number}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

type EvidenceTab = "context" | "problem" | "eval";

const evidenceTabs: Array<[EvidenceTab, string]> = [
  ["context", "记忆"],
  ["problem", "问题"],
  ["eval", "评估"],
];

export function ContextGardenDemo({
  compact = false,
  idPrefix = "desktop",
}: {
  compact?: boolean;
  idPrefix?: string;
}) {
  const [active, setActive] = useState<EvidenceTab>("context");

  const selectAdjacent = (index: number, direction: number) => {
    const nextIndex =
      (index + direction + evidenceTabs.length) % evidenceTabs.length;
    const next = evidenceTabs[nextIndex][0];
    setActive(next);
    document.getElementById(`${idPrefix}-tab-${next}`)?.focus();
  };

  return (
    <div className="demo-window" aria-label="Context Garden 可切换界面证据">
      <div className="window-tabs" role="tablist" aria-label="项目证据视图">
        {evidenceTabs.map(([id, label], index) => (
          <button
            className="tab-button"
            id={`${idPrefix}-tab-${id}`}
            type="button"
            role="tab"
            aria-controls={`${idPrefix}-panel-${id}`}
            aria-selected={active === id}
            tabIndex={active === id ? 0 : -1}
            onClick={() => setActive(id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                selectAdjacent(index, -1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                selectAdjacent(index, 1);
              }
            }}
            key={id}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="window-panel"
        id={`${idPrefix}-panel-context`}
        role="tabpanel"
        aria-labelledby={`${idPrefix}-tab-context`}
        hidden={active !== "context"}
      >
        <div className="window-status">
          <span className="window-label connected">
            {compact ? "Local context" : "Local context connected"}
          </span>
          <span className="window-label">{compact ? "24" : "24 memories"}</span>
        </div>
        <div className="context-board">
          <div className="context-side">
            {compact ? null : <strong>CONTEXT / GARDEN</strong>}
            <span className="active">今日上下文</span>
            <span>长期记忆</span>
            <span>召回评估</span>
            {compact ? null : <span>事件记录</span>}
          </div>
          <div className="context-main">
            {compact ? null : (
              <span className="window-label">THU · AUG 06</span>
            )}
            <h4>今天值得继续的三件事</h4>
            {compact ? null : <p>根据当前目标与过去 14 天的记录整理</p>}
            <div className="context-cards">
              <div className="context-card wide">
                <span>Working context</span>
                {compact
                  ? "把功能列表改写为问题、判断与证据。"
                  : "把作品页从“功能列表”改写为问题、判断与证据。"}
              </div>
              <div className="context-card">
                <span>Recall</span>
                {compact ? "区分事实与回忆。" : "区分确定事实与模糊回忆。"}
              </div>
              <div className="context-card">
                <span>Open loop</span>
                {compact ? "留下评估样本。" : "为错误召回增加评估样本。"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="window-panel"
        id={`${idPrefix}-panel-problem`}
        role="tabpanel"
        aria-labelledby={`${idPrefix}-tab-problem`}
        hidden={active !== "problem"}
      >
        <div className="window-status">
          <span className="window-label">Decision map</span>
          <span className="window-label">Problem / v03</span>
        </div>
        <div className="problem-map">
          <span className="window-label">控制流不是固定管线</span>
          <h4>让 Agent 判断什么时候需要记忆</h4>
          <div className="flow-row">
            <div className="flow-node">
              <strong>当前问题</strong>
              <span>先判断信息是否足够</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-node">
              <strong>选择工具</strong>
              <span>结构化读取或检索</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-node">
              <strong>留下依据</strong>
              <span>来源、时间与置信度</span>
            </div>
          </div>
          <p className="problem-note">
            真正的问题不是“有没有向量库”，而是错误记忆出现时能否知道它从哪里来。
          </p>
        </div>
      </div>

      <div
        className="window-panel"
        id={`${idPrefix}-panel-eval`}
        role="tabpanel"
        aria-labelledby={`${idPrefix}-tab-eval`}
        hidden={active !== "eval"}
      >
        <div className="window-status">
          <span className="window-label connected">Evaluation ready</span>
          <span className="window-label">12 samples</span>
        </div>
        <div className="eval-board">
          <span className="window-label">Regression set</span>
          <h4>把坏案例留下来，再跑一次</h4>
          <div className="eval-list">
            <div className="eval-row">
              <div>
                <strong>确定事实是否被错误改写</strong>
                <span>姓名、偏好与当前状态</span>
              </div>
              <span className="eval-state">Passed</span>
            </div>
            <div className="eval-row">
              <div>
                <strong>旧事件是否压过当前目标</strong>
                <span>时间权重与工作上下文</span>
              </div>
              <span className="eval-state review">Review</span>
            </div>
            <div className="eval-row">
              <div>
                <strong>召回结果是否可以追踪来源</strong>
                <span>source ids / timestamps</span>
              </div>
              <span className="eval-state">Passed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
