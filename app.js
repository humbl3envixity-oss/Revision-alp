/* ==========================================================================
   REVISE — a Year 11 GCSE revision app (offline-first PWA)
   All data lives in localStorage on this device. Nothing leaves the phone.
   ========================================================================== */

const STORAGE_KEY = "revise.v1";
const uid = () => Math.random().toString(36).slice(2, 10);
const todayStr = () => new Date().toISOString().slice(0, 10);

/* --------------------------------------------------------------------------
   DEFAULT GCSE CATALOG
   Subject -> Topic -> Subtopics. Editable in-app; this is just a starting point.
-------------------------------------------------------------------------- */
const DEFAULT_CATALOG = [
  { name: "Maths", topics: [
    { name: "Algebra", subtopics: ["Quadratic equations", "Simultaneous equations", "Factorising", "Expanding brackets"] },
    { name: "Geometry", subtopics: ["Angles", "Pythagoras", "Trigonometry", "Circle theorems"] },
    { name: "Probability", subtopics: ["Tree diagrams", "Venn diagrams", "Combined events"] },
    { name: "Statistics", subtopics: ["Averages", "Cumulative frequency", "Box plots"] },
    { name: "Number", subtopics: ["Standard form", "Surds", "Fractions & percentages"] },
  ]},
  { name: "English Language", topics: [
    { name: "Fiction reading", subtopics: ["Language analysis", "Structure analysis"] },
    { name: "Non-fiction reading", subtopics: ["Comparing viewpoints", "Evaluating writers' methods"] },
    { name: "Creative writing", subtopics: ["Descriptive writing", "Narrative writing"] },
    { name: "Transactional writing", subtopics: ["Letters", "Articles", "Speeches"] },
  ]},
  { name: "English Literature", topics: [
    { name: "Macbeth", subtopics: ["Themes", "Characters", "Context"] },
    { name: "An Inspector Calls", subtopics: ["Themes", "Characters", "Context"] },
    { name: "Poetry anthology", subtopics: ["Power and conflict", "Comparing poems"] },
  ]},
  { name: "Biology", topics: [
    { name: "Cell structure", subtopics: ["Animal & plant cells", "Specialised cells", "Microscopy"] },
    { name: "Infection and response", subtopics: ["Pathogens", "Vaccination", "Antibiotics"] },
    { name: "Bioenergetics", subtopics: ["Photosynthesis", "Respiration"] },
    { name: "Homeostasis", subtopics: ["Nervous system", "Hormones", "The kidney"] },
  ]},
  { name: "Chemistry", topics: [
    { name: "Atomic structure", subtopics: ["Structure of the atom", "The periodic table", "Isotopes"] },
    { name: "Bonding", subtopics: ["Ionic bonding", "Covalent bonding", "Metallic bonding"] },
    { name: "Chemical reactions", subtopics: ["Rates of reaction", "Energy changes"] },
    { name: "Quantitative chemistry", subtopics: ["Moles", "Conservation of mass"] },
  ]},
  { name: "Physics", topics: [
    { name: "Energy", subtopics: ["Energy stores", "Conservation of energy", "Efficiency"] },
    { name: "Forces", subtopics: ["Motion", "Newton's laws", "Momentum"] },
    { name: "Waves", subtopics: ["Wave properties", "Electromagnetic spectrum"] },
    { name: "Electricity", subtopics: ["Circuits", "Resistance", "Power"] },
  ]},
  { name: "Combined Science", topics: [
    { name: "Cell biology", subtopics: ["Cell structure", "Cell division"] },
    { name: "Chemical changes", subtopics: ["Reactivity series", "Electrolysis"] },
    { name: "Energy", subtopics: ["Energy transfers", "Efficiency"] },
  ]},
  { name: "History", topics: [
    { name: "Cold War", subtopics: ["Origins", "Key crises"] },
    { name: "Medicine through time", subtopics: ["Medieval", "Industrial", "Modern"] },
  ]},
  { name: "Geography", topics: [
    { name: "Natural hazards", subtopics: ["Tectonic hazards", "Weather hazards", "Climate change"] },
    { name: "Urban issues", subtopics: ["Urbanisation", "UK case study"] },
  ]},
  { name: "Computer Science", topics: [
    { name: "Algorithms", subtopics: ["Searching", "Sorting", "Flowcharts"] },
    { name: "Programming fundamentals", subtopics: ["Sequence", "Selection", "Iteration"] },
    { name: "Data representation", subtopics: ["Binary", "Hexadecimal", "Images & sound"] },
  ]},
  { name: "French", topics: [
    { name: "Identity and culture", subtopics: ["Family", "Free time"] },
    { name: "Grammar", subtopics: ["Tenses", "Verb conjugation"] },
  ]},
  { name: "Spanish", topics: [
    { name: "Identity and culture", subtopics: ["Family", "Free time"] },
    { name: "Grammar", subtopics: ["Tenses", "Verb conjugation"] },
  ]},
  { name: "Religious Studies", topics: [
    { name: "Beliefs and teachings", subtopics: ["Christianity", "Islam"] },
    { name: "Themes", subtopics: ["Peace and conflict", "Crime and punishment"] },
  ]},
];

/* --------------------------------------------------------------------------
   SAMPLE QUIZ BANK — keyed by "SubjectName::TopicName"
   Included so the app is useful immediately. More can be added by editing
   this object; a "Generate Quiz" AI feature can slot in here later.
-------------------------------------------------------------------------- */
const QUIZ_BANK = {
  "Maths::Algebra": [
    { type: "mcq", q: "Solve: x² − 5x + 6 = 0", options: ["x = 2, 3", "x = -2, -3", "x = 1, 6", "x = 2, -3"], answer: 0, explain: "Factorises to (x−2)(x−3)=0, so x=2 or x=3." },
    { type: "mcq", q: "Expand: (x + 3)(x − 2)", options: ["x² + x − 6", "x² − x − 6", "x² + 5x − 6", "x² − 6"], answer: 0, explain: "x²−2x+3x−6 = x²+x−6." },
    { type: "tf", q: "Simultaneous equations always have exactly one solution.", answer: false, explain: "They can have one, none, or infinitely many solutions depending on the lines." },
    { type: "fill", q: "Factorise: x² + 7x + 12 = (x + __)(x + __)", answer: ["3", "4"], explain: "3 × 4 = 12 and 3 + 4 = 7." },
    { type: "mcq", q: "What is the discriminant used for?", options: ["Finding the number of real roots", "Finding the y-intercept", "Finding the gradient", "Finding the turning point"], answer: 0, explain: "b²−4ac tells you how many real solutions a quadratic has." },
  ],
  "Biology::Cell structure": [
    { type: "mcq", q: "Which organelle controls the cell's activities?", options: ["Nucleus", "Mitochondria", "Ribosome", "Cytoplasm"], answer: 0, explain: "The nucleus contains DNA and controls the cell." },
    { type: "tf", q: "Plant cells have a cell wall but animal cells do not.", answer: true, explain: "The cell wall (made of cellulose) is unique to plant cells." },
    { type: "mcq", q: "Where does aerobic respiration mainly take place?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Vacuole"], answer: 0, explain: "Mitochondria are the site of aerobic respiration." },
    { type: "short", q: "Name one adaptation of a sperm cell for its function.", answer: ["tail", "flagellum", "mitochondria", "acrosome"], explain: "Accepted: tail/flagellum for movement, many mitochondria for energy, or an acrosome to digest the egg membrane." },
    { type: "fill", q: "A structure that carries out photosynthesis is called a __________.", answer: ["chloroplast"], explain: "Chloroplasts contain chlorophyll, which absorbs light for photosynthesis." },
  ],
  "Chemistry::Atomic structure": [
    { type: "mcq", q: "What has a relative charge of -1?", options: ["Electron", "Proton", "Neutron", "Nucleus"], answer: 0, explain: "Electrons are negatively charged; protons are +1, neutrons are neutral." },
    { type: "tf", q: "Isotopes of an element have the same number of protons but different numbers of neutrons.", answer: true, explain: "This changes the mass number but not the atomic number." },
    { type: "mcq", q: "Elements in the same group of the periodic table have the same...", options: ["Number of electrons in their outer shell", "Number of neutrons", "Atomic mass", "Number of shells"], answer: 0, explain: "This gives elements in a group similar chemical properties." },
    { type: "fill", q: "The atomic number tells you the number of __________ in an atom.", answer: ["protons"], explain: "Atomic number = number of protons (= electrons in a neutral atom)." },
  ],
  "Physics::Energy": [
    { type: "mcq", q: "What is the unit of energy?", options: ["Joule", "Newton", "Watt", "Volt"], answer: 0, explain: "Energy is measured in joules (J)." },
    { type: "tf", q: "Energy can be created as long as you have the right equipment.", answer: false, explain: "Energy cannot be created or destroyed, only transferred (conservation of energy)." },
    { type: "mcq", q: "GPE = m × g × h. What does 'h' stand for?", options: ["Height", "Heat", "Horizontal distance", "Half the mass"], answer: 0, explain: "Gravitational potential energy depends on height above a reference point." },
    { type: "short", q: "Give one way energy is 'wasted' in an inefficient machine.", answer: ["heat", "sound", "friction"], explain: "Commonly wasted as heat (often via friction) or sound." },
  ],
  "English Language::Fiction reading": [
    { type: "mcq", q: "Which technique describes giving human qualities to non-human things?", options: ["Personification", "Alliteration", "Simile", "Onomatopoeia"], answer: 0, explain: "Personification gives human traits to objects, animals, or ideas." },
    { type: "tf", q: "A simile always uses 'like' or 'as' to compare two things.", answer: true, explain: "That's what distinguishes a simile from a metaphor." },
    { type: "mcq", q: "Analysing how a text is structured means looking at...", options: ["What the writer focuses on and when, across the text", "Only the vocabulary used", "Only the punctuation", "The font and layout"], answer: 0, explain: "Structure includes narrative viewpoint shifts, time, focus, and pacing." },
  ],
};

