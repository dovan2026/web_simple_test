'use strict';

/* ============================================================
   game.js  –  DDR 사쿠란보 리믹스
   Complete DDR-style rhythm game engine
   ============================================================ */

// ============================================================
// 1. CONSTANTS & CONFIG
// ============================================================

const CFG = {
  BPM:           130,
  SONG_OFFSET:   3.5,   // seconds of countdown before first note
  SONG_DURATION: 97,    // total song length in seconds

  CANVAS_W: 480,
  CANVAS_H: 700,
  LANE_W:   120,   // 480 / 4 lanes
  RECEPTOR_Y: 615, // y of the hit target line
  NOTE_HALF:   22, // half-size of arrow sprite (px)
  SPAWN_Y:    -55, // where notes appear above canvas

  SPEEDS: { easy: 360, normal: 480, hard: 620 }, // px per second

  // Timing windows in milliseconds (±)
  JUDGE: { PERFECT: 45, GREAT: 90, GOOD: 140, BAD: 200 },

  // Base score per judgment
  SCORE: { PERFECT: 1000, GREAT: 750, GOOD: 400, BAD: 100, MISS: 0 },

  // Life delta per judgment (%)
  LIFE: { PERFECT: 4, GREAT: 2, GOOD: 1, BAD: -5, MISS: -10 },

  // Lane accent colours [Left, Down, Up, Right]
  COLORS: ['#FF4757', '#2ED8FA', '#2ECC71', '#FFA502'],

  // Judgment display colours
  JCOLORS: {
    PERFECT: '#FFD700', GREAT: '#00FF7F',
    GOOD: '#00BFFF', BAD: '#FF69B4', MISS: '#FF4444',
  },

  // Key → lane index mapping
  KEYS: {
    ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3,
    KeyA: 0,      KeyS: 1,      KeyW: 2,    KeyD: 3,
  },
};

// Centre X of each lane
const LANE_X = [60, 180, 300, 420];

// ============================================================
// 2. BEATMAP BUILDER
// ============================================================
(function buildBeatmaps() {
  const BD  = 60 / CFG.BPM;   // quarter-note duration (s)
  const off = CFG.SONG_OFFSET;

  // helper: beat number (can be fractional for 8th / 16th notes)
  //   1.0  = quarter note
  //   0.5  = 8th note
  //   0.25 = 16th note
  function t(b) { return b * BD + off; }

  // Raw arrays: [beat, lane]   lane: 0=L 1=D 2=U 3=R
  // ── EASY ──────────────────────────────────────────
  const EASY = [
    /* intro – simple quarters */
    [8,0],[9,3],[10,1],[11,2],[12,0],[13,3],[14,1],[15,2],
    [16,0],[17,2],[18,3],[19,1],[20,2],[21,0],[22,3],[23,1],
    /* section A */
    [24,0],[26,1],[28,2],[30,3],[32,3],[34,2],[36,1],[38,0],
    [40,0],[41,3],[42,2],[43,1],[44,0],[45,3],[46,2],[47,1],
    /* section B */
    [48,0],[50,3],[52,1],[54,2],[56,3],[58,0],[60,2],[62,1],
    [64,0],[65,3],[66,2],[67,1],[68,0],[69,3],[70,1],[71,2],
    /* section C */
    [72,0],[74,2],[76,0],[78,3],[80,3],[82,0],[84,2],[86,1],
    /* finale */
    [88,0],[89,1],[90,2],[91,3],[92,3],[93,2],[94,1],[95,0],
    [96,0],[97,3],[98,1],[99,2],[100,0],[101,3],[102,2],[103,1],
  ];

  // ── NORMAL adds 8th-note fills ─────────────────────
  const NORMAL_EXTRA = [
    /* section A 8ths */
    [32.5,1],[33.5,2],[34.5,1],[35.5,0],
    [36.5,1],[37.5,0],[38.5,3],[39.5,2],
    [40.5,2],[41.5,0],[42.5,1],[43.5,3],
    [44.5,1],[45.5,0],[46.5,3],[47.5,2],
    /* section B 8ths */
    [48.5,2],[49.5,0],[50.5,2],[51.5,0],
    [52.5,3],[53.5,1],[54.5,3],[55.5,1],
    [56.5,2],[57.5,1],[58.5,3],[59.5,2],
    [60.5,0],[61.5,3],[62.5,0],[63.5,3],
    /* section C 8ths */
    [64.5,2],[65.5,1],[66.5,0],[67.5,3],
    [68.5,2],[69.5,1],[70.5,3],[71.5,0],
    [72.5,3],[73.5,1],[74.5,0],[75.5,2],
    [76.5,1],[77.5,2],[78.5,1],[79.5,0],
    /* finale 8ths */
    [80.5,2],[81.5,1],[82.5,3],[83.5,0],
    [84.5,1],[85.5,2],[86.5,0],[87.5,3],
    [88.5,3],[89.5,2],[90.5,1],[91.5,0],
    [92.5,0],[93.5,1],[94.5,2],[95.5,3],
    [96.5,2],[97.5,1],[98.5,0],[99.5,3],
    [100.5,1],[101.5,0],[102.5,3],[103.5,2],
  ];
  const NORMAL = [...EASY, ...NORMAL_EXTRA];

  // ── HARD adds 16th-note bursts ──────────────────────
  const HARD_EXTRA = [
    [40.25,3],[40.75,0],[41.25,1],[41.75,2],
    [44.25,3],[44.75,0],[45.25,1],[45.75,2],
    [48.25,0],[48.75,3],[49.25,2],[49.75,1],
    [56.25,1],[56.75,2],[57.25,3],[57.75,0],
    [64.25,2],[64.75,1],[65.25,0],[65.75,3],
    [68.25,1],[68.75,2],[69.25,3],[69.75,0],
    [72.25,0],[72.75,1],[73.25,2],[73.75,3],
    [76.25,3],[76.75,2],[77.25,1],[77.75,0],
    [80.25,1],[80.75,2],[81.25,3],[81.75,0],
    [84.25,2],[84.75,3],[85.25,0],[85.75,1],
    [88.25,2],[88.75,1],[89.25,3],[89.75,0],
    [92.25,1],[92.75,0],[93.25,3],[93.75,2],
    [96.25,0],[96.75,1],[97.25,2],[97.75,3],
    [100.25,3],[100.75,2],[101.25,1],[101.75,0],
    /* extra fast run near end */
    [103.25,0],[103.5,2],[103.75,1],[104,3],
  ];
  const HARD = [...NORMAL, ...HARD_EXTRA];

  function build(raw) {
    return raw
      .map(([beat, lane]) => ({ time: t(beat), lane, hit: false, missed: false }))
      .sort((a, b) => a.time - b.time);
  }

  window.BEATMAPS = { easy: build(EASY), normal: build(NORMAL), hard: build(HARD) };
})();


