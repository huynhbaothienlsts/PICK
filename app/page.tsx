"use client";

import { useEffect, useMemo, useState } from "react";

declare global { interface Window { lucide?: { createIcons: () => void } } }

type Mode = "free" | "membership";
type Page = "home" | "partner" | "coaching" | "events" | "booking" | "progress" | "membership";

const nav = [
  ["home", "home", "Home"], ["partner", "users", "Partner"], ["coaching", "graduation-cap", "Coaching"],
  ["events", "calendar-days", "Events"], ["progress", "chart-no-axes-combined", "Progress"],
] as const;

const players = [
  { name: "Minh Anh", level: "Intermediate", time: "Tue · Thu, 6–8 PM", match: "94%", tone: "#F6C453" },
  { name: "Quang Huy", level: "Advanced", time: "Sat · Sun, 8–11 AM", match: "89%", tone: "#68C6A3" },
  { name: "Linh Chi", level: "Beginner", time: "Mon · Wed, 5–7 PM", match: "86%", tone: "#F49B87" },
];

const coaches = [
  { name: "Coach Duy", detail: "DUPR 5.1 · Strategy", rate: "450k / lesson", initials: "ND" },
  { name: "Coach Mai", detail: "8 years · Fundamentals", rate: "400k / lesson", initials: "TM" },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return <i data-lucide={name} style={{ width: size, height: size }} aria-hidden="true" />;
}

function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: string }) {
  return <div className="section-title"><div>{eyebrow && <span>{eyebrow}</span>}<h2>{title}</h2></div>{action && <button>{action}</button>}</div>;
}

function AppCard({ icon, title, text, onClick, accent = false }: { icon: string; title: string; text: string; onClick?: () => void; accent?: boolean }) {
  return <button className={`action-card ${accent ? "accent" : ""}`} onClick={onClick}><span className="action-icon"><Icon name={icon} /></span><span><b>{title}</b><small>{text}</small></span><Icon name="chevron-right" size={18} /></button>;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("free");
  const [page, setPage] = useState<Page>("home");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All levels");
  const [selectedDate, setSelectedDate] = useState(26);
  const [selectedTime, setSelectedTime] = useState("17:30");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const script = document.createElement("script"); script.src = "/lucide.min.js"; script.onload = () => window.lucide?.createIcons(); document.body.appendChild(script);
    return () => script.remove();
  }, []);
  useEffect(() => { setTimeout(() => window.lucide?.createIcons(), 0); }, [mode, page, selectedDate, selectedTime, search, level]);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(""), 2200); return () => clearTimeout(id); }, [toast]);

  const title = useMemo(() => ({ home: "", partner: mode === "free" ? "Find a Partner" : "Match Suggestions", coaching: mode === "free" ? "Find a Coach" : "Coach Calendar", events: "Games & Events", booking: "Book a Court", progress: "My Progress", membership: "PICK! Membership" }[page]), [page, mode]);
  const go = (p: Page) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const act = (message: string) => setToast(message);

  return <main className="stage">
    <div className="phone-shell">
      <header className="topbar">
        <button className={`mode-toggle ${mode}`} onClick={() => setMode(mode === "free" ? "membership" : "free")} aria-label="Switch demo mode">
          <Icon name={mode === "free" ? "crown" : "house"} size={15} /> {mode === "free" ? "Membership" : "Free App"}
        </button>
        <button className="brand" onClick={() => go("home")}><span>PICK!</span><small>SOCIAL</small></button>
        <button className="avatar" aria-label="Open profile">TH</button>
      </header>

      {page !== "home" && <div className="page-head"><button onClick={() => go("home")} aria-label="Back home"><Icon name="arrow-left" /></button><div><small>{mode === "membership" ? "MEMBER EXPERIENCE" : "FREE EXPERIENCE"}</small><h1>{title}</h1></div><span /></div>}

      <div className="content">
        {page === "home" && <HomePage mode={mode} go={go} act={act} />}
        {page === "partner" && <PartnerPage mode={mode} search={search} setSearch={setSearch} level={level} setLevel={setLevel} act={act} />}
        {page === "coaching" && <CoachingPage mode={mode} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} act={act} />}
        {page === "events" && <EventsPage mode={mode} act={act} />}
        {page === "booking" && <BookingPage mode={mode} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} act={act} />}
        {page === "progress" && <ProgressPage mode={mode} act={act} />}
        {page === "membership" && <MembershipPage mode={mode} go={go} act={act} />}
      </div>

      <nav className="bottom-nav" aria-label="Main navigation">{nav.map(([p, icon, label]) => <button key={p} className={page === p ? "active" : ""} onClick={() => go(p)}><Icon name={icon} size={21} /><span>{label}</span></button>)}</nav>
      {toast && <div className="toast"><Icon name="circle-check" size={18} />{toast}</div>}
    </div>
  </main>;
}

