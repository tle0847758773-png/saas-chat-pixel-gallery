import fs from 'node:fs';
import path from 'node:path';

const SAMPLE_RATE = 48000;
const DURATION_SEC = 27.6;
const NUM_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_SEC);
const left = new Float32Array(NUM_SAMPLES);
const right = new Float32Array(NUM_SAMPLES);

// Deterministic Mulberry32 PRNG (no Math.random)
function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createRng(20261123);

function addSample(idx, l, r) {
  if (idx >= 0 && idx < NUM_SAMPLES) {
    left[idx] += l;
    right[idx] += r;
  }
}

function mixPan(idx, mono, pan = 0) {
  // pan in [-1, 1]
  const lGain = Math.sqrt(0.5 * (1 - pan));
  const rGain = Math.sqrt(0.5 * (1 + pan));
  addSample(idx, mono * lGain, mono * rGain);
}

// MIDI note to Hz
function mtof(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Soft kick drum
function triggerKick(startSec, amp = 0.45) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(0.22 * SAMPLE_RATE);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 42 + 125 * Math.exp(-t * 34);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.exp(-t * 14) * (1 - Math.exp(-t * 400));
    const click = Math.exp(-t * 180) * 0.25;
    const sample = (Math.sin(phase) + click) * env * amp;
    mixPan(start + i, sample, 0);
  }
}

// Crisp clap/snare
function triggerSnare(startSec, amp = 0.22) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(0.18 * SAMPLE_RATE);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const n = rng() * 2 - 1;
    // simple high-pass tilt
    const hp = n - 0.65 * prev;
    prev = n;
    const body = Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 36) * 0.45;
    const env = Math.exp(-t * 22);
    const sample = (hp * 0.7 + body) * env * amp;
    mixPan(start + i, sample, 0.04);
  }
}

// Tight hi-hat
function triggerHat(startSec, amp = 0.09, open = false) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor((open ? 0.14 : 0.055) * SAMPLE_RATE);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const n = rng() * 2 - 1;
    const hp = n - 0.88 * prev;
    prev = n;
    const env = Math.exp(-t * (open ? 24 : 75));
    mixPan(start + i, hp * env * amp, -0.18);
  }
}

// Warm synth bass note
function triggerBass(startSec, durSec, midi, amp = 0.24) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durSec * SAMPLE_RATE);
  const freq = mtof(midi);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const phase = (t * freq) % 1;
    const saw = phase * 2 - 1;
    const sub = Math.sin(2 * Math.PI * freq * t);
    // Low-pass filter sweep
    const cutoff = 0.06 + 0.16 * Math.exp(-t * 10);
    lp += cutoff * (saw - lp);
    const env =
      Math.min(1, t / 0.008) *
      Math.min(1, (durSec - t) / 0.025) *
      (0.55 + 0.45 * Math.exp(-t * 5));
    mixPan(start + i, (lp * 0.65 + sub * 0.5) * env * amp, 0);
  }
}

// Warm Rhodes-style electric piano chord
function triggerChord(startSec, durSec, midis, amp = 0.11) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durSec * SAMPLE_RATE);
  for (let k = 0; k < midis.length; k++) {
    const freq = mtof(midis[k]);
    const pan = -0.35 + (k / Math.max(1, midis.length - 1)) * 0.7;
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const env =
        Math.min(1, t / 0.014) *
        Math.min(1, (durSec - t) / 0.06) *
        (0.45 + 0.55 * Math.exp(-t * 2.8));
      const tine = Math.sin(2 * Math.PI * freq * 3 * t) * Math.exp(-t * 16) * 0.25;
      const fund = Math.sin(2 * Math.PI * freq * t) + 0.18 * Math.sin(2 * Math.PI * freq * 2 * t);
      mixPan(start + i, (fund + tine) * env * (amp / midis.length) * 2.1, pan);
    }
  }
}

// Crisp UI Pop
function triggerPop(startSec, baseFreq = 580, amp = 0.22, pan = 0) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(0.08 * SAMPLE_RATE);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const freq = baseFreq + 440 * Math.exp(-t * 60);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.exp(-t * 48) * (1 - Math.exp(-t * 900));
    mixPan(start + i, Math.sin(phase) * env * amp, pan);
  }
}

