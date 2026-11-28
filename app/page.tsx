"use client";

import { useEffect, useMemo, useState } from "react";

declare global { interface Window { lucide?: { createIcons: () => void } } }

type Mode = "free" | "membership";
type Page = "home" | "partner" | "coaching" | "events" | "booking" | "progress" | "membership" | "profile";

const nav = [
  ["home", "home", "Home"], ["partner", "users", "Partner"], ["coaching", "graduation-cap", "Coaching"],
  ["events", "calendar-days", "Events"], ["progress", "chart-no-axes-combined", "Progress"],
] as const;

const players = [
  { name: "Minh Anh", level: "Intermediate", time: "Tuesday, 6–8 PM", preference: "Doubles · Social competitive", tone: "#F6C453" },
  { name: "Quang Huy", level: "Advanced", time: "Saturday, 8–11 AM", preference: "Singles · Fast-paced", tone: "#68C6A3" },
  { name: "Linh Chi", level: "Beginner", time: "Wednesday, 5–7 PM", preference: "Doubles · Learning", tone: "#F49B87" },
  { name: "Bao Tran", level: "Intermediate", time: "Thursday, 6–8 PM", preference: "Doubles · Balanced", tone: "#8B9BD6" },
];

const coaches = [
  { name: "Coach Duy", detail: "8 years · Match strategy", focus: "Intermediate–Advanced", rate: "450k / lesson", slots: "Thu · 17:30, 19:00", initials: "ND" },
  { name: "Coach Mai", detail: "6 years · Fundamentals", focus: "Beginner–Intermediate", rate: "400k / lesson", slots: "Tue · 09:00, 10:30", initials: "TM" },
  { name: "Coach An", detail: "5 years · Footwork & defence", focus: "All levels", rate: "420k / lesson", slots: "Sat · 08:00, 09:30", initials: "LA" },
  { name: "Coach Khoa", detail: "7 years · Doubles tactics", focus: "Intermediate", rate: "480k / lesson", slots: "Sun · 15:00, 16:30", initials: "PK" },
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
  const [availability, setAvailability] = useState("Any time");
  const [selectedDate, setSelectedDate] = useState(26);
  const [selectedTime, setSelectedTime] = useState("17:30");
  const [toast, setToast] = useState("");
  const [dialog, setDialog] = useState<{ title: string; body: string; confirm?: string } | null>(null);
  const [showNudge, setShowNudge] = useState(true);

  useEffect(() => {
    const script = document.createElement("script"); script.src = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/lucide.min.js`; script.onload = () => window.lucide?.createIcons(); document.body.appendChild(script);
    return () => script.remove();
  }, []);
  useEffect(() => { setTimeout(() => window.lucide?.createIcons(), 0); }, [mode, page, selectedDate, selectedTime, search, level]);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(""), 2200); return () => clearTimeout(id); }, [toast]);

  const title = useMemo(() => ({ home: "", partner: mode === "free" ? "Find a Partner" : "Match Suggestions", coaching: mode === "free" ? "Find a Coach" : "Coach Calendar", events: "Games & Events", booking: "Book a Court", progress: "My Progress", membership: "PICK! Membership", profile: "Player Profile" }[page]), [page, mode]);
  const go = (p: Page) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const act = (message: string) => setToast(message);

  return <main className="stage">
    <div className="phone-shell">
      <header className="topbar">
        <button className={`mode-toggle ${mode}`} onClick={() => setMode(mode === "free" ? "membership" : "free")} aria-label="Switch demo mode">
          <Icon name={mode === "free" ? "crown" : "house"} size={15} /> {mode === "free" ? "Membership" : "Free App"}
        </button>
        <button className="brand" onClick={() => go("home")}><span>PICK!</span><small>SOCIAL</small></button>
        <button className="avatar" aria-label="Open profile" onClick={() => go("profile")}>TH</button>
      </header>

      {page !== "home" && <div className="page-head"><button onClick={() => go("home")} aria-label="Back home"><Icon name="arrow-left" /></button><div><small>{mode === "membership" ? "MEMBER EXPERIENCE" : "FREE EXPERIENCE"}</small><h1>{title}</h1></div><span /></div>}

      <div className="content">
        {page === "home" && <HomePage mode={mode} go={go} act={act} />}
        {page === "partner" && <PartnerPage mode={mode} search={search} setSearch={setSearch} level={level} setLevel={setLevel} availability={availability} setAvailability={setAvailability} act={act} openDialog={setDialog} />}
        {page === "coaching" && <CoachingPage key={mode} mode={mode} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} act={act} openDialog={setDialog} />}
        {page === "events" && <EventsPage mode={mode} act={act} openDialog={setDialog} />}
        {page === "booking" && <BookingPage mode={mode} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} act={act} />}
        {page === "progress" && <ProgressPage mode={mode} act={act} />}
        {page === "membership" && <MembershipPage mode={mode} go={go} act={act} />}
        {page === "profile" && <ProfilePage mode={mode} go={go} act={act} />}
      </div>

      <nav className="bottom-nav" aria-label="Main navigation">{nav.map(([p, icon, label]) => <button key={p} className={page === p ? "active" : ""} onClick={() => go(p)}><Icon name={icon} size={21} /><span>{label}</span></button>)}</nav>
      {mode === "free" && showNudge && page !== "membership" && <aside className="membership-nudge"><button className="nudge-close" onClick={() => setShowNudge(false)} aria-label="Dismiss membership reminder"><Icon name="x" size={13} /></button><button onClick={() => go("membership")}><img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/pick-mascot-paddle.png`} alt="PICK! mascot" /><span><b>Still playing for free?</b><small>Discover what PICK! SOCIAL can unlock.</small></span></button></aside>}
      {toast && <div className="toast"><Icon name="circle-check" size={18} />{toast}</div>}
      {dialog && <div className="dialog-backdrop" onClick={() => setDialog(null)}><section className="dialog" onClick={e => e.stopPropagation()}><button className="dialog-close" onClick={() => setDialog(null)} aria-label="Close"><Icon name="x" /></button><div className="dialog-icon"><Icon name="circle-check-big" /></div><h2>{dialog.title}</h2><p>{dialog.body}</p>{dialog.confirm && <button className="primary wide tall" onClick={() => { act(dialog.confirm!); setDialog(null); }}>{dialog.confirm}</button>}<button className="secondary wide" onClick={() => setDialog(null)}>Close</button></section></div>}
    </div>
  </main>;
}

