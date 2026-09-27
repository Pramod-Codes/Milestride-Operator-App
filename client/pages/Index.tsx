import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  LogOut,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
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
  Moon,
  Sun,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

const bikeImage = "https://images.pexels.com/photos/9538570/pexels-photo-9538570.jpeg?auto=compress&cs=tinysrgb&w=900";
type HubName = "University Campus" | "Shopping Complex" | "Global Tech Park" | "Metro Station";
const hubs: { name: HubName; image: string; healthy: number; attention: number; maintenance: number; charging: number }[] = [
  { name: "University Campus", image: "https://images.pexels.com/photos/34259660/pexels-photo-34259660.jpeg", healthy: 18, attention: 2, maintenance: 3, charging: 4 },
  { name: "Shopping Complex", image: "https://images.pexels.com/photos/24198/pexels-photo.jpg", healthy: 14, attention: 1, maintenance: 2, charging: 3 },
  { name: "Global Tech Park", image: "https://images.pexels.com/photos/31665482/pexels-photo-31665482.jpeg", healthy: 22, attention: 3, maintenance: 4, charging: 5 },
  { name: "Metro Station", image: "https://images.pexels.com/photos/36990781/pexels-photo-36990781.jpeg", healthy: 16, attention: 1, maintenance: 2, charging: 4 },
];

const hubImages = Object.fromEntries(hubs.map(hub => [hub.name, hub.image])) as Record<HubName, string>;
const currentDate = new Date();
const dateLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(currentDate);
const dayLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" }).format(currentDate).toUpperCase();
const shortDateLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(currentDate);
const previousInspectionDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000));

const metrics = [
  { value: "01", label: "Attention", tone: "amber", icon: AlertTriangle },
  { value: "01", label: "Critical", tone: "red", icon: AlertTriangle },
  { value: "03", label: "Maintenance", tone: "blue", icon: Wrench },
  { value: "08", label: "Charging", tone: "green", icon: BatteryCharging },
];

const vehicles = [
  { id: "MS 2048", model: "E Bike X1", status: "Needs attention", battery: "86%", range: "32 km", hub: "University Campus" as HubName, tone: "amber" },
  { id: "MS 2049", model: "E Bike X1", status: "Active", battery: "91%", range: "35 km", hub: "University Campus" as HubName, tone: "green" },
  { id: "MS 2050", model: "E Bike X2", status: "Maintenance", battery: "62%", range: "20 km", hub: "Shopping Complex" as HubName, tone: "red" },
  { id: "MS 2051", model: "E Bike X1", status: "Charging", battery: "24%", range: "8 km", hub: "Shopping Complex" as HubName, tone: "blue" },
  { id: "MS 2052", model: "E Bike X2", status: "Active", battery: "94%", range: "38 km", hub: "Global Tech Park" as HubName, tone: "green" },
  { id: "MS 2053", model: "E Bike X1", status: "Active", battery: "78%", range: "29 km", hub: "Global Tech Park" as HubName, tone: "green" },
  { id: "MS 2054", model: "E Bike X2", status: "Charging", battery: "41%", range: "15 km", hub: "Metro Station" as HubName, tone: "blue" },
  { id: "MS 2055", model: "E Bike X1", status: "Active", battery: "88%", range: "33 km", hub: "Metro Station" as HubName, tone: "green" },
];

type TaskStatus = "Pending" | "In Progress" | "Awaiting Review" | "Resolved" | "Closed";
type FleetTask = { id: string; name: string; status: TaskStatus; due: string; tone: string; hub: HubName; ticketNumber?: string; issueDetails: string; resolutionChecklist: string[]; checkedSteps: string[]; acknowledgedAt?: string; completionComment: string; proofImages: string[] };

const initialTaskItems: FleetTask[] = [
  { id: "TS-1048", name: "Inspect vehicle MS 2048", status: "Pending", due: "Due today · High priority", tone: "amber", hub: "University Campus", ticketNumber: "IS-7856", issueDetails: "The front light failed during the scheduled inspection. Keep MS 2048 out of service until the lamp and its wiring are checked, repaired, and tested.", resolutionChecklist: ["Secure MS 2048 and tag it out of service", "Inspect the front lamp, wiring, and connector", "Repair or replace the faulty light component", "Test front and rear lights before return to service"], checkedSteps: [], completionComment: "", proofImages: [] },
  { id: "TS-1050", name: "Charge vehicle MS 2017", status: "Pending", due: "Due today · Normal priority", tone: "amber", hub: "Shopping Complex", ticketNumber: "CH-7812", issueDetails: "MS 2017 is below its recommended battery level. Inspect the battery connection and charging point, charge the vehicle, and confirm a safe operating level before releasing it.", resolutionChecklist: ["Move MS 2017 to a safe charging point", "Inspect the battery connector and charger cable", "Charge the battery to the required operating level", "Confirm the charge indicator and check for abnormal heat"], checkedSteps: [], completionComment: "", proofImages: [] },
  { id: "TS-1033", name: "Verify maintenance MS 2033", status: "In Progress", due: "Due today · Normal priority", tone: "blue", hub: "Metro Station", ticketNumber: "IS-7733", issueDetails: "A rider reported reduced rear-brake response on MS 2033. Inspect the brake system and confirm safe stopping performance before the bike is returned to service.", resolutionChecklist: ["Secure MS 2033 and prevent rentals during inspection", "Inspect brake lever travel, cable, and pad wear", "Adjust or replace faulty brake components", "Perform a controlled stop test and record the result"], checkedSteps: [], completionComment: "", proofImages: [] },
  { id: "TS-1017", name: "Charging check MS 2022", status: "Closed", due: "Closed today · 08:40 AM", tone: "green", hub: "Shopping Complex", issueDetails: "Charging and battery connection checks are complete.", resolutionChecklist: ["Inspect charger and battery connection", "Confirm charging indicator and safe charge level"], checkedSteps: ["Inspect charger and battery connection", "Confirm charging indicator and safe charge level"], completionComment: "Charging confirmed and safety check passed.", proofImages: [] },
  { id: "TS-2091", name: "Inspection follow-up MS 2091", status: "Closed", due: "Verified and closed · Today", tone: "green", hub: "Global Tech Park", ticketNumber: "IN-7791", issueDetails: "The scheduled inspection was completed and all checklist items passed.", resolutionChecklist: ["Review all inspection checklist entries", "Confirm photos and vehicle ID match the report", "Record the sign-off for the maintenance log"], checkedSteps: ["Review all inspection checklist entries", "Confirm photos and vehicle ID match the report", "Record the sign-off for the maintenance log"], completionComment: "Inspection records verified and signed off.", proofImages: [] },
];