/* --------------------------------------------------------------------------
   STORE — load / save / defaults
-------------------------------------------------------------------------- */
function loadStore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through to default */ }
  }
  return {
    setupDone: false,
    user: { name: "", dailyGoalMin: 30, weeklyGoalHrs: 5, theme: "light" },
    examBoards: {},       // keyed by subject.id -> board name, "" = not set yet
    subjects: [],
    sessions: [],
    quizAttempts: [],
    flashcards: [],       // {id, subjectId, topicId, front, back, interval, nextReview, lastReviewed}
    aiEndpoint: "",        // your deployed Cloudflare Worker URL — see README
    aiMessages: [],         // {role:'user'|'assistant', content}
    activeTimer: null,
  };
}
const BOARD_OPTIONS = ["AQA", "Edexcel", "OCR", "WJEC", "Eduqas"];
let STORE = loadStore();
// migrate older saved data that predates flashcards / per-subject exam boards
if (!STORE.flashcards) STORE.flashcards = [];
if (!STORE.examBoards) STORE.examBoards = {};
if (!STORE.aiEndpoint) STORE.aiEndpoint = "";
if (!STORE.aiMessages) STORE.aiMessages = [];
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(STORE)); }

function buildDefaultSubjects(selectedNames) {
  return DEFAULT_CATALOG
    .filter(s => selectedNames.includes(s.name))
    .map((s, i) => ({
      id: uid(),
      name: s.name,
      colorIdx: i % 8,
      topics: s.topics.map(t => ({
        id: uid(),
        name: t.name,
        subtopics: t.subtopics.map(st => ({ id: uid(), name: st })),
        confidence: 3,
      })),
    }));
}

/* --------------------------------------------------------------------------
   HELPERS — stats
-------------------------------------------------------------------------- */
function findSubject(id) { return STORE.subjects.find(s => s.id === id); }
function findTopic(subjectId, topicId) {
  const s = findSubject(subjectId);
  return s ? s.topics.find(t => t.id === topicId) : null;
}
function fmtMins(totalMin) {
  const h = Math.floor(totalMin / 60), m = Math.round(totalMin % 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
function fmtClock(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function isSameDay(iso, dayStr) { return iso.slice(0, 10) === dayStr; }
function startOfWeekStr() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Monday=0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}
function minutesToday() {
  const t = todayStr();
  return STORE.sessions.filter(s => isSameDay(s.start, t)).reduce((a, s) => a + s.durationSec / 60, 0);
}
function minutesThisWeek() {
  const wk = startOfWeekStr();
  return STORE.sessions.filter(s => s.start.slice(0, 10) >= wk).reduce((a, s) => a + s.durationSec / 60, 0);
}
function currentStreak() {
  const days = new Set(STORE.sessions.map(s => s.start.slice(0, 10)));
  let streak = 0;
  let d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}
function avgQuizScore() {
  if (STORE.quizAttempts.length === 0) return null;
  const pct = STORE.quizAttempts.reduce((a, q) => a + q.score / q.total, 0) / STORE.quizAttempts.length;
  return Math.round(pct * 100);
}
function topicsNeedingRevision() {
  // Weak confidence, or flagged "needs again", or not revised in 7+ days
  const out = [];
  STORE.subjects.forEach(sub => {
    sub.topics.forEach(top => {
      const sessions = STORE.sessions.filter(s => s.topicId === top.id).sort((a, b) => b.start.localeCompare(a.start));
      const last = sessions[0];
      const daysSince = last ? Math.floor((Date.now() - new Date(last.start)) / 86400000) : null;
      const weak = top.confidence <= 2 || (last && last.needsAgain);
      const stale = daysSince !== null && daysSince >= 7;
      const never = !last;
      if (weak || stale) {
        out.push({ subject: sub, topic: top, reason: weak ? "weak" : "stale", daysSince });
      }
    });
  });
  out.sort((a, b) => (a.reason === "weak" ? 0 : 1) - (b.reason === "weak" ? 0 : 1));
  return out;
}
function subjectMinutes(subjectId) {
  return STORE.sessions.filter(s => s.subjectId === subjectId).reduce((a, s) => a + s.durationSec / 60, 0);
}

/* --------------------------------------------------------------------------
   ROUTER
-------------------------------------------------------------------------- */
let CURRENT_VIEW = "home";
let QUIZ = null;      // in-progress quiz state
let TIMER_TICK = null;

function setView(name) {
  CURRENT_VIEW = name;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.view === name));
  render();
}

function render() {
  const el = document.getElementById("views");
  if (!el) return;
  if (CURRENT_VIEW === "home") el.innerHTML = viewHome();
  else if (CURRENT_VIEW === "subjects") el.innerHTML = viewSubjects();
  else if (CURRENT_VIEW === "revise") el.innerHTML = viewRevise();
  else if (CURRENT_VIEW === "quizzes") el.innerHTML = viewQuizzes();
  else if (CURRENT_VIEW === "flashcards") el.innerHTML = viewFlashcards();
  else if (CURRENT_VIEW === "tutor") el.innerHTML = viewTutor();
  else if (CURRENT_VIEW === "progress") el.innerHTML = viewProgress();
  document.getElementById("greeting").textContent = STORE.user.name ? `Hi, ${STORE.user.name}` : "Hi there";
  document.getElementById("dateLine").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  if (CURRENT_VIEW === "tutor") {
    const scroller = document.getElementById("chatScroll");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }
}