function HomePage({ mode, go, act }: { mode: Mode; go: (p: Page) => void; act: (s: string) => void }) {
  const member = mode === "membership";
  return <>
    <section className={`hero mascot-hero ${member ? "member" : ""}`}>
      <div className="hero-copy">{member && <div className="active-badge"><Icon name="badge-check" size={14} /> MEMBERSHIP ACTIVE</div>}<p>Good afternoon, Thien</p><h1>Play. Connect. Grow.</h1><span>Your game. Your people. Your community.</span><button className="hero-cta" onClick={() => go("events")}><Icon name="circle-play" size={16} /> Find a Game</button></div>
      <img className="hero-mascot" src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${member ? "pick-mascot-paddle.png" : "pick-mascot.png"}`} alt="PICK! mint mascot" />
    </section>
    <div className="player-snapshot"><button className="snapshot-person" onClick={() => go("profile")}><span>TH</span><div><b>Thien Huynh</b><small>Intermediate · Ho Chi Minh City</small></div></button><div><b>{member ? "4" : "2"}</b><small>games this week</small></div><div><b>66.7%</b><small>win rate</small></div></div>
    <SectionTitle eyebrow="QUICK START" title={member ? "Member shortcuts" : "What do you want to do?"} />
    <div className="action-grid">
      <AppCard icon="users" title={member ? "Smart Match Suggestions" : "Find Players"} text={member ? "Matched by skill & schedule" : "Search, filter & connect"} onClick={() => go("partner")} accent={member} />
      <AppCard icon="graduation-cap" title={member ? "Coach Calendar" : "Find a Coach"} text={member ? "Manage your training" : "Discover & book separately"} onClick={() => go("coaching")} />
      <AppCard icon="calendar-check" title="Book a Court" text={member ? "Court hire paid separately" : "See open slots"} onClick={() => go("booking")} />
      <AppCard icon={member ? "chart-no-axes-combined" : "trophy"} title={member ? "Player Progress" : "Track Results"} text={member ? "Structured match progress" : "Record a match"} onClick={() => go("progress")} />
    </div>
    <SectionTitle eyebrow="COMING UP" title={member ? "Organised games for you" : "Upcoming Games & Events"} action="See all" />
    <button className="event-feature" onClick={() => go("events")}><div className="date-block"><b>{member ? "28" : "29"}</b><span>NOV</span></div><div><span className="tag">{member ? "MEMBER EXCLUSIVE" : "UNIVERSITY CLUB"}</span><h3>{member ? "DUPR 4.0+ Evening Rally" : "Social Rally Night"}</h3><p><Icon name="map-pin" size={14} /> PICK! Thao Dien · {member ? "7:00 PM" : "8:30 PM"}</p></div><Icon name="chevron-right" /></button>
    <section className="community-photo"><img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/pickleball-community.jpg`} alt="Friends playing pickleball together" /><div><span>COMMUNITY IN MOTION</span><h3>Weekly games. Local groups. Real connections.</h3><p>Join 128 players across university clubs and neighbourhood groups.</p><button onClick={() => go("events")}>Explore community <Icon name="arrow-right" size={14} /></button></div></section>
    {member ? <div className="ai-preview"><span><Icon name="trophy" size={19} /></span><div><b>Intermediate Playing Ladder</b><p>You are #12 · Two matches to climb</p></div><button onClick={() => go("events")}>View</button></div> : <button className="membership-banner membership-price" onClick={() => go("membership")}><div><span>PICK! SOCIAL MEMBERSHIP</span><h3>Grow your game with your community.</h3><p><b>VND 399,000/month</b> · Smart matching, organised games & progress</p><em>Explore membership</em></div><img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/pick-mascot-paddle.png`} alt="PICK! mascot holding a paddle" /></button>}
  </>;
}

