import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BatteryCharging,
  Bell,
  Bike,
  Camera,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileText,
  Filter,
  History,
  Home,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Moon,
  Sun,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

const bikeImage = "https://images.pexels.com/photos/34259660/pexels-photo-34259660.jpeg?auto=compress&cs=tinysrgb&w=900";

const metrics = [
  { value: "07", label: "Attention", tone: "amber", icon: AlertTriangle },
  { value: "03", label: "Critical", tone: "red", icon: AlertTriangle },
  { value: "12", label: "Maintenance", tone: "blue", icon: Wrench },
  { value: "08", label: "Charging", tone: "green", icon: BatteryCharging },
];

const vehicles = [
  { id: "MS 2048", model: "E Bike X1", status: "Needs attention", battery: "86%", range: "32 km", hub: "Indiranagar Hub", tone: "amber" },
  { id: "MS 2017", model: "E Bike X1", status: "Charging", battery: "24%", range: "8 km", hub: "Koramangala Hub", tone: "blue" },
  { id: "MS 2091", model: "E Bike X2", status: "Active", battery: "94%", range: "38 km", hub: "Indiranagar Hub", tone: "green" },
];

const checklist = [
  ["Brakes", "Good", true], ["Tires", "Good", true], ["Battery", "Good", true],
  ["Lights", "Issue detected", false], ["Chain", "Good", true], ["Bell", "Good", true],
];

type View = "home" | "vehicles" | "tasks" | "alerts" | "profile" | "scanner" | "vehicle" | "inspection" | "report" | "submitted" | "issue";

function StatusBadge({ children, tone = "green" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`status status-${tone}`}><span className="status-dot" />{children}</span>;
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const preference = localStorage.getItem("milestride-theme");
    return preference ? preference === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("milestride-theme", dark ? "dark" : "light");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#101817" : "#f3f6f5");
  }, [dark]);
  return <button className="icon-btn theme-toggle" aria-label="Toggle dark mode" onClick={() => setDark(value => !value)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}

function TopBar({ title, onBack, action }: { title?: string; onBack?: () => void; action?: React.ReactNode }) {
  return <header className={`topbar ${onBack ? "subpage-topbar" : ""}`}>
    {onBack ? <button className="icon-btn" onClick={onBack}><ArrowLeft size={20} /></button> : <div className="topbar-spacer" />}
    {title && <h1>{title}</h1>}
    <div className="top-actions">{action}</div>
  </header>;
}

function BottomNav({ active, setView }: { active: View; setView: (v: View) => void }) {
  const items = [["home", "Home", Home], ["vehicles", "Vehicles", Bike], ["tasks", "Tasks", ClipboardCheck], ["alerts", "Alerts", Bell], ["profile", "Profile", UserRound]] as const;
  return <nav className="bottom-nav">{items.map(([id, label, Icon]) => <button key={id} className={active === id ? "active" : ""} onClick={() => setView(id)}><Icon size={20} strokeWidth={active === id ? 2.4 : 1.8} /><span>{label}</span></button>)}</nav>;
}