/* --------------------------------------------------------------------------
   VIEW: HOME
-------------------------------------------------------------------------- */
function viewHome() {
  const streak = currentStreak();
  const today = minutesToday();
  const week = minutesThisWeek();
  const avg = avgQuizScore();
  const needs = topicsNeedingRevision().slice(0, 4);
  const recent = [...STORE.sessions].sort((a, b) => b.start.localeCompare(a.start)).slice(0, 5);

  return `
    <div class="streak-card">
      <div class="streak-ring">${streak}</div>
      <div class="streak-text">
        <b>${streak === 0 ? "Start your streak today" : streak + "-day streak"}</b>
        <span>${STORE.user.dailyGoalMin}m daily goal &middot; ${STORE.user.weeklyGoalHrs}h weekly goal</span>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-box"><div class="num">${fmtMins(today)}</div><div class="lbl">Today</div></div>
      <div class="stat-box"><div class="num">${fmtMins(week)}</div><div class="lbl">This week</div></div>
      <div class="stat-box"><div class="num">${avg === null ? "—" : avg + "%"}</div><div class="lbl">Avg quiz score</div></div>
    </div>

    <div class="quick-grid">
      <button class="quick-btn" data-action="goto" data-view="revise"><span class="qi">⏱</span>Start Revision</button>
      <button class="quick-btn" data-action="goto" data-view="quizzes"><span class="qi">📝</span>Take a Quiz</button>
      <button class="quick-btn" data-action="goto" data-view="tutor"><span class="qi">💬</span>AI Tutor</button>
      <button class="quick-btn" data-action="goto" data-view="subjects"><span class="qi">📚</span>Subjects</button>
      <button class="quick-btn" data-action="goto" data-view="progress"><span class="qi">📊</span>Progress</button>
    </div>

    <div class="section-title">Needs revision</div>
    <div class="card">
      ${needs.length === 0 ? `<div class="empty-state">Nothing urgent — nice work.</div>` :
        needs.map(n => `
          <div class="topic-row">
            <div>
              <div class="topic-name">${n.topic.name}</div>
              <div class="topic-sub">${n.subject.name}</div>
            </div>
            <span class="pill ${n.reason === 'weak' ? 'weak' : 'due'}">${n.reason === 'weak' ? 'Weak' : (n.daysSince + 'd ago')}</span>
          </div>`).join("")}
    </div>

    <div class="section-title">Recent sessions</div>
    <div class="card">
      ${recent.length === 0 ? `<div class="empty-state">No sessions logged yet. Hit "Start Revision" to begin.</div>` :
        recent.map(s => {
          const sub = findSubject(s.subjectId);
          const top = sub ? findTopic(sub.id, s.topicId) : null;
          return `<div class="session-row sc-${sub ? sub.colorIdx : 0}">
            <span class="session-dot"></span>
            <div>
              <div class="topic-name">${top ? top.name : "Topic"}</div>
              <div class="topic-sub">${sub ? sub.name : ""}</div>
            </div>
            <span class="session-time">${fmtMins(s.durationSec / 60)}</span>
          </div>`;
        }).join("")}
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW: SUBJECTS
-------------------------------------------------------------------------- */
function viewSubjects() {
  const owned = STORE.subjects.map(s => s.name);
  const available = DEFAULT_CATALOG.filter(s => !owned.includes(s.name));
  return `
    <div class="section-title">Your subjects</div>
    ${STORE.subjects.length === 0 ? `<div class="card"><div class="empty-state">No subjects yet — add one below.</div></div>` : ""}
    ${STORE.subjects.map(s => `
      <div class="subject-card sc-${s.colorIdx}">
        <div class="subject-card-top">
          <div>
            <h3>${s.name}</h3>
            <div class="subject-meta">${s.topics.length} topic${s.topics.length === 1 ? "" : "s"} &middot; ${fmtMins(subjectMinutes(s.id))} revised</div>
          </div>
          <button class="icon-btn" data-action="remove-subject" data-id="${s.id}" aria-label="Remove">✕</button>
        </div>
        <div style="margin-top:8px;">
          ${STORE.examBoards[s.id] ?
            `<button class="board-pill" data-action="edit-board" data-subject="${s.id}">${STORE.examBoards[s.id]} &middot; edit</button>` :
            `<button class="board-pill" style="background:var(--paper);color:var(--ink-soft);border:1px dashed var(--line);" data-action="edit-board" data-subject="${s.id}">+ Set exam board</button>`}
        </div>
        <div class="topic-chip-row">
          ${s.topics.map(t => `<span class="topic-chip ${t.confidence <= 2 ? 'weak' : ''}">${t.name}</span>`).join("")}
          <button class="topic-chip" data-action="add-topic" data-subject="${s.id}" style="border-style:dashed;">+ Topic</button>
        </div>
      </div>
    `).join("")}

    <div class="section-title">Add a subject</div>
    <div class="card">
      <div class="chip-grid">
        ${available.map(s => `<button class="chip" data-action="add-subject" data-name="${s.name}">${s.name}</button>`).join("")}
        <button class="chip" data-action="add-custom-subject" style="border-style:dashed;">+ Custom subject</button>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW: REVISE
-------------------------------------------------------------------------- */
function viewRevise() {
  if (STORE.activeTimer) return viewReviseTimer();

  if (STORE.subjects.length === 0) {
    return `<div class="card"><div class="empty-state">Add a subject first so you have something to revise.</div>
      <button class="btn-primary" data-action="goto" data-view="subjects">Go to Subjects</button></div>`;
  }

  const s0 = STORE.subjects[0];
  return `
    <div class="section-title">Start a session</div>
    <div class="card">
      <label class="field-label">Subject</label>
      <select class="input-lg" id="reviseSubject">
        ${STORE.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join("")}
      </select>
      <label class="field-label">Topic</label>
      <select class="input-lg" id="reviseTopic">
        ${s0.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join("")}
      </select>
      <label class="field-label">Goal (optional)</label>
      <input class="input-lg" id="reviseGoal" placeholder="e.g. Finish 10 practice questions">
      <button class="btn-primary" data-action="start-timer">Start timer</button>
      <button class="btn-secondary" data-action="log-manual">Log a past session instead</button>
    </div>
  `;
}

function viewReviseTimer() {
  const t = STORE.activeTimer;
  const sub = findSubject(t.subjectId);
  const top = sub ? findTopic(sub.id, t.topicId) : null;
  const elapsed = Math.floor((Date.now() - t.startedAt + (t.accumSec * 1000)) / 1000);
  return `
    <div class="card">
      <div class="timer-display">
        <div class="t" id="timerClock">${fmtClock(elapsed)}</div>
        <div class="ctx">${sub ? sub.name : ""} &middot; ${top ? top.name : ""}</div>
        ${t.goal ? `<div class="ctx">Goal: ${t.goal}</div>` : ""}
      </div>
      <div class="timer-controls">
        <button class="btn-secondary" data-action="${t.paused ? 'resume-timer' : 'pause-timer'}">${t.paused ? "Resume" : "Pause"}</button>
        <button class="btn-primary" data-action="finish-timer">Finish</button>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW: QUIZZES
-------------------------------------------------------------------------- */
function viewQuizzes() {
  if (QUIZ && QUIZ.finished) return viewQuizResults();
  if (QUIZ) return viewQuizPlay();

  if (STORE.subjects.length === 0) {
    return `<div class="card"><div class="empty-state">Add a subject first to unlock quizzes.</div>
      <button class="btn-primary" data-action="goto" data-view="subjects">Go to Subjects</button></div>`;
  }
  const s0 = STORE.subjects[0];
  const recent = [...STORE.quizAttempts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return `
    <div class="section-title">Set up a quiz</div>
    <div class="card">
      <label class="field-label">Subject</label>
      <select class="input-lg" id="quizSubject">
        ${STORE.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join("")}
      </select>
      <label class="field-label">Topic</label>
      <select class="input-lg" id="quizTopic">
        ${s0.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join("")}
      </select>
      <label class="field-label">Number of questions</label>
      <input type="number" class="input-lg" id="quizCount" value="5" min="1" max="10">
      <button class="btn-primary" data-action="start-quiz">Start quiz</button>
      <p class="topic-sub" style="margin-top:10px;">Sample questions are preloaded for Maths (Algebra), Biology (Cell structure), Chemistry (Atomic structure), Physics (Energy), and English Language (Fiction reading). More topics can be added to the question bank any time.</p>
    </div>

    <div class="section-title">Recent results</div>
    <div class="card">
      ${recent.length === 0 ? `<div class="empty-state">No quizzes taken yet.</div>` :
        recent.map(q => {
          const sub = findSubject(q.subjectId);
          const top = sub ? findTopic(sub.id, q.topicId) : null;
          return `<div class="topic-row">
            <div><div class="topic-name">${top ? top.name : "Topic"}</div><div class="topic-sub">${sub ? sub.name : ""}</div></div>
            <span class="pill ${q.score / q.total >= 0.8 ? 'mastered' : q.score / q.total >= 0.5 ? 'due' : 'weak'}">${q.score}/${q.total}</span>
          </div>`;
        }).join("")}
    </div>
  `;
}

function viewQuizPlay() {
  const i = QUIZ.index;
  const q = QUIZ.questions[i];
  const pct = Math.round((i / QUIZ.questions.length) * 100);
  const answered = QUIZ.answers[i] !== undefined;

  let bodyHtml = "";
  if (q.type === "mcq") {
    bodyHtml = q.options.map((opt, idx) => {
      let cls = "quiz-option";
      if (answered) {
        if (idx === q.answer) cls += " correct";
        else if (idx === QUIZ.answers[i]) cls += " incorrect";
      }
      return `<button class="${cls}" ${answered ? "disabled" : ""} data-action="answer-mcq" data-idx="${idx}">${opt}</button>`;
    }).join("");
  } else if (q.type === "tf") {
    ["True", "False"].forEach((label, idx) => {
      const val = idx === 0;
      let cls = "quiz-option";
      if (answered) {
        if (val === q.answer) cls += " correct";
        else if (val === QUIZ.answers[i]) cls += " incorrect";
      }
      bodyHtml += `<button class="${cls}" ${answered ? "disabled" : ""} data-action="answer-tf" data-val="${val}">${label}</button>`;
    });
  } else if (q.type === "fill" || q.type === "short") {
    bodyHtml = `
      <input class="input-lg" id="freeAnswer" ${answered ? "disabled" : ""} placeholder="Type your answer" value="${answered ? (QUIZ.answers[i].text || "") : ""}">
      ${!answered ? `<button class="btn-primary" data-action="answer-free">Submit</button>` : ""}
    `;
  }

  return `
    <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
    <div class="card">
      <p class="topic-sub">Question ${i + 1} of ${QUIZ.questions.length}</p>
      <h3 style="margin:6px 0 14px;">${q.q}</h3>
      ${bodyHtml}
      ${answered ? `<div class="explain-box">${q.explain}</div>
        <button class="btn-primary" data-action="next-question">${i === QUIZ.questions.length - 1 ? "See results" : "Next question"}</button>` : ""}
    </div>
  `;
}

function viewQuizResults() {
  const total = QUIZ.questions.length;
  const score = QUIZ.score;
  const pct = Math.round((score / total) * 100);
  const wrongTopics = pct < 70 ? [findTopicNameByQuizContext()] : [];
  return `
    <div class="card score-ring-wrap">
      <div class="score-big">${score}/${total}</div>
      <div class="score-sub">${pct}% &middot; ${pct >= 80 ? "Strong result" : pct >= 50 ? "Solid — a bit more practice will help" : "Worth revisiting this topic"}</div>
    </div>
    <div class="section-title">Review</div>
    <div class="card">
      ${QUIZ.questions.map((q, idx) => `
        <div class="topic-row">
          <div class="topic-name" style="max-width:75%;">${q.q}</div>
          <span class="pill ${QUIZ.correct[idx] ? 'mastered' : 'weak'}">${QUIZ.correct[idx] ? "Correct" : "Missed"}</span>
        </div>
      `).join("")}
    </div>
    <button class="btn-primary" data-action="finish-quiz">Done</button>
  `;
}
function findTopicNameByQuizContext() {
  const sub = findSubject(QUIZ.subjectId);
  const top = sub ? findTopic(sub.id, QUIZ.topicId) : null;
  return top ? top.name : "";
}

/* --------------------------------------------------------------------------
   VIEW: PROGRESS
-------------------------------------------------------------------------- */
function viewProgress() {
  const totalMin = STORE.sessions.reduce((a, s) => a + s.durationSec / 60, 0);
  const streak = currentStreak();
  let longest = 0, run = 0;
  const days = [...new Set(STORE.sessions.map(s => s.start.slice(0, 10)))].sort();
  let prev = null;
  days.forEach(d => {
    if (prev && (new Date(d) - new Date(prev)) / 86400000 === 1) run++; else run = 1;
    longest = Math.max(longest, run);
    prev = d;
  });
  const maxSubMin = Math.max(1, ...STORE.subjects.map(s => subjectMinutes(s.id)));
  const weakTopics = topicsNeedingRevision().filter(t => t.reason === "weak").slice(0, 5);
  const strongTopics = STORE.subjects.flatMap(s => s.topics.map(t => ({ s, t })))
    .filter(x => x.t.confidence >= 4).slice(0, 5);

  return `
    <div class="stat-row">
      <div class="stat-box"><div class="num">${fmtMins(totalMin)}</div><div class="lbl">Total revised</div></div>
      <div class="stat-box"><div class="num">${streak}</div><div class="lbl">Current streak</div></div>
      <div class="stat-box"><div class="num">${longest}</div><div class="lbl">Longest streak</div></div>
    </div>

    <div class="section-title">Time per subject</div>
    <div class="card">
      ${STORE.subjects.length === 0 ? `<div class="empty-state">Add subjects to see this breakdown.</div>` :
        STORE.subjects.map(s => `
          <div class="bar-chart-row sc-${s.colorIdx}">
            <div class="bar-chart-label">${s.name}</div>
            <div class="bar-chart-track"><div class="bar-chart-fill" style="width:${(subjectMinutes(s.id) / maxSubMin) * 100}%"></div></div>
            <div class="bar-chart-value">${fmtMins(subjectMinutes(s.id))}</div>
          </div>
        `).join("")}
    </div>

    <div class="section-title">Weakest topics</div>
    <div class="card">
      ${weakTopics.length === 0 ? `<div class="empty-state">Nothing flagged as weak right now.</div>` :
        weakTopics.map(n => `<div class="topic-row"><div><div class="topic-name">${n.topic.name}</div><div class="topic-sub">${n.subject.name}</div></div><span class="pill weak">Weak</span></div>`).join("")}
    </div>

    <div class="section-title">Strongest topics</div>
    <div class="card">
      ${strongTopics.length === 0 ? `<div class="empty-state">Keep revising to build up mastered topics.</div>` :
        strongTopics.map(x => `<div class="topic-row"><div><div class="topic-name">${x.t.name}</div><div class="topic-sub">${x.s.name}</div></div><span class="pill mastered">Strong</span></div>`).join("")}
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW: AI TUTOR
-------------------------------------------------------------------------- */
const TUTOR_QUICK_PROMPTS = [
  { label: "Explain this", prompt: "Can you explain this topic to me in simple terms, step by step?" },
  { label: "Quiz me", prompt: "Ask me one question at a time on this topic, and mark my answers as I go." },
  { label: "Give me a hint", prompt: "Give me a hint for this topic without telling me the full answer." },
  { label: "Simplify it", prompt: "Can you explain that again, more simply?" },
  { label: "Give me an exam question", prompt: "Give me a realistic exam-style question on this topic." },
];

function viewTutor() {
  if (!STORE.aiEndpoint) {
    return `
      <div class="setup-banner">
        <b>Not connected yet.</b> The AI Tutor needs a backend URL to talk to Claude securely.
        Add yours in Settings → AI Assistant. See the README for the 5-minute Cloudflare Workers setup.
      </div>
      <button class="btn-primary" data-action="open-settings-shortcut">Open Settings</button>
    `;
  }

  const s0 = STORE.subjects[0];
  return `
    ${STORE.subjects.length > 0 ? `
      <div class="card" style="margin-bottom:14px;">
        <label class="field-label" style="margin-top:0;">Talking about</label>
        <div style="display:flex; gap:8px; margin-top:6px;">
          <select class="input-lg" id="tutorSubject" style="margin-top:0;">
            ${STORE.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join("")}
          </select>
          <select class="input-lg" id="tutorTopic" style="margin-top:0;">
            ${s0.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join("")}
          </select>
        </div>
      </div>` : ""}

    <div class="chat-quick-row">
      ${TUTOR_QUICK_PROMPTS.map(q => `<button data-action="tutor-quick" data-prompt="${q.prompt.replace(/"/g, '&quot;')}">${q.label}</button>`).join("")}
    </div>

    <div class="chat-scroll" id="chatScroll">
      ${STORE.aiMessages.length === 0 ? `<div class="empty-state">Ask me to explain a topic, quiz you, or help you plan revision.</div>` :
        STORE.aiMessages.map(m => `<div class="chat-bubble ${m.role}">${escapeHtml(m.content)}</div>`).join("")}
      ${AI_LOADING ? `<div class="chat-bubble thinking">Thinking…</div>` : ""}
    </div>

    <div class="chat-input-row">
      <textarea id="chatInput" rows="1" placeholder="Ask anything about your revision…"></textarea>
      <button class="chat-send-btn" data-action="send-chat" aria-label="Send">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="m2 21 21-9L2 3v7l15 2-15 2z"/></svg>
      </button>
    </div>
  `;
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML.replace(/\n/g, "<br>");
}

let AI_LOADING = false;

async function sendChatMessage(text) {
  if (!text || !text.trim() || AI_LOADING) return;
  const subjectSel = document.getElementById("tutorSubject");
  const topicSel = document.getElementById("tutorTopic");
  let contextLine = "";
  if (subjectSel && topicSel) {
    const sub = findSubject(subjectSel.value);
    const top = sub ? findTopic(sub.id, topicSel.value) : null;
    const board = sub ? STORE.examBoards[sub.id] : "";
    if (sub && top) contextLine = `The student is currently revising "${top.name}" in ${sub.name}${board ? ` (${board} exam board)` : ""}.`;
  }

  STORE.aiMessages.push({ role: "user", content: text.trim() });
  save();
  AI_LOADING = true;
  render();

  const system = `You are a friendly, encouraging Year 11 GCSE revision tutor talking to a student inside their personal revision app. ${contextLine} Explain things clearly and simply, use short paragraphs suited to a phone screen, and use the Socratic method when testing the student — ask questions and give hints rather than immediately revealing answers, unless they ask you directly for the answer. If you are not confident an exam-board-specific detail is accurate, say so clearly and suggest the student check their specification. Never claim an answer is correct if you are unsure.`;

  const apiMessages = STORE.aiMessages.map(m => ({ role: m.role, content: m.content }));

  try {
    const res = await fetch(STORE.aiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages, system }),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || "Request failed");
    STORE.aiMessages.push({ role: "assistant", content: data.text || "(No response)" });
  } catch (err) {
    STORE.aiMessages.push({ role: "assistant", content: "Couldn't reach the AI assistant. Check your internet connection and that the endpoint URL in Settings is correct." });
  }
  AI_LOADING = false;
  save();
  render();
}

/* --------------------------------------------------------------------------
   VIEW: FLASHCARDS
-------------------------------------------------------------------------- */
let STUDY = null; // in-progress flashcard study session

function viewFlashcards() {
  if (STUDY && STUDY.finished) return viewStudyResults();
  if (STUDY) return viewStudyPlay();

  if (STORE.subjects.length === 0) {
    return `<div class="card"><div class="empty-state">Add a subject first to create flashcards.</div>
      <button class="btn-primary" data-action="goto" data-view="subjects">Go to Subjects</button></div>`;
  }

  const today = todayStr();
  const due = STORE.flashcards.filter(c => !c.nextReview || c.nextReview <= today);

  return `
    <div class="due-card">
      <div>
        <div class="num">${due.length}</div>
        <div class="lbl">card${due.length === 1 ? "" : "s"} due today</div>
      </div>
      <button class="btn-primary" style="width:auto;margin-top:0;padding:13px 20px;" data-action="start-study" ${STORE.flashcards.length === 0 ? "disabled" : ""}>Study now</button>
    </div>

    <div class="section-title">Your cards<a href="#" data-action="add-flashcard">+ New card</a></div>
    <div class="card">
      ${STORE.flashcards.length === 0 ? `<div class="empty-state">No flashcards yet — add your first one above.</div>` :
        STORE.subjects.map(s => {
          const cards = STORE.flashcards.filter(c => c.subjectId === s.id);
          if (cards.length === 0) return "";
          return `<p class="topic-sub" style="font-weight:700;margin:14px 0 4px;">${s.name}</p>` +
            cards.map(c => `
              <div class="card-list-row">
                <div>
                  <div class="card-list-front">${c.front}</div>
                  <div class="card-list-sub">${c.nextReview && c.nextReview > today ? "Next review " + c.nextReview : "Due now"}</div>
                </div>
                <div class="card-list-actions">
                  <button data-action="edit-flashcard" data-id="${c.id}">✎</button>
                  <button data-action="delete-flashcard" data-id="${c.id}">🗑</button>
                </div>
              </div>
            `).join("");
        }).join("")}
    </div>
  `;
}

function viewStudyPlay() {
  const card = STUDY.cards[STUDY.index];
  const sub = findSubject(card.subjectId);
  return `
    <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${(STUDY.index / STUDY.cards.length) * 100}%"></div></div>
    <p class="topic-sub">Card ${STUDY.index + 1} of ${STUDY.cards.length}${sub ? " · " + sub.name : ""}</p>
    <div class="flip-card">${STUDY.revealed ? card.back : card.front}</div>
    ${!STUDY.revealed ?
      `<div class="flip-hint">Tap to reveal the answer</div>
       <button class="btn-primary" data-action="show-answer">Show answer</button>` :
      `<div class="grade-row">
        <button class="grade-btn grade-again" data-action="grade-card" data-rating="again">Again</button>
        <button class="grade-btn grade-hard" data-action="grade-card" data-rating="hard">Hard</button>
        <button class="grade-btn grade-good" data-action="grade-card" data-rating="good">Good</button>
        <button class="grade-btn grade-easy" data-action="grade-card" data-rating="easy">Easy</button>
      </div>`}
  `;
}

function viewStudyResults() {
  return `
    <div class="card score-ring-wrap">
      <div class="score-big">${STUDY.reviewedCount}</div>
      <div class="score-sub">card${STUDY.reviewedCount === 1 ? "" : "s"} reviewed</div>
    </div>
    <button class="btn-primary" data-action="finish-study">Done</button>
  `;
}

function startFlashcardStudy(subjectId) {
  const today = todayStr();
  let pool = subjectId ? STORE.flashcards.filter(c => c.subjectId === subjectId) : STORE.flashcards.slice();
  let due = pool.filter(c => !c.nextReview || c.nextReview <= today);
  if (due.length === 0) due = pool; // nothing due — offer to review anyway
  if (due.length === 0) return;
  STUDY = { cards: [...due].sort(() => Math.random() - 0.5), index: 0, revealed: false, finished: false, reviewedCount: 0 };
  setView("flashcards");
}

function gradeCard(card, rating) {
  let interval = card.interval || 1;
  if (rating === "again") interval = 1;
  else if (rating === "hard") interval = Math.max(1, Math.round(interval * 1.2));
  else if (rating === "good") interval = Math.max(1, Math.round(interval * 2.5));
  else if (rating === "easy") interval = Math.max(1, Math.round(interval * 4));
  card.interval = interval;
  const next = new Date();
  next.setDate(next.getDate() + (rating === "again" ? 0 : interval));
  card.nextReview = next.toISOString().slice(0, 10);
  card.lastReviewed = new Date().toISOString();
}

function flashcardAnswer(rating) {
  const card = STUDY.cards[STUDY.index];
  gradeCard(card, rating);
  STUDY.reviewedCount++;
  if (rating === "again") STUDY.cards.push(card); // resurface later this session
  STUDY.index++;
  STUDY.revealed = false;
  save();
  if (STUDY.index >= STUDY.cards.length) STUDY.finished = true;
  render();
}

function openFlashcardModal(cardId) {
  const editing = cardId ? STORE.flashcards.find(c => c.id === cardId) : null;
  const s0 = editing ? findSubject(editing.subjectId) : STORE.subjects[0];
  openModal(`
    <h2 style="margin-top:0;">${editing ? "Edit flashcard" : "New flashcard"}</h2>
    <label class="field-label">Subject</label>
    <select class="input-lg" id="fcSubject">
      ${STORE.subjects.map(s => `<option value="${s.id}" ${editing && editing.subjectId === s.id ? "selected" : ""}>${s.name}</option>`).join("")}
    </select>
    <label class="field-label">Topic (optional)</label>
    <select class="input-lg" id="fcTopic">
      <option value="">No specific topic</option>
      ${s0.topics.map(t => `<option value="${t.id}" ${editing && editing.topicId === t.id ? "selected" : ""}>${t.name}</option>`).join("")}
    </select>
    <label class="field-label">Front</label>
    <textarea class="input-lg" id="fcFront" rows="2">${editing ? editing.front : ""}</textarea>
    <label class="field-label">Back</label>
    <textarea class="input-lg" id="fcBack" rows="2">${editing ? editing.back : ""}</textarea>
    <button class="btn-primary" id="fcSaveBtn">${editing ? "Save changes" : "Add card"}</button>
  `);
  document.getElementById("fcSubject").addEventListener("change", (e) => {
    const s = findSubject(e.target.value);
    document.getElementById("fcTopic").innerHTML = `<option value="">No specific topic</option>` +
      s.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
  });
  document.getElementById("fcSaveBtn").addEventListener("click", () => {
    const front = document.getElementById("fcFront").value.trim();
    const back = document.getElementById("fcBack").value.trim();
    if (!front || !back) return;
    const subjectId = document.getElementById("fcSubject").value;
    const topicId = document.getElementById("fcTopic").value || null;
    if (editing) {
      editing.front = front; editing.back = back; editing.subjectId = subjectId; editing.topicId = topicId;
    } else {
      STORE.flashcards.push({ id: uid(), subjectId, topicId, front, back, interval: 1, nextReview: todayStr(), lastReviewed: null });
    }
    save(); closeModal(); render();
  });
}

/* --------------------------------------------------------------------------
   MODAL HELPERS
-------------------------------------------------------------------------- */
function openModal(html) {
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal() { document.getElementById("modal").classList.add("hidden"); }

/* --------------------------------------------------------------------------
   SETTINGS
-------------------------------------------------------------------------- */
function renderSettings() {
  document.getElementById("settingsBody").innerHTML = `
    <div class="setting-row">
      <label>Name</label>
      <input class="input-lg" id="setName" value="${STORE.user.name}">
    </div>
    <div class="setting-row">
      <label>Theme</label>
      <div class="chip-grid">
        <button class="chip ${STORE.user.theme === 'light' ? 'selected' : ''}" data-action="set-theme" data-val="light">Light</button>
        <button class="chip ${STORE.user.theme === 'dark' ? 'selected' : ''}" data-action="set-theme" data-val="dark">Dark</button>
      </div>
    </div>
    <div class="setting-row">
      <label>Daily goal (minutes)</label>
      <input type="number" class="input-lg" id="setDaily" value="${STORE.user.dailyGoalMin}">
    </div>
    <div class="setting-row">
      <label>Weekly goal (hours)</label>
      <input type="number" class="input-lg" id="setWeekly" value="${STORE.user.weeklyGoalHrs}">
    </div>
    <div class="setting-row">
      <label>AI Assistant</label>
      <p class="topic-sub" style="margin:0 0 6px;">Paste your Cloudflare Worker URL here — see the README for setup. Never paste your Anthropic API key anywhere in this app.</p>
      <input class="input-lg" id="setAiEndpoint" placeholder="https://your-worker.workers.dev" value="${STORE.aiEndpoint}">
    </div>
    <button class="btn-primary" data-action="save-settings">Save changes</button>
    <div class="setting-row">
      <label>Your data</label>
      <button class="btn-secondary" data-action="export-data">Export data (.json)</button>
      <label class="btn-secondary" style="display:block;text-align:center;cursor:pointer;">
        Import data (.json)
        <input type="file" accept="application/json" id="importFile" style="display:none;">
      </label>
    </div>
    <div class="setting-row">
      <button class="btn-secondary btn-danger" data-action="reset-data">Reset all data</button>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   TIMER LOGIC
-------------------------------------------------------------------------- */
function tickTimer() {
  if (!STORE.activeTimer || STORE.activeTimer.paused) return;
  const el = document.getElementById("timerClock");
  if (!el) return;
  const t = STORE.activeTimer;
  const elapsed = Math.floor((Date.now() - t.startedAt) / 1000) + t.accumSec;
  el.textContent = fmtClock(elapsed);
}

function startTimer() {
  const subjectId = document.getElementById("reviseSubject").value;
  const topicId = document.getElementById("reviseTopic").value;
  const goal = document.getElementById("reviseGoal").value.trim();
  STORE.activeTimer = { subjectId, topicId, goal, startedAt: Date.now(), accumSec: 0, paused: false };
  save(); render();
  if (TIMER_TICK) clearInterval(TIMER_TICK);
  TIMER_TICK = setInterval(tickTimer, 1000);
}
function pauseTimer() {
  const t = STORE.activeTimer;
  t.accumSec += Math.floor((Date.now() - t.startedAt) / 1000);
  t.paused = true;
  save(); render();
}
function resumeTimer() {
  const t = STORE.activeTimer;
  t.startedAt = Date.now();
  t.paused = false;
  save(); render();
}
function finishTimer() {
  const t = STORE.activeTimer;
  const totalSec = t.paused ? t.accumSec : t.accumSec + Math.floor((Date.now() - t.startedAt) / 1000);
  if (TIMER_TICK) clearInterval(TIMER_TICK);
  openModal(`
    <h2 style="margin-top:0;">How did that go?</h2>
    <p class="topic-sub">${fmtClock(totalSec)} revised</p>
    <label class="field-label">How confident do you feel about this topic?</label>
    <div class="confidence-row">
      ${[1,2,3,4,5].map(n => `<button class="conf-btn" data-conf="${n}">${n}</button>`).join("")}
    </div>
    <label class="field-label">What did you revise? (optional)</label>
    <textarea class="input-lg" id="sessionNotes" rows="3"></textarea>
    <label class="field-label"><input type="checkbox" id="needsAgain"> I need to revise this again soon</label>
    <button class="btn-primary" id="saveSessionBtn">Save session</button>
  `);

  let chosenConf = 3;
  document.querySelectorAll(".conf-btn").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".conf-btn").forEach(x => x.classList.remove("selected"));
    b.classList.add("selected");
    chosenConf = Number(b.dataset.conf);
  }));

  document.getElementById("saveSessionBtn").addEventListener("click", () => {
    const notes = document.getElementById("sessionNotes").value.trim();
    const needsAgain = document.getElementById("needsAgain").checked;
    const startIso = new Date(Date.now() - totalSec * 1000).toISOString();
    STORE.sessions.push({
      id: uid(), subjectId: t.subjectId, topicId: t.topicId, goal: t.goal,
      start: startIso, durationSec: totalSec, confidence: chosenConf, notes, needsAgain,
    });
    const topic = findTopic(t.subjectId, t.topicId);
    if (topic) topic.confidence = chosenConf;
    STORE.activeTimer = null;
    save(); closeModal(); setView("home");
  });
}