function PartnerPage({ mode, search, setSearch, level, setLevel, availability, setAvailability, act, openDialog }: { mode: Mode; search: string; setSearch: (s: string) => void; level: string; setLevel: (s: string) => void; availability: string; setAvailability: (s: string) => void; act: (s: string) => void; openDialog: (d: { title: string; body: string; confirm?: string }) => void }) {
  const shown = players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (level === "All levels" || p.level === level) && (availability === "Any time" || p.time.includes(availability)));
  return <>{mode === "free" ? <>
    <div className="search"><Icon name="search" size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players by name" /></div>
    <div className="filters">{["All levels", "Beginner", "Intermediate", "Advanced"].map(x => <button className={level === x ? "active" : ""} onClick={() => setLevel(x)} key={x}>{x}</button>)}</div><div className="filters availability">{["Any time", "Tuesday", "Wednesday", "Thursday", "Saturday"].map(x => <button className={availability === x ? "active" : ""} onClick={() => setAvailability(x)} key={x}><Icon name="clock-3" size={12} />{x}</button>)}</div>
    <SectionTitle eyebrow={`${shown.length} PLAYERS NEARBY`} title="Player directory" />
    <div className="stack">{shown.map(p => <PlayerCard key={p.name} p={p} action="Connect" view={() => openDialog({ title: p.name, body: `${p.level} player · ${p.preference}. Available ${p.time}. This is sample profile data for the prototype.` })} act={() => act(`Connection request sent to ${p.name}`)} />)}</div>
  </> : <>
    <div className="info-strip"><Icon name="sparkles" /><div><b>Smart matches for you</b><p>Based on Intermediate level + evening availability.</p></div></div>
    <SectionTitle eyebrow="TOP COMPATIBILITY" title="Players who fit your game" action="Refresh" />
    <div className="stack">{shown.slice(0, 3).map(p => <PlayerCard key={p.name} p={p} action="Join Match" match view={() => openDialog({ title: p.name, body: `${p.level} · ${p.preference}. Your overlapping availability is ${p.time}. Skill and schedule compatibility are shown without fabricated match percentages.` })} act={() => openDialog({ title: "Match details", body: `${p.name} (${p.level}) · Thursday, 6:30 PM · PICK! Thao Dien · 6/8 slots. Court fees are shared and paid separately.`, confirm: "Confirm Join Match" })} />)}</div>
    <button className="secondary wide" onClick={() => { setLevel("All levels"); setAvailability("Any time"); act("Additional compatible suggestions loaded"); }}>See More Options</button>
    <div className="basic-access"><Icon name="search" /><div><b>Find a Specific Player</b><p>Search the full player directory by name.</p></div><button onClick={() => setSearch("Minh")}>Search</button></div>
  </>}</>;
}