// ============================================================
// 3. AUDIO ENGINE  (Web Audio API – fully generated)
// ============================================================
class AudioEngine {
  constructor() {
    this.ctx        = null;
    this.master     = null;
    this.startTime  = 0;
    this.nextBeat   = 0; // next quarter-beat index to schedule
    this.totalBeats = Math.ceil(CFG.SONG_DURATION / (60 / CFG.BPM)) + 8;
    this._timer     = null;
    this.LOOKAHEAD  = 0.12; // seconds ahead to schedule
  }

  /* Must be called after a user gesture */
  async init() {
    this.ctx    = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
  }

  start() {
    if (!this.ctx) return;
    this.stop(); // Clear any existing scheduler timer first
    this.ctx.resume();
    this.startTime = this.ctx.currentTime + 0.05;
    this.nextBeat  = 0;
    this._schedule();
    this._timer = setInterval(() => this._schedule(), 22);
  }

  stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  }

  suspend() { this.ctx && this.ctx.suspend(); }
  resumeCtx() { this.ctx && this.ctx.resume(); }

  getElapsed() {
    if (!this.ctx) return 0;
    return Math.max(0, this.ctx.currentTime - this.startTime);
  }

  // Beat-phase [0,1) for visual effects
  beatPhase() {
    const BD = 60 / CFG.BPM;
    return (this.getElapsed() % BD) / BD;
  }

  /* ---- internal scheduler ---- */
  _schedule() {
    const BD   = 60 / CFG.BPM;
    const look = this.ctx.currentTime + this.LOOKAHEAD;
    while (this.nextBeat < this.totalBeats) {
      const bt = this.startTime + this.nextBeat * BD;
      if (bt > look) break;
      this._dobeat(this.nextBeat, bt, BD);
      this.nextBeat++;
    }
  }

  _dobeat(beat, time, BD) {
    const bar4 = beat % 4;   // position within a 4/4 bar

    // Kick on 1 & 3
    if (bar4 === 0 || bar4 === 2) this._kick(time);
    // Snare on 2 & 4
    if (bar4 === 1 || bar4 === 3) this._snare(time);
    // Closed hi-hat every beat + open on the "and"
    this._hihat(time, true);
    this._hihat(time + BD * 0.5, false);

    // Simple pentatonic melody loop (32-beat cycle)
    // C-maj pentatonic: C4 E4 G4 A4 B4 C5
    const PENTA = [261.63,329.63,392,440,493.88,523.25,587.33,659.25];
    const mel32 = [
      0,2,4,5, 4,2,0,4,  2,5,4,2, 0,2,4,0,
      5,4,2,0, 4,5,7,5,  4,2,0,2, 4,5,4,2,
    ];
    const idx = beat % 32;
    if (mel32[idx] !== undefined) {
      const freq = PENTA[mel32[idx] % PENTA.length];
      this._synth(time, freq, 0.07, BD * 0.82);
    }

    // Bass root note every 4 beats
    if (bar4 === 0) {
      const bassNotes = [130.81,146.83,164.81,174.61];
      const bIdx = Math.floor(beat / 4) % bassNotes.length;
      this._bass(time, bassNotes[bIdx], BD * 3.8);
    }
  }

  /* ---- synthesis primitives ---- */
  _kick(time) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g); g.connect(this.master);
    o.type = 'sine';
    o.frequency.setValueAtTime(180, time);
    o.frequency.exponentialRampToValueAtTime(0.001, time + 0.42);
    g.gain.setValueAtTime(0.85, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.42);
    o.start(time); o.stop(time + 0.45);
  }

  _snare(time) {
    // Noise burst
    const dur = 0.16;
    const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const flt = this.ctx.createBiquadFilter(); flt.type = 'highpass'; flt.frequency.value = 1400;
    const g   = this.ctx.createGain();
    src.connect(flt); flt.connect(g); g.connect(this.master);
    g.gain.setValueAtTime(0.28, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    src.start(time); src.stop(time + dur);
    // Tone component
    const o = this.ctx.createOscillator(); const gt = this.ctx.createGain();
    o.connect(gt); gt.connect(this.master);
    o.type = 'triangle'; o.frequency.value = 195;
    gt.gain.setValueAtTime(0.12, time); gt.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
    o.start(time); o.stop(time + 0.09);
  }

  _hihat(time, closed) {
    const dur = closed ? 0.038 : 0.09;
    const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const flt = this.ctx.createBiquadFilter(); flt.type = 'highpass'; flt.frequency.value = 9000;
    const g   = this.ctx.createGain();
    src.connect(flt); flt.connect(g); g.connect(this.master);
    g.gain.setValueAtTime(closed ? 0.10 : 0.14, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    src.start(time); src.stop(time + dur);
  }

  _synth(time, freq, vol, dur) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g); g.connect(this.master);
    o.type = 'triangle';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, time);
    g.gain.setValueAtTime(vol * 0.6, time + dur * 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    o.start(time); o.stop(time + dur + 0.01);
  }

  _bass(time, freq, dur) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g); g.connect(this.master);
    o.type = 'sawtooth';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.14, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + Math.min(dur, 1.8));
    o.start(time); o.stop(time + Math.min(dur, 1.8) + 0.01);
  }

  /* Play a "hit confirm" sound effect */
  playHitFX(lane) {
    if (!this.ctx) return;
    const freqs = [523, 587, 659, 784]; // C5 D5 E5 G5
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g); g.connect(this.master);
    o.type = 'sine';
    o.frequency.value = freqs[lane];
    g.gain.setValueAtTime(0.18, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    o.start(); o.stop(this.ctx.currentTime + 0.15);
  }
}