function openManualLog() {
  if (STORE.subjects.length === 0) return;
  const s0 = STORE.subjects[0];
  openModal(`
    <h2 style="margin-top:0;">Log a past session</h2>
    <label class="field-label">Subject</label>
    <select class="input-lg" id="manSubject">${STORE.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join("")}</select>
    <label class="field-label">Topic</label>
    <select class="input-lg" id="manTopic">${s0.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join("")}</select>
    <label class="field-label">Duration (minutes)</label>
    <input type="number" class="input-lg" id="manMins" value="30" min="1">
    <button class="btn-primary" id="manSaveBtn">Save session</button>
  `);
  document.getElementById("manSubject").addEventListener("change", (e) => {
    const s = findSubject(e.target.value);
    document.getElementById("manTopic").innerHTML = s.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
  });
  document.getElementById("manSaveBtn").addEventListener("click", () => {
    const subjectId = document.getElementById("manSubject").value;
    const topicId = document.getElementById("manTopic").value;
    const mins = Number(document.getElementById("manMins").value) || 0;
    STORE.sessions.push({
      id: uid(), subjectId, topicId, goal: "", start: new Date().toISOString(),
      durationSec: mins * 60, confidence: 3, notes: "", needsAgain: false,
    });
    save(); closeModal(); setView("home");
  });
}

