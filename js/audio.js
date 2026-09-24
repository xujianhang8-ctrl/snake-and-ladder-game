// Small synthesized sound effects (Web Audio, no audio files):
// wooden-fish knocks for steps, temple-bell chimes for merit, a sinking
// glide for karma.

let ctx = null;
let master = null;
let enabled = true;

function audio() {
  if (!enabled) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setSoundEnabled(on) {
  enabled = Boolean(on);
  if (!enabled && ctx && ctx.state === 'running') ctx.suspend();
}

export function isSoundEnabled() {
  return enabled;
}

// Browsers only allow audio after a user gesture; call this from one.
export function unlockAudio() {
  audio();
}

function tone(ac, { freq, freqEnd, type = 'sine', start = 0, dur = 0.3, gain = 0.3, attack = 0.005 }) {
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(ac, { start = 0, dur = 0.05, gain = 0.2, freq = 2500, q = 1.5 }) {
  const t0 = ac.currentTime + start;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = freq;
  bp.Q.value = q;
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(bp).connect(g).connect(master);
  src.start(t0);
}

function bell(ac, freq, start = 0, gain = 0.18, dur = 1.6) {
  // A few inharmonic partials give a small temple-bell colour.
  tone(ac, { freq, start, dur, gain });
  tone(ac, { freq: freq * 2.76, start, dur: dur * 0.5, gain: gain * 0.35 });
  tone(ac, { freq: freq * 5.4, start, dur: dur * 0.25, gain: gain * 0.12 });
}

export const sfx = {
  dice() {
    const ac = audio();
    if (!ac) return;
    for (let i = 0; i < 7; i++) {
      noise(ac, { start: i * 0.075 + Math.random() * 0.02, dur: 0.04, gain: 0.35, freq: 1800 + Math.random() * 1600, q: 3 });
    }
  },
  step() {
    const ac = audio();
    if (!ac) return;
    tone(ac, { freq: 980, freqEnd: 620, dur: 0.12, gain: 0.25 });
    noise(ac, { dur: 0.015, gain: 0.12, freq: 3200, q: 2 });
  },
  ladder() {
    const ac = audio();
    if (!ac) return;
    [523.25, 587.33, 659.25, 783.99, 880, 1046.5].forEach((f, i) => bell(ac, f, i * 0.11, 0.12, 1.2));
  },
  snake() {
    const ac = audio();
    if (!ac) return;
    tone(ac, { freq: 440, freqEnd: 110, type: 'triangle', dur: 1.0, gain: 0.22, attack: 0.02 });
    tone(ac, { freq: 220, freqEnd: 70, type: 'sine', start: 0.05, dur: 1.1, gain: 0.18, attack: 0.03 });
  },
  blocked() {
    const ac = audio();
    if (!ac) return;
    tone(ac, { freq: 330, dur: 0.18, gain: 0.15 });
    tone(ac, { freq: 262, start: 0.14, dur: 0.3, gain: 0.15 });
  },
  win() {
    const ac = audio();
    if (!ac) return;
    bell(ac, 196, 0, 0.22, 3.2);
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => bell(ac, f, 0.25 + i * 0.16, 0.13, 2));
  },
};
