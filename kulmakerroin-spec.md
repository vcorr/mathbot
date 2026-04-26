# Kulmakerroin — Finnish 8th Grade Geometry Game
## Technical & Design Specification

---

## Overview

A mobile-first, browser-based interactive geometry game for Finnish 8th-grade students (yläkoulu, 8. luokka). Duolingo-style progression through five concept levels covering the prerequisite ladder for *kulmakerroin* (gradient). All UI copy, prompts, and feedback in Finnish. Mathematics notation universal (y = kx + b, coordinates, etc.).

**Inspired by:** the existing `mathbot` artifact (see source files). Reuse its design language, component architecture, and question interaction patterns — do not copy its content or topic map verbatim.

---

## File Architecture

Identical multi-file structure to mathbot:

```
index.html          — CSS variables, fonts, animations, script tags
ui.jsx              — Btn3D, Card, Pill, Icon, Confetti primitives (reuse mathbot's)
lessons.jsx         — LEVELS data, question banks, SVG diagram components
screens.jsx         — LevelSelectScreen, PracticeScreen, FeedbackDrawer, CompleteScreen
app.jsx             — Root component, routing (level-select → practice → complete)
android-frame.jsx   — Reuse mathbot's AndroidDevice component unchanged
tweaks-panel.jsx    — Reuse mathbot's TweaksPanel unchanged
```

---

## Design System

Inherit mathbot's design tokens exactly:

```css
--c-bg: #fbf8f1;
--c-surface: #ffffff;
--c-ink: #1f2a2e;
--c-ink-soft: #5b6d72;
--c-line: #e7e0cf;
--c-mint / --c-mint-d / --c-mint-deep / --c-mint-soft
--c-coral / --c-coral-d
--c-gold / --c-gold-d
--c-blue / --c-blue-d
--c-violet / --c-violet-d
--c-rose / --c-rose-d
--r-card: 22px;
```

Fonts: Nunito (800, 900 weights) + JetBrains Mono (for equations).  
Buttons: `.btn3d` class with `--btn-shadow` CSS variable (4px offset shadow).  
Animations: `pop`, `shake`, `slide-up`, `fade-in`, `confetti-fall` — reuse mathbot's keyframes.

---

## App Structure & Routing

```
route: 'level-select'   →   LevelSelectScreen
route: 'practice'       →   PracticeScreen (topic: LEVELS[n])
route: 'complete'       →   CompleteScreen (xpEarned, accuracy)
```

No home/topic-map screen. The entry point IS the level select. No XP meta-game or streak in this version — keep state minimal: `{ unlockedUpTo: number }` persisted to `localStorage`.

---

## Level Definitions (LEVELS array)

Five levels, locked progression. Level N unlocks when level N-1 is completed.

```js
const LEVELS = [
  {
    id: 'koordinaatisto',
    title: 'Koordinaatisto',
    subtitle: 'Pisteiden sijainti tasolla',
    icon: '✕',           // cross / axis symbol
    tint: 'var(--c-mint)',
    tintSoft: 'var(--c-mint-soft)',
    shadow: 'var(--c-mint-d)',
    questionCount: 5,
  },
  {
    id: 'nousu-juoksu',
    title: 'Nousu ja juoksu',
    subtitle: 'Suoran jyrkkyys visuaalisesti',
    icon: '↗',
    tint: 'var(--c-blue)',
    tintSoft: '#dceaff',
    shadow: 'var(--c-blue-d)',
    questionCount: 5,
  },
  {
    id: 'kulmakerroin',
    title: 'Kulmakerroin',
    subtitle: 'k = nousu / juoksu',
    icon: 'k',
    tint: 'var(--c-gold)',
    tintSoft: '#fff2c2',
    shadow: 'var(--c-gold-d)',
    questionCount: 5,
  },
  {
    id: 'y-leikkauspiste',
    title: 'Y-leikkauspiste',
    subtitle: 'Missä suora leikkaa y-akselin?',
    icon: 'b',
    tint: 'var(--c-violet)',
    tintSoft: '#ece1ff',
    shadow: 'var(--c-violet-d)',
    questionCount: 5,
  },
  {
    id: 'lineaarinen-yhtalo',
    title: 'Lineaarinen yhtälö',
    subtitle: 'y = kx + b kokonaan',
    icon: 'y=',
    tint: 'var(--c-coral)',
    tintSoft: '#ffd9d9',
    shadow: 'var(--c-coral-d)',
    questionCount: 5,
  },
];
```