type AlertItem = { id: string; status: string; tone: string; vehicle: string; title: string; time: string; hub: HubName; ticketNumber: string; details: string; assignedTo: string };
const alertItems: AlertItem[] = [
  { id: "AL-2048", status: "Critical", tone: "red", vehicle: "MS 2048", title: "Front light failure", time: "8 min ago", hub: "University Campus", ticketNumber: "IS-7856", details: "The front light did not turn on during the vehicle inspection. Keep the bike out of service until the replacement light is installed and tested.", assignedTo: "Ramesh Kumar · Maintenance" },
  { id: "AL-2017", status: "Warning", tone: "amber", vehicle: "MS 2017", title: "Battery below recommended level", time: "32 min ago", hub: "Shopping Complex", ticketNumber: "CH-7812", details: "Battery charge is below the recommended operating threshold. Move the vehicle to an available charging point and check the battery connection.", assignedTo: "Charging team · Shopping Complex" },
  { id: "AL-2091", status: "Information", tone: "blue", vehicle: "MS 2091", title: "Inspection completed", time: "1 hr ago", hub: "Global Tech Park", ticketNumber: "IN-7791", details: "The scheduled inspection was completed and all checklist items passed. The vehicle is cleared for service.", assignedTo: "Arjun Kumar · Hub Operator" },
  { id: "AL-2033", status: "Warning", tone: "amber", vehicle: "MS 2033", title: "Rear brake response reduced", time: "Yesterday", hub: "Metro Station", ticketNumber: "IS-7733", details: "A rider reported reduced rear-brake response. Keep the vehicle unavailable until the brake system is adjusted and passes a controlled stop test.", assignedTo: "Ramesh Kumar · Maintenance" },
];

const checklist = [
  ["Brakes", "Good", true], ["Tires", "Good", true], ["Battery", "Good", true],
  ["Lights", "Issue detected", false], ["Chain", "Good", true], ["Bell", "Good", true],
];

type View = "home" | "vehicles" | "tasks" | "task" | "alerts" | "alert" | "profile" | "preferences" | "appearance" | "notifications" | "help" | "charging" | "scanner" | "vehicle" | "inspection" | "report" | "submitted" | "issue" | "splash" | "signin";

function StatusBadge({ children, tone = "green" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`status status-${tone}`}><span className="status-dot" />{children}</span>;
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const preference = localStorage.getItem("milestride-theme");
    return preference ? preference === "dark" : true;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("milestride-theme", dark ? "dark" : "light");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#101817" : "#f3f6f5");
  }, [dark]);
  return <button className="theme-switch" aria-label="Toggle dark mode" aria-pressed={dark} onClick={() => setDark(value => !value)}><span>{dark ? "Dark Mode" : "Light Mode"}</span><span className="switch-track"><span className="switch-knob">{dark ? <Moon size={11} /> : <Sun size={11} />}</span></span></button>;
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