function HomePage({ mode, go, act }: { mode: Mode; go: (p: Page) => void; act: (s: string) => void }) {
  const member = mode === "membership";
  return <>
    <section className={`hero ${member ? "member" : ""}`}>
      <div className="hero-ball" /><div className="hero-copy">{member && <div className="active-badge"><Icon name="badge-check" size={14} /> MEMBERSHIP ACTIVE</div>}<p>Good afternoon, Thien</p><h1>{member ? "Your game, elevated." : "Play. Connect. Grow."}</h1><span>{member ? "Your smartest next match starts here." : "Find your people. Get on court. Keep improving."}</span></div>
      <div className="hero-stat"><b>{member ? "4" : "2"}</b><small>games<br />this week</small></div>
    </section>
    <SectionTitle eyebrow="QUICK START" title={member ? "Member shortcuts" : "What do you want to do?"} />
    <div className="action-grid">
      <AppCard icon="users" title={member ? "Match Suggestions" : "Find a Partner"} text={member ? "3 great matches" : "38 players nearby"} onClick={() => go("partner")} accent={member} />
      <AppCard icon="graduation-cap" title={member ? "Coach Calendar" : "Find a Coach"} text={member ? "Next: Thu, 5 PM" : "Book a lesson"} onClick={() => go("coaching")} />
      <AppCard icon="calendar-check" title="Book a Court" text={member ? "Member benefits apply" : "See open slots"} onClick={() => go("booking")} />
      <AppCard icon={member ? "sparkles" : "trophy"} title={member ? "PICK! AI Coach" : "Track Progress"} text={member ? "New insight ready" : "Record a result"} onClick={() => go("progress")} />
    </div>
    <SectionTitle eyebrow="COMING UP" title={member ? "Picked for you" : "Games & events"} action="See all" />
    <button className="event-feature" onClick={() => go("events")}><div className="date-block"><b>{member ? "28" : "29"}</b><span>NOV</span></div><div><span className="tag">{member ? "MEMBER EXCLUSIVE" : "UNIVERSITY CLUB"}</span><h3>{member ? "DUPR 4.0+ Evening Rally" : "Social Rally Night"}</h3><p><Icon name="map-pin" size={14} /> PICK! Thao Dien · {member ? "7:00 PM" : "8:30 PM"}</p></div><Icon name="chevron-right" /></button>
    {member ? <div className="ai-preview"><span><Icon name="sparkles" size={19} /></span><div><b>PICK! AI Coach</b><p>“Your rally consistency is trending up.”</p></div><button onClick={() => go("progress")}>View</button></div> : <button className="membership-banner" onClick={() => go("membership")}><div><span>GO FURTHER WITH PICK!</span><h3>Meet your best match, faster.</h3><p>Unlock matching, AI coaching & more.</p></div><div className="crown"><Icon name="crown" /></div></button>}
  </>;
}

