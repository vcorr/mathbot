import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { course } from '../courses/kulmakerroin'
import type {
  MatchQuestion,
  SliderQuestion,
  TapQuestion,
  DualSliderQuestion,
  Question,
} from '../courses/types'

// ─── Diagram imports (module-level to satisfy static-components rule) ────────
import CoordDiagram from '../components/diagrams/CoordDiagram'
import CoordSliderDiagram from '../components/diagrams/CoordSliderDiagram'
import RiseRunDiagram from '../components/diagrams/RiseRunDiagram'
import ThreeLinesDiagram from '../components/diagrams/ThreeLinesDiagram'
import TwoPointDiagram from '../components/diagrams/TwoPointDiagram'
import LinearDiagram from '../components/diagrams/LinearDiagram'
import GradientSliderDiagram from '../components/diagrams/GradientSliderDiagram'
import LinearShiftDiagram from '../components/diagrams/LinearShiftDiagram'

// ─── Central diagram renderer (module-level component) ───────────────────────

function QuestionDiagram({
  diagramKey,
  diagramProps = {},
  sliderValue = 0,
  sliderValues = [],
}: {
  diagramKey: string
  diagramProps?: Record<string, unknown>
  sliderValue?: number
  sliderValues?: number[]
}) {
  switch (diagramKey) {
    case 'coord':
      return (
        <CoordDiagram
          point={diagramProps.point as [number, number] | undefined}
          pointLabel={diagramProps.pointLabel as string | undefined}
          highlightQuadrant={diagramProps.highlightQuadrant as number | undefined}
          showQuadrantLabels={diagramProps.showQuadrantLabels as boolean | undefined}
        />
      )
    case 'coord-slider':
      return <CoordSliderDiagram value={sliderValue} />
    case 'rise-run':
      return (
        <RiseRunDiagram
          rise={diagramProps.rise as number ?? 3}
          run={diagramProps.run as number ?? 2}
        />
      )
    case 'three-lines':
      return (
        <ThreeLinesDiagram
          lines={diagramProps.lines as React.ComponentProps<typeof ThreeLinesDiagram>['lines']}
        />
      )
    case 'two-point':
      return (
        <TwoPointDiagram
          A={diagramProps.A as [number, number]}
          B={diagramProps.B as [number, number]}
        />
      )
    case 'linear': {
      // For dual-slider questions, k and b come from sliderValues
      const k = sliderValues.length >= 1 ? sliderValues[0] : (diagramProps.k as number ?? 1)
      const b = sliderValues.length >= 2 ? sliderValues[1] : (diagramProps.b as number ?? 0)
      return (
        <LinearDiagram
          k={k}
          b={b}
          targetPoints={diagramProps.targetPoints as [number, number][] | undefined}
        />
      )
    }
    case 'gradient-slider':
      return (
        <GradientSliderDiagram
          value={sliderValue}
          pivot={diagramProps.pivot as [number, number] | undefined}
        />
      )
    case 'linear-shift':
      return (
        <LinearShiftDiagram
          k={diagramProps.k as number ?? 1}
          value={sliderValue}
        />
      )
    default:
      return null
  }
}

// React import needed for JSX in QuestionDiagram switch
import React from 'react'

// ─── Draggable chip ─────────────────────────────────────────────────────────

function DraggableChip({ id, label }: { id: number; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.45 : 1,
        touchAction: 'none',
      }}
      className="rounded-2xl border-2 border-line bg-surface px-5 py-3 text-sm font-extrabold text-ink cursor-grab select-none"
    >
      {label}
    </div>
  )
}

// ─── Droppable target ────────────────────────────────────────────────────────

function DroppableTarget({
  id,
  label,
  filledChipLabel,
}: {
  id: string
  label: string
  filledChipLabel: string | null
}) {
  const { isOver, setNodeRef } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className="flex items-center gap-3 rounded-2xl border-2 px-4 py-3"
      style={{
        borderColor: isOver ? 'var(--color-mint)' : 'var(--color-line)',
        background: isOver ? 'var(--color-mint-soft)' : 'var(--color-surface)',
      }}
    >
      <span className="text-sm text-ink-soft w-28 flex-shrink-0">{label}</span>
      <div
        className="flex-1 h-10 rounded-xl border-2 border-dashed flex items-center justify-center"
        style={{ borderColor: 'var(--color-line)' }}
      >
        {filledChipLabel ? (
          <span className="text-sm font-extrabold text-ink">{filledChipLabel}</span>
        ) : (
          <span className="text-xs text-ink-soft">pudota tähän</span>
        )}
      </div>
    </div>
  )
}

// ─── Match widget ────────────────────────────────────────────────────────────

