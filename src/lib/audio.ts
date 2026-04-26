let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function beep(
  startFreq: number,
  endFreq: number,
  durationSec: number,
  volume = 0.25,
  type: OscillatorType = 'sine',
) {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)

  osc.type = type
  osc.frequency.setValueAtTime(startFreq, ac.currentTime)
  if (endFreq !== startFreq) {
    osc.frequency.linearRampToValueAtTime(endFreq, ac.currentTime + durationSec * 0.6)
  }
  gain.gain.setValueAtTime(volume, ac.currentTime)
  gain.gain.linearRampToValueAtTime(0, ac.currentTime + durationSec)

  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + durationSec + 0.05)
}

export function playCorrect(muted: boolean) {
  if (muted) return
  try {
    beep(440, 660, 0.25)
    setTimeout(() => beep(660, 880, 0.2), 120)
  } catch {
    // AudioContext blocked (e.g. no user gesture yet) — silent fallback
  }
}

export function playWrong(muted: boolean) {
  if (muted) return
  try {
    beep(300, 220, 0.35, 0.3, 'sawtooth')
  } catch {
    // silent fallback
  }
}

export function hapticWrong() {
  try {
    if ('vibrate' in navigator) navigator.vibrate([120, 40, 120])
  } catch {
    // not available
  }
}
