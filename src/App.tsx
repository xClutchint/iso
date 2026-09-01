import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CaretDown,
  ChatCircle,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  Cloud,
  Database,
  EnvelopeSimple,
  FileText,
  FolderOpen,
  List,
  MagnifyingGlass,
  PresentationChart,
  ShieldCheck,
  ShoppingCart,
  UsersThree,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

type FormStatus = "idle" | "loading" | "success" | "error";
type ProductMode = "chat" | "knowledge" | "connections";

const productModes: Array<{
  id: ProductMode;
  label: string;
  icon: typeof ChatCircle;
}> = [
  { id: "chat", label: "Chat", icon: ChatCircle },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "connections", label: "Connections", icon: Database },
];

const capabilityExamples = [
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    request: "Add this WhatsApp order to the CRM and prepare a confirmation.",
    result: "Order added. Confirmation ready for review.",
    activity: ["Customer matched", "Order draft created", "Confirmation prepared"],
  },
  {
    id: "research",
    label: "Research",
    icon: MagnifyingGlass,
    request: "Review nearby listings and save a competitor report to OneDrive.",
    result: "The competitor report is ready in OneDrive.",
    activity: ["12 listings reviewed", "Sources verified", "Report saved"],
  },
  {
    id: "documents",
    label: "Documents",
    icon: PresentationChart,
    request: "Turn these notes into a client presentation and place it in Drive.",
    result: "The presentation is ready for review.",
    activity: ["Notes organised", "12 slides created", "Presentation saved"],
  },
  {
    id: "email",
    label: "Email",
    icon: EnvelopeSimple,
    request: "Draft a follow-up using the latest account notes and meeting summary.",
    result: "The follow-up is drafted and ready to send.",
    activity: ["Account notes found", "Meeting checked", "Draft prepared"],
  },
];

const connectionApps = [
  { label: "WhatsApp Business", detail: "Sales channel", icon: WhatsappLogo, tone: "whatsapp" },
  { label: "OneDrive", detail: "Company files", icon: Cloud, tone: "onedrive" },
  { label: "CRM", detail: "Customer records", icon: Database, tone: "neutral" },
  { label: "Gmail", detail: "Team inbox", icon: EnvelopeSimple, tone: "gmail" },
];

const knowledgeSources = [
  { label: "Orders", detail: "Live", icon: Database },
  { label: "Invoices", detail: "248 files", icon: FileText },
  { label: "Product catalogue", detail: "Synced", icon: FolderOpen },
  { label: "Company policies", detail: "36 files", icon: ShieldCheck },
];

const teamMembers = [
  { initials: "EC", name: "Emily Carter", access: "WhatsApp, CRM" },
  { initials: "JW", name: "James Wilson", access: "OneDrive, CRM" },
  { initials: "SR", name: "Sophia Rodriguez", access: "WhatsApp, OneDrive" },
  { initials: "MT", name: "Marcus Thompson", access: "CRM, reports" },
];

const recentActivity = [
  { initials: "EC", text: "Emily connected WhatsApp", time: "10:42 AM" },
  { initials: "JW", text: "James connected OneDrive", time: "Yesterday" },
  { initials: "SR", text: "Sophia requested approval", time: "9:17 AM" },
  { initials: "MT", text: "Marcus connected CRM", time: "Monday" },
];

function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function focusTab(
  event: KeyboardEvent<HTMLButtonElement>,
  currentIndex: number,
  total: number,
  select: (index: number) => void,
) {
  let nextIndex: number | null = null;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % total;
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + total) % total;
  }
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = total - 1;
  if (nextIndex === null) return;

  event.preventDefault();
  select(nextIndex);
  const tabList = event.currentTarget.parentElement;
  window.requestAnimationFrame(() => {
    const tabs = tabList?.querySelectorAll<HTMLElement>("[role='tab']");
    tabs?.[nextIndex!]?.focus();
  });
}