function HomeView({ setView }: { setView: (v: View) => void }) {
  return <>
    <main className="page home-page">
      <section className="greeting"><div><p className="eyebrow">THURSDAY, 24 MAY 2024</p><h2>Good morning, Arjun</h2><p className="muted">Here’s what needs your attention today.</p></div><div className="avatar">AK</div></section>
      <section><div className="section-heading"><h3>Overview</h3><span className="muted small">Today, 24 May</span></div><div className="metrics">{metrics.map(({ value, label, tone, icon: Icon }) => <div className={`metric-card ${tone}`} key={label}><div className="metric-icon"><Icon size={15} /></div><strong>{value}</strong><span>{label}</span></div>)}</div></section>
      <section className="health-card"><div><p className="eyebrow">FLEET HEALTH</p><h3>85% <span>Healthy vehicles</span></h3><p className="positive">↑ 6% <em>vs yesterday</em></p></div><div className="health-ring"><div><b>85</b><span>%</span></div></div></section>
      <section><div className="section-heading"><h3>Quick actions</h3></div><div className="quick-actions"><button className="primary action-card" onClick={() => setView("scanner")}><QrCode size={20} /><span>Scan vehicle</span><ChevronRight size={16} /></button><button className="secondary action-card" onClick={() => setView("report")}><FileText size={20} /><span>Report issue</span><ChevronRight size={16} /></button></div></section>
      <section><div className="section-heading"><h3>Needs attention</h3><button className="text-btn" onClick={() => setView("vehicles")}>View all</button></div><div className="attention-list"><button className="vehicle-row" onClick={() => setView("vehicle")}><div className="vehicle-thumb"><Bike size={21} /></div><div className="vehicle-copy"><strong>MS 2048</strong><span>E Bike X1 · Indiranagar Hub</span><StatusBadge tone="amber">Lights issue</StatusBadge></div><ChevronRight size={17} /></button><button className="vehicle-row"><div className="round-icon blue"><BatteryCharging size={18} /></div><div className="vehicle-copy"><strong>MS 2017</strong><span>E Bike X1 · Koramangala Hub</span><StatusBadge tone="blue">Low battery</StatusBadge></div><ChevronRight size={17} /></button></div></section>
      <section className="offline-banner"><span className="offline-dot" /><div><strong>All data is up to date</strong><p>Last synced 2 minutes ago</p></div><ChevronRight size={17} /></section>
    </main><BottomNav active="home" setView={setView} />
  </>;
}

function Scanner({ setView }: { setView: (v: View) => void }) {
  return <div className="scanner"><div className="scanner-top"><button className="light-btn" onClick={() => setView("home")}><X size={20} /></button><span>Scan vehicle</span><button className="light-btn"><MoreHorizontal size={20} /></button></div><div className="camera-stage"><div className="scan-copy"><p>SCAN VEHICLE</p><h2>Align QR code within<br />the frame to scan</h2></div><div className="scan-frame"><span /><span /><span /><span /><div className="scan-line" /><QrCode size={78} strokeWidth={1.2} /></div><p className="scan-hint">Place the vehicle QR code inside the frame</p></div><div className="scanner-bottom"><button className="scan-result" onClick={() => setView("vehicle")}><div className="success-mini"><Check size={17} /></div><div><strong>MS 2048</strong><span>Vehicle detected</span></div><ChevronRight size={18} /></button><button className="manual-link">Enter vehicle ID manually</button></div></div>;
}

function Vehicle({ setView }: { setView: (v: View) => void }) {
  return <><TopBar title="Vehicle details" onBack={() => setView("home")} action={<button className="icon-btn"><MoreHorizontal size={20} /></button>} /><main className="page"><div className="vehicle-title"><div><p className="eyebrow">VEHICLE</p><h2>MS 2048</h2></div><StatusBadge>Active</StatusBadge></div><div className="hero-bike"><img src={bikeImage} /><div className="image-label"><MapPin size={13} /> Indiranagar Hub</div></div><div className="vehicle-specs"><div><span>Model</span><strong>E Bike X1</strong></div><div><span>Battery</span><strong>86%</strong><div className="progress"><i style={{ width: "86%" }} /></div></div><div><span>Range</span><strong>32 km</strong></div><div><span>Status</span><strong className="green-text">In service</strong></div><div><span>Last updated</span><strong>24 May 2024, 08:30 AM</strong></div></div><div className="sticky-actions"><button className="secondary" onClick={() => setView("issue")}><History size={17} /> View history</button><button className="primary" onClick={() => setView("inspection")}><ClipboardCheck size={17} /> Inspect now</button></div></main></>;
}