/* --------------------------------------------------------------------------
   QUIZ LOGIC
-------------------------------------------------------------------------- */
function startQuiz() {
  const subjectId = document.getElementById("quizSubject").value;
  const topicId = document.getElementById("quizTopic").value;
  const count = Math.max(1, Number(document.getElementById("quizCount").value) || 5);
  const sub = findSubject(subjectId);
  const top = findTopic(subjectId, topicId);
  const key = `${sub.name}::${top.name}`;
  const bank = QUIZ_BANK[key];

  if (!bank || bank.length === 0) {
    openModal(`
      <h2 style="margin-top:0;">No sample questions yet</h2>
      <p class="topic-sub">There isn't a preloaded question bank for "${top.name}" yet. Try Maths &middot; Algebra, Biology &middot; Cell structure, Chemistry &middot; Atomic structure, Physics &middot; Energy, or English Language &middot; Fiction reading — or add your own questions to the bank in the code.</p>
      <button class="btn-primary" id="closeNoQuiz">Got it</button>
    `);
    document.getElementById("closeNoQuiz").addEventListener("click", closeModal);
    return;
  }

  const questions = [...bank].sort(() => Math.random() - 0.5).slice(0, Math.min(count, bank.length));
  QUIZ = { subjectId, topicId, questions, index: 0, answers: [], correct: [], score: 0, finished: false };
  render();
}