// Soft mechanical click / tick
function triggerClick(startSec, amp = 0.14, pitch = 1900, pan = 0.1) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(0.025 * SAMPLE_RATE);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const tone = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 160);
    const noise = (rng() * 2 - 1) * Math.exp(-t * 240) * 0.5;
    mixPan(start + i, (tone + noise) * amp, pan);
  }
}

// Smooth airy whoosh
function triggerWhoosh(startSec, durSec = 0.35, amp = 0.18, rising = true) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durSec * SAMPLE_RATE);
  let lp = 0;
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const u = t / durSec;
    const n = rng() * 2 - 1;
    const coeff = rising ? 0.03 + 0.35 * u : 0.35 - 0.3 * u;
    lp += coeff * (n - lp);
    const bp = lp - 0.55 * prev;
    prev = lp;
    const env = Math.sin(Math.PI * u);
    const shimmer = Math.sin(2 * Math.PI * (rising ? 320 + 420 * u : 620 - 300 * u) * t) * 0.12;
    mixPan(start + i, (bp * 1.4 + shimmer) * env * amp, (u - 0.5) * 0.4);
  }
}

// Bright harmonic chime
function triggerChime(startSec, midis = [77, 84, 89], amp = 0.16) {
  midis.forEach((m, idx) => {
    const start = Math.floor((startSec + idx * 0.045) * SAMPLE_RATE);
    const len = Math.floor(0.65 * SAMPLE_RATE);
    const freq = mtof(m);
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-t * 5.2) * Math.min(1, t / 0.008);
      const tone =
        Math.sin(2 * Math.PI * freq * t) +
        0.3 * Math.sin(2 * Math.PI * freq * 2 * t) * Math.exp(-t * 9);
      mixPan(start + i, tone * env * amp * 0.55, (idx - 1) * 0.25);
    }
  });
}

// 1. Groove Bed @ 118 BPM
const BEAT = 60 / 118;
const SIXTEENTH = BEAT / 4;
const CHORDS = [
  { root: 41, chord: [60, 63, 68, 72] }, // Fm7
  { root: 39, chord: [58, 63, 67, 70] }, // Eb6
  { root: 37, chord: [56, 61, 65, 68] }, // DbMaj7
  { root: 36, chord: [55, 60, 64, 67] }, // C7/C
];

const totalBeats = Math.floor(DURATION_SEC / BEAT);
for (let b = 0; b < totalBeats; b++) {
  const t = b * BEAT;
  const bar = Math.floor(b / 4);
  const beatInBar = b % 4;
  const prog = CHORDS[bar % CHORDS.length];

  // Kick & Snare
  triggerKick(t, 0.36);
  if (beatInBar === 1 || beatInBar === 3) {
    triggerSnare(t, 0.18);
  }
  if (beatInBar === 2) {
    triggerKick(t + SIXTEENTH * 2, 0.2);
  }

  // 16th hi-hats
  for (let s = 0; s < 4; s++) {
    const ht = t + s * SIXTEENTH;
    if (ht < DURATION_SEC - 0.1) {
      triggerHat(ht, s % 2 === 1 ? 0.075 : 0.045, beatInBar === 3 && s === 2);
    }
  }

  // Funk bass syncopation
  if (beatInBar === 0) {
    triggerBass(t, BEAT * 0.85, prog.root, 0.23);
    triggerBass(t + SIXTEENTH * 3, BEAT * 0.45, prog.root + 7, 0.17);
  } else if (beatInBar === 1) {
    triggerBass(t + SIXTEENTH * 2, BEAT * 0.45, prog.root + 12, 0.18);
  } else if (beatInBar === 2) {
    triggerBass(t, BEAT * 0.7, prog.root, 0.21);
    triggerBass(t + SIXTEENTH * 3, BEAT * 0.45, prog.root + 5, 0.16);
  } else if (beatInBar === 3) {
    triggerBass(t + SIXTEENTH * 2, BEAT * 0.4, prog.root + 7, 0.16);
  }

  // Electric piano chords on bar start & upbeat of 2
  if (beatInBar === 0) {
    triggerChord(t, BEAT * 1.8, prog.chord, 0.13);
  } else if (beatInBar === 2) {
    triggerChord(t + SIXTEENTH * 2, BEAT * 1.35, prog.chord, 0.1);
  }
}