function Inspection({ setView }: { setView: (v: View) => void }) {
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<"checklist" | "details">("checklist");
  return <><TopBar title="Inspection" onBack={() => setView("vehicle")} /><main className="page"><div className="context-line"><span>Vehicle <strong>MS 2048</strong></span><StatusBadge>Active</StatusBadge></div><div className="tabs"><button className={tab === "checklist" ? "selected" : ""} onClick={() => setTab("checklist")}>Checklist</button><button className={tab === "details" ? "selected" : ""} onClick={() => setTab("details")}>Details</button></div>{tab === "checklist" ? <><div className="inspection-progress"><div><strong>Vehicle checklist</strong><span>{failed ? "1 issue found" : "5 of 6 checked"}</span></div><div className="progress"><i style={{ width: failed ? "100%" : "84%" }} /></div></div><div className="checklist">{checklist.map(([name, status, good]) => <button key={String(name)} className={`check-item ${!good && failed ? "failed" : ""}`} onClick={() => !good && setFailed(!failed)}><div className={`check-icon ${good ? "good" : "bad"}`}>{good ? <Check size={16} /> : <AlertTriangle size={16} />}</div><div><strong>{name}</strong><span className={good ? "green-text" : "red-text"}>{good ? status : failed ? status : "Tap to mark issue"}</span></div>{good ? <Check size={16} className="green-text" /> : <ChevronRight size={17} />}</button>)}</div><div className="sticky-bottom"><button className="primary full" onClick={() => setView("report")}>{failed ? "Continue to report issue" : "Continue"}<ChevronRight size={17} /></button></div></> : <div className="vehicle-specs"><div><span>Vehicle ID</span><strong>MS 2048</strong></div><div><span>Inspection started</span><strong>24 May 2024, 09:02 AM</strong></div><div><span>Inspector</span><strong>Arjun Kumar</strong></div><div><span>Hub</span><strong>Indiranagar Hub</strong></div><div><span>Last inspection</span><strong>18 May 2024 · Passed</strong></div></div>}</main></>;
}

function Report({ setView }: { setView: (v: View) => void }) {
  const [severity, setSeverity] = useState("High");
  const [issueType, setIssueType] = useState("Lights not working");
  const [photoCount, setPhotoCount] = useState(2);
  return <><TopBar title="Report issue" onBack={() => setView("inspection")} /><main className="page report-page"><div className="context-line"><span>Vehicle <strong>MS 2048</strong></span><StatusBadge tone="red">Issue detected</StatusBadge></div><label className="field-label">Issue type</label><button className="select-field" onClick={() => setIssueType(issueType === "Lights not working" ? "Front light damaged" : "Lights not working")}>{issueType} <ChevronRight size={17} /></button><label className="field-label">Severity</label><div className="severity-row">{["Low", "Medium", "High"].map(item => <button className={severity === item ? "chosen" : ""} onClick={() => setSeverity(item)} key={item}>{item}</button>)}</div><div className="field-label-row"><label className="field-label">Add photos <span>(optional)</span></label><span className="muted small">{photoCount} of 4</span></div><div className="photos"><div className="photo"><img src={bikeImage} /><button><X size={13} /></button></div><div className="photo"><img src={bikeImage} /><button><X size={13} /></button></div><button className="add-photo" onClick={() => setPhotoCount(count => Math.min(4, count + 1))}><Plus size={21} /><span>{photoCount === 4 ? "Photo limit" : "Add photo"}</span></button></div><label className="field-label">Notes <span>(optional)</span></label><textarea defaultValue={"Front light not working.\nNeeds immediate attention."} /><div className="sticky-bottom"><button className="primary full" onClick={() => setView("submitted")}>Submit report <ChevronRight size={17} /></button></div></main></>;
}

function Submitted({ setView }: { setView: (v: View) => void }) {
  return <div className="success-screen"><div className="success-circle"><Check size={34} /></div><p className="eyebrow">REPORT RECEIVED</p><h2>Issue reported<br />successfully</h2><p className="muted center">We've notified the maintenance team and will update you soon.</p><div className="ticket"><span>Ticket ID</span><strong>#IS-7856</strong><span>Submitted just now · MS 2048</span></div><div className="success-actions"><button className="primary full" onClick={() => setView("issue")}>View issue</button><button className="secondary full" onClick={() => setView("home")}>Back to home</button></div></div>;
}