function answerQuestion(userAnswer) {
  const q = QUIZ.questions[QUIZ.index];
  let isCorrect = false;
  if (q.type === "mcq") isCorrect = userAnswer === q.answer;
  else if (q.type === "tf") isCorrect = userAnswer === q.answer;
  else if (q.type === "fill" || q.type === "short") {
    const text = (userAnswer.text || "").trim().toLowerCase();
    isCorrect = q.answer.some(a => text.includes(String(a).toLowerCase()));
  }
  QUIZ.answers[QUIZ.index] = userAnswer;
  QUIZ.correct[QUIZ.index] = isCorrect;
  if (isCorrect) QUIZ.score++;
  render();
}

function nextQuestion() {
  if (QUIZ.index === QUIZ.questions.length - 1) {
    QUIZ.finished = true;
    STORE.quizAttempts.push({
      id: uid(), subjectId: QUIZ.subjectId, topicId: QUIZ.topicId,
      date: new Date().toISOString(), score: QUIZ.score, total: QUIZ.questions.length,
    });
    // Nudge topic confidence based on result
    const top = findTopic(QUIZ.subjectId, QUIZ.topicId);
    if (top) {
      const pct = QUIZ.score / QUIZ.questions.length;
      if (pct >= 0.8) top.confidence = Math.min(5, top.confidence + 1);
      else if (pct < 0.5) top.confidence = Math.max(1, top.confidence - 1);
    }
    save();
  } else {
    QUIZ.index++;
  }
  render();
}