function HomeView({ setView, selectedHub, setSelectedHub, tasks, openTask }: { setView: (v: View) => void; selectedHub: HubName; setSelectedHub: (hub: HubName) => void; tasks: FleetTask[]; openTask: (taskId: string) => void }) {
  const hub = hubs.find(item => item.name === selectedHub)!;
  const totals = hub.healthy + hub.attention + hub.maintenance + hub.charging;
  const health = Math.round((hub.healthy / totals) * 100);
  const selectedAttentionVehicle = vehicles.find(vehicle => vehicle.hub === selectedHub && vehicle.status === "Needs attention");
  return <>
    <main className="page home-page">
      <section className="greeting"><div><p className="eyebrow">{dayLabel}</p><h2>Hello, Arjun</h2><p className="muted">Here’s what needs your attention today.</p></div><div className="avatar">AK</div></section>
      <section className="hub-picker"><div className="section-heading"><h3>My hubs</h3><span className="muted small">Select a hub</span></div><div className="hub-picker-row">{hubs.map(item => <button className={`hub-chip ${selectedHub === item.name ? "selected" : ""}`} key={item.name} onClick={() => setSelectedHub(item.name)}><span className="hub-chip-dot" />{item.name}</button>)}</div></section><section><div className="section-heading"><h3>Overview</h3><span className="muted small">{selectedHub} · {shortDateLabel}</span></div><div className="metrics">{metrics.map(({ value, label, tone, icon: Icon }, index) => { const values = [hub.attention, hub.attention > 0 ? 1 : 0, hub.maintenance, hub.charging]; return <button className={`metric-card ${tone}`} key={label} onClick={() => setView(({ amber: "vehicles", red: "alerts", blue: "tasks", green: "charging" } as Record<string, View>)[tone])} aria-label={`View ${label} details`}><div className="metric-icon"><Icon size={15} /></div><strong>{String(values[index]).padStart(2, "0")}</strong><span>{label}</span></button>; })}</div></section>
      <section className="health-card"><div><p className="eyebrow">FLEET HEALTH</p><h3>{health}% <span>Healthy vehicles</span></h3><p className="positive">↑ 6% <em>vs yesterday</em></p></div><div className="health-ring"><div><b>{totals}</b><span>vehicles</span></div></div></section>
      <section><div className="section-heading"><h3>Quick actions</h3></div><div className="quick-actions"><button className="primary action-card" onClick={() => setView("scanner")}><QrCode size={20} /><span>Scan vehicle</span><ChevronRight size={16} /></button><button className="secondary action-card" onClick={() => setView("report")}><FileText size={20} /><span>Report issue</span><ChevronRight size={16} /></button></div></section>
      <section><div className="section-heading"><h3>Needs attention</h3><button className="text-btn" onClick={() => setView("vehicles")}>View all</button></div><div className="attention-list">{selectedAttentionVehicle ? <button className="vehicle-row" onClick={() => setView("vehicle")}><div className="vehicle-thumb"><Bike size={21} /></div><div className="vehicle-copy"><strong>{selectedAttentionVehicle.id}</strong><span>{selectedAttentionVehicle.model} · {selectedHub}</span><StatusBadge tone="amber">Lights issue</StatusBadge></div><ChevronRight size={17} /></button> : null}<div className="attention-empty"><div className="round-icon green"><Check size={18} /></div><div><strong>No vehicles need attention</strong><span>{selectedHub} is clear for now</span></div></div></div></section>
      {tasks.some(task => task.hub === selectedHub && task.status === "Resolved") && <section className="review-queue"><div className="section-heading"><div><h3>Hub admin review</h3><span className="muted small">Resolved tasks waiting for verification</span></div><span className="review-count">{tasks.filter(task => task.hub === selectedHub && task.status === "Resolved").length}</span></div>{tasks.filter(task => task.hub === selectedHub && task.status === "Resolved").map(task => <button className="review-task" key={task.id} onClick={() => openTask(task.id)}><div className="review-icon"><ClipboardCheck size={18} /></div><div><strong>{task.name}</strong><span>{task.id} · {task.hub}</span></div><span className="review-action">Review <ChevronRight size={15} /></span></button>)}</section>}
      <section className="offline-banner"><span className="offline-dot" /><div><strong>All data is up to date</strong><p>Last synced 2 minutes ago</p></div><ChevronRight size={17} /></section><section><div className="section-heading"><h3>Hub pulse</h3><button className="text-btn">View hubs</button></div><div className="hub-grid">{hubs.map(item => <button className={`hub-card ${selectedHub === item.name ? "selected" : ""}`} key={item.name} onClick={() => setSelectedHub(item.name)}><img src={hubImages[item.name]} /><strong>{item.name}</strong><span>{item.healthy} active vehicles</span></button>)}</div></section>
    </main><BottomNav active="home" setView={setView} />
  </>;
}

function Scanner({ setView }: { setView: (v: View) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  useEffect(() => {
    let stream: MediaStream | undefined;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }).then(result => {
      stream = result;
      if (videoRef.current) {
        videoRef.current.srcObject = result;
        setCameraReady(true);
      }
    }).catch(() => setCameraReady(false));
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);
  return <div className="scanner"><div className="scanner-top"><button className="light-btn" onClick={() => setView("home")}><X size={20} /></button><span>Scan vehicle</span><button className="light-btn"><MoreHorizontal size={20} /></button></div><div className="camera-stage">{cameraReady && <video ref={videoRef} className="camera-feed" autoPlay playsInline muted />}<div className="scan-copy"><p>SCAN VEHICLE</p><h2>Align QR code within<br />the frame to scan</h2></div><div className="scan-frame"><span /><span /><span /><span /><div className="scan-line" /><QrCode size={78} strokeWidth={1.2} /></div><p className="scan-hint">Place the vehicle QR code inside the frame</p></div><div className="scanner-bottom"><button className="scan-result" onClick={() => setView("vehicle")}><div className="success-mini"><Check size={17} /></div><div><strong>MS 2048</strong><span>Vehicle detected</span></div><ChevronRight size={18} /></button><button className="manual-link">Enter vehicle ID manually</button></div></div>;
}