function ListView({ type, setView }: { type: View; setView: (v: View) => void }) {
  const isVehicles = type === "vehicles";
  return <><TopBar title={isVehicles ? "Vehicles" : type === "tasks" ? "Tasks" : type === "alerts" ? "Alerts" : "Profile"} onBack={() => setView("home")} action={isVehicles ? <button className="icon-btn" aria-label="Filter vehicles"><SlidersHorizontal size={19} /></button> : undefined} /><main className="page list-page">{isVehicles ? <div className="search"><Search size={18} /><input placeholder="Search vehicles" /></div> : <div className="filter-row"><button className="filter active-filter">All</button><button className="filter">Critical</button><button className="filter">Pending</button></div>}{isVehicles ? <div className="list-stack">{vehicles.map(v => <button className="fleet-card" key={v.id} onClick={() => v.id === "MS 2048" && setView("vehicle")}><div className="fleet-card-top"><div><strong>{v.id}</strong><span>{v.model} · {v.hub}</span></div><StatusBadge tone={v.tone}>{v.status}</StatusBadge></div><div className="fleet-card-meta"><span><BatteryCharging size={14} /> {v.battery}</span><span><MapPin size={14} /> {v.range}</span><span><ClipboardCheck size={14} /> Inspection due</span></div></button>)}</div> : <div className="list-stack">{type === "alerts" ? [["Critical", "MS 2048 · Front light failure", "8 min ago", "red"], ["Warning", "MS 2017 · Battery below recommended level", "32 min ago", "amber"], ["Information", "MS 2091 · Inspection completed", "1 hr ago", "blue"]].map(([a,b,c,t]) => <div className="alert-card" key={b}><div className={`alert-symbol ${t}`}><AlertTriangle size={17} /></div><div><StatusBadge tone={t}>{a}</StatusBadge><strong>{b}</strong><span>{c}</span></div><ChevronRight size={17} /></div>) : type === "tasks" ? ["Inspect vehicle MS 2048", "Verify maintenance MS 2033", "Charging check MS 2017"].map((x,i) => <div className="task-card" key={x}><div className="task-icon"><ClipboardCheck size={18} /></div><div><strong>{x}</strong><span>{i === 0 ? "Due today · High priority" : "Due tomorrow · Normal priority"}</span></div><StatusBadge tone={i === 0 ? "amber" : "blue"}>Pending</StatusBadge></div>) : <div className="profile-card"><div className="large-avatar">AK</div><h2>Arjun Kumar</h2><p className="muted">Mobility Operator · Indiranagar Hub</p><button className="settings-row"><Settings size={18} /><span>App preferences</span><ChevronRight size={17} /></button><div className="settings-row"><Moon size={18} /><span>Dark mode</span><ThemeToggle /></div><button className="settings-row"><Bell size={18} /><span>Notifications</span><ChevronRight size={17} /></button><button className="settings-row"><CircleHelp size={18} /><span>Help & support</span><ChevronRight size={17} /></button></div>}</div>}</main><BottomNav active={type} setView={setView} /></>;
}

function Issue({ setView }: { setView: (v: View) => void }) {
  return <><TopBar title="Issue #IS-7856" onBack={() => setView("submitted")} /><main className="page issue-page"><div className="issue-heading"><div><p className="eyebrow">MAINTENANCE TICKET</p><h2>Lights not working</h2></div><StatusBadge tone="red">High priority</StatusBadge></div><div className="timeline"><div className="timeline-item done"><i><Check size={14} /></i><div><strong>Issue reported</strong><span>24 May 2024 · 09:15 AM</span></div></div><div className="timeline-item current"><i><Wrench size={14} /></i><div><strong>Maintenance assigned</strong><span>Ramesh Kumar · Technician</span><p>Replacement light is being installed.</p></div></div><div className="timeline-item"><i><ShieldCheck size={14} /></i><div><strong>Resolution pending</strong><span>We’ll notify you when it’s ready to verify.</span></div></div></div><div className="update-photo"><img src={bikeImage} /><div><span>Latest update · 11:30 AM</span><strong>Technician is working on this vehicle</strong></div></div><div className="sticky-bottom"><button className="secondary full" onClick={() => setView("vehicle")}>Back to vehicle</button></div></main></>;
}

export default function Index() {
  const [view, setView] = useState<View>("home");
  if (view === "scanner") return <Scanner setView={setView} />;
  if (view === "vehicle") return <Vehicle setView={setView} />;
  if (view === "inspection") return <Inspection setView={setView} />;
  if (view === "report") return <Report setView={setView} />;
  if (view === "submitted") return <Submitted setView={setView} />;
  if (view === "issue") return <Issue setView={setView} />;
  if (["vehicles", "tasks", "alerts", "profile"].includes(view)) return <ListView type={view} setView={setView} />;
  return <HomeView setView={setView} />;
}