function PartnerPage({ mode, search, setSearch, level, setLevel, act }: { mode: Mode; search: string; setSearch: (s: string) => void; level: string; setLevel: (s: string) => void; act: (s: string) => void }) {
  const shown = players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (level === "All levels" || p.level === level));
  return <>{mode === "free" ? <>
    <div className="search"><Icon name="search" size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players by name" /></div>
    <div className="filters">{["All levels", "Beginner", "Intermediate", "Advanced"].map(x => <button className={level === x ? "active" : ""} onClick={() => setLevel(x)} key={x}>{x}</button>)}</div>
    <SectionTitle eyebrow={`${shown.length} PLAYERS NEARBY`} title="Player directory" />
    <div className="stack">{shown.map(p => <PlayerCard key={p.name} p={p} action="Connect" act={() => act(`Connection request sent to ${p.name}`)} />)}</div>
  </> : <>
    <div className="info-strip"><Icon name="sparkles" /><div><b>Smart matches for you</b><p>Based on Intermediate level + evening availability.</p></div></div>
    <SectionTitle eyebrow="TOP COMPATIBILITY" title="Players who fit your game" action="Refresh" />
    <div className="stack">{players.slice(0, 2).map(p => <PlayerCard key={p.name} p={p} action="Join Match" match act={() => act(`Match invitation sent to ${p.name}`)} />)}</div>
    <button className="secondary wide" onClick={() => act("Showing more partner options")}>See More Options</button>
    <div className="basic-access"><Icon name="users" /><div><b>Looking for someone specific?</b><p>Member access still includes the full player directory.</p></div><button onClick={() => act("Player directory opened")}>Find players</button></div>
  </>}</>;
}

function PlayerCard({ p, action, match, act }: { p: typeof players[number]; action: string; match?: boolean; act: () => void }) {
  return <article className="player-card"><div className="portrait" style={{ background: p.tone }}>{p.name.split(" ").map(n => n[0]).join("")}</div><div className="player-info"><div className="player-name"><h3>{p.name}</h3>{match && <b>{p.match} match</b>}</div><span>{p.level}</span><p><Icon name="clock-3" size={14} /> {p.time}</p><div className="card-actions"><button className="secondary" onClick={() => {}}>View Profile</button><button className="primary" onClick={act}>{action}</button></div></div></article>;
}

function CoachingPage({ mode, selectedDate, setSelectedDate, selectedTime, setSelectedTime, act }: { mode: Mode; selectedDate: number; setSelectedDate: (n: number) => void; selectedTime: string; setSelectedTime: (s: string) => void; act: (s: string) => void }) {
  return <>{mode === "free" ? <>
    <div className="search"><Icon name="search" size={18} /><input placeholder="Search by coach or specialty" /></div>
    <div className="filters"><button className="active">All coaches</button><button>Beginner</button><button>Strategy</button></div>
    <SectionTitle eyebrow="PICK! COACHES" title="Find the right coach" />
    <div className="stack">{coaches.map(c => <article className="coach-card" key={c.name}><div className="coach-avatar">{c.initials}</div><div><h3>{c.name}</h3><p>{c.detail}</p><div className="stars">★★★★★ <span>4.9</span></div><b>{c.rate}</b></div><button onClick={() => act(`${c.name}'s profile opened`)}><Icon name="chevron-right" /></button></article>)}</div>
  </> : <>
    <div className="calendar-top"><button><Icon name="chevron-left" /></button><div><small>YOUR TRAINING PLAN</small><h2>November 2026</h2></div><button><Icon name="chevron-right" /></button></div>
    <div className="week-row">{[24,25,26,27,28,29,30].map((d,i) => <button className={selectedDate === d ? "selected" : ""} onClick={() => setSelectedDate(d)} key={d}><span>{["TUE","WED","THU","FRI","SAT","SUN","MON"][i]}</span><b>{d}</b>{[26,28].includes(d) && <i />}</button>)}</div>
    <SectionTitle eyebrow={`${selectedDate} NOVEMBER`} title="Available coaching slots" />
    <div className="coach-focus"><div className="coach-avatar">ND</div><div><h3>Coach Duy</h3><p>Strategy & match play</p></div><span>4 slots</span></div>
    <div className="time-grid">{["09:00","10:30","17:30","19:00"].map(t => <button className={selectedTime === t ? "selected" : ""} onClick={() => setSelectedTime(t)} key={t}>{t}</button>)}</div>
    <button className="primary wide tall" onClick={() => act(`Training booked for Nov ${selectedDate} at ${selectedTime}`)}>Book Training · {selectedTime}</button>
    <SectionTitle eyebrow="UPCOMING" title="Your training sessions" />
    <div className="session"><div><b>03</b><span>DEC</span></div><p><b>Match Strategy</b><small>Coach Duy · 5:30 PM</small></p><Icon name="more-horizontal" /></div>
  </>}</>;
}