function Vehicle({ setView }: { setView: (v: View) => void }) {
  return <><TopBar title="Vehicle details" onBack={() => setView("home")} /><main className="page"><div className="vehicle-title"><div><p className="eyebrow">VEHICLE</p><h2>MS 2048</h2></div><StatusBadge>Active</StatusBadge></div><div className="hero-bike"><img src={bikeImage} /><div className="image-label"><MapPin size={13} /> University Campus</div></div><div className="vehicle-specs"><div><span>Model</span><strong>E Bike X1</strong></div><div><span>Battery</span><strong className="battery-value"><BatteryCharging size={15} />86%</strong></div><div><span>Range</span><strong>32 km</strong></div><div><span>Status</span><strong className="green-text">In service</strong></div><div><span>Last updated</span><strong>{dateLabel}, 08:30 AM</strong></div></div><div className="sticky-actions"><button className="secondary" onClick={() => setView("issue")}><History size={17} /> View history</button><button className="primary" onClick={() => setView("inspection")}><ClipboardCheck size={17} /> Inspect now</button></div></main></>;
}

function Inspection({ setView }: { setView: (v: View) => void }) {
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<"checklist" | "details">("checklist");
  return <><TopBar title="Inspection" onBack={() => setView("vehicle")} /><main className="page"><div className="context-line"><span>Vehicle <strong>MS 2048</strong></span><StatusBadge>Active</StatusBadge></div><div className="tabs"><button className={tab === "checklist" ? "selected" : ""} onClick={() => setTab("checklist")}>Checklist</button><button className={tab === "details" ? "selected" : ""} onClick={() => setTab("details")}>Details</button></div>{tab === "checklist" ? <><div className="inspection-progress"><div><strong>Vehicle checklist</strong><span>{failed ? "1 issue found" : "5 of 6 checked"}</span></div><div className="progress"><i style={{ width: failed ? "100%" : "84%" }} /></div></div><div className="checklist">{checklist.map(([name, status, good]) => <button key={String(name)} className={`check-item ${!good && failed ? "failed" : ""}`} onClick={() => !good && setFailed(!failed)}><div className={`check-icon ${good ? "good" : "bad"}`}>{good ? <Check size={16} /> : <AlertTriangle size={16} />}</div><div><strong>{name}</strong><span className={good ? "green-text" : "red-text"}>{good ? status : failed ? status : "Tap to mark issue"}</span></div>{good ? <Check size={16} className="green-text" /> : <ChevronRight size={17} />}</button>)}</div><div className="sticky-bottom"><button className="primary full" onClick={() => setView("report")}>{failed ? "Continue to report issue" : "Continue"}<ChevronRight size={17} /></button></div></> : <div className="vehicle-specs"><div><span>Vehicle ID</span><strong>MS 2048</strong></div><div><span>Inspection started</span><strong>{dateLabel}, 09:02 AM</strong></div><div><span>Inspector</span><strong>Arjun Kumar</strong></div><div><span>Hub</span><strong>University Campus</strong></div><div><span>Last inspection</span><strong>{previousInspectionDate} · Passed</strong></div></div>}</main></>;
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

function ChargingView({ setView }: { setView: (v: View) => void }) {
  return <><TopBar title="Charging" onBack={() => setView("home")} /><main className="page list-page"><section className="health-card"><div><p className="eyebrow">CHARGING OVERVIEW</p><h3>08 <span>Vehicles charging</span></h3><p className="positive">↑ 2 <em>since yesterday</em></p></div><div className="round-icon blue"><BatteryCharging size={24} /></div></section><div className="section-heading"><h3>Active charging</h3><span className="muted small">08 vehicles</span></div><div className="list-stack">{["MS 2017", "MS 2022", "MS 2031", "MS 2042", "MS 2056", "MS 2064", "MS 2079", "MS 2088"].map((id, index) => <div className="task-card" key={id}><div className="task-icon"><BatteryCharging size={18} /></div><div><strong>{id}</strong><span>{index === 0 ? "Shopping Complex · 24% battery" : "University Campus · Charging"}</span></div><StatusBadge tone="blue">Charging</StatusBadge></div>)}</div><div className="offline-banner"><span className="offline-dot" /><div><strong>8 vehicles are charging safely</strong><p>Next review in 18 minutes</p></div></div></main></>;
}

function TaskDetail({ task, setView, backView, updateTask }: { task: FleetTask; setView: (v: View) => void; backView: View; updateTask: (task: FleetTask) => void }) {
  const [comment, setComment] = useState(task.completionComment);
  const [proofImages, setProofImages] = useState(task.proofImages);
  const [uploadError, setUploadError] = useState("");
  const canSubmit = comment.trim().length > 0 && proofImages.length > 0 && task.checkedSteps.length === task.resolutionChecklist.length;
  const addProofImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 4 - proofImages.length);
    const images = await Promise.all(files.map(async file => {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      return canvas.toDataURL("image/jpeg", 0.72);
    }));
    setProofImages(current => [...current, ...images].slice(0, 4));
    setUploadError("");
  };
  const submitCompletion = () => {
    if (!canSubmit) return;
    updateTask({ ...task, status: "Resolved", tone: "blue", due: "Completed · awaiting admin verification", completionComment: comment.trim(), proofImages });
  };
  const closeTicket = () => updateTask({ ...task, status: "Closed", tone: "green", due: "Verified and closed" });
  const acknowledgeTask = () => updateTask({ ...task, status: "In Progress", tone: "blue", due: "Acknowledged · in progress", acknowledgedAt: new Date().toISOString() });
  const toggleChecklistStep = (step: string) => updateTask({ ...task, checkedSteps: task.checkedSteps.includes(step) ? task.checkedSteps.filter(item => item !== step) : [...task.checkedSteps, step] });
  const tone = task.status === "Pending" ? "amber" : task.status === "Closed" ? "green" : "blue";
  return <><TopBar title="Task details" onBack={() => setView(backView)} /><main className="page task-detail-page"><div className="task-detail-heading"><div><p className="eyebrow">TASK {task.id}</p><h2>{task.name}</h2></div><StatusBadge tone={tone}>{task.status}</StatusBadge></div><div className="task-info"><div><span>Assigned hub</span><strong>{task.hub}</strong></div><div><span>Schedule</span><strong>{task.due}</strong></div></div><section className="task-issue-card"><h3>Issue details</h3><p>{task.issueDetails}</p><div className="task-reference"><div><span>Vehicle</span><strong>{task.name.match(/MS \d+/)?.[0] ?? "Fleet task"}</strong></div>{task.ticketNumber && <div><span>Associated ticket</span><strong>#{task.ticketNumber}</strong></div>}</div></section><section className="task-resolution-checklist"><div className="task-checklist-heading"><div><h3>Resolution checklist</h3><span>{task.checkedSteps.length} of {task.resolutionChecklist.length} completed</span></div><StatusBadge tone={task.checkedSteps.length === task.resolutionChecklist.length ? "green" : "amber"}>{task.checkedSteps.length === task.resolutionChecklist.length ? "Ready to submit" : "In progress"}</StatusBadge></div>{task.resolutionChecklist.map((step, index) => { const checked = task.checkedSteps.includes(step); return <button className={`task-checklist-step ${checked ? "checked" : ""}`} key={step} disabled={task.status !== "In Progress"} onClick={() => toggleChecklistStep(step)}><span className="task-check-box">{checked && <Check size={14} />}</span><span className="task-check-number">{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></button>; })}</section>{task.status === "Pending" ? <section className="task-acknowledgement"><div className="round-icon amber"><ClipboardCheck size={18} /></div><div><strong>Acknowledge this task</strong><span>Confirm you’ve reviewed the issue and are ready to work through the checklist.</span></div><button className="primary full" onClick={acknowledgeTask}>Acknowledge &amp; start task <ChevronRight size={17} /></button></section> : task.status === "In Progress" ? <><section className="completion-form"><div className="section-heading"><h3>Completion report</h3></div><label className="field-label" htmlFor="completion-comment">What was completed?</label><textarea id="completion-comment" value={comment} onChange={event => setComment(event.target.value)} placeholder="Add completion notes for the hub admin" /><div className="proof-heading"><div><strong>Proof images</strong><span>Upload up to 4 photos</span></div><span>{proofImages.length}/4</span></div><div className="proof-gallery">{proofImages.map((image, index) => <div className="proof-image" key={`${image.slice(0, 24)}-${index}`}><img src={image} alt={`Completion proof ${index + 1}`} /><button aria-label="Remove proof image" onClick={() => setProofImages(images => images.filter((_, imageIndex) => imageIndex !== index))}><X size={14} /></button></div>)}{proofImages.length < 4 && <label className="proof-upload"><Camera size={20} /><span>Add proof</span><input type="file" accept="image/*" multiple onChange={event => { addProofImages(event).catch(() => setUploadError("Could not read the selected image. Try another photo.")).finally(() => { event.target.value = ""; }); }} /></label>}</div>{uploadError && <p className="upload-error">{uploadError}</p>}</section><div className="task-detail-actions">{null}<button className="primary full" disabled={!canSubmit} onClick={submitCompletion}>Submit for admin verification <ChevronRight size={17} /></button><p>Add a completion note and at least one proof image to submit.</p></div></> : task.status === "Resolved" ? <><section className="completion-report"><div className="report-status"><div className="round-icon blue"><Clock3 size={18} /></div><div><strong>Waiting for hub admin verification</strong><span>Operator completion submitted</span></div></div><div className="submitted-comment"><span>Completion comments</span><p>{task.completionComment}</p></div>{task.proofImages.length > 0 && <div className="proof-gallery read-only">{task.proofImages.map((image, index) => <img src={image} alt={`Completion proof ${index + 1}`} key={`${image.slice(0, 24)}-${index}`} />)}</div>}</section><div className="task-detail-actions"><button className="primary full" onClick={closeTicket}><Check size={17} /> Verify &amp; close ticket</button><p>Confirm the notes and proof images before closing.</p></div></> : <section className="completion-report"><div className="report-status"><div className="round-icon green"><Check size={18} /></div><div><strong>Ticket closed</strong><span>Verified by hub admin</span></div></div><div className="submitted-comment"><span>Completion comments</span><p>{task.completionComment}</p></div>{task.proofImages.length > 0 && <div className="proof-gallery read-only">{task.proofImages.map((image, index) => <img src={image} alt={`Completion proof ${index + 1}`} key={`${image.slice(0, 24)}-${index}`} />)}</div>}</section>}</main></>;
}