function MatchWidget({
  question,
  slots,
  onDragEnd,
}: {
  question: MatchQuestion
  slots: (number | null)[]
  onDragEnd: (e: DragEndEvent) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  )
  const poolChips = question.chips
    .map((label, idx) => ({ label, idx }))
    .filter(({ idx }) => !slots.includes(idx))

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-3 mb-4">
        {question.targets.map((target, targetIdx) => (
          <DroppableTarget
            key={targetIdx}
            id={`target-${targetIdx}`}
            label={target}
            filledChipLabel={
              slots[targetIdx] !== null && slots[targetIdx] !== undefined
                ? question.chips[slots[targetIdx]!]
                : null
            }
          />
        ))}
      </div>
      <div className="flex gap-3 justify-center flex-wrap min-h-[52px]">
        {poolChips.map(({ label, idx }) => (
          <DraggableChip key={idx} id={idx} label={label} />
        ))}
      </div>
    </DndContext>
  )
}

// ─── Tap / Solve widget ──────────────────────────────────────────────────────

function TapWidget({
  question,
  selected,
  revealed,
  onSelect,
}: {
  question: TapQuestion
  selected: number | null
  revealed: boolean
  onSelect: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {question.options.map((opt, i) => {
        let borderColor = 'var(--color-line)'
        let bg = 'var(--color-surface)'
        let textColor = 'var(--color-ink)'

        if (revealed) {
          if (i === question.correct) {
            borderColor = 'var(--color-mint)'; bg = 'var(--color-mint-soft)'; textColor = 'var(--color-mint-deep)'
          } else if (i === selected) {
            borderColor = 'var(--color-coral)'; bg = '#ffe1e1'; textColor = 'var(--color-coral-d)'
          }
        } else if (selected === i) {
          borderColor = 'var(--color-mint)'; bg = 'var(--color-mint-soft)'; textColor = 'var(--color-mint-deep)'
        }

        return (
          <button
            key={i}
            className="rounded-2xl border-2 p-4 text-center font-extrabold text-sm transition-colors"
            style={{ borderColor, background: bg, color: textColor }}
            onClick={() => !revealed && onSelect(i)}
            disabled={revealed}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ─── Slider widget ───────────────────────────────────────────────────────────

function SliderWidget({
  question,
  value,
  onChange,
}: {
  question: SliderQuestion
  value: number
  onChange: (v: number) => void
}) {
  const vStr = value % 1 === 0 ? String(value) : value.toFixed(1)
  return (
    <div className="flex flex-col gap-4">
      <QuestionDiagram
        diagramKey={question.diagram}
        diagramProps={question.diagramProps}
        sliderValue={value}
      />
      <div className="flex flex-col gap-2 px-2">
        <input
          type="range"
          min={question.min}
          max={question.max}
          step={question.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: 'var(--color-mint)' }}
        />
        <div className="flex justify-between text-xs text-ink-soft font-extrabold">
          <span>{question.min}</span>
          <span className="font-black text-ink">{vStr}</span>
          <span>{question.max}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Dual-slider widget ───────────────────────────────────────────────────────

function DualSliderWidget({
  question,
  values,
  onChange,
}: {
  question: DualSliderQuestion
  values: number[]
  onChange: (idx: number, v: number) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Diagram updates live with both k and b */}
      <QuestionDiagram
        diagramKey={question.diagram}
        diagramProps={question.diagramProps}
        sliderValues={values}
      />
      {question.sliders.map((slider, idx) => {
        const v = values[idx] ?? slider.min
        const vStr = v % 1 === 0 ? String(v) : v.toFixed(1)
        return (
          <div key={idx} className="flex flex-col gap-1 px-2">
            <div className="flex justify-between text-xs font-extrabold text-ink-soft">
              <span>{slider.label}</span>
              <span className="text-ink">{vStr}</span>
            </div>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={v}
              onChange={(e) => onChange(idx, Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--color-mint)' }}
            />
          </div>
        )
      })}
    </div>
  )
}

// ─── Per-question state ───────────────────────────────────────────────────────

interface QState {
  selectedOption: number | null
  slots: (number | null)[]
  sliderValue: number
  sliderValues: number[]
}

function initQState(q: Question): QState {
  return {
    selectedOption: null,
    slots: q.type === 'match' ? Array((q as MatchQuestion).targets.length).fill(null) : [],
    sliderValue: q.type === 'slider' ? (q as SliderQuestion).min : 0,
    sliderValues:
      q.type === 'dual-slider'
        ? (q as DualSliderQuestion).sliders.map((s) => s.min)
        : [],
  }
}

// ─── Practice Screen ─────────────────────────────────────────────────────────

export default function PracticeScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { levelIndex: number } | null

  const levelIndex = state?.levelIndex ?? 0
  const level = course.levels[levelIndex]
  const questions = level.questions

  const [qIndex, setQIndex] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [qState, setQState] = useState<QState>(() => initQState(questions[0]))
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  if (!state) {
    navigate('/', { replace: true })
    return null
  }

  const q = questions[qIndex]

  function handleDragEnd(event: DragEndEvent) {
    const chipIdx = Number(event.active.id)
    const overId = event.over ? String(event.over.id) : null
    setQState((s) => {
      const slots = [...s.slots]
      const prevTarget = slots.indexOf(chipIdx)
      if (prevTarget !== -1) slots[prevTarget] = null
      if (overId?.startsWith('target-')) {
        slots[Number(overId.split('-')[1])] = chipIdx
      }
      return { ...s, slots }
    })
  }

  function canSubmit(): boolean {
    if (q.type === 'tap' || q.type === 'solve') return qState.selectedOption !== null
    if (q.type === 'match') return qState.slots.every((s) => s !== null)
    return true // slider / dual-slider always submittable
  }

  function handleSubmit() {
    let correct = false
    if (q.type === 'tap' || q.type === 'solve') {
      correct = qState.selectedOption === q.correct
    } else if (q.type === 'match') {
      correct = q.correct.every((chipIdx, targetIdx) => qState.slots[targetIdx] === chipIdx)
    } else if (q.type === 'slider') {
      correct = Math.abs(qState.sliderValue - q.target) <= q.tolerance
    } else if (q.type === 'dual-slider') {
      correct = q.sliders.every(
        (slider, i) => Math.abs((qState.sliderValues[i] ?? slider.min) - slider.target) <= slider.tolerance,
      )
    }
    if (!correct) setWrongCount((w) => w + 1)
    setIsCorrect(correct)
    setShowFeedback(true)
  }

  function handleContinue() {
    const next = qIndex + 1
    if (next >= questions.length) {
      navigate('/complete', {
        state: {
          levelIndex,
          levelId: level.id,
          wrongCount,
          totalQuestions: questions.length,
        },
      })
    } else {
      setShowFeedback(false)
      setQIndex(next)
      setQState(initQState(questions[next]))
      setIsCorrect(false)
    }
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-line bg-surface flex-shrink-0">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full text-lg font-black text-ink-soft"
          onClick={() => navigate('/')}
          aria-label="Poistu"
        >
          ✕
        </button>
        <div className="flex-1 h-3 rounded-full bg-line overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(qIndex / questions.length) * 100}%`,
              background: 'var(--color-mint)',
            }}
          />
        </div>
        <span className="text-xs font-extrabold text-ink-soft whitespace-nowrap">
          {qIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Scrollable question area */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-32">
        <div className="text-xs font-extrabold tracking-widest uppercase text-ink-soft mb-3">
          {level.title}
        </div>

        <p className="text-xl font-extrabold text-ink mb-5 leading-snug">{q.prompt}</p>

        {/* Static diagram (tap/solve/match, not for slider types which handle their own) */}
        {q.type !== 'slider' && q.type !== 'dual-slider' && q.diagram && (
          <div className="mb-5">
            <QuestionDiagram diagramKey={q.diagram} diagramProps={q.diagramProps} />
          </div>
        )}

        {/* Widgets */}
        {(q.type === 'tap' || q.type === 'solve') && (
          <TapWidget
            question={q}
            selected={qState.selectedOption}
            revealed={showFeedback}
            onSelect={(i) => setQState((s) => ({ ...s, selectedOption: i }))}
          />
        )}
        {q.type === 'match' && (
          <MatchWidget question={q} slots={qState.slots} onDragEnd={handleDragEnd} />
        )}
        {q.type === 'slider' && (
          <SliderWidget
            question={q}
            value={qState.sliderValue}
            onChange={(v) => setQState((s) => ({ ...s, sliderValue: v }))}
          />
        )}
        {q.type === 'dual-slider' && (
          <DualSliderWidget
            question={q}
            values={qState.sliderValues}
            onChange={(idx, v) =>
              setQState((s) => {
                const sv = [...s.sliderValues]
                sv[idx] = v
                return { ...s, sliderValues: sv }
              })
            }
          />
        )}

        {/* Tarkista button */}
        {!showFeedback && (
          <div className="mt-6">
            <button
              className="w-full rounded-2xl py-4 text-base font-black"
              style={
                canSubmit()
                  ? { background: 'var(--color-mint)', boxShadow: '0 4px 0 var(--color-mint-d)', color: 'white' }
                  : { background: 'var(--color-line)', boxShadow: '0 4px 0 #c9c0ae', color: 'var(--color-ink-soft)' }
              }
              disabled={!canSubmit()}
              onClick={handleSubmit}
            >
              Tarkista
            </button>
          </div>
        )}
      </div>

      {/* Feedback drawer */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            key="feedback"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl px-6 pt-5 pb-8 shadow-xl"
            style={{ background: isCorrect ? 'var(--color-mint-soft)' : '#ffe1e1' }}
          >
            <div
              className="text-lg font-black mb-1"
              style={{ color: isCorrect ? 'var(--color-mint-deep)' : 'var(--color-coral-d)' }}
            >
              {isCorrect ? 'Oikein! 🎉' : 'Melkein!'}
            </div>
            <p className="text-sm font-extrabold text-ink leading-snug mb-5">{q.selitys}</p>
            <button
              className="w-full rounded-2xl py-4 text-base font-black text-white"
              style={{
                background: isCorrect ? 'var(--color-mint)' : 'var(--color-coral)',
                boxShadow: `0 4px 0 ${isCorrect ? 'var(--color-mint-d)' : 'var(--color-coral-d)'}`,
              }}
              onClick={handleContinue}
            >
              Jatka
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