// ============================================================
// 4. PARTICLE SYSTEM
// ============================================================
class Particle {
  constructor(x, y, color, big = false) {
    this.x     = x;
    this.y     = y;
    this.vx    = (Math.random() - 0.5) * (big ? 10 : 7);
    this.vy    = -(Math.random() * 7 + (big ? 4 : 1));
    this.color = color;
    this.life  = 1.0;
    this.decay = big ? 0.022 : 0.035 + Math.random() * 0.03;
    this.size  = big ? 5 + Math.random() * 5 : 2 + Math.random() * 4;
    this.grav  = 0.28;
    this.rot   = Math.random() * Math.PI * 2;
    this.rotV  = (Math.random() - 0.5) * 0.25;
    this.isStr = Math.random() < 0.4; // is star shape?
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.grav;
    this.vx *= 0.97;
    this.rot += this.rotV;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle   = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 6;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    const s = this.size * this.life;
    if (this.isStr) {
      // small 4-point star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const r = (i % 2 === 0) ? s : s * 0.4;
        if (i === 0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
        else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  get dead() { return this.life <= 0; }
}

class ParticleSystem {
  constructor() { this.pool = []; }

  burst(x, y, color, count = 14, big = false) {
    for (let i = 0; i < count; i++) this.pool.push(new Particle(x, y, color, big));
  }

  update() { this.pool = this.pool.filter(p => { p.update(); return !p.dead; }); }

  draw(ctx) { this.pool.forEach(p => p.draw(ctx)); }
}


// ============================================================
// 5. SCREEN MANAGER
// ============================================================
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
}


// ============================================================
// 6. GAME ENGINE
// ============================================================
class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx    = this.canvas.getContext('2d');
    this.audio  = new AudioEngine();
    this.parts  = new ParticleSystem();

    // Game state
    this.state      = 'title';   // title | countdown | playing | paused | result
    this.difficulty = 'normal';
    this.speed      = CFG.SPEEDS.normal;

    this.score     = 0;
    this.combo     = 0;
    this.maxCombo  = 0;
    this.life      = 50;         // starts at 50 %
    this.counts    = { PERFECT:0, GREAT:0, GOOD:0, BAD:0, MISS:0 };

    this.beatmap     = [];
    this.totalNotes  = 0;
    this.spawnIdx    = 0;        // next beatmap index to consider for spawning
    this.activeNotes = [];       // currently visible notes

    this.keysHeld   = [false, false, false, false];
    this.keyFlash   = [0, 0, 0, 0];
    this.laneGlow   = [0, 0, 0, 0];
    this.receptorScale = [1, 1, 1, 1]; // scale anim on press

    this.judgText  = '';
    this.judgTimer = 0;
    this.judgColor = '#fff';
    this.judgScale = 1;

    this.songTime  = 0;
    this.lastRaf   = 0;
    this.animId    = null;
    this.failed    = false;
    this.bgPulse   = 0;
    this.lastNoteClearedTime = null;

    // Character dance data
    this.charFrame = 0;
    this.charTimer = 0;

    this._onKey    = this._onKey.bind(this);
    this._onKeyUp  = this._onKeyUp.bind(this);
  }

