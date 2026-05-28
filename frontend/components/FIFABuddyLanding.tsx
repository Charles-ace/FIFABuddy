"use client";

import { useMemo, useState } from "react";

type Agent = {
  name: string;
  role: string;
  status: "Executing" | "Monitoring" | "Ready";
  score: string;
  accent: string;
};

type MarketplaceAgent = {
  name: string;
  category: string;
  description: string;
  runs: string;
  uptime: string;
};

const featuredAgents: Agent[] = [
  { name: "Scout-7", role: "Market intelligence", status: "Executing", score: "98.4%", accent: "emerald" },
  { name: "Relay Core", role: "Workflow coordinator", status: "Monitoring", score: "42 ops", accent: "teal" },
  { name: "Risk Sentinel", role: "Execution guardrails", status: "Executing", score: "0.04s", accent: "lime" },
  { name: "Alpha Desk", role: "Signal synthesis", status: "Ready", score: "17 feeds", accent: "mint" },
];

const marketplaceAgents: MarketplaceAgent[] = [
  {
    name: "Trading Analyst",
    category: "Markets",
    description: "Turns order flow, social velocity, and macro feeds into ranked execution signals.",
    runs: "2.8M",
    uptime: "99.99%",
  },
  {
    name: "Treasury Operator",
    category: "Finance",
    description: "Coordinates allocations, policy checks, and approval routing across wallets.",
    runs: "840K",
    uptime: "99.97%",
  },
  {
    name: "Support Copilot",
    category: "Ops",
    description: "Routes tickets, drafts answers, escalates incidents, and monitors customer sentiment.",
    runs: "5.1M",
    uptime: "99.94%",
  },
  {
    name: "Research Swarm",
    category: "Research",
    description: "Deploys parallel agents to read, score, and summarize high-volume intelligence.",
    runs: "1.2M",
    uptime: "99.96%",
  },
  {
    name: "Compliance Watch",
    category: "Risk",
    description: "Watches policy boundaries, flags anomalous behavior, and records execution proofs.",
    runs: "690K",
    uptime: "99.98%",
  },
  {
    name: "Growth Autopilot",
    category: "Growth",
    description: "Tests content, segments audiences, and optimizes campaigns with live feedback loops.",
    runs: "3.4M",
    uptime: "99.91%",
  },
];

const ecosystem = [
  "OpenAI",
  "Anthropic",
  "X Layer",
  "WalletConnect",
  "Base",
  "Polygon",
  "Notion",
  "Slack",
  "Linear",
  "Vercel",
];

const faqs = [
  {
    question: "What is FIFABuddy?",
    answer:
      "FIFABuddy is an AI Agent Hub for deploying, coordinating, and monitoring autonomous agents from one real-time command center.",
  },
  {
    question: "Can agents execute workflows automatically?",
    answer:
      "Yes. You can run agents manually, schedule workflows, or let approved agents execute tasks inside policy and risk limits.",
  },
  {
    question: "How does multi-agent coordination work?",
    answer:
      "A coordinator agent routes context, delegates tasks, verifies outputs, and keeps every specialist agent synchronized through live execution state.",
  },
  {
    question: "Is FIFABuddy built for institutional teams?",
    answer:
      "The interface is designed for high-signal operations: audit trails, live status, clear ownership, policy checks, and fast operator review.",
  },
];

function FIFABuddyLogo() {
  return (
    <div className="hub-logo" aria-label="FIFABuddy">
      <svg className="hub-logo-mark" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="hubLogoGradient" x1="8" y1="56" x2="56" y2="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#02f57f" />
            <stop offset="0.52" stopColor="#00d7a7" />
            <stop offset="1" stopColor="#d7ffe9" />
          </linearGradient>
        </defs>
        <path d="M18 46V16h30v8H28v7h16v8H28v7H18Z" fill="url(#hubLogoGradient)" />
        <circle cx="48" cy="16" r="4" fill="#9cffc7" />
        <circle cx="44" cy="46" r="3.5" fill="#02f57f" />
        <circle cx="18" cy="16" r="3.5" fill="#00d7a7" />
        <path className="hub-logo-orbit-path" d="M14 35c8 15 33 16 41 0M50 29C43 14 20 12 11 27" />
      </svg>
      <span className="hub-logo-copy">FIFABuddy</span>
    </div>
  );
}