function TasksView({ tasks, setView, openTask }: { tasks: FleetTask[]; setView: (v: View) => void; openTask: (taskId: string) => void }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Pending", "In Progress", "Resolved", "Closed"];
  const visibleTasks = tasks.filter(task => filter === "All" || task.status === filter);
  return <><TopBar title="Tasks" onBack={() => setView("home")} /><main className="page list-page"><div className="filter-row">{filters.map(item => <button className={`filter ${filter === item ? "active-filter" : ""}`} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>{visibleTasks.length ? <div className="list-stack">{visibleTasks.map(task => <button className="task-card task-card-button" key={task.id} onClick={() => openTask(task.id)}><div className="task-icon"><ClipboardCheck size={18} /></div><div className="task-card-copy"><strong>{task.name}</strong><span>{task.id} · {task.hub}{task.ticketNumber ? ` · Ticket #${task.ticketNumber}` : ""}</span><span>{task.due}</span></div><div className="task-card-status"><StatusBadge tone={task.status === "Pending" ? "amber" : task.status === "Closed" ? "green" : "blue"}>{task.status}</StatusBadge><ChevronRight size={17} /></div></button>)}</div> : <div className="task-empty"><ClipboardCheck size={24} /><strong>No {filter.toLowerCase()} tasks</strong><span>Tasks in this state will appear here.</span></div>}</main><BottomNav active="tasks" setView={setView} /></>;
}

function AlertDetail({ alert, ticketTask, setView, openTask }: { alert: AlertItem; ticketTask?: FleetTask; setView: (v: View) => void; openTask: (taskId: string, returnView?: View) => void }) {
  const ticketStatus = ticketTask?.status ?? (alert.status === "Resolved" ? "Resolved" : "Open");
  const ticketTone = ticketStatus === "Closed" ? "green" : ticketStatus === "Resolved" ? "blue" : alert.tone;
  return <><TopBar title="Alert details" onBack={() => setView("alerts")} /><main className="page alert-detail-page"><div className="alert-detail-heading"><div className={`alert-symbol ${alert.tone}`}><AlertTriangle size={20} /></div><div><p className="eyebrow">ALERT {alert.id}</p><h2>{alert.title}</h2></div><StatusBadge tone={alert.tone}>{alert.status}</StatusBadge></div><section className="alert-ticket"><div><span>Associated ticket</span><strong>#{alert.ticketNumber}</strong></div><StatusBadge tone={ticketTone}>{ticketStatus}</StatusBadge></section><section className="alert-detail-card"><h3>Alert information</h3><p>{alert.details}</p><div className="alert-facts"><div><span>Vehicle</span><strong>{alert.vehicle}</strong></div><div><span>Hub</span><strong>{alert.hub}</strong></div><div><span>Reported</span><strong>{alert.time}</strong></div><div><span>Assigned to</span><strong>{alert.assignedTo}</strong></div></div></section>{ticketTask && <button className="secondary full alert-task-link" onClick={() => openTask(ticketTask.id, "alert")}>Open linked task <ChevronRight size={16} /></button>}<section className="alert-timeline"><h3>Ticket activity</h3><div className="timeline-item done"><i><Check size={14} /></i><div><strong>Alert created</strong><span>{alert.time} · {alert.vehicle}</span></div></div><div className={`timeline-item ${ticketStatus === "Resolved" || ticketStatus === "Closed" ? "done" : "current"}`}><i>{ticketStatus === "Resolved" || ticketStatus === "Closed" ? <Check size={14} /> : <Wrench size={14} />}</i><div><strong>{ticketStatus === "Closed" ? "Ticket closed" : ticketStatus === "Resolved" ? "Completion submitted for review" : "Assigned for follow-up"}</strong><span>{alert.assignedTo}</span><p>{ticketStatus === "Closed" ? "The ticket has been verified and closed; the vehicle is cleared." : ticketStatus === "Resolved" ? "The task is resolved and waiting for hub admin verification." : "Follow up with the assigned team using the ticket number above."}</p></div></div></section></main></>;
}

function AlertsView({ setView, openAlert, tasks }: { setView: (v: View) => void; openAlert: (alertId: string) => void; tasks: FleetTask[] }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Critical", "Warning", "Information", "Resolved"];
  const visibleAlerts = alertItems.filter(alert => filter === "All" || alert.status === filter || (filter === "Resolved" && ["Resolved", "Closed"].includes(tasks.find(task => task.ticketNumber === alert.ticketNumber)?.status ?? "")));
  return <><TopBar title="Alerts" onBack={() => setView("home")} /><main className="page list-page"><div className="filter-row">{filters.map(item => <button className={`filter ${filter === item ? "active-filter" : ""}`} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><div className="list-stack">{visibleAlerts.map(alert => { const linkedTask = tasks.find(task => task.ticketNumber === alert.ticketNumber); const ticketStatus = linkedTask?.status; const ticketTone = linkedTask?.status === "Closed" ? "green" : linkedTask?.status === "Resolved" ? "blue" : linkedTask?.status === "Pending" ? "amber" : "blue"; return <button className="alert-card alert-card-button" key={alert.id} onClick={() => openAlert(alert.id)}><div className={`alert-symbol ${alert.tone}`}><AlertTriangle size={17} /></div><div className="alert-card-copy"><div className="alert-card-badges"><StatusBadge tone={alert.tone}>{alert.status}</StatusBadge>{linkedTask && <StatusBadge tone={ticketTone}>{ticketStatus}</StatusBadge>}</div><strong>{alert.vehicle} · {alert.title}</strong><span>{alert.time} · Ticket #{alert.ticketNumber}</span></div><ChevronRight size={17} /></button>; })}</div></main><BottomNav active="alerts" setView={setView} /></>;
}

function ListView({ type, setView, selectedHub }: { type: View; setView: (v: View) => void; selectedHub: HubName }) {
  const isVehicles = type === "vehicles";
  const [filter, setFilter] = useState("All");
  const filters = type === "alerts" ? ["All", "Critical", "Warning", "Information", "Resolved"] : ["All", "Pending", "In Progress", "Completed"];
  return <><TopBar title={isVehicles ? "Vehicles" : type === "tasks" ? "Tasks" : type === "alerts" ? "Alerts" : "Profile"} onBack={() => setView("home")} action={undefined} /><main className="page list-page">{isVehicles ? <div className="search"><Search size={18} /><input placeholder="Search vehicles" /></div> : type === "profile" ? null : <div className="filter-row">{filters.map(item => <button className={`filter ${filter === item ? "active-filter" : ""}`} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>}{isVehicles ? <div className="list-stack">{vehicles.filter(v => v.hub === selectedHub).map(v => <button className="fleet-card" key={v.id} onClick={() => v.id === "MS 2048" && setView("vehicle")}><div className="fleet-card-top"><div><strong>{v.id}</strong><span>{v.model} · {v.hub}</span></div><StatusBadge tone={v.tone}>{v.status}</StatusBadge></div><div className="fleet-card-meta"><span><BatteryCharging size={14} /> {v.battery}</span><span><MapPin size={14} /> {v.range}</span><span><ClipboardCheck size={14} /> Inspection due</span></div></button>)}</div> : <div className="list-stack">{type === "alerts" ? [["Critical", "MS 2048 · Front light failure", "8 min ago", "red"], ["Warning", "MS 2017 · Battery below recommended level", "32 min ago", "amber"], ["Information", "MS 2091 · Inspection completed", "1 hr ago", "blue"], ["Resolved", "MS 2033 · Brake adjustment completed", "Yesterday", "green"]].filter(([status]) => filter === "All" || status === filter).map(([a,b,c,t]) => <div className="alert-card" key={b}><div className={`alert-symbol ${t}`}><AlertTriangle size={17} /></div><div><StatusBadge tone={t}>{a}</StatusBadge><strong>{b}</strong><span>{c}</span></div><ChevronRight size={17} /></div>) : type === "tasks" ? initialTaskItems.filter(item => filter === "All" || item.status === filter).map(({ name, status, due, tone }) => <div className="task-card" key={name}><div className="task-icon"><ClipboardCheck size={18} /></div><div><strong>{name}</strong><span>{due}</span></div><StatusBadge tone={tone}>{status}</StatusBadge></div>) : <div className="profile-card"><div className="large-avatar">AK</div><h2>Arjun Kumar</h2><p className="muted">Mobility Operator</p><button className="settings-row" onClick={() => setView("preferences")}><Settings size={18} /><span>App preferences</span><ChevronRight size={17} /></button><div className="settings-row"><Moon size={18} /><span>Appearance</span><ThemeToggle /></div><button className="settings-row" onClick={() => setView("notifications")}><Bell size={18} /><span>Notifications</span><ChevronRight size={17} /></button><button className="settings-row" onClick={() => setView("help")}><CircleHelp size={18} /><span>Help & support</span><ChevronRight size={17} /></button><button className="settings-row sign-out-row" onClick={() => setView("signin")}><LogOut size={18} /><span>Sign out</span><ChevronRight size={17} /></button></div>}</div>}</main><BottomNav active={type} setView={setView} /></>;
}

function Splash() {
  return <div className="splash-screen"><div className="splash-mark"><Bike size={42} /></div><h1>MILESTRIDE</h1><p>Hub Operator</p><span>Fleet operations, simplified.</span></div>;
}

function SignIn({ setView }: { setView: (v: View) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("arjun@milestride.io");
  const [password, setPassword] = useState("arjun@1788");
  return <div className="auth-screen"><div className="auth-brand"><div className="splash-mark small-mark"><Bike size={25} /></div><strong>MILESTRIDE</strong></div><div className="auth-copy"><p className="eyebrow">HUB OPERATOR</p><h2>Welcome back</h2><p className="muted">Sign in to manage your mobility fleet.</p></div><div className="auth-form"><label className="field-label">Work email</label><div className="auth-field"><Mail size={17} /><input className="auth-input" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" /></div><label className="field-label">Password</label><div className="auth-field"><LockKeyhole size={17} /><input className="auth-input" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" type={showPassword ? "text" : "password"} /><button className="password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><button className="primary full" onClick={() => setView("home")}>Sign in <ChevronRight size={17} /></button></div><p className="auth-foot">Need access? <span>Contact your hub administrator</span></p></div>;
}

function ProfileDetail({ type, setView }: { type: "preferences" | "notifications" | "help"; setView: (v: View) => void }) {
  const content: { title: string; intro: string; rows: string[][] } = { preferences: { title: "App preferences", intro: "Manage your operator experience", rows: [["Default hub", "University Campus"], ["Units", "Metric (km, °C)"], ["Data sync", "Automatic"]] }, notifications: { title: "Notifications", intro: "Stay informed about fleet activity", rows: [["Critical vehicle alerts", "Enabled"], ["Maintenance updates", "Enabled"], ["Daily summary", "08:00 AM"]] }, help: { title: "Help & support", intro: "Get assistance with hub operations", rows: [["Quick start guide", "Operator handbook"], ["Contact support", "support@milestride.com"], ["About Milestride", "Version 1.0.0"]] } }[type];
  return <><TopBar title={content.title} onBack={() => setView("profile")} /><main className="page detail-page"><p className="muted detail-intro">{content.intro}</p><div className="vehicle-specs detail-list">{content.rows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>{type === "notifications" && <div className="offline-banner"><span className="offline-dot" /><div><strong>Notifications are active</strong><p>You'll receive important fleet updates here.</p></div></div>}{type === "help" && <button className="primary full">Contact support <ChevronRight size={17} /></button>}</main></>;
}

function Issue({ setView }: { setView: (v: View) => void }) {
  return <><TopBar title="Issue #IS-7856" onBack={() => setView("submitted")} /><main className="page issue-page"><div className="issue-heading"><div><p className="eyebrow">MAINTENANCE TICKET</p><h2>Lights not working</h2></div><StatusBadge tone="red">High priority</StatusBadge></div><div className="timeline"><div className="timeline-item done"><i><Check size={14} /></i><div><strong>Issue reported</strong><span>{dateLabel} · 09:15 AM</span></div></div><div className="timeline-item current"><i><Wrench size={14} /></i><div><strong>Maintenance assigned</strong><span>Ramesh Kumar · Technician</span><p>Replacement light is being installed.</p></div></div><div className="timeline-item"><i><ShieldCheck size={14} /></i><div><strong>Resolution pending</strong><span>We’ll notify you when it’s ready to verify.</span></div></div></div><div className="update-photo"><img src={bikeImage} /><div><span>Latest update · 11:30 AM</span><strong>Technician is working on this vehicle</strong></div></div><div className="sticky-bottom"><button className="secondary full" onClick={() => setView("vehicle")}>Back to vehicle</button></div></main></>;
}

export default function Index() {
  const [view, setView] = useState<View>("splash");
  const [selectedHub, setSelectedHub] = useState<HubName>("University Campus");
  const [tasks, setTasks] = useState<FleetTask[]>(() => {
    const savedTasks = localStorage.getItem("milestride-tasks");
    const saved = savedTasks ? JSON.parse(savedTasks) as Partial<FleetTask>[] : [];
    return initialTaskItems.map(initialTask => {
      const storedTask = saved.find(task => task.id === initialTask.id);
      return { ...initialTask, status: storedTask?.status ?? initialTask.status, due: storedTask?.due ?? initialTask.due, tone: storedTask?.tone ?? initialTask.tone, checkedSteps: storedTask?.checkedSteps ?? initialTask.checkedSteps, acknowledgedAt: storedTask?.acknowledgedAt, completionComment: storedTask?.completionComment ?? initialTask.completionComment, proofImages: storedTask?.proofImages ?? initialTask.proofImages };
    });
  });
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskItems[0].id);
  const [selectedAlertId, setSelectedAlertId] = useState(alertItems[0].id);
  const [taskReturnView, setTaskReturnView] = useState<View>("tasks");
  const openTask = (taskId: string, returnView: View = "tasks") => {
    setSelectedTaskId(taskId);
    setTaskReturnView(returnView);
    setView("task");
  };
  const openAlert = (alertId: string) => {
    setSelectedAlertId(alertId);
    setView("alert");
  };
  const updateTask = (updatedTask: FleetTask) => setTasks(current => current.map(task => task.id === updatedTask.id ? updatedTask : task));
  useLayoutEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("milestride-theme", "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#101817");
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => setView("signin"), 1100);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => localStorage.setItem("milestride-tasks", JSON.stringify(tasks)), [tasks]);
  if (view === "splash") return <Splash />;
  if (view === "signin") return <SignIn setView={setView} />;
  if (view === "preferences" || view === "notifications" || view === "help") return <ProfileDetail type={view} setView={setView} />;
  if (view === "scanner") return <Scanner setView={setView} />;
  if (view === "vehicle") return <Vehicle setView={setView} />;
  if (view === "inspection") return <Inspection setView={setView} />;
  if (view === "report") return <Report setView={setView} />;
  if (view === "submitted") return <Submitted setView={setView} />;
  if (view === "issue") return <Issue setView={setView} />;
  if (view === "charging") return <ChargingView setView={setView} />;
  if (view === "task") return <TaskDetail task={tasks.find(task => task.id === selectedTaskId)!} setView={setView} backView={taskReturnView} updateTask={updateTask} />;
  if (view === "tasks") return <TasksView tasks={tasks} setView={setView} openTask={openTask} />;
  if (view === "alert") {
    const alert = alertItems.find(item => item.id === selectedAlertId)!;
    const ticketTask = tasks.find(task => task.ticketNumber === alert.ticketNumber);
    return <AlertDetail alert={alert} ticketTask={ticketTask} setView={setView} openTask={openTask} />;
  }
  if (view === "alerts") return <AlertsView setView={setView} openAlert={openAlert} tasks={tasks} />;
  if (["vehicles", "profile"].includes(view)) return <ListView type={view} setView={setView} selectedHub={selectedHub} />;
  return <HomeView setView={setView} selectedHub={selectedHub} setSelectedHub={setSelectedHub} tasks={tasks} openTask={openTask} />;
}