/* --------------------------------------------------------------------------
   SUBJECT / TOPIC MANAGEMENT
-------------------------------------------------------------------------- */
function addSubjectByName(name) {
  const catalogEntry = DEFAULT_CATALOG.find(s => s.name === name);
  const colorIdx = STORE.subjects.length % 8;
  const subject = {
    id: uid(), name, colorIdx,
    topics: catalogEntry ? catalogEntry.topics.map(t => ({
      id: uid(), name: t.name, subtopics: t.subtopics.map(st => ({ id: uid(), name: st })), confidence: 3,
    })) : [],
  };
  STORE.subjects.push(subject);
  save(); render();
  editExamBoard(subject.id);
}
function addCustomSubject() {
  openModal(`
    <h2 style="margin-top:0;">Custom subject</h2>
    <label class="field-label">Subject name</label>
    <input class="input-lg" id="customSubjectName" placeholder="e.g. Music">
    <button class="btn-primary" id="customSubjectSave">Add subject</button>
  `);
  document.getElementById("customSubjectSave").addEventListener("click", () => {
    const name = document.getElementById("customSubjectName").value.trim();
    if (!name) return;
    const subject = { id: uid(), name, colorIdx: STORE.subjects.length % 8, topics: [] };
    STORE.subjects.push(subject);
    save(); closeModal(); render();
    editExamBoard(subject.id);
  });
}
function editExamBoard(subjectId) {
  const current = STORE.examBoards[subjectId] || "";
  const sub = findSubject(subjectId);
  openModal(`
    <h2 style="margin-top:0;">Exam board${sub ? " — " + sub.name : ""}</h2>
    <p class="topic-sub">Not sure yet? Leave it and set it whenever you find out.</p>
    <select class="input-lg" id="boardSelect">
      <option value="">Not sure yet</option>
      ${BOARD_OPTIONS.map(b => `<option ${b === current ? "selected" : ""}>${b}</option>`).join("")}
    </select>
    <button class="btn-primary" id="boardSaveBtn">Save</button>
  `);
  document.getElementById("boardSaveBtn").addEventListener("click", () => {
    STORE.examBoards[subjectId] = document.getElementById("boardSelect").value;
    save(); closeModal(); render();
  });
}
function removeSubject(id) {
  STORE.subjects = STORE.subjects.filter(s => s.id !== id);
  save(); render();
}
function addTopicToSubject(subjectId) {
  openModal(`
    <h2 style="margin-top:0;">Add a topic</h2>
    <label class="field-label">Topic name</label>
    <input class="input-lg" id="newTopicName" placeholder="e.g. Momentum">
    <button class="btn-primary" id="newTopicSave">Add topic</button>
  `);
  document.getElementById("newTopicSave").addEventListener("click", () => {
    const name = document.getElementById("newTopicName").value.trim();
    if (!name) return;
    const s = findSubject(subjectId);
    s.topics.push({ id: uid(), name, subtopics: [], confidence: 3 });
    save(); closeModal(); render();
  });
}