function MiniIcon({ type }: { type: "deploy" | "monitor" | "chart" | "shield" }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (type === "deploy") {
    return (
      <svg {...common}><path d="M12 3v12m0-12 4 4m-4-4-4 4" /><path d="M5 14v5h14v-5" /></svg>
    );
  }
  if (type === "monitor") {
    return (
      <svg {...common}><path d="M4 5h16v11H4z" /><path d="M9 21h6m-3-5v5" /><path d="m7 12 3-3 3 2 4-5" /></svg>
    );
  }
  if (type === "chart") {
    return (
      <svg {...common}><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 3-4 3 2 5-7" /></svg>
    );
  }
  return (
    <svg {...common}><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></svg>
  );
}

function Flag({ country }: { country: "US" | "GB" | "NG" | "JP" | "BR" | "SG" }) {
  if (country === "US") {
    return (
      <svg className="hub-flag" viewBox="0 0 7410 3900" aria-label="United States flag">
        <path fill="#b22234" d="M0 0h7410v3900H0z" />
        <path stroke="#fff" strokeWidth="300" d="M0 450h7410M0 1050h7410M0 1650h7410M0 2250h7410M0 2850h7410M0 3450h7410" />
        <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
      </svg>
    );
  }
  if (country === "GB") {
    return (
      <svg className="hub-flag" viewBox="0 0 60 30" aria-label="United Kingdom flag">
        <clipPath id="gbClip"><path d="M0 0h60v30H0z" /></clipPath>
        <path fill="#012169" d="M0 0h60v30H0z" />
        <path stroke="#fff" strokeWidth="6" d="m0 0 60 30m0-30L0 30" clipPath="url(#gbClip)" />
        <path stroke="#C8102E" strokeWidth="4" d="m0 0 60 30m0-30L0 30" clipPath="url(#gbClip)" />
        <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60" />
        <path stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60" />
      </svg>
    );
  }
  if (country === "NG") {
    return (
      <svg className="hub-flag" viewBox="0 0 6 3" aria-label="Nigeria flag">
        <path fill="#008751" d="M0 0h6v3H0z" />
        <path fill="#fff" d="M2 0h2v3H2z" />
      </svg>
    );
  }
  if (country === "JP") {
    return (
      <svg className="hub-flag" viewBox="0 0 3 2" aria-label="Japan flag">
        <path fill="#fff" d="M0 0h3v2H0z" />
        <circle cx="1.5" cy="1" r="0.6" fill="#bc002d" />
      </svg>
    );
  }
  if (country === "BR") {
    return (
      <svg className="hub-flag" viewBox="0 0 20 14" aria-label="Brazil flag">
        <path fill="#009b3a" d="M0 0h20v14H0z" />
        <path fill="#ffdf00" d="M10 1.3 18 7l-8 5.7L2 7z" />
        <circle cx="10" cy="7" r="3" fill="#002776" />
      </svg>
    );
  }
  return (
    <svg className="hub-flag" viewBox="0 0 3 2" aria-label="Singapore flag">
      <path fill="#fff" d="M0 0h3v2H0z" />
      <path fill="#ef3340" d="M0 0h3v1H0z" />
      <circle cx="0.62" cy="0.5" r="0.3" fill="#fff" />
      <circle cx="0.72" cy="0.5" r="0.25" fill="#ef3340" />
    </svg>
  );
}