function PlayerCard({ p, action, match, view, act }: { p: typeof players[number]; action: string; match?: boolean; view: () => void; act: () => void }) {
  return <article className="player-card"><div className="portrait" style={{ background: p.tone }}>{p.name.split(" ").map(n => n[0]).join("")}</div><div className="player-info"><div className="player-name"><h3>{p.name}</h3>{match && <b>Schedule overlap</b>}</div><span>{p.level} · {p.preference}</span><p><Icon name="clock-3" size={14} /> {p.time}</p><div className="card-actions"><button className="secondary" onClick={view}>View Profile</button><button className="primary" onClick={act}>{action}</button></div></div></article>;
}

function CoachingPage({ mode, selectedDate, setSelectedDate, selectedTime, setSelectedTime, act, openDialog }: { mode: Mode; selectedDate: number; setSelectedDate: (n: number) => void; selectedTime: string; setSelectedTime: (s: string) => void; act: (s: string) => void; openDialog: (d: { title: string; body: string; confirm?: string }) => void }) {
  return <>{mode === "free" ? <>
    <div className="search"><Icon name="search" size={18} /><input placeholder="Search by coach or specialty" /></div>
    <div className="filters"><button className="active">All coaches</button><button>Beginner</button><button>Strategy</button></div>
    <SectionTitle eyebrow="PICK! COACHES" title="Find the right coach" />
    <div className="stack">{coaches.map((c,i) => <article className="coach-card" key={c.name}><div className="coach-avatar">{c.initials}</div><div><span className="demo-label">SAMPLE PROFILE</span><h3>{c.name}</h3><p>{c.detail} · {c.focus}</p><div className="stars">★★★★★ <span>{i ? "4.8" : "4.9"}</span></div><b>{c.rate}</b><small>{c.slots}</small></div><button onClick={() => openDialog({ title: `${c.name} · Lesson details`, body: `${c.detail}. Focus: ${c.focus}. Available ${c.slots}. Coaching is paid separately from Membership. Sample data.`, confirm: "Request Lesson" })}><Icon name="chevron-right" /></button></article>)}</div>
  </> : <>
    <div className="calendar-top"><button><Icon name="chevron-left" /></button><div><small>YOUR TRAINING PLAN</small><h2>November 2026</h2></div><button><Icon name="chevron-right" /></button></div>
    <div className="week-row">{[24,25,26,27,28,29,30].map((d,i) => <button className={selectedDate === d ? "selected" : ""} onClick={() => setSelectedDate(d)} key={d}><span>{["TUE","WED","THU","FRI","SAT","SUN","MON"][i]}</span><b>{d}</b>{[26,28].includes(d) && <i />}</button>)}</div>
    <div className="calendar-views"><button className="active">Week</button><button>Month</button></div><SectionTitle eyebrow={`${selectedDate} NOVEMBER · SAMPLE AVAILABILITY`} title="Available coaching slots" />
    <div className="calendar-coaches">{[{c:coaches[0],days:[26,28],times:["17:30","19:00"]},{c:coaches[1],days:[25,27],times:["09:00","10:30"]},{c:coaches[2],days:[29,30],times:["08:00","09:30"]}].map(({c,days,times}) => <button key={c.name} className={days.includes(selectedDate) ? "active" : ""} onClick={() => { setSelectedDate(days[0]); setSelectedTime(times[0]); }}><div className="coach-avatar">{c.initials}</div><span><b>{c.name}</b><small>{days.join(" & ")} Nov · {times.join(", ")}</small></span><Icon name="chevron-right" /></button>)}</div>
    <div className="time-grid">{["08:00","09:00","10:30","17:30","19:00","20:00"].map(t => <button className={selectedTime === t ? "selected" : ""} onClick={() => setSelectedTime(t)} key={t}>{t}</button>)}</div>
    <p className="payment-note"><Icon name="info" size={14} /> Membership improves scheduling access. Lessons remain separately paid.</p><button className="primary wide tall" onClick={() => openDialog({ title: "Confirm lesson request", body: `Selected ${selectedDate} November at ${selectedTime}. Coaching fee is paid separately. This is sample availability.`, confirm: "Confirm Lesson Request" })}>Book Lesson · {selectedTime}</button>
    <SectionTitle eyebrow="UPCOMING" title="Your training sessions" />
    <div className="session"><div><b>03</b><span>DEC</span></div><p><b>Match Strategy</b><small>Coach Duy · 5:30 PM · Reminder on</small></p><button onClick={() => openDialog({ title: "Manage session", body: "Match Strategy with Coach Duy · 3 December, 5:30 PM. Coaching fee is paid separately.", confirm: "Reschedule Session" })}><Icon name="more-horizontal" /></button></div>
  </>}</>;
}