// 2. Scene-locked UI & Transition SFX
// Typewriter ticks (1.35s - 2.35s)
for (let t = 1.35; t <= 2.35; t += 0.068) {
  triggerClick(t, 0.09, 2100 + (Math.floor(t * 20) % 4) * 180, -0.15);
}

// Wheel scroll list 1 (3.35s - 4.30s)
for (let i = 0; i < 8; i++) {
  triggerClick(3.35 + i * 0.11, 0.12, 1300 + i * 70, 0);
}

// Sonic3 click SFX
triggerPop(5.35, 620, 0.26, 0.1);
triggerClick(5.38, 0.22, 2400, 0.1);

// Editor workspace click -> 3D Gallery transition (7.40s)
triggerClick(7.18, 0.2, 2300, 0);
triggerWhoosh(7.2, 0.28, 0.22, true);
triggerPop(7.4, 740, 0.25, 0);

// Kinetic words & Lime dome rise (8.60s - 10.90s)
triggerPop(8.62, 520, 0.2, 0);
triggerPop(9.3, 600, 0.2, 0);
triggerWhoosh(9.87, 0.42, 0.24, true);
triggerChime(9.92, [72, 79, 84], 0.12);
triggerPop(10.75, 860, 0.24, 0.15);

// 4-Column Vertical Slices reveal (14.00s)
triggerWhoosh(13.98, 0.36, 0.25, false);
triggerClick(14.12, 0.15, 1600, -0.3);
triggerClick(14.22, 0.15, 1800, 0.3);

// THREE + Mini Sonic3 pop (16.55s & 16.95s)
triggerPop(16.55, 480, 0.28, 0);
triggerPop(16.95, 780, 0.26, 0);

// Sonic3 mat 2 click (18.90s)
triggerPop(18.9, 640, 0.24, 0.05);
triggerClick(18.94, 0.18, 2200, 0.05);

// Layer Writing ticks (20.60s - 23.60s)
for (let i = 0; i < 6; i++) {
  triggerClick(20.65 + i * 0.52, 0.14, 1500, -0.2);
}

// Wheel scroll list 2 (23.70s - 24.60s)
for (let i = 0; i < 8; i++) {
  triggerClick(23.7 + i * 0.11, 0.12, 1300 + i * 70, 0);
}

// Sonic3 mat 3 click (25.95s)
triggerPop(25.95, 640, 0.24, 0);

// Split Eyes Finale + resolving chime (26.35s & 26.85s)
triggerWhoosh(26.35, 0.3, 0.2, true);
triggerChime(26.85, [77, 81, 84, 89], 0.18);

// Master fade-in/out & soft limiter
const fadeInSamples = Math.floor(0.18 * SAMPLE_RATE);
const fadeOutSamples = Math.floor(0.45 * SAMPLE_RATE);
for (let i = 0; i < NUM_SAMPLES; i++) {
  let gain = 1;
  if (i < fadeInSamples) {
    gain *= i / fadeInSamples;
  }
  if (i > NUM_SAMPLES - fadeOutSamples) {
    gain *= (NUM_SAMPLES - i) / fadeOutSamples;
  }
  left[i] = Math.tanh(left[i] * gain * 0.9);
  right[i] = Math.tanh(right[i] * gain * 0.9);
}

// Encode 16-bit PCM Stereo WAV
const dataSize = NUM_SAMPLES * 4;
const buffer = Buffer.alloc(44 + dataSize);
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(2, 22); // Stereo
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(SAMPLE_RATE * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < NUM_SAMPLES; i++) {
  const l = Math.max(-1, Math.min(1, left[i]));
  const r = Math.max(-1, Math.min(1, right[i]));
  buffer.writeInt16LE(Math.round(l * 32767), offset);
  buffer.writeInt16LE(Math.round(r * 32767), offset + 2);
  offset += 4;
}

const outPath = path.resolve(process.cwd(), 'public', 'assets', 'soundtrack.wav');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buffer);
console.log(`Generated ${outPath} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB, ${DURATION_SEC}s)`);