function EventsPage({ mode, act }: { mode: Mode; act: (s: string) => void }) {
  const events = mode === "membership" ? [
    ["28", "DUPR 4.0+ Evening Rally", "Advanced · Limited to 16 players", "MEMBER EXCLUSIVE"],
    ["05", "PICK! Sponsor Cup", "Free eligible entry · Limited slots", "FREE MEMBER ENTRY"],
    ["12", "Beginner League", "Member league discount applies", "MEMBER SAVING"],
  ] : [["29", "University Club Session", "Off-peak social play · All levels", "UNIVERSITY CLUB"], ["06", "Thao Dien Open", "Early tournament alert", "EARLY ALERT"], ["14", "Sunday Social Mixer", "Friendly play · Open entry", "SOCIAL"]];
  return <><div className="tab-switch"><button className="active">Upcoming</button><button>Past</button></div>{mode === "membership" && <div className="info-strip"><Icon name="crown" /><div><b>Member priority is on</b><p>Exclusive sessions and eligible free entries appear first.</p></div></div>}<div className="event-list">{events.map((e, i) => <article key={e[1]}><div className="event-date"><b>{e[0]}</b><span>{i ? "DEC" : "NOV"}</span></div><div><span className="tag">{e[3]}</span><h3>{e[1]}</h3><p>{e[2]}</p><small><Icon name="map-pin" size={13} /> PICK! Thao Dien</small></div><button onClick={() => act(`Viewing ${e[1]}`)}><Icon name="chevron-right" /></button></article>)}</div><button className="secondary wide">View all events</button></>;
}

function BookingPage({ mode, selectedDate, setSelectedDate, selectedTime, setSelectedTime, act }: { mode: Mode; selectedDate: number; setSelectedDate: (n: number) => void; selectedTime: string; setSelectedTime: (s: string) => void; act: (s: string) => void }) {
  return <><div className="stepper"><span className="done">1</span><i /><span className="done">2</span><i /><span>3</span></div><SectionTitle eyebrow="1 · COURT" title="PICK! Thao Dien" action="Change" /><div className="court-card"><div className="court-visual"><span>PICK!</span></div><div><h3>Court 02</h3><p>Indoor · Premium surface</p><span><Icon name="map-pin" size={13} /> District 2</span></div><Icon name="circle-check" /></div><SectionTitle eyebrow="2 · DATE & TIME" title="Choose your slot" /><div className="week-row compact">{[24,25,26,27,28].map((d,i) => <button className={selectedDate === d ? "selected" : ""} onClick={() => setSelectedDate(d)} key={d}><span>{["TUE","WED","THU","FRI","SAT"][i]}</span><b>{d}</b></button>)}</div><div className="time-grid">{["15:00","16:30","17:30","19:00"].map(t => <button className={selectedTime === t ? "selected" : ""} onClick={() => setSelectedTime(t)} key={t}>{t}</button>)}</div><SectionTitle eyebrow="3 · SUMMARY" title="Your booking" /><div className="booking-summary"><div><span>Court 02 · {selectedDate} Nov</span><b>{selectedTime} – 19:00</b></div><strong>250,000 ₫</strong>{mode === "membership" && <div className="benefits"><h4><Icon name="crown" size={15} /> Member benefits applied</h4>{["Priority Slot Hold","Daytime Booking Discount","Daytime Combo: free drink + paddle rental"].map(x => <p key={x}><Icon name="check" size={14} />{x}</p>)}<small>Court hire, coaching and F&B are separately paid.</small></div>}</div><button className="primary wide tall" onClick={() => act("Court booking confirmed")}>Confirm Booking</button></>;
}