function EventsPage({ mode, act, openDialog }: { mode: Mode; act: (s: string) => void; openDialog: (d: { title: string; body: string; confirm?: string }) => void }) {
  const events = mode === "membership" ? [
    ["28", "DUPR 4.0+ Evening Rally", "Verified rating required · 6/16 slots", "COMPETITIVE SESSION"],
    ["05", "Facilitated Community Game", "1 of 2 monthly games · Court fee shared", "MEMBER ORGANISED"],
    ["12", "Beginner League", "Discounted member entry · 8 slots", "MEMBER DISCOUNT"],
  ] : [["29", "University Club Session", "Off-peak social play · All levels", "UNIVERSITY CLUB"], ["06", "Thao Dien Open", "Early tournament alert", "EARLY ALERT"], ["14", "Sunday Social Mixer", "Friendly play · Open entry", "SOCIAL"]];
  return <><div className="tab-switch"><button className="active">Upcoming</button><button onClick={() => act("Past events loaded")}>Past</button></div>{mode === "membership" && <div className="info-strip"><Icon name="crown" /><div><b>Member competition access</b><p>Structured sessions, ladders and discounted selected events. Fees remain clearly labelled.</p></div></div>}<div className="event-list">{events.map((e, i) => <article key={e[1]}><div className="event-date"><b>{e[0]}</b><span>{i ? "DEC" : "NOV"}</span></div><div><span className="tag">{e[3]}</span><h3>{e[1]}</h3><p>{e[2]}</p><small><Icon name="map-pin" size={13} /> PICK! Thao Dien</small></div><button aria-label={`View ${e[1]}`} onClick={() => openDialog({ title: e[1], body: `${e[2]}. Venue: PICK! Thao Dien. Demo event details; eligibility and pricing shown before confirmation.`, confirm: "Register Interest" })}><Icon name="circle-plus" /></button></article>)}</div>{mode === "membership" && <div className="ladder-card"><span><Icon name="trophy" size={15} /> PLAYING LADDER</span><h3>Intermediate Ladder · Week 4</h3><div><b>#12</b><p>Your position<small>2 matches to climb</small></p><button onClick={() => openDialog({ title: "Intermediate Playing Ladder", body: "You are currently #12. Challenge a nearby player, agree a time and record the verified result after the match.", confirm: "Find a Ladder Match" })}>View ladder</button></div></div>}<SectionTitle eyebrow="ORGANISED GAMES" title="Find your next court crew" /><div className="organised-game"><div className="game-photo"><img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/pick-mascot-paddle.png`} alt="PICK! mascot ready to play" /></div><div><span>{mode === "membership" ? "MEMBER ORGANISED · COURT FEE SHARED" : "PUBLIC ACTIVITY"}</span><h3>Thursday After-Work Rally</h3><p><Icon name="users" size={14} /> 6/8 players · Intermediate</p><p><Icon name="clock-3" size={14} /> Thu 6:30 PM · Thao Dien</p><div className="player-dots"><i>MA</i><i>QH</i><i>LC</i><b>+3</b></div></div><button className="primary" onClick={() => openDialog({ title: "Thursday After-Work Rally", body: "6/8 players · Intermediate · Thursday 6:30 PM · PICK! Thao Dien. Participants share and pay the court fee separately.", confirm: "Confirm Join" })}>Join</button></div><SectionTitle eyebrow="COMMUNITY" title="This week at PICK!" /><div className="community-grid"><button onClick={() => act("Weekly challenge joined")}><Icon name="target" /><b>Rally 50</b><span>Weekly challenge · 68 joined</span></button><button onClick={() => openDialog({ title: "Club leaderboard", body: "You are #12 this week. Rankings are based on recorded demo match results.", confirm: "Find a Ladder Match" })}><Icon name="trophy" /><b>Club leaderboard</b><span>You are #12 this week</span></button></div><button className="secondary wide" onClick={() => act("All community events loaded")}>View all events</button></>;
}

function BookingPage({ mode, selectedDate, setSelectedDate, selectedTime, setSelectedTime, act }: { mode: Mode; selectedDate: number; setSelectedDate: (n: number) => void; selectedTime: string; setSelectedTime: (s: string) => void; act: (s: string) => void }) {
  const unavailable = ["10:30","18:00"];
  return <><div className="stepper"><span className="done">1</span><i /><span className="done">2</span><i /><span>3</span></div><SectionTitle eyebrow="1 · COURT" title="Choose a court" /><div className="court-options"><button className="court-card selected"><div className="court-visual"><span>PICK!</span></div><div><h3>Court 02</h3><p>Indoor · Premium surface</p><span><Icon name="map-pin" size={13} /> District 2</span></div><Icon name="circle-check" /></button><button className="court-card" onClick={() => act("Court 03 selected")}>Court 03 · Outdoor</button></div><SectionTitle eyebrow="2 · DATE & TIME" title="Choose an available slot" /><div className="week-row compact">{[24,25,26,27,28].map((d,i) => <button className={selectedDate === d ? "selected" : ""} onClick={() => setSelectedDate(d)} key={d}><span>{["TUE","WED","THU","FRI","SAT"][i]}</span><b>{d}</b></button>)}</div><div className="slot-legend"><span><i />Available</span><span><i />Selected</span><span><i />Unavailable</span></div><div className="time-grid extended">{["08:00","09:00","10:30","15:00","16:30","17:30","18:00","19:00"].map(t => <button disabled={unavailable.includes(t)} className={selectedTime === t ? "selected" : unavailable.includes(t) ? "unavailable" : ""} onClick={() => setSelectedTime(t)} key={t}>{t}</button>)}</div><SectionTitle eyebrow="3 · SUMMARY" title="Review your booking" /><div className="booking-summary"><div><span>Court 02 · {selectedDate} Nov</span><b>{selectedTime} · 90 minutes</b></div><strong>250,000 ₫</strong>{mode === "membership" && <div className="benefits honest"><h4><Icon name="info" size={15} /> Membership information</h4><p>Standard availability and pricing apply.</p><p>Court hire is paid separately and is not included in the VND 399,000 monthly fee.</p><small>Coaching and food & drinks are also separately paid.</small></div>}</div><button className="primary wide tall" onClick={() => act(`Court 02 booked for ${selectedDate} Nov at ${selectedTime}`)}>Confirm & Pay Court Fee</button></>;
}

function ProgressPage({ mode, act }: { mode: Mode; act: (s: string) => void }) {
  return <>{mode === "free" ? <><div className="score-hero"><div><small>GAMES PLAYED</small><b>12</b><span>+3 this week</span></div><div className="ring"><b>67%</b><span>win rate</span></div></div><div className="stats-row"><div><Icon name="trophy" /><b>8</b><span>Wins</span></div><div><Icon name="activity" /><b>3</b><span>This week</span></div><div><Icon name="flame" /><b>2</b><span>Win streak</span></div></div><button className="primary wide tall" onClick={() => act("Match result form opened")}>+ Record Match Result</button><SectionTitle eyebrow="RECENT HISTORY" title="Your matches" /><div className="match-row"><span className="win">W</span><div><b>vs. Minh Anh</b><small>21–16, 21–18 · Nov 24 · Demo result</small></div><Icon name="chevron-right" /></div><div className="match-row"><span className="loss">L</span><div><b>vs. Quang Huy</b><small>18–21, 19–21 · Nov 21 · Demo result</small></div><Icon name="chevron-right" /></div></> : <><div className="ai-hero"><div className="ai-orb"><Icon name="sparkles" /></div><div><span>ILLUSTRATIVE AI COACH DEMO</span><h2>Your progress, structured.</h2><p>Simulated enhancement — not a confirmed membership entitlement or real AI analysis.</p></div><small>SIMULATED DEMO OUTPUT</small></div><div className="summary-label">POST-MATCH SUMMARY · SAMPLE DATA</div><div className="record-card"><div><b>8W <span>–</span> 4L</b><p>Your last 12 demo matches.</p></div><div className="ring mini"><b>66.7%</b><span>win rate</span></div></div><div className="ai-flow"><div className="flow-card data"><span><Icon name="chart-no-axes-combined" /> 1 · PERFORMANCE DATA</span><div className="mini-stats"><p><b>66.7%</b>Win rate</p><p><b>12</b>Matches played</p><p><b>3</b>Weekly activity</p></div></div><div className="connector" /><div className="flow-card reflect"><span><Icon name="message-circle" /> 2 · YOUR COACH’S COMMENTS</span><blockquote>“Work on maintaining consistency during longer rallies.”</blockquote></div><div className="connector" /><div className="flow-card insight"><span><Icon name="sparkles" /> 3 · AI-GENERATED INSIGHT</span><p>The sample coach comment identifies extended-rally consistency as a possible area to improve.</p><small>SIMULATED — NOT REAL AI ANALYSIS</small></div><div className="connector" /><div className="flow-card next"><span><Icon name="target" /> 4 · SUGGESTED NEXT STEPS</span><ul><li>Set a goal to maintain more consistent rallies.</li><li>Focus on controlled shot placement during your next practice.</li><li>Review your progress after three matches.</li></ul></div></div><button className="primary wide tall" onClick={() => act("Practice goal added to your demo plan")}>Add to Practice Plan</button></>}
  </>;
}

function ProfilePage({ mode, go, act }: { mode: Mode; go: (p: Page) => void; act: (s: string) => void }) {
  return <><section className="profile-hero"><div className="profile-avatar">TH</div><div><span>{mode === "membership" ? "PICK! MEMBER" : "FREE PLAYER"}</span><h2>Thien Huynh</h2><p><Icon name="map-pin" size={14} /> Ho Chi Minh City</p></div><button onClick={() => act("Profile editing opened")}><Icon name="pencil" size={16} /></button></section><div className="profile-tags"><span>Intermediate</span><span>Balanced player</span><span>Evening games</span></div><div className="profile-stats"><div><b>12</b><span>Matches</span></div><div><b>66.7%</b><span>Win rate</span></div><div><b>3</b><span>Groups</span></div></div><SectionTitle eyebrow="PLAYING STYLE" title="How you play" /><div className="style-card"><div><Icon name="zap" /><span><b>Quick at the kitchen</b><small>Prefers controlled placement and fast exchanges.</small></span></div><div><Icon name="clock-3" /><span><b>Best availability</b><small>Tuesday & Thursday · 6–8 PM</small></span></div></div><SectionTitle eyebrow="MY COMMUNITY" title="Groups & achievements" /><div className="group-row"><span>US</span><div><b>University Social Club</b><small>42 players · Weekly games</small></div><Icon name="chevron-right" /></div><div className="badge-row"><div><Icon name="flame" /><b>3-Week Streak</b></div><div><Icon name="handshake" /><b>Community Builder</b></div><div><Icon name="trophy" /><b>Rally 50</b></div></div><button className="primary wide tall" onClick={() => go(mode === "membership" ? "progress" : "membership")}>{mode === "membership" ? "View My Progress" : "Explore Membership"}</button></>;
}

function MembershipPage({ mode, go, act }: { mode: Mode; go: (p: Page) => void; act: (s: string) => void }) {
  const rows = [["Player directory","Smart Match Suggestions"],["Public activities","Organised & competitive games"],["Event alerts","Ladders & selected discounts"],["Basic progress","Structured progress tracking"],["Coach discovery","Dedicated Coach Calendar"]];
  return <><div className="membership-hero"><div className="crown"><Icon name="crown" /></div><span>{mode === "membership" ? "MEMBERSHIP ACTIVE" : "STRUCTURED PLAY. STRONGER COMMUNITY."}</span><h2>PICK! Membership</h2><p><b>VND 399,000</b> / month</p></div><div className="ecosystem"><div><span>1</span><b>Free App</b><small>Discover & connect</small></div><Icon name="arrow-right" /><div><span>2</span><b>Membership</b><small>Play more deeply</small></div><Icon name="arrow-right" /><div><span>3</span><b>Community</b><small>Return & grow</small></div></div>{mode === "free" ? <><SectionTitle eyebrow="DEFINITIVE COMPARISON" title="Free discovery. Structured membership." /><div className="comparison"><div className="compare-head"><b>Free App</b><b>Membership</b></div>{rows.map(x => <div key={x[0]}><span><Icon name="check" size={14} />{x[0]}</span><strong><Icon name="crown" size={14} />{x[1]}</strong></div>)}</div><div className="payment-rules"><b>Always paid separately</b><p>Court hire · Coaching lessons · Food & drinks</p><small>No free court hours, priority booking or general free event entry.</small></div><button className="primary wide tall" onClick={() => act("Membership upgrade demo opened")}>Explore Membership Upgrade</button><p className="fineprint">Demo only — no payment will be processed.</p></> : <><div className="active-plan"><Icon name="badge-check" /><div><b>Your membership is active</b><p>Structured opportunities are ready to explore. Court and coaching fees remain separate.</p></div></div><SectionTitle eyebrow="MEMBER EXPERIENCES" title="Your engaged playing core" /><div className="shortcut-list"><AppCard icon="users" title="Smart Match Suggestions" text="Skill & schedule factors" onClick={() => go("partner")} /><AppCard icon="calendar-days" title="Coach Calendar" text="Manage separately paid lessons" onClick={() => go("coaching")} /><AppCard icon="trophy" title="Playing Ladders" text="Competitive recurring play" onClick={() => go("events")} /><AppCard icon="chart-no-axes-combined" title="Player Progress" text="Structured tracking" onClick={() => go("progress")} /></div><div className="payment-rules"><b>Two facilitated community games/month</b><p>Organised experience; participants share and pay court fees separately.</p></div></>}</>;
}