function Logo() {
  return (
    <a className="brand" href="#top" aria-label="ISO home">
      ISO
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const menu = mobileNavRef.current;
    const focusableItems = Array.from(
      menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
    );
    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];
    window.requestAnimationFrame(() => firstItem?.focus());

    const handleMenuKeydown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !firstItem || !lastItem) return;

      if (event.shiftKey && (document.activeElement === firstItem || !menu?.contains(document.activeElement))) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", handleMenuKeydown);
    return () => document.removeEventListener("keydown", handleMenuKeydown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header-shell">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#product">Product</a>
          <a href="#integrations">Integrations</a>
          <a href="#controls">Controls</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="header-actions">
          <a className="header-link" href="#product">See product</a>
          <a className="button button-primary button-small" href="#early-access">Get early access</a>
        </div>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={19} /> : <List size={19} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              className="menu-scrim"
              type="button"
              aria-label="Close navigation"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.nav
              ref={mobileNavRef}
              id="mobile-navigation"
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <a href="#product" onClick={closeMenu}>Product</a>
              <a href="#integrations" onClick={closeMenu}>Integrations</a>
              <a href="#controls" onClick={closeMenu}>Controls</a>
              <a href="#pricing" onClick={closeMenu}>Pricing</a>
              <a className="button button-primary" href="#early-access" onClick={closeMenu}>Get early access</a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function TrafficLights() {
  return (
    <span className="traffic-lights" aria-hidden="true">
      <i className="traffic-red" />
      <i className="traffic-yellow" />
      <i className="traffic-green" />
    </span>
  );
}

function AssistantMark() {
  return <span className="assistant-mark" aria-hidden="true"><i /></span>;
}

function ProductTabs({ mode, onSelect, labelledBy }: { mode: ProductMode; onSelect: (mode: ProductMode) => void; labelledBy: string }) {
  const selectedIndex = productModes.findIndex((item) => item.id === mode);

  return (
    <div className="product-tabs" role="tablist" aria-label={labelledBy}>
      {productModes.map((item, index) => {
        const Icon = item.icon;
        const selected = mode === item.id;
        return (
          <button
            id={`hero-tab-${item.id}`}
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="hero-workspace-panel"
            tabIndex={selected ? 0 : -1}
            className={selected ? "is-active" : ""}
            onClick={() => onSelect(item.id)}
            onKeyDown={(event) => focusTab(event, selectedIndex, productModes.length, (next) => onSelect(productModes[next].id))}
          >
            <Icon size={18} weight="regular" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ChatPanel() {
  return (
    <div className="phone-panel chat-panel">
      <div className="message message-user">Pull the invoice for this month&apos;s perfume order and send it here.</div>
      <div className="assistant-row">
        <AssistantMark />
        <div className="assistant-answer">
          <p>Found it. I matched the CRM order and added the invoice below.</p>
          <div className="action-receipt">
            <span><Cloud className="app-onedrive" size={18} weight="fill" /><b>OneDrive searched</b><CheckCircle size={16} /></span>
            <span><Database size={18} /><b>CRM order PF-204 matched</b><CheckCircle size={16} /></span>
            <span><FileText className="app-pdf" size={18} weight="fill" /><b>Invoice_March.pdf ready</b><CheckCircle size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KnowledgePanel() {
  return (
    <div className="phone-panel phone-list-panel">
      <div className="panel-intro">
        <div><span>Company knowledge</span><strong>Everything your team needs</strong></div>
        <span className="sync-copy"><CheckCircle size={15} weight="fill" /> 12 sources</span>
      </div>
      <div className="source-list">
        {knowledgeSources.map((source) => {
          const Icon = source.icon;
          return (
            <div className="source-row" key={source.label}>
              <span className="source-icon"><Icon size={19} /></span>
              <div><strong>{source.label}</strong><small>{source.detail}</small></div>
              <CheckCircle size={17} />
            </div>
          );
        })}
      </div>
      <p className="panel-footnote"><ClockCounterClockwise size={15} /> Synced just now</p>
    </div>
  );
}

function ConnectionsPanel() {
  return (
    <div className="phone-panel phone-list-panel">
      <div className="panel-intro">
        <div><span>Connected accounts</span><strong>Ready wherever work happens</strong></div>
        <span className="sync-copy"><CheckCircle size={15} weight="fill" /> Live</span>
      </div>
      <div className="source-list">
        {connectionApps.map((app) => {
          const Icon = app.icon;
          return (
            <div className="source-row" key={app.label}>
              <span className={`source-icon app-${app.tone}`}><Icon size={20} weight={app.tone === "whatsapp" ? "fill" : "regular"} /></span>
              <div><strong>{app.label}</strong><small>{app.detail}</small></div>
              <span className="connected-label">Connected</span>
            </div>
          );
        })}
      </div>
      <a className="quiet-action" href="#integrations">Manage connections <ArrowRight size={15} /></a>
    </div>
  );
}

function HeroPhone() {
  const [mode, setMode] = useState<ProductMode>("chat");
  const reduceMotion = useReducedMotion();

  return (
    <div className="device hero-device" role="group" aria-label="Interactive ISO workspace preview">
      <div className="device-chrome">
        <TrafficLights />
        <strong>ISO</strong>
        <label className="organisation-switcher">
          <span className="sr-only">Organisation</span>
          <select defaultValue="aster" aria-label="Organisation">
            <option value="aster">Aster &amp; Co.</option>
            <option value="northstar">Northstar Realty</option>
          </select>
          <CaretDown size={13} aria-hidden="true" />
        </label>
      </div>
      <ProductTabs mode={mode} onSelect={setMode} labelledBy="ISO workspace modes" />
      <div className="device-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            id="hero-workspace-panel"
            role="tabpanel"
            aria-labelledby={`hero-tab-${mode}`}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="panel-motion"
          >
            {mode === "chat" && <ChatPanel />}
            {mode === "knowledge" && <KnowledgePanel />}
            {mode === "connections" && <ConnectionsPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="device-composer" aria-hidden={mode !== "chat"}>
        <span>{mode === "chat" ? "Message ISO" : "Ask ISO about this workspace"}</span>
        <span className="composer-action" aria-hidden="true"><ArrowRight size={17} /></span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-halo" aria-hidden="true" />
      <div className="page-shell hero-inner">
        <motion.div className="hero-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>One connected AI workspace</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24, rotateX: -18 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.78, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}>
            Give your team an AI<br className="desktop-break" /> that gets work done.
          </motion.h1>
          <motion.p className="hero-body" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }}>Connect your tools, knowledge and channels. Turn everyday requests into finished work.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}>
            <a className="button button-primary" href="#early-access">Get early access</a>
            <a className="button button-secondary" href="#product">See ISO at work</a>
          </motion.div>
        </motion.div>
        <motion.div className="hero-device-stage" initial={{ opacity: 0, y: 28, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}>
          <HeroPhone />
        </motion.div>
      </div>
    </section>
  );
}

function ValueStatement() {
  return (
    <section className="value-statement" id="product">
      <Reveal className="page-shell statement-inner">
        <h2>One place for the AI your business needs.</h2>
        <p>Agents, models, integrations and team access come together in one managed workspace.</p>
      </Reveal>
    </section>
  );
}

function ContextWindow() {
  return (
    <div className="context-window" aria-label="ISO connected workspace flow">
      <div className="wide-window-chrome"><TrafficLights /><strong>ISO</strong><span>Workspace online</span></div>
      <div className="context-grid">
        <div className="context-column connections-column">
          <h3><ChatCircle size={20} /> Connections</h3>
          <div className="context-list">
            {connectionApps.map((app) => {
              const Icon = app.icon;
              return (
                <div className="context-row" key={app.label}>
                  <span className={`source-icon app-${app.tone}`}><Icon size={20} weight={app.tone === "whatsapp" ? "fill" : "regular"} /></span>
                  <div><strong>{app.label}</strong><small>{app.detail}</small></div>
                  <CheckCircle size={17} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="context-column knowledge-column">
          <h3><BookOpen size={20} /> Knowledge</h3>
          <div className="context-list">
            {knowledgeSources.map((source) => {
              const Icon = source.icon;
              return (
                <div className="context-row" key={source.label}>
                  <span className="source-icon"><Icon size={19} /></span>
                  <div><strong>{source.label}</strong><small>{source.detail}</small></div>
                </div>
              );
            })}
          </div>
          <p className="sources-synced"><ClockCounterClockwise size={16} /> 12 sources synced</p>
        </div>
        <div className="context-column result-column">
          <h3><CheckCircle size={20} /> Ready to act</h3>
          <div className="compact-chat">
            <div className="message message-user">Pull the invoice for this month&apos;s perfume order.</div>
            <div className="compact-answer">
              <AssistantMark />
              <div>
                <p>Found it. I matched the CRM order and added the invoice.</p>
                <div className="mini-receipt">
                  <span><Cloud size={16} className="app-onedrive" /> OneDrive searched <Check size={14} /></span>
                  <span><Database size={16} /> Order PF-204 matched <Check size={14} /></span>
                  <span><FileText size={16} className="app-pdf" /> Invoice ready <Check size={14} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsSection() {
  return (
    <section className="section integrations-section" id="integrations">
      <div className="page-shell">
        <Reveal className="section-heading section-heading-centered">
          <h2>Connect once. Work across everything.</h2>
          <p>Bring your tools, company knowledge and team channels into one managed workspace.</p>
        </Reveal>
        <Reveal delay={0.08}><ContextWindow /></Reveal>
      </div>
    </section>
  );
}

function CapabilityPhone({ selected }: { selected: number }) {
  const example = capabilityExamples[selected];
  const reduceMotion = useReducedMotion();

  return (
    <div className="device capability-device" aria-live="polite">
      <div className="device-chrome compact-chrome"><TrafficLights /><strong>ISO</strong><span>Work assistant</span></div>
      <div className="capability-phone-title"><WhatsappLogo size={18} weight="fill" /> Team channel</div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={example.id}
          id="capability-workspace-panel"
          role="tabpanel"
          aria-labelledby={`capability-tab-${example.id}`}
          className="capability-phone-body"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.26 }}
        >
          <div className="message message-user">{example.request}</div>
          <div className="assistant-row">
            <AssistantMark />
            <div className="assistant-answer capability-answer">
              <p>{example.result}</p>
              <div className="activity-list">
                <strong>Activity</strong>
                {example.activity.map((item) => <span key={item}><CheckCircle size={16} />{item}</span>)}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="device-composer capability-composer"><span>Message ISO</span><span className="composer-action" aria-hidden="true"><ArrowRight size={17} /></span></div>
    </div>
  );
}

function CapabilitiesSection() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="section capabilities-section" aria-labelledby="capabilities-title">
      <div className="page-shell capability-grid">
        <Reveal className="capability-copy">
          <h2 id="capabilities-title">From a message to finished work.</h2>
          <p>ISO finds the context, uses the right tools and returns the result where work began.</p>
          <div className="capability-selector" role="tablist" aria-label="Work examples">
            {capabilityExamples.map((item, index) => {
              const Icon = item.icon;
              const active = index === selected;
              return (
                <button
                  id={`capability-tab-${item.id}`}
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="capability-workspace-panel"
                  tabIndex={active ? 0 : -1}
                  className={active ? "is-active" : ""}
                  onClick={() => setSelected(index)}
                  onKeyDown={(event) => focusTab(event, selected, capabilityExamples.length, setSelected)}
                >
                  <span className="selector-icon"><Icon size={21} /></span>
                  <strong>{item.label}</strong>
                  <ArrowRight size={17} />
                </button>
              );
            })}
          </div>
        </Reveal>
        <Reveal className="capability-device-wrap" delay={0.08}><CapabilityPhone selected={selected} /></Reveal>
      </div>
    </section>
  );
}

function AdminConsole() {
  const [approval, setApproval] = useState<"pending" | "approved" | "review">("pending");

  return (
    <div className="admin-console" aria-label="ISO organisation controls preview">
      <div className="wide-window-chrome"><TrafficLights /><strong>ISO</strong><span>Organisation controls</span></div>
      <div className="admin-grid">
        <div className="admin-column people-column">
          <h3><UsersThree size={20} /> People</h3>
          <p className="column-label">Individual connections</p>
          <div className="people-list">
            {teamMembers.map((member) => (
              <div className="person-row" key={member.name}>
                <span className="person-avatar">{member.initials}</span>
                <div><strong>{member.name}</strong><small>{member.access}</small></div>
              </div>
            ))}
          </div>
          <div className="managed-access">
            <p className="column-label">Managed access</p>
            <span><WhatsappLogo size={17} /> WhatsApp <small>All members</small></span>
            <span><Cloud size={17} /> OneDrive <small>All members</small></span>
            <span><Database size={17} /> CRM <small>Sales team</small></span>
          </div>
        </div>
        <div className="admin-column approval-column">
          <h3><ShieldCheck size={20} /> Approvals</h3>
          <div className={`approval-status status-${approval}`} aria-live="polite">
            {approval === "pending" && "Needs approval"}
            {approval === "approved" && "Approved"}
            {approval === "review" && "Marked for review"}
          </div>
          <div className="approval-person"><span className="person-avatar">SR</span><p><strong>Sophia Rodriguez</strong> wants to send a customer confirmation.</p></div>
          <div className="approval-actions-list">
            <span><WhatsappLogo size={18} /><div><strong>WhatsApp</strong><small>Send customer message</small></div></span>
            <span><Cloud size={18} /><div><strong>OneDrive</strong><small>Attach Confirmation_March.pdf</small></div></span>
            <span><Database size={18} /><div><strong>CRM</strong><small>Create note on customer record</small></div></span>
          </div>
          <div className="approval-buttons">
            <button className="button button-primary" type="button" onClick={() => setApproval("approved")} disabled={approval === "approved"}>Approve</button>
            <button className="button button-secondary" type="button" onClick={() => setApproval("review")}>Review</button>
          </div>
        </div>
        <div className="admin-column activity-column">
          <h3><ClockCounterClockwise size={20} /> Activity</h3>
          <div className="activity-feed">
            {recentActivity.map((item) => (
              <div className="activity-row" key={`${item.initials}-${item.text}`}>
                <span className="person-avatar">{item.initials}</span>
                <div><strong>{item.text}</strong><small>{item.time}</small></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlsSection() {
  return (
    <section className="section controls-section" id="controls">
      <div className="page-shell">
        <Reveal className="section-heading section-heading-centered">
          <h2>The right access for every person.</h2>
          <p>Administrators control connected apps, available actions and approval rules. Activity stays visible in one place.</p>
        </Reveal>
        <Reveal delay={0.08}><AdminConsole /></Reveal>
      </div>
    </section>
  );
}

function EarlyAccessForm({ bundle }: { bundle: number }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
  }, []);

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    timerRef.current = window.setTimeout(() => setStatus("success"), 700);
  };

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <CheckCircle size={28} weight="fill" />
        <div><strong>You are on the early access list.</strong><p>We will be in touch with the next steps.</p></div>
      </div>
    );
  }

  return (
    <form className="early-form" onSubmit={submitForm} noValidate>
      <input type="hidden" name="bundle" value={bundle} />
      <label htmlFor="work-email">Work email</label>
      <input id="work-email" type="email" name="email" placeholder="you@company.com" autoComplete="email" aria-invalid={status === "error"} aria-describedby={status === "error" ? "email-error" : undefined} required />
      <button className="button button-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Joining..." : "Get early access"}
        {status !== "loading" && <ArrowRight size={17} />}
      </button>
      {status === "error" && <p className="form-error" id="email-error" role="alert">Enter a valid work email.</p>}
    </form>
  );
}

function PricingSection() {
  const [bundle, setBundle] = useState(5);
  const bundleLabel = bundle === 20 ? "Growing teams" : `${bundle} people`;

  return (
    <section className="section pricing-section" id="pricing">
      <div className="page-shell">
        <Reveal className="section-heading section-heading-centered pricing-heading">
          <h2>One plan for the whole organisation.</h2>
          <p>Start with five people. Add the next five as your team grows.</p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="bundle-builder">
            <div className="bundle-choices" role="group" aria-label="Choose team bundle">
              {[5, 10, 15, 20].map((amount) => {
                const label = amount === 20 ? "Growing teams" : `${amount} people`;
                return (
                  <button key={amount} type="button" className={bundle === amount ? "is-active" : ""} aria-pressed={bundle === amount} onClick={() => setBundle(amount)}>
                    <UsersThree size={19} /><span>{label}</span>{bundle === amount && <Check size={16} />}
                  </button>
                );
              })}
            </div>
            <div className="bundle-includes">
              <h3>Your ISO workspace</h3>
              <span><CheckCircle size={18} /> Hosted AI agents</span>
              <span><CheckCircle size={18} /> Connected tools and channels</span>
              <span><CheckCircle size={18} /> Individual team access</span>
              <span><CheckCircle size={18} /> Monthly AI usage</span>
              <span><CheckCircle size={18} /> Approval controls</span>
            </div>
            <div className="bundle-cta" id="early-access">
              <p>Selected bundle</p>
              <strong>{bundleLabel}</strong>
              <span>Early access pricing is shared during onboarding.</span>
              <EarlyAccessForm bundle={bundle} />
            </div>
          </div>
        </Reveal>
        <Reveal className="closing-line"><p>Bring practical AI into everyday work.</p></Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <Logo />
        <p>AI that works where your team works.</p>
        <nav aria-label="Footer navigation">
          <a href="#product">Product</a><a href="#integrations">Integrations</a><a href="#controls">Controls</a><a href="#pricing">Pricing</a>
        </nav>
        <span>© {new Date().getFullYear()} ISO</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <ValueStatement />
        <IntegrationsSection />
        <CapabilitiesSection />
        <ControlsSection />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