  /* ---- Initialise (called once on page load) ---- */
  async init() {
    await this.audio.init();
    this._bindEvents();
    this._loadBest();
    showScreen('title');
  }

  _loadBest() {
    const b = localStorage.getItem('ddr-best');
    if (b) document.getElementById('best-score').textContent = Number(b).toLocaleString();
  }

  /* ---- Event binding ---- */
  _bindEvents() {
    document.addEventListener('keydown', this._onKey);
    document.addEventListener('keyup',   this._onKeyUp);

    // Difficulty buttons
    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.difficulty = btn.dataset.diff;
      });
    });

    // Screen buttons
    document.getElementById('btn-start') .addEventListener('click', () => this.startGame());
    document.getElementById('btn-resume').addEventListener('click', () => this.resume());
    document.getElementById('btn-quit')  .addEventListener('click', () => this.quitToMenu());
    document.getElementById('btn-retry') .addEventListener('click', () => this.startGame());
    document.getElementById('btn-menu')  .addEventListener('click', () => {
      this.state = 'title';
      this.audio.stop();
      if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
      showScreen('title');
    });
  }

  /* ---- Key handlers ---- */
  _onKey(e) {
    if (e.repeat) return;

    // Space → start from title
    if (e.code === 'Space' && this.state === 'title') { this.startGame(); return; }

    // ESC → pause / resume
    if (e.code === 'Escape') {
      if      (this.state === 'playing') this.pause();
      else if (this.state === 'paused')  this.resume();
      return;
    }

    if (this.state !== 'playing') return;

    const lane = CFG.KEYS[e.code];
    if (lane === undefined) return;
    e.preventDefault();

    this.keysHeld[lane]        = true;
    this.keyFlash[lane]        = 1.0;
    this.receptorScale[lane]   = 1.25;
    this._hitLane(lane);
  }

  _onKeyUp(e) {
    const lane = CFG.KEYS[e.code];
    if (lane !== undefined) this.keysHeld[lane] = false;
  }

  /* ============================================================
     START GAME
     ============================================================ */
  startGame() {
    // Reset all state
    this.score = 0; this.combo = 0; this.maxCombo = 0; this.life = 50;
    this.counts    = { PERFECT:0, GREAT:0, GOOD:0, BAD:0, MISS:0 };
    this.failed    = false;
    this.spawnIdx  = 0;
    this.activeNotes = [];
    this.parts.pool  = [];
    this.keysHeld    = [false,false,false,false];
    this.keyFlash    = [0,0,0,0];
    this.laneGlow    = [0,0,0,0];
    this.receptorScale = [1,1,1,1];
    this.judgTimer   = 0;
    this.songTime    = 0;
    this.lastNoteClearedTime = null;

    // Clone beatmap
    const src = window.BEATMAPS[this.difficulty];
    this.beatmap    = src.map(n => ({ ...n, hit: false, missed: false }));
    this.totalNotes = this.beatmap.length;
    this.speed      = CFG.SPEEDS[this.difficulty];
    this.songDuration = (this.beatmap.length > 0 ? this.beatmap[this.beatmap.length - 1].time : CFG.SONG_DURATION) + 3.0;

    showScreen('game');
    this.state = 'countdown';
    this._updateHUD();
    this._startCountdown();
  }

  _startCountdown() {
    const overlay = document.getElementById('countdown-overlay');
    const numEl   = document.getElementById('countdown-num');
    overlay.classList.remove('hidden');
    this.audio.ctx.resume();

    let count = 3;
    numEl.textContent = count;
    numEl.className   = 'countdown-num pop-anim';

    // Render canvas during countdown
    this._renderStatic();

    const tick = setInterval(() => {
      count--;
      if (count > 0) {
        numEl.textContent = count;
        numEl.className   = '';
        void numEl.offsetWidth;
        numEl.className   = 'countdown-num pop-anim';
      } else if (count === 0) {
        numEl.textContent = 'GO!';
        numEl.className   = 'countdown-num go-anim';
      } else {
        clearInterval(tick);
        overlay.classList.add('hidden');
        this._beginPlaying();
      }
    }, 1000);
  }

  _beginPlaying() {
    this.state      = 'playing';
    this.audio.startTime = this.audio.ctx.currentTime;
    this.audio.start();
    this.lastRaf    = performance.now();
    this._loop();
  }

  /* ============================================================
     MAIN LOOP
     ============================================================ */
  _loop() {
    // Keep running one more frame even in 'result' state so we can render
    if (this.state !== 'playing' && this.state !== 'result') {
      this.animId = null;
      return;
    }
    this.animId = requestAnimationFrame(() => this._loop());

    const now = performance.now();
    const dt  = Math.min((now - this.lastRaf) / 1000, 0.05);
    this.lastRaf = now;

    if (this.state === 'playing') {
      this.songTime = this.audio.getElapsed();
      this._update(dt);
    }

    this._render();
  }

  /* ============================================================
     UPDATE
     ============================================================ */
  _update(dt) {
    const speed       = this.speed;
    const travelTime  = (CFG.RECEPTOR_Y - CFG.SPAWN_Y) / speed; // s to fall from spawn → receptor

    // ── Spawn notes ──
    while (this.spawnIdx < this.beatmap.length) {
      const note = this.beatmap[this.spawnIdx];
      if (note.time - travelTime <= this.songTime) {
        this.activeNotes.push(note);
        this.spawnIdx++;
      } else break;
    }

    // ── Update note positions & miss detection ──
    for (const note of this.activeNotes) {
      if (note.hit || note.missed) continue;
      const timeUntilHit = note.time - this.songTime;
      note.y = CFG.RECEPTOR_Y - timeUntilHit * speed;

      // MISS when note is more than BAD-window past receptor
      if (timeUntilHit < -(CFG.JUDGE.BAD / 1000)) {
        note.missed = true;
        this._applyJudgment('MISS', note.lane);
      }
    }

    // Autoplay for testing
    if (window.DDR_AUTOPLAY) {
      for (const note of this.activeNotes) {
        if (!note.hit && !note.missed && this.songTime >= note.time) {
          this._hitLane(note.lane);
        }
      }
    }

    // Cull notes that are out of play (hit, missed, or far below screen)
    this.activeNotes = this.activeNotes.filter(n => {
      if (n.hit || n.missed) return false;   // ← remove hit/missed notes
      return n.y < CFG.CANVAS_H + 60;
    });

    // ── Effects ──
    this.parts.update();

    for (let i = 0; i < 4; i++) {
      this.keyFlash[i]       = Math.max(0, this.keyFlash[i]       - dt * 6);
      this.laneGlow[i]       = Math.max(0, this.laneGlow[i]       - dt * 2.5);
      this.receptorScale[i]  = 1 + (this.receptorScale[i] - 1) * Math.max(0, 1 - dt * 12);
    }

    if (this.judgTimer > 0) {
      this.judgTimer  -= dt;
      this.judgScale   = 1 + (1 - Math.min(1, this.judgTimer * 2)) * 0.15;
    }

    // Beat-pulse background effect
    const phase   = this.audio.beatPhase();
    this.bgPulse  = Math.pow(Math.max(0, 1 - phase * 2), 2) * 0.18;

    // Character animation
    this.charTimer += dt;
    if (this.charTimer > 0.23) { this.charTimer = 0; this.charFrame = (this.charFrame + 1) % 4; }

    // ── Check if last note is cleared ──
    if (this.spawnIdx >= this.beatmap.length && this.activeNotes.length === 0) {
      if (this.lastNoteClearedTime === null) {
        this.lastNoteClearedTime = this.songTime;
      }
    }

    // ── Song end (3 seconds after last note cleared) ──
    if (this.lastNoteClearedTime !== null && (this.songTime - this.lastNoteClearedTime >= 3.0)) {
      this._endGame(false);
    }

    this._updateHUD();
  }

  /* ============================================================
     HIT DETECTION
     ============================================================ */
  _hitLane(lane) {
    let best = null, bestDiff = Infinity;

    for (const note of this.activeNotes) {
      if (note.lane !== lane || note.hit || note.missed) continue;
      const diff = Math.abs((note.time - this.songTime) * 1000); // ms
      if (diff < CFG.JUDGE.BAD && diff < bestDiff) {
        bestDiff = diff;
        best     = note;
      }
    }

    if (!best) return; // no hittable note – ghost tap, no penalty

    best.hit = true;
    let judgment;
    if      (bestDiff <= CFG.JUDGE.PERFECT) judgment = 'PERFECT';
    else if (bestDiff <= CFG.JUDGE.GREAT)   judgment = 'GREAT';
    else if (bestDiff <= CFG.JUDGE.GOOD)    judgment = 'GOOD';
    else                                     judgment = 'BAD';

    this._applyJudgment(judgment, lane);

    // Visual hit FX
    const big    = judgment === 'PERFECT';
    const count  = big ? 22 : judgment === 'GREAT' ? 16 : 10;
    this.parts.burst(LANE_X[lane], CFG.RECEPTOR_Y, CFG.COLORS[lane], count, big);
    this.laneGlow[lane] = 1.0;
    this.audio.playHitFX(lane);

    // Also burst stars for PERFECT
    if (big) this.parts.burst(LANE_X[lane], CFG.RECEPTOR_Y, '#ffffff', 8, true);
  }

  /* ============================================================
     JUDGMENT APPLICATION
     ============================================================ */
  _applyJudgment(judgment, lane) {
    this.counts[judgment]++;

    // Combo multiplier: +1 tier every 10 consecutive hits
    const mult = judgment !== 'MISS' && judgment !== 'BAD'
      ? Math.floor(this.combo / 10) + 1
      : 1;
    this.score += CFG.SCORE[judgment] * mult;

    if (judgment === 'MISS' || judgment === 'BAD') {
      this.combo = 0;
    } else {
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    }

    this.life = Math.max(0, Math.min(100, this.life + CFG.LIFE[judgment]));

    // Judgment display
    this.judgText  = judgment;
    this.judgTimer = 0.85;
    this.judgColor = CFG.JCOLORS[judgment];
    this.judgScale = 1.5;

    // Update DOM judgment text
    const jEl = document.getElementById('judgment-text');
    jEl.textContent  = judgment;
    jEl.style.color  = this.judgColor;
    jEl.style.opacity = '1';
    jEl.style.transform = 'translate(-50%,-50%) scale(1.5)';
    clearTimeout(this._jTimeout);
    this._jTimeout = setTimeout(() => {
      jEl.style.opacity   = '0';
      jEl.style.transform = 'translate(-50%,-50%) scale(0.9)';
    }, 500);

    if (this.life <= 0 && !this.failed) {
      this.failed = true;
      this._endGame(true);
    }
  }

  /* ============================================================
     PAUSE / RESUME / QUIT
     ============================================================ */
  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.audio.suspend();
    this.audio.stop();
    document.getElementById('pause-overlay').classList.remove('hidden');
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    document.getElementById('pause-overlay').classList.add('hidden');
    this.lastRaf = performance.now();
    this.audio.resumeCtx();
    this.audio.nextBeat = Math.max(0, this.audio.nextBeat - 2);
    this.audio.start();
  }

  quitToMenu() {
    this.state = 'title';
    this.audio.stop();
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
    document.getElementById('pause-overlay').classList.add('hidden');
    showScreen('title');
  }

  /* ============================================================
     GAME OVER / RESULT
     ============================================================ */
  _endGame(failed) {
    if (this.state === 'result') return;
    console.log('[DDR] _endGame called, failed=', failed, 'score=', this.score);
    this.state = 'result';
    this.audio.stop();
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
    setTimeout(() => this._showResult(failed), 800);
  }

  _showResult(failed) {
    const P = this.counts.PERFECT, G = this.counts.GREAT,
          O = this.counts.GOOD,    B = this.counts.BAD,
          M = this.counts.MISS,    T = this.totalNotes;

    const accuracy = T > 0
      ? ((P + G * 0.85 + O * 0.65 + B * 0.25) / T * 100).toFixed(1)
      : '0.0';

    let grade = 'F';
    if (!failed) {
      if      (+accuracy >= 98) grade = 'S+';
      else if (+accuracy >= 95) grade = 'S';
      else if (+accuracy >= 88) grade = 'A';
      else if (+accuracy >= 75) grade = 'B';
      else if (+accuracy >= 60) grade = 'C';
      else                       grade = 'D';
    }

    // Populate DOM
    const s = (id, v) => { document.getElementById(id).textContent = v; };
    s('rst-perfect', P);  s('rst-great', G);  s('rst-good', O);
    s('rst-bad', B);      s('rst-miss', M);
    s('rst-score',    this.score.toLocaleString());
    s('rst-maxcombo', this.maxCombo);
    s('rst-accuracy', accuracy + '%');

    const gEl = document.getElementById('result-grade-display');
    gEl.textContent = grade;
    gEl.className   = `grade-display grade-${grade[0]}`;
    gEl.style.opacity = '1';  // make grade visible

    console.log('[DDR] _showResult: grade=', grade, 'accuracy=', accuracy, 'score=', this.score);
    showScreen('result');

    // Save best score
    const prev = +(localStorage.getItem('ddr-best') || 0);
    if (this.score > prev) {
      localStorage.setItem('ddr-best', this.score);
      document.getElementById('best-score').textContent = this.score.toLocaleString();
    }
  }

  /* ============================================================
     HUD UPDATE
     ============================================================ */
  _updateHUD() {
    document.getElementById('hud-score').textContent  = String(this.score).padStart(7, '0');
    document.getElementById('hud-combo').textContent  = this.combo;
    document.getElementById('hud-perfect').textContent = this.counts.PERFECT;
    document.getElementById('hud-great').textContent   = this.counts.GREAT;
    document.getElementById('hud-good').textContent    = this.counts.GOOD;
    document.getElementById('hud-bad').textContent     = this.counts.BAD;
    document.getElementById('hud-miss').textContent    = this.counts.MISS;
    document.getElementById('life-num').textContent    = Math.round(this.life) + '%';

    const fill = document.getElementById('life-bar-fill');
    fill.style.width = this.life + '%';
    if      (this.life < 25) fill.style.background = 'linear-gradient(90deg,#ff4757,#ff6b81)';
    else if (this.life < 50) fill.style.background = 'linear-gradient(90deg,#ffa502,#ffbe76)';
    else                     fill.style.background = 'linear-gradient(90deg,#2ecc71,#00cec9)';

    const prog = Math.min(100, (this.songTime / this.songDuration) * 100);
    document.getElementById('song-prog-fill').style.height = prog + '%';
  }


  /* ============================================================
     RENDER
     ============================================================ */
  _render() {
    const ctx = this.ctx;
    const W   = CFG.CANVAS_W;
    const H   = CFG.CANVAS_H;

    ctx.clearRect(0, 0, W, H);
    this._drawBG(ctx, W, H);
    this._drawLanes(ctx, W, H);
    this._drawCharacter(ctx, W, H);
    this.parts.draw(ctx);
    this._drawNotes(ctx);
    this._drawReceptors(ctx);
    if (this.combo >= 5) this._drawComboCanvas(ctx, W);
  }

  _renderStatic() {
    const ctx = this.ctx;
    const W   = CFG.CANVAS_W;
    const H   = CFG.CANVAS_H;
    ctx.clearRect(0, 0, W, H);
    this._drawBG(ctx, W, H);
    this._drawLanes(ctx, W, H);
    this._drawReceptors(ctx);
  }

  /* ---- Background ---- */
  _drawBG(ctx, W, H) {
    // Base gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#060618');
    g.addColorStop(1, '#0d0d28');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Beat-pulse radial burst
    if (this.bgPulse > 0.005) {
      const rg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.85);
      rg.addColorStop(0, `rgba(255,255,255,${(this.bgPulse * 0.8).toFixed(3)})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
    }

    // Lane glow blobs
    for (let i = 0; i < 4; i++) {
      if (this.laneGlow[i] < 0.01) continue;
      const lg = ctx.createRadialGradient(LANE_X[i], CFG.RECEPTOR_Y, 0, LANE_X[i], CFG.RECEPTOR_Y, 180);
      const col = CFG.COLORS[i];
      const a   = Math.floor(this.laneGlow[i] * 55).toString(16).padStart(2, '0');
      lg.addColorStop(0, col + a);
      lg.addColorStop(1, 'transparent');
      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ---- Lane lines ---- */
  _drawLanes(ctx, W, H) {
    // Lane hold glow (key pressed)
    for (let i = 0; i < 4; i++) {
      if (!this.keysHeld[i]) continue;
      const x    = i * CFG.LANE_W;
      const lg   = ctx.createLinearGradient(0, 0, 0, H);
      lg.addColorStop(0, 'transparent');
      lg.addColorStop(0.85, CFG.COLORS[i] + '20');
      lg.addColorStop(1,    CFG.COLORS[i] + '40');
      ctx.fillStyle = lg;
      ctx.fillRect(x, 0, CFG.LANE_W, H);
    }

    // Dividers
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth   = 1;
    for (let i = 1; i < 4; i++) {
      const x = i * CFG.LANE_W;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    // Outer borders
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth   = 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W, H); ctx.stroke();

    // Receptor hit line (subtle)
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(0, CFG.RECEPTOR_Y); ctx.lineTo(W, CFG.RECEPTOR_Y); ctx.stroke();
  }

  /* ---- Simple dancing stick-figure character ---- */
  _drawCharacter(ctx, W, H) {
    const cx    = W / 2;
    const cy    = H * 0.35;
    const frame = this.charFrame;  // 0-3

    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth   = 5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    // Each value is a simple number for the current animation frame
    const BOUNCE  = [0, -4,  0,  4];
    const ARM_L_Y = [40, 20,  0, 20];  // left arm Y-offset (up = negative offset from shoulder)
    const LEG_L_Y = [20, 40, 20,  0];  // left leg Y extension
    const LEG_R_Y = [ 0, 20, 40, 20];  // right leg Y extension

    const bounce = BOUNCE[frame];
    const armLY  = ARM_L_Y[frame];     // number
    const legL   = LEG_L_Y[frame];
    const legR   = LEG_R_Y[frame];

    const Y = cy + bounce;

    // Head
    ctx.beginPath();
    ctx.arc(cx, Y - 44, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.moveTo(cx, Y - 28);
    ctx.lineTo(cx, Y + 14);
    ctx.stroke();

    // Left arm (opposite swing to right)
    ctx.beginPath();
    ctx.moveTo(cx, Y - 18);
    ctx.lineTo(cx - 22, Y - 18 + armLY);
    ctx.stroke();

    // Right arm (mirror of left)
    ctx.beginPath();
    ctx.moveTo(cx, Y - 18);
    ctx.lineTo(cx + 22, Y - 18 - armLY);
    ctx.stroke();

    // Left leg
    ctx.beginPath();
    ctx.moveTo(cx, Y + 14);
    ctx.lineTo(cx - 14, Y + 14 + legL);
    ctx.lineTo(cx - 20, Y + 14 + legL + 10);
    ctx.stroke();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(cx, Y + 14);
    ctx.lineTo(cx + 14, Y + 14 + legR);
    ctx.lineTo(cx + 20, Y + 14 + legR + 10);
    ctx.stroke();

    ctx.restore();
  }

  /* ---- Notes ---- */
  _drawNotes(ctx) {
    for (const note of this.activeNotes) {
      if (note.hit || note.missed) continue;
      // Fade in at top
      const alpha = note.y < 40 ? Math.max(0.1, note.y / 40) : 1.0;
      this._drawArrow(ctx, LANE_X[note.lane], note.y, note.lane, alpha, false);
    }
  }

  /* ---- Receptors ---- */
  _drawReceptors(ctx) {
    for (let i = 0; i < 4; i++) {
      const flash = this.keyFlash[i];
      const alpha = 0.32 + flash * 0.68;
      ctx.save();
      ctx.translate(LANE_X[i], CFG.RECEPTOR_Y);
      const sc = this.receptorScale ? this.receptorScale[i] : 1;
      ctx.scale(sc, sc);
      ctx.translate(-LANE_X[i], -CFG.RECEPTOR_Y);
      this._drawArrow(ctx, LANE_X[i], CFG.RECEPTOR_Y, i, alpha, true, flash);
      ctx.restore();
    }
  }

  /* ---- Arrow drawing ---- */
  _drawArrow(ctx, x, y, dir, alpha, isReceptor, flashAmt = 0) {
    ctx.save();
    ctx.translate(x, y);

    // Rotation so the arrow points in the correct direction
    // Lane 0 = Left (←):  rotate -90°
    // Lane 1 = Down (↓):  rotate 180°
    // Lane 2 = Up   (↑):  rotate   0°
    // Lane 3 = Right(→):  rotate  90°
    const ROT = [-Math.PI / 2, Math.PI, 0, Math.PI / 2];
    ctx.rotate(ROT[dir]);

    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    const col  = CFG.COLORS[dir];
    const s    = CFG.NOTE_HALF;

    if (isReceptor) {
      // Outline-only receptor
      const glow = 4 + flashAmt * 20;
      ctx.shadowColor  = col;
      ctx.shadowBlur   = glow;
      ctx.strokeStyle  = col;
      ctx.lineWidth    = 3;
      ctx.beginPath(); this._arrowShape(ctx, s); ctx.stroke();

      // Inner dim fill
      ctx.globalAlpha  *= 0.18 + flashAmt * 0.25;
      ctx.fillStyle    = col;
      ctx.shadowBlur   = 0;
      ctx.beginPath(); this._arrowShape(ctx, s); ctx.fill();
    } else {
      // Filled note with glow
      ctx.shadowColor  = col;
      ctx.shadowBlur   = 16;
      ctx.fillStyle    = col;
      ctx.beginPath(); this._arrowShape(ctx, s); ctx.fill();

      // Bright inner highlight
      ctx.shadowBlur   = 0;
      ctx.fillStyle    = 'rgba(255,255,255,0.22)';
      ctx.beginPath(); this._arrowShape(ctx, s * 0.58); ctx.fill();

      // Outline
      ctx.strokeStyle  = 'rgba(255,255,255,0.55)';
      ctx.lineWidth    = 2;
      ctx.beginPath(); this._arrowShape(ctx, s); ctx.stroke();
    }

    ctx.restore();
  }

  /* Arrow shape – pointing UP. Will be rotated per direction */
  _arrowShape(ctx, s) {
    ctx.moveTo(  0,        -s);           // tip
    ctx.lineTo(  s * 0.95, -s * 0.18);   // upper-right wing tip
    ctx.lineTo(  s * 0.42, -s * 0.18);   // inner upper-right
    ctx.lineTo(  s * 0.42,  s * 0.82);   // lower-right body
    ctx.lineTo( -s * 0.42,  s * 0.82);   // lower-left body
    ctx.lineTo( -s * 0.42, -s * 0.18);   // inner upper-left
    ctx.lineTo( -s * 0.95, -s * 0.18);   // upper-left wing tip
    ctx.closePath();
  }

  /* ---- Combo display on canvas ---- */
  _drawComboCanvas(ctx, W) {
    const y   = CFG.RECEPTOR_Y - 80;
    const sz  = Math.min(52, 20 + this.combo * 0.12);
    ctx.save();
    ctx.textAlign    = 'center';
    ctx.font         = `900 ${sz}px Outfit, sans-serif`;
    ctx.shadowColor  = '#FFD700';
    ctx.shadowBlur   = 22;
    const g = ctx.createLinearGradient(W/2-60, y, W/2+60, y);
    g.addColorStop(0, '#FFD700');
    g.addColorStop(1, '#FFA502');
    ctx.fillStyle = g;
    ctx.fillText(this.combo + ' COMBO', W / 2, y);
    ctx.restore();
  }
}


// ============================================================
// 7. BOOT
// ============================================================
const game = new GameEngine();
window.addEventListener('load', () => { game.init(); });