/* --------------------------------------------------------------------------
   DATA EXPORT / IMPORT / RESET
-------------------------------------------------------------------------- */
function exportData() {
  const blob = new Blob([JSON.stringify(STORE, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `revise-backup-${todayStr()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      STORE = parsed; save(); location.reload();
    } catch (e) { alert("That file couldn't be read as valid backup data."); }
  };
  reader.readAsText(file);
}
function resetData() {
  if (!confirm("This deletes everything stored on this device. This can't be undone. Continue?")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/* --------------------------------------------------------------------------
   SETUP FLOW
-------------------------------------------------------------------------- */
function initSetupScreen() {
  document.getElementById("setupSubjects").innerHTML = DEFAULT_CATALOG.map(s =>
    `<button class="chip" data-setup-subject="${s.name}">${s.name}</button>`).join("");

  document.querySelectorAll("[data-setup-subject]").forEach(chip =>
    chip.addEventListener("click", () => chip.classList.toggle("selected")));

  function populateBoardRows() {
    const selected = [...document.querySelectorAll("[data-setup-subject].selected")].map(c => c.dataset.setupSubject);
    const rows = document.getElementById("setupBoardRows");
    if (selected.length === 0) {
      rows.innerHTML = `<p class="topic-sub">No subjects picked yet — go back and choose at least one.</p>`;
      return;
    }
    rows.innerHTML = selected.map(name => `
      <div class="board-row">
        <div class="board-row-label">${name}</div>
        <select class="input-lg" data-board-for="${name}">
          <option value="">Not sure yet</option>
          ${BOARD_OPTIONS.map(b => `<option>${b}</option>`).join("")}
        </select>
      </div>
    `).join("");
  }

  document.querySelectorAll("[data-next]").forEach(btn => {
    btn.addEventListener("click", () => {
      const nextStep = btn.dataset.next;
      if (nextStep === "3") populateBoardRows();
      document.querySelectorAll(".setup-step").forEach(s => s.classList.add("hidden"));
      document.querySelector(`.setup-step[data-step="${nextStep}"]`).classList.remove("hidden");
    });
  });

  document.getElementById("setupFinish").addEventListener("click", () => {
    const name = document.getElementById("setupName").value.trim() || "there";
    const selectedSubjects = [...document.querySelectorAll("[data-setup-subject].selected")].map(c => c.dataset.setupSubject);
    const boardBySubjectName = {};
    document.querySelectorAll("[data-board-for]").forEach(sel => { boardBySubjectName[sel.dataset.boardFor] = sel.value; });
    const daily = Number(document.getElementById("setupDaily").value) || 30;
    const weekly = Number(document.getElementById("setupWeekly").value) || 5;

    STORE.user.name = name;
    STORE.user.dailyGoalMin = daily;
    STORE.user.weeklyGoalHrs = weekly;
    STORE.subjects = buildDefaultSubjects(selectedSubjects);
    STORE.subjects.forEach(s => { STORE.examBoards[s.id] = boardBySubjectName[s.name] || ""; });
    STORE.setupDone = true;
    save();

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("main").classList.remove("hidden");
    applyTheme();
    setView("home");
  });
}

function applyTheme() {
  const theme = STORE.user.theme || "light";
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#14162B" : "#F5F6F1");
}

/* --------------------------------------------------------------------------
   GLOBAL EVENT DELEGATION
-------------------------------------------------------------------------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  if (btn.tagName === "A") e.preventDefault();
  const action = btn.dataset.action;

  if (action === "goto") setView(btn.dataset.view);
  else if (action === "start-timer") startTimer();
  else if (action === "log-manual") openManualLog();
  else if (action === "pause-timer") pauseTimer();
  else if (action === "resume-timer") resumeTimer();
  else if (action === "finish-timer") finishTimer();
  else if (action === "start-quiz") startQuiz();
  else if (action === "answer-mcq") answerQuestion(Number(btn.dataset.idx));
  else if (action === "answer-tf") answerQuestion(btn.dataset.val === "true");
  else if (action === "answer-free") answerQuestion({ text: document.getElementById("freeAnswer").value });
  else if (action === "next-question") nextQuestion();
  else if (action === "finish-quiz") { QUIZ = null; setView("quizzes"); }
  else if (action === "add-subject") addSubjectByName(btn.dataset.name);
  else if (action === "add-custom-subject") addCustomSubject();
  else if (action === "remove-subject") { if (confirm("Remove this subject and its topics?")) removeSubject(btn.dataset.id); }
  else if (action === "add-topic") addTopicToSubject(btn.dataset.subject);
  else if (action === "edit-board") editExamBoard(btn.dataset.subject);
  else if (action === "start-study") startFlashcardStudy(btn.dataset.subject || null);
  else if (action === "show-answer") { STUDY.revealed = true; render(); }
  else if (action === "grade-card") flashcardAnswer(btn.dataset.rating);
  else if (action === "finish-study") { STUDY = null; setView("flashcards"); }
  else if (action === "add-flashcard") openFlashcardModal();
  else if (action === "edit-flashcard") openFlashcardModal(btn.dataset.id);
  else if (action === "delete-flashcard") { if (confirm("Delete this flashcard?")) { STORE.flashcards = STORE.flashcards.filter(f => f.id !== btn.dataset.id); save(); render(); } }
  else if (action === "tutor-quick") { document.getElementById("chatInput").value = btn.dataset.prompt; sendChatMessage(btn.dataset.prompt); }
  else if (action === "send-chat") { const ta = document.getElementById("chatInput"); const text = ta.value; ta.value = ""; sendChatMessage(text); }
  else if (action === "open-settings-shortcut") { renderSettings(); document.getElementById("settingsSheet").classList.remove("hidden"); }
  else if (action === "set-theme") { STORE.user.theme = btn.dataset.val; applyTheme(); save(); renderSettings(); }
  else if (action === "save-settings") {
    STORE.user.name = document.getElementById("setName").value.trim();
    STORE.user.dailyGoalMin = Number(document.getElementById("setDaily").value) || 30;
    STORE.user.weeklyGoalHrs = Number(document.getElementById("setWeekly").value) || 5;
    STORE.aiEndpoint = document.getElementById("setAiEndpoint").value.trim();
    save(); document.getElementById("settingsSheet").classList.add("hidden"); render();
  }
  else if (action === "export-data") exportData();
  else if (action === "reset-data") resetData();
});

document.addEventListener("change", (e) => {
  if (e.target.id === "reviseSubject") {
    const s = findSubject(e.target.value);
    document.getElementById("reviseTopic").innerHTML = s.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
  }
  if (e.target.id === "quizSubject") {
    const s = findSubject(e.target.value);
    document.getElementById("quizTopic").innerHTML = s.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
  }
  if (e.target.id === "tutorSubject") {
    const s = findSubject(e.target.value);
    document.getElementById("tutorTopic").innerHTML = s.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
  }
  if (e.target.id === "importFile" && e.target.files[0]) importData(e.target.files[0]);
});

document.addEventListener("keydown", (e) => {
  if (e.target.id === "chatInput" && e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const text = e.target.value;
    e.target.value = "";
    sendChatMessage(text);
  }
});

document.querySelectorAll(".tab-btn").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));

document.getElementById("openSettings").addEventListener("click", () => {
  renderSettings();
  document.getElementById("settingsSheet").classList.remove("hidden");
});
document.getElementById("closeSettings").addEventListener("click", () => document.getElementById("settingsSheet").classList.add("hidden"));
document.getElementById("settingsSheet").addEventListener("click", (e) => { if (e.target.id === "settingsSheet") e.currentTarget.classList.add("hidden"); });
document.getElementById("modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });

/* --------------------------------------------------------------------------
   BOOTSTRAP
-------------------------------------------------------------------------- */
applyTheme();
if (!STORE.setupDone) {
  document.getElementById("setup").classList.remove("hidden");
  initSetupScreen();
} else {
  document.getElementById("main").classList.remove("hidden");
  if (STORE.activeTimer && !STORE.activeTimer.paused) {
    TIMER_TICK = setInterval(tickTimer, 1000);
  }
  render();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* offline install is optional, ignore failures */ });
}