function ProgressPage({ mode, act }: { mode: Mode; act: (s: string) => void }) {
  return <>{mode === "free" ? <><div className="score-hero"><div><small>GAMES PLAYED</small><b>12</b><span>+3 this week</span></div><div className="ring"><b>67%</b><span>win rate</span></div></div><div className="stats-row"><div><Icon name="trophy" /><b>8</b><span>Wins</span></div><div><Icon name="activity" /><b>3</b><span>This week</span></div><div><Icon name="flame" /><b>2</b><span>Win streak</span></div></div><button className="primary wide tall" onClick={() => act("Ready to record a new match")}>+ Record Match Result</button><SectionTitle eyebrow="RECENT HISTORY" title="Your matches" /><div className="match-row"><span className="win">W</span><div><b>vs. Minh Anh</b><small>21–16, 21–18 · Nov 24</small></div><Icon name="chevron-right" /></div><div className="match-row"><span className="loss">L</span><div><b>vs. Quang Huy</b><small>18–21, 19–21 · Nov 21</small></div><Icon name="chevron-right" /></div></> : <><div className="ai-hero"><div className="ai-orb"><Icon name="sparkles" /></div><div><span>PICK! AI COACH</span><h2>Your game, decoded.</h2><p>AI-assisted progress and guidance after every match.</p></div><small>SIMULATED DEMO OUTPUT</small></div><div className="summary-label">POST-MATCH SUMMARY · SAMPLE</div><div className="record-card"><div><b>8W <span>–</span> 4L</b><p>Your last 12 recorded matches.</p></div><div className="ring mini"><b>66.7%</b><span>win rate</span></div></div><div className="ai-flow"><div className="flow-card data"><span><Icon name="chart-no-axes-combined" /> 1 · PERFORMANCE DATA</span><div className="mini-stats"><p><b>66.7%</b>Win rate</p><p><b>12</b>Matches played</p><p><b>3</b>Weekly activity</p></div></div><div className="connector" /><div className="flow-card reflect"><span><Icon name="message-circle" /> 2 · PLAYER REFLECTION</span><blockquote>“I struggled to maintain consistency during longer rallies.”</blockquote></div><div className="connector" /><div className="flow-card insight"><span><Icon name="sparkles" /> 3 · AI-GENERATED INSIGHT</span><p>Your reflection suggests that consistency during extended rallies is an area you would like to improve.</p><small>SIMULATED — NOT REAL AI ANALYSIS</small></div><div className="connector" /><div className="flow-card next"><span><Icon name="target" /> 4 · SUGGESTED NEXT STEPS</span><ul><li>Set a goal to maintain more consistent rallies.</li><li>Focus on controlled shot placement during your next practice.</li><li>Review your progress after three matches.</li></ul></div></div><button className="primary wide tall" onClick={() => act("Practice goal added to your plan")}>Add to My Practice Plan</button></>}
  </>;
}

function MembershipPage({ mode, go, act }: { mode: Mode; go: (p: Page) => void; act: (s: string) => void }) {
  return <><div className="membership-hero"><div className="crown"><Icon name="crown" /></div><span>{mode === "membership" ? "MEMBERSHIP ACTIVE" : "PLAY SMARTER. CONNECT FASTER."}</span><h2>PICK! Membership</h2><p><b>VND 399,000</b> / month</p></div>{mode === "free" ? <><SectionTitle eyebrow="COMPARE PLANS" title="More value in every game" /><div className="comparison"><div className="compare-head"><b>Free App</b><b>Membership</b></div>{[["Find players","Match suggestions"],["Coach directory","Coach calendar"],["Club sessions","Exclusive events"],["Standard booking","Member benefits"],["Basic tracking","PICK! AI Coach"]].map(x => <div key={x[0]}><span><Icon name="check" size={14} />{x[0]}</span><strong><Icon name="crown" size={14} />{x[1]}</strong></div>)}</div><button className="primary wide tall" onClick={() => act("Membership checkout demo opened")}>Join Membership</button><p className="fineprint">Demo only — no payment will be processed.</p></> : <><div className="active-plan"><Icon name="badge-check" /><div><b>Your membership is active</b><p>All member experiences are ready to explore.</p></div></div><SectionTitle eyebrow="YOUR BENEFITS" title="Ready when you are" /><div className="shortcut-list"><AppCard icon="users" title="Match Suggestions" text="Meet compatible players" onClick={() => go("partner")} /><AppCard icon="calendar-days" title="Coach Calendar" text="Plan training faster" onClick={() => go("coaching")} /><AppCard icon="sparkles" title="PICK! AI Coach" text="See your latest insight" onClick={() => go("progress")} /><AppCard icon="ticket-check" title="Exclusive Events" text="Priority access & savings" onClick={() => go("events")} /></div></>}</>;
}