export function FIFABuddyLanding() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState(0);

  const categories = ["All", "Markets", "Finance", "Ops", "Research", "Risk", "Growth"];
  const filteredAgents = useMemo(
    () =>
      marketplaceAgents.filter((agent) => {
        const matchesCategory = category === "All" || agent.category === category;
        const matchesSearch = `${agent.name} ${agent.description} ${agent.category}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [category, query]
  );

  return (
    <main className="hub-shell">
      <div className="hub-ambient hub-ambient-one" />
      <div className="hub-ambient hub-ambient-two" />

      <header className="hub-nav">
        <FIFABuddyLogo />
        <nav className="hub-nav-links" aria-label="Primary navigation">
          <a href="#command">Command</a>
          <a href="#agents">Agents</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className="hub-nav-cta" href="#pricing">Launch Hub</a>
      </header>

      <section className="hub-hero">
        <div className="hub-hero-copy">
          <div className="hub-eyebrow"><span /> Autonomous AI Operations Layer</div>
          <h1>Mission control for autonomous AI agents.</h1>
          <p>
            Deploy specialist agents, coordinate workflows, monitor execution, and convert market intelligence into real-time action from one institutional-grade control center.
          </p>
          <div className="hub-hero-actions">
            <a className="hub-btn hub-btn-primary" href="#command">Deploy Agent</a>
            <a className="hub-btn hub-btn-secondary" href="#workflow">View Orchestration</a>
          </div>
          <div className="hub-trust-row" aria-label="Live platform metrics">
            <div><strong>24.8M</strong><span>agent runs</span></div>
            <div><strong>99.98%</strong><span>runtime uptime</span></div>
            <div><strong>0.42s</strong><span>median routing</span></div>
          </div>
        </div>

        <div className="hub-hero-visual" aria-label="AI agent command visualization">
          <div className="hub-orbit-core">
            <div className="hub-orbit-ring hub-orbit-ring-one" />
            <div className="hub-orbit-ring hub-orbit-ring-two" />
            <div className="hub-command-core"><FIFABuddyLogo /></div>
          </div>
          <div className="hub-panel hub-panel-feed">
            <span className="hub-panel-label">Execution Feed</span>
            {["Scout-7 parsed 18 market feeds", "Risk Sentinel approved policy", "Relay Core dispatched workflow"].map((item) => (
              <div className="hub-feed-line" key={item}><span />{item}</div>
            ))}
          </div>
          <div className="hub-panel hub-panel-chart">
            <span className="hub-panel-label">Signal Confidence</span>
            <div className="hub-mini-chart">
              {["36%", "54%", "48%", "68%", "76%", "71%", "88%"].map((height, index) => (
                <span key={height + index} style={{ height }} />
              ))}
            </div>
          </div>
          <div className="hub-node hub-node-one">Ops</div>
          <div className="hub-node hub-node-two">Risk</div>
          <div className="hub-node hub-node-three">Intel</div>
        </div>

        <div className="hub-logo-strip">
          <span>Trusted execution fabric</span>
          <div className="hub-marquee">
            <div>
              {ecosystem.concat(ecosystem).map((item, index) => <b key={`${item}-${index}`}>{item}</b>)}
            </div>
          </div>
        </div>
      </section>

      <section className="hub-section hub-command" id="command">
        <div className="hub-section-heading">
          <span>Live Agent Command Center</span>
          <h2>Every agent, workflow, and signal in one operational grid.</h2>
        </div>
        <div className="hub-command-grid">
          <div className="hub-glass-card hub-command-main">
            <div className="hub-card-top">
              <div><span className="hub-panel-label">Orchestration Load</span><strong>87 active workflows</strong></div>
              <span className="hub-live-pill">Live</span>
            </div>
            <div className="hub-terminal">
              {["ingest.market_feed", "route.to_scout_cluster", "verify.policy_bounds", "execute.approved_tasks", "write.audit_trail"].map((step, index) => (
                <div key={step} style={{ animationDelay: `${index * 0.18}s` }}><span>0{index + 1}</span>{step}<b>OK</b></div>
              ))}
            </div>
          </div>
          <div className="hub-glass-card">
            <span className="hub-panel-label">System Health</span>
            <div className="hub-radial"><strong>99.98%</strong><span>execution reliability</span></div>
          </div>
          <div className="hub-glass-card">
            <span className="hub-panel-label">Activity Feed</span>
            <div className="hub-activity-list">
              <p><span />Tokyo desk deployed Research Swarm</p>
              <p><span />Treasury Operator completed 12 approvals</p>
              <p><span />Alpha Desk raised confidence threshold</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hub-section" id="agents">
        <div className="hub-section-heading">
          <span>Featured AI Agents</span>
          <h2>Specialists that coordinate like a single operating system.</h2>
        </div>
        <div className="hub-agent-grid">
          {featuredAgents.map((agent) => (
            <article className={`hub-agent-card hub-agent-${agent.accent}`} key={agent.name}>
              <div className="hub-agent-avatar"><span />{agent.name.slice(0, 2)}</div>
              <div>
                <h3>{agent.name}</h3>
                <p>{agent.role}</p>
              </div>
              <div className="hub-agent-meta">
                <span>{agent.status}</span>
                <strong>{agent.score}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section" id="marketplace">
        <div className="hub-section-heading hub-split-heading">
          <div>
            <span>Agent Marketplace</span>
            <h2>Search, deploy, and compose production-ready agent systems.</h2>
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search agents..." aria-label="Search agents" />
        </div>
        <div className="hub-filter-row">
          {categories.map((item) => (
            <button type="button" className={item === category ? "active" : ""} onClick={() => setCategory(item)} key={item}>
              {item}
            </button>
          ))}
        </div>
        <div className="hub-market-grid">
          {filteredAgents.map((agent) => (
            <article className="hub-market-card" key={agent.name}>
              <div className="hub-market-icon"><MiniIcon type={agent.category === "Risk" ? "shield" : agent.category === "Markets" ? "chart" : agent.category === "Ops" ? "monitor" : "deploy"} /></div>
              <span>{agent.category}</span>
              <h3>{agent.name}</h3>
              <p>{agent.description}</p>
              <div><b>{agent.runs}</b> runs <b>{agent.uptime}</b> uptime</div>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section hub-workflow" id="workflow">
        <div className="hub-section-heading">
          <span>Multi-Agent Workflow Visualization</span>
          <h2>Autonomous execution chains with verifiable coordination.</h2>
        </div>
        <div className="hub-workflow-board">
          {["Trigger", "Research", "Risk Check", "Execute", "Audit"].map((node, index) => (
            <div className="hub-workflow-node" key={node} style={{ animationDelay: `${index * 0.2}s` }}>
              <span>{index + 1}</span>
              <strong>{node}</strong>
              <small>{index === 0 ? "Signal received" : index === 1 ? "Agents dispatched" : index === 2 ? "Policy verified" : index === 3 ? "Task committed" : "Proof stored"}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="hub-section hub-analytics">
        <div className="hub-section-heading">
          <span>Real-Time Analytics</span>
          <h2>Market intelligence, execution quality, and agent performance.</h2>
        </div>
        <div className="hub-analytics-grid">
          <div className="hub-glass-card hub-wide-chart">
            <div className="hub-card-top"><strong>AI Signal Tracking</strong><span className="hub-live-pill">Streaming</span></div>
            <svg viewBox="0 0 640 220" className="hub-line-chart" aria-hidden="true">
              <path className="hub-chart-area" d="M0 190 C80 140 110 180 180 120 C250 58 295 122 350 88 C430 35 500 84 640 26 L640 220 L0 220Z" />
              <path className="hub-chart-line" d="M0 190 C80 140 110 180 180 120 C250 58 295 122 350 88 C430 35 500 84 640 26" />
            </svg>
          </div>
          {["Agent throughput 12.4k/min", "Market feeds 318 live", "Policy blocks 0.7%", "Avg confidence 91%"].map((metric) => (
            <div className="hub-metric-card" key={metric}><strong>{metric.split(" ").slice(-1)}</strong><span>{metric.replace(metric.split(" ").slice(-1)[0], "")}</span></div>
          ))}
        </div>
      </section>

      <section className="hub-section hub-global">
        <div className="hub-section-heading">
          <span>Global Activity Map</span>
          <h2>Operators and agents executing across live markets worldwide.</h2>
        </div>
        <div className="hub-global-grid">
          <div className="hub-world-map" aria-hidden="true">
            <span className="hub-map-dot dot-us" />
            <span className="hub-map-dot dot-uk" />
            <span className="hub-map-dot dot-ng" />
            <span className="hub-map-dot dot-jp" />
            <span className="hub-map-dot dot-br" />
          </div>
          <div className="hub-country-list">
            {[
              ["US", "United States", "8,420 live tasks"],
              ["GB", "United Kingdom", "3,118 live tasks"],
              ["NG", "Nigeria", "2,904 live tasks"],
              ["JP", "Japan", "2,244 live tasks"],
              ["BR", "Brazil", "1,840 live tasks"],
              ["SG", "Singapore", "1,602 live tasks"],
            ].map(([code, name, tasks]) => (
              <div className="hub-country-row" key={code}>
                <Flag country={code as "US" | "GB" | "NG" | "JP" | "BR" | "SG"} />
                <span>{name}</span>
                <strong>{tasks}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hub-section hub-integrations">
        <div className="hub-section-heading">
          <span>Supported Ecosystem</span>
          <h2>Connect models, chains, tools, wallets, and work systems.</h2>
        </div>
        <div className="hub-integration-strip">
          {ecosystem.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="hub-section hub-testimonials">
        <div className="hub-section-heading">
          <span>Institutional Teams</span>
          <h2>Built for operators who need clarity while agents move fast.</h2>
        </div>
        <div className="hub-testimonial-grid">
          {[
            ["Maya Chen", "Head of Automation, Meridian Capital", "FIFABuddy gave our desk a live view of every agent action, policy check, and escalation. It feels like an operations room for AI."],
            ["Olu Adeyemi", "Founder, SignalForge Labs", "The multi-agent workflow view changed how we ship research. We can see delegation, verification, and execution in one surface."],
            ["Elena Roth", "COO, Northstar Systems", "It has the density of a trading terminal without the chaos. Our teams trust it because the state is always visible."],
          ].map(([name, title, quote]) => (
            <article className="hub-testimonial-card" key={name}>
              <p>"{quote}"</p>
              <div><strong>{name}</strong><span>{title}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section hub-pricing" id="pricing">
        <div className="hub-section-heading">
          <span>Pricing</span>
          <h2>Scale from operator cockpit to institutional agent mesh.</h2>
        </div>
        <div className="hub-pricing-grid">
          {[
            ["Starter", "$49", "Deploy 5 agents", "Basic workflow monitor", "Community marketplace"],
            ["Command", "$249", "Deploy 50 agents", "Advanced orchestration", "Policy and audit trails"],
            ["Institution", "Custom", "Unlimited agent mesh", "Dedicated infrastructure", "Priority integrations"],
          ].map((plan, index) => (
            <article className={`hub-price-card ${index === 1 ? "featured" : ""}`} key={plan[0]}>
              <span>{plan[0]}</span>
              <h3>{plan[1]}</h3>
              {plan.slice(2).map((feature) => <p key={feature}>{feature}</p>)}
              <a href="#command">{index === 2 ? "Contact Sales" : "Start Now"}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="hub-section hub-faq">
        <div className="hub-section-heading">
          <span>FAQ</span>
          <h2>Everything operators ask before launching an agent hub.</h2>
        </div>
        <div className="hub-faq-list">
          {faqs.map((faq, index) => (
            <button className={openFaq === index ? "open" : ""} type="button" key={faq.question} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
              <span>{faq.question}</span>
              <p>{faq.answer}</p>
            </button>
          ))}
        </div>
      </section>

      <footer className="hub-footer">
        <FIFABuddyLogo />
        <div>
          <a href="#agents">Agents</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#pricing">Pricing</a>
          <a href="https://x.com/charlesace_" target="_blank" rel="noreferrer">Built by @charlesace</a>
        </div>
      </footer>
    </main>
  );
}
