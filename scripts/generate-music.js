#!/usr/bin/env node
// Generates a 31-second lo-fi beat WAV file at public/music.wav
// 44100 Hz, 16-bit, mono — no external dependencies required

const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
const DURATION = 31;
const BPM = 95;
const NUM_SAMPLES = SAMPLE_RATE * DURATION;
const DATA_SIZE = NUM_SAMPLES * 2; // 16-bit = 2 bytes per sample
const BUFFER_SIZE = 44 + DATA_SIZE;

const buf = Buffer.alloc(BUFFER_SIZE);

// ── WAV Header ────────────────────────────────────────────────────────────────
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + DATA_SIZE, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);          // PCM chunk size
buf.writeUInt16LE(1, 20);           // PCM format
buf.writeUInt16LE(1, 22);           // mono
buf.writeUInt32LE(SAMPLE_RATE, 24);
buf.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
buf.writeUInt16LE(2, 32);           // block align
buf.writeUInt16LE(16, 34);          // bit depth
buf.write("data", 36);
buf.writeUInt32LE(DATA_SIZE, 40);

// ── Deterministic noise via LCG ───────────────────────────────────────────────
let lcgState = 0xdeadbeef;
function lcgRand() {
  lcgState = Math.imul(lcgState, 1664525) + 1013904223;
  return ((lcgState >>> 0) / 0xffffffff) * 2 - 1; // [-1, 1]
}
function lcgRandAt(seed) {
  let s = seed ^ 0x9e3779b9;
  s = Math.imul(s, 1664525) + 1013904223;
  s = Math.imul(s >>> 0, 0x6b43a9b5);
  return ((s >>> 0) / 0xffffffff) * 2 - 1;
}

const SPB  = SAMPLE_RATE * 60 / BPM;          // samples per beat
const SP8  = SPB / 2;                          // samples per 8th note
const SP16 = SPB / 4;                          // samples per 16th note

// ── Envelope helpers ──────────────────────────────────────────────────────────
const exp = (t, rate) => Math.exp(-t * rate);

// ── Pentatonic melody pattern (A minor pentatonic) ────────────────────────────
// Frequencies: A3=220, C4=261.63, D4=293.66, E4=329.63, G4=392
const PENTA = [220, 261.63, 293.66, 329.63, 392, 440];
const MELODY = [0, 2, 4, 2, 0, 4, 3, 1, 0, 2, 4, 5, 3, 1, 2, 0];
const BASS   = [55, 55, 65.41, 55, 49, 55, 65.41, 49]; // A1, A1, C2, A1, G1, ...

console.log("Generating lo-fi beat...");

for (let i = 0; i < NUM_SAMPLES; i++) {
  const t   = i / SAMPLE_RATE;
  const bp  = i % Math.round(SPB);    // position within a beat
  const s8p = i % Math.round(SP8);    // position within an 8th
  const s16 = i % Math.round(SP16);   // position within a 16th
  const bi  = Math.floor(i / SPB);    // beat index (absolute)
  const s8i = Math.floor(i / SP8);    // 8th note index (absolute)
  const s16i= Math.floor(i / SP16);   // 16th note index

  let samp = 0;

  // ── Kick: beat 1 and beat 3 (every 2nd beat) ──────────────────────────────
  if (bi % 2 === 0 && bp < SAMPLE_RATE * 0.22) {
    const kt = bp / SAMPLE_RATE;
    const kf = 80 * exp(kt, 22) + 40;
    samp += Math.sin(2 * Math.PI * kf * kt) * exp(kt, 10) * 0.75;
    samp += Math.sin(2 * Math.PI * 40 * kt) * exp(kt, 28) * 0.35;
  }

  // ── Snare: beat 2 and beat 4 ──────────────────────────────────────────────
  if (bi % 2 === 1 && bp < SAMPLE_RATE * 0.18) {
    const st = bp / SAMPLE_RATE;
    samp += lcgRandAt(bi * 1000 + bp) * exp(st, 28) * 0.45;
    samp += Math.sin(2 * Math.PI * 180 * st) * exp(st, 35) * 0.18;
  }

  // ── Closed hi-hat: every 16th note ────────────────────────────────────────
  if (s16 < 280) {
    const ht = s16 / SAMPLE_RATE;
    const isOpen = s16i % 8 === 6;
    samp += lcgRandAt(s16i * 777 + s16) * exp(ht, isOpen ? 60 : 550) * 0.12;
  }

  // ── Bass line ─────────────────────────────────────────────────────────────
  const bassFreq = BASS[Math.floor(bi / 2) % BASS.length];
  const bassEnv  = exp(bp / SAMPLE_RATE, 3.5) * 0.28;
  samp += Math.sin(2 * Math.PI * bassFreq * t) * bassEnv;
  samp += Math.sin(2 * Math.PI * bassFreq * 2 * t) * bassEnv * 0.18;

  // ── Lo-fi melody: every 2 beats, soft attack ──────────────────────────────
  const melIdx  = Math.floor(bi / 2) % MELODY.length;
  const melFreq = PENTA[MELODY[melIdx]];
  const melEnv  = Math.sin(Math.PI * Math.min(1, bp / SPB)) * 0.07;
  samp += Math.sin(2 * Math.PI * melFreq * t) * melEnv;
  samp += Math.sin(2 * Math.PI * melFreq * 2 * t) * melEnv * 0.25;

  // ── Soft vinyl crackle ────────────────────────────────────────────────────
  samp += lcgRandAt(i) * 0.012;

  // ── Soft master limiter ───────────────────────────────────────────────────
  const limited = Math.tanh(samp * 1.15) * 0.82;
  const int16 = Math.round(Math.max(-1, Math.min(1, limited)) * 32767);
  buf.writeInt16LE(int16, 44 + i * 2);
}

const out = path.join(__dirname, "..", "public", "music.wav");
fs.writeFileSync(out, buf);
console.log(`✅ Written: ${out}  (${(BUFFER_SIZE / 1024 / 1024).toFixed(1)} MB)`);