---

## Level Select Screen

- Header: `mathbot · GEOMETRIA` logo (reuse mathbot's header markup)
- Section label: `OSIO 3 · KOORDINAATTIGEOMETRIA`
- Heading: `Valitse harjoitus`
- Five `TopicNode` cards in winding-path layout (alternating left/right indent: `[0, 24, 48, 24, 0]px`)
- Each node: circular progress ring (empty until completed) + tint-coloured icon button + label card
- Lock icon on locked levels; ★★★ Suoritettu on completed levels
- Tap unlocked node → navigate to practice for that level

---

## Practice Screen

Identical structure to mathbot's `PracticeScreen`:

1. **Top bar:** exit (✕) button + progress bar (questions completed / total) + no hearts (removed for this version)
2. **Question area:** level title label + prompt text + diagram (if any) + interaction widget
3. **Feedback drawer** (slides up from bottom): green (✓ Oikein!) or red (✗ Melkein!) + explanation text + Jatka button
4. On last question answered → `CompleteScreen`

Question transition: `fade-in` animation on question area re-render.

---

## Question Types (4 kinds)

### 1. `tap` — Multiple choice (2×2 grid)
Tap one option, then press Tarkista. Options highlight on selection. Correct/incorrect revealed on submit.

### 2. `match` — Drag chip to target
Drag labelled chips onto dashed drop targets overlaid on an SVG diagram. Pointer-based drag (works on touch). Submit when all targets filled.

### 3. `slider` — Drag to find a value
A range input controls a live SVG diagram (e.g. a line whose gradient changes). Student drags to match a target value within a tolerance.

### 4. `solve` — Pick the correct calculation result
Show a worked equation with one unknown. Four large number buttons. Student picks the answer.

---

## Question Banks (per level)

### Level 1 — Koordinaatisto (5 questions)

**Q1 — tap**
```
Prompt: "Missä koordinaattiparissa piste P sijaitsee?"
Diagram: CoordDiagram — piste merkitty kohdassa (3, 2)
Options: (3,2) ✓ | (2,3) | (-3,2) | (3,-2)
Selitys: "Ensimmäinen luku on x-koordinaatti (vaakasuunta), toinen on y-koordinaatti (pystysuunta)."
```

**Q2 — match**
```
Prompt: "Yhdistä akselit oikeisiin nimiin."
Diagram: CoordDiagram — tyhjä koordinaatisto, kaksi akselia
Targets: vaakaakseli → x-akseli, pystyakseli → y-akseli
Chips: ["x-akseli", "y-akseli"]
Selitys: "x-akseli on vaakasuora, y-akseli on pystysuora."
```

**Q3 — tap**
```
Prompt: "Missä neljänneksessä piste (-2, 3) sijaitsee?"
Diagram: CoordDiagram — neljännekset merkitty I–IV
Options: I | II ✓ | III | IV
Selitys: "Toisessa neljänneksessä x on negatiivinen ja y on positiivinen."
```

**Q4 — solve**
```
Prompt: "Piste Q on kohdassa (x, y) = (−4, 1). Mikä on x-koordinaatti?"
Options: 1 | −1 | −4 ✓ | 4
Selitys: "x-koordinaatti on järjestetyn parin ensimmäinen luku: −4."
```

**Q5 — slider**
```
Prompt: "Siirrä pistettä niin, että y-koordinaatti on 3."
Diagram: CoordSliderDiagram — piste liikkuu pystysuunnassa, y-arvo näkyy
Target: y = 3, tolerance: 0
Selitys: "y-koordinaatti 3 tarkoittaa kolme yksikköä x-akselin yläpuolella."
```

---

### Level 2 — Nousu ja juoksu (5 questions)

**Q1 — tap**
```
Prompt: "Mikä suora on jyrkkin?"
Diagram: ThreeLinesDiagram — kolme suoraa eri kulmakertoimilla (k=1, k=2, k=0.5), merkitty A/B/C
Options: A | B ✓ | C
Selitys: "Suoran B kulmakerroin on suurin, joten se on jyrkkin."
```

**Q2 — match**
```
Prompt: "Yhdistä käsitteet oikeisiin osiin suorasta."
Diagram: RiseRunDiagram — suora koordinaatistossa, nousu ja juoksu merkitty nuolilla
Targets: pystysuuntainen muutos → nousu, vaakasuuntainen muutos → juoksu
Chips: ["nousu", "juoksu"]
Selitys: "Nousu mittaa pystysuuntaisen muutoksen, juoksu vaakasuuntaisen."
```

**Q3 — tap**
```
Prompt: "Suoralla on nousu 4 ja juoksu 2. Onko suora nouseva vai laskeva?"
Diagram: RiseRunDiagram — positiivinen kulmakerroin
Options: Nouseva ✓ | Laskeva | Vaakasuora | Pystysuora
Selitys: "Kun nousu on positiivinen, suora nousee vasemmalta oikealle."
```

**Q4 — solver**
```
Prompt: "Suoran nousu on 6 ja juoksu on 3. Laske kulmakerroin k."
Diagram: RiseRunDiagram (nousu=6, juoksu=3)
Equation shown: k = nousu / juoksu = 6 / 3 = ?
Options: 2 ✓ | 3 | 0.5 | 18
Selitys: "k = 6 ÷ 3 = 2. Suora nousee kaksi yksikköä jokaista vaakasuoraa yksikköä kohden."
```

**Q5 — slider**
```
Prompt: "Säädä suoran jyrkkyys niin, että kulmakerroin k = 1."
Diagram: GradientSliderDiagram — suora pyörii origon ympäri, k-arvo näkyy
Target: k = 1, tolerance: 0.1
Selitys: "k = 1 tarkoittaa, että suora nousee täsmälleen 45° kulmassa."
```

---

### Level 3 — Kulmakerroin (5 questions)

**Q1 — tap**
```
Prompt: "Mitkä kaksi pistettä ovat koordinaatistossa: A = (1,2) ja B = (3,6). Mikä on kulmakerroin?"
Diagram: TwoPointDiagram (A=(1,2), B=(3,6))
Options: 1 | 2 ✓ | 3 | 4
Selitys: "k = (y₂−y₁)/(x₂−x₁) = (6−2)/(3−1) = 4/2 = 2"
```

**Q2 — solve**
```
Prompt: "Pisteet (0,0) ja (4,−8). Laske kulmakerroin."
Equation shown: k = (−8−0) / (4−0) = ?
Options: −2 ✓ | 2 | −0.5 | 0.5
Selitys: "k = −8/4 = −2. Negatiivinen kulmakerroin tarkoittaa laskevaa suoraa."
```

**Q3 — tap**
```
Prompt: "Suoran kulmakerroin on −3. Miten suora käyttäytyy?"
Options: Nousee jyrkästi | Laskee jyrkästi ✓ | On vaakasuora | Nousee loivasti
Selitys: "Negatiivinen k tarkoittaa laskevaa suoraa. |k|=3 tarkoittaa jyrkkää laskua."
```

**Q4 — match**
```
Prompt: "Yhdistä kulmakerroin oikeaan suoraan."
Diagram: ThreeLinesDiagram — suorat merkitty A/B/C (k=−1, k=0, k=2)
Targets: A→k=−1, B→k=0, C→k=2
Chips: ["k = −1", "k = 0", "k = 2"]
Selitys: "k=0 on vaakasuora, positiivinen k nousee, negatiivinen laskee."
```

**Q5 — slider**
```
Prompt: "Säädä pistettä B niin, että kulmakerroin A→B on tarkalleen 3."
Diagram: GradientFromPointsDiagram — A kiinteä (0,0), B liikkuu, k-arvo lasketaan ja näytetään
Target: k = 3, tolerance: 0.15
Selitys: "k = 3 tarkoittaa nousua 3 yksikköä jokaista vaakasuoraa yksikköä kohden."
```

---

### Level 4 — Y-leikkauspiste (5 questions)

**Q1 — tap**
```
Prompt: "Missä kohdassa suora y = 2x + 4 leikkaa y-akselin?"
Diagram: LinearDiagram (k=2, b=4)
Options: (0,2) | (0,4) ✓ | (4,0) | (2,0)
Selitys: "Y-leikkauspiste on aina muotoa (0, b). Tässä b = 4, joten piste on (0, 4)."
```

**Q2 — solve**
```
Prompt: "Suora kulkee pisteen (0, −3) kautta ja sen kulmakerroin on 1. Mikä on b?"
Equation: y = kx + b → y = 1·x + b, piste (0,−3): −3 = 1·0 + b → b = ?
Options: −3 ✓ | 3 | 1 | −1
Selitys: "Kun x=0, y=b suoraan. Joten b = −3."
```

**Q3 — slider**
```
Prompt: "Siirrä suoraa ylös tai alas niin, että se leikkaa y-akselin kohdassa y = 2."
Diagram: LinearShiftDiagram — suora (k=1) liikkuu pystysuunnassa, b-arvo näkyy
Target: b = 2, tolerance: 0.1
Selitys: "Muuttamalla b:tä siirrät suoraa ylös tai alas muuttamatta sen jyrkkyyttä."
```

**Q4 — match**
```
Prompt: "Yhdistä yhtälö oikeaan y-leikkauspisteeseen."
Targets: y=x+3 → (0,3), y=2x−1 → (0,−1), y=−x+5 → (0,5)
Chips: ["(0, 3)", "(0, −1)", "(0, 5)"]
Selitys: "Y-leikkauspiste saadaan suoraan vakiotermistä b yhtälössä y = kx + b."
```

**Q5 — tap**
```
Prompt: "Mikä yhtälö sopii suoralle, jonka y-leikkauspiste on (0, −2) ja kulmakerroin 3?"
Options: y = 2x − 3 | y = 3x − 2 ✓ | y = −2x + 3 | y = 3x + 2
Selitys: "k = 3 ja b = −2, joten y = 3x + (−2) = 3x − 2."
```

---

### Level 5 — Lineaarinen yhtälö (5 questions)

**Q1 — tap**
```
Prompt: "Mikä on suoran y = −2x + 5 kulmakerroin ja y-leikkauspiste?"
Diagram: LinearDiagram (k=−2, b=5)
Options: k=5, b=−2 | k=−2, b=5 ✓ | k=2, b=5 | k=−2, b=−5
Selitys: "Muodossa y = kx + b: k on x:n kerroin (−2) ja b on vakiotermi (5)."
```

**Q2 — solve**
```
Prompt: "Suora kulkee pisteiden (1,3) ja (3,7) kautta. Muodosta yhtälö y = kx + b."
Step 1 shown: k = (7−3)/(3−1) = 4/2 = 2
Step 2: 3 = 2·1 + b → b = ?
Options: b=1 ✓ | b=2 | b=3 | b=−1
Then full equation: y = 2x + 1
Selitys: "Ensin lasketaan k kahdesta pisteestä, sitten b sijoittamalla piste yhtälöön."
```

**Q3 — match**
```
Prompt: "Yhdistä yhtälö oikeaan kuvaajaan."
Diagram: ThreeLinesDiagram — kolme suoraa koordinaatistossa
Targets: Suora A→y=x+1, Suora B→y=−x+3, Suora C→y=2x
Chips: ["y = x + 1", "y = −x + 3", "y = 2x"]
Selitys: "Vertaa kulmakerrointa (jyrkkyys/suunta) ja y-leikkauspistettä (missä leikkaa y-akselin)."
```

**Q4 — slider**
```
Prompt: "Säädä suoran kulmakerroin ja y-leikkauspiste niin, että suora kulkee pisteiden (0,1) ja (2,5) kautta."
Diagram: DualSliderDiagram — kaksi slideria (k ja b), suora päivittyy live, pisteet A ja B merkitty
Target: k=2, b=1, tolerance: 0.15 per slider
Selitys: "k = (5−1)/(2−0) = 2 ja b = 1. Yhtälö on y = 2x + 1."
```

**Q5 — tap**
```
Prompt: "Lasketaan: Missä kohdassa suora y = 3x − 6 leikkaa x-akselin?"
Options: x=2 ✓ | x=3 | x=6 | x=−2
Selitys: "X-leikkauspiste: aseta y=0 → 0 = 3x − 6 → x = 2."
```

---

## SVG Diagram Components

All diagrams are inline React SVG components. Coordinate system always shows axes with arrows, tick marks every unit, axis labels. Grid optional (light `--c-line` lines). Colours use CSS variables.

### CoordDiagram
- Props: `point?: [x,y]`, `highlightQuadrant?: number`, `showLabels?: boolean`
- 280×280 viewBox, origin at centre, range −5 to 5 on both axes
- Axes with arrowheads, tick marks every unit, labels on axes
- If `point` provided: filled circle at position + coordinate label `(x, y)`
- If `highlightQuadrant` provided: light tint fill on that quadrant

### CoordSliderDiagram
- Props: `y: number` (controlled by slider)
- Same coord system; moveable point constrained to x=0 column (y-axis), filled circle, y-value label updates live

### RiseRunDiagram
- Props: `rise: number`, `run: number`
- Shows a line segment with run (horizontal, gold) and rise (vertical, coral) marked with double-headed arrows and labels

### TwoPointDiagram
- Props: `A: [x,y]`, `B: [x,y]`
- Both points marked with filled circles and labels; dashed line connecting them; rise and run indicated

### ThreeLinesDiagram
- Props: `lines: Array<{k: number, b: number, label: string, color: string}>`
- Three lines through same/different origins; each labelled at its end

### LinearDiagram
- Props: `k: number`, `b: number`
- Single line with equation shown; y-intercept point marked; x-intercept marked if within range

### GradientSliderDiagram
- Props: `k: number` (controlled), `pivot?: [x,y]` (default origin)
- Line rotates around pivot as k changes; current k value shown in badge

### GradientFromPointsDiagram
- Props: `A: [x,y]` (fixed), `Bx: number` (controlled — B slides along x, y computed from target k)
- Shows calculated k value live

### LinearShiftDiagram
- Props: `k: number` (fixed), `b: number` (controlled by slider)
- Line translates vertically; y-intercept highlighted

### DualSliderDiagram
- Props: `k: number`, `b: number` (both controlled by two sliders in the question widget)
- Line updates live; two fixed target points shown for reference

---

## Feedback Drawer (Finnish copy)

```js
correct: {
  heading: 'Oikein! 🎉',
  buttonLabel: 'Jatka',
  bg: 'var(--c-mint-soft)',
  accent: 'var(--c-mint)',
}
incorrect: {
  heading: 'Melkein!',
  buttonLabel: 'Jatka',
  bg: '#ffe1e1',
  accent: 'var(--c-coral)',
}
```

Explanation text from `question.selitys` always shown regardless of correct/incorrect.

---

## Complete Screen (Finnish copy)

```
Hienoa! Taso suoritettu!
Olet nyt lähempänä koordinaattigeometrian hallintaa.

Tiles:
  XP: +{xp}
  Tarkkuus: {accuracy}%
  Aika: {mm:ss}

Button: Jatka
```

Confetti burst on enter. Gold crown icon. Same `pop` animation as mathbot.

---

## State Management

```js
// app.jsx top-level state
const [unlockedUpTo, setUnlockedUpTo] = React.useState(
  () => Number(localStorage.getItem('kulmakerroin_unlocked') ?? 0)
);
// persist on level complete:
localStorage.setItem('kulmakerroin_unlocked', newValue);

const [route, setRoute] = React.useState({ name: 'level-select' });
// routes: 'level-select' | 'practice' | 'complete'
```

No XP, no hearts, no streak in this version. Accuracy (correct / total questions) calculated in `PracticeScreen` and passed to `CompleteScreen`.

---

## Mobile-First Layout

- AndroidDevice frame: 400px wide × 840px tall (reuse mathbot's component)
- All touch interactions use `onPointerDown` / `pointermove` / `pointerup` with `touchAction: 'none'` on draggable elements
- Font sizes: prompts 20–22px, options 15–16px, labels 11–12px
- Minimum tap target: 48px × 48px
- No horizontal scroll anywhere

---

## Implementation Notes for Claude Code

1. **Reuse** `android-frame.jsx`, `tweaks-panel.jsx`, `ui.jsx` from mathbot verbatim — only update `lessons.jsx`, `screens.jsx`, `app.jsx`
2. The `Object.assign(window, {...})` pattern is required for cross-file component sharing (Babel standalone, no bundler)
3. All SVG diagrams must handle the coordinate transform: origin at centre of viewBox, y-axis inverted (SVG y increases downward, math y increases upward)
4. Slider-controlled diagrams receive their value as a prop from the question widget's `useState` — diagrams are pure/stateless
5. The `match` question type's drag-to-target uses pointer events, not HTML drag API — required for touch support
6. Tolerance values in `slider` questions: compare `Math.abs(actual - target) <= tolerance`
7. Finnish special characters (ä, ö) must be in UTF-8 — ensure `<meta charset="utf-8">` in index.html
