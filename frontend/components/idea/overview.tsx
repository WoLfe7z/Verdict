import React, { useState } from 'react'

// Icons
import { LuDot } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { IoWarning } from "react-icons/io5";
import {
  LuClipboardCheck, LuFlaskConical, LuMessageSquare, LuRocket, LuChartColumnIncreasing,
  LuSearch, LuUsers, LuTarget, LuDollarSign, LuCpu, LuTrendingUp, LuRefreshCw, LuBriefcase,
} from "react-icons/lu";

// ─── Risk & Constraint Analysis Engine ───────────────────────────────────────

type RiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'High'

interface Metrics {
  marketDemand: number
  problemSeverity: number
  customerClarity: number
  differentiation: number
  monetization: number
  scalability: number
}

interface RiskDriver {
  icon: 'warning'
  label: string
  boldWord: string
}

interface CriticalWeakness {
  title: string
  description: string
}

interface StructuralConstraint {
  label: string
  description: string
}

interface RiskAnalysis {
  overallRisk: RiskLevel
  riskColor: string
  riskBg: string
  primaryDrivers: RiskDriver[]
  criticalWeaknesses: CriticalWeakness[]
  structuralConstraints: StructuralConstraint[]
}

function calculateRiskLevel(metrics: Metrics): RiskLevel {
  const values = Object.values(metrics)
  const lowest = Math.min(...values)
  const highest = Math.max(...values)
  const spread = highest - lowest
  const belowFive = values.filter(v => v < 5).length

  // Weighted average with monetization and demand at 1.5x
  const weightedSum =
    metrics.marketDemand * 1.5 +
    metrics.problemSeverity * 1 +
    metrics.customerClarity * 1 +
    metrics.differentiation * 1 +
    metrics.monetization * 1.5 +
    metrics.scalability * 1
  const weightedAvg = weightedSum / 7

  // Deterministic threshold logic
  if (lowest <= 2 || belowFive >= 3 || weightedAvg < 4) return 'High'
  if (lowest <= 3 || belowFive >= 2 || spread >= 6 || weightedAvg < 5) return 'Elevated'
  if (lowest < 5 || belowFive >= 1 || spread >= 4 || weightedAvg < 6.5) return 'Moderate'
  return 'Low'
}

function getRiskMeta(level: RiskLevel) {
  const map: Record<RiskLevel, { color: string; bg: string }> = {
    Low: { color: 'text-green-400', bg: 'bg-green-500/20' },
    Moderate: { color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    Elevated: { color: 'text-orange-400', bg: 'bg-orange-500/20' },
    High: { color: 'text-red-400', bg: 'bg-red-500/20' },
  }
  return map[level]
}

function deriveRiskDrivers(m: Metrics): RiskDriver[] {
  const drivers: RiskDriver[] = []

  if (m.differentiation < 5) {
    drivers.push({ icon: 'warning', label: 'Competitive Saturation Risk', boldWord: 'Saturation' })
    if (m.differentiation < 4)
      drivers.push({ icon: 'warning', label: 'Limited Differentiation Risk', boldWord: 'Differentiation' })
  }
  if (m.monetization < 5) {
    drivers.push({ icon: 'warning', label: 'Revenue Model Uncertainty', boldWord: 'Revenue' })
    if (m.monetization < 4)
      drivers.push({ icon: 'warning', label: 'Pricing Resistance Risk', boldWord: 'Resistance' })
  }
  if (m.marketDemand < 5) {
    drivers.push({ icon: 'warning', label: 'Demand Validation Risk', boldWord: 'Demand' })
    if (m.marketDemand < 4)
      drivers.push({ icon: 'warning', label: 'Market Collapse Exposure', boldWord: 'Collapse' })
  }
  if (m.problemSeverity < 5) {
    drivers.push({ icon: 'warning', label: 'Weak Problem-Market Fit', boldWord: 'Problem-Market' })
  }
  if (m.customerClarity < 5) {
    drivers.push({ icon: 'warning', label: 'ICP Misalignment Threat', boldWord: 'Misalignment' })
    if (m.customerClarity < 4)
      drivers.push({ icon: 'warning', label: 'Target Audience Ambiguity', boldWord: 'Ambiguity' })
  }
  if (m.scalability < 5) {
    drivers.push({ icon: 'warning', label: 'Scalability Ceiling Risk', boldWord: 'Scalability' })
    if (m.scalability < 4)
      drivers.push({ icon: 'warning', label: 'Infrastructure Bottleneck Threat', boldWord: 'Bottleneck' })
  }

  return drivers
}

function deriveCriticalWeaknesses(m: Metrics): CriticalWeakness[] {
  const weaknesses: CriticalWeakness[] = []

  if (m.marketDemand <= 3)
    weaknesses.push({
      title: `Demand Collapse (${m.marketDemand})`,
      description: 'Insufficient market pull to sustain acquisition economics at scale.',
    })
  if (m.problemSeverity <= 3)
    weaknesses.push({
      title: `Problem Irrelevance (${m.problemSeverity})`,
      description: 'Problem severity does not justify switching costs or behavioral change.',
    })
  if (m.customerClarity <= 3)
    weaknesses.push({
      title: `ICP Undefined (${m.customerClarity})`,
      description: 'Target customer profile lacks specificity required for channel optimization.',
    })
  if (m.differentiation <= 3)
    weaknesses.push({
      title: `Low Differentiation (<${Math.ceil(m.differentiation)})`,
      description: 'Insufficient unique value proposition to stand out from competitors.',
    })
  if (m.monetization <= 3)
    weaknesses.push({
      title: `Monetization Failure (${m.monetization})`,
      description: 'No validated revenue mechanism; unit economics remain theoretical.',
    })
  if (m.scalability <= 3)
    weaknesses.push({
      title: `Scalability Ceiling (${m.scalability})`,
      description: 'Architecture or model constraints prevent cost-efficient scaling beyond initial traction.',
    })

  return weaknesses
}

function deriveStructuralConstraints(m: Metrics, stage?: string): StructuralConstraint[] {
  const constraints: StructuralConstraint[] = []

  if (m.marketDemand >= 8 && m.differentiation <= 5)
    constraints.push({
      label: 'Competitive Density Constraint',
      description: 'High-demand market with low differentiation creates winner-take-all dynamics.',
    })
  if (m.scalability >= 7 && m.monetization < 5)
    constraints.push({
      label: 'Capital Dependency Constraint',
      description: 'Scalable model without monetization validation requires sustained external funding.',
    })
  if (stage === 'Pre-validation' || stage === 'idea')
    constraints.push({
      label: 'Validation Dependency Constraint',
      description: 'All projections are pre-validation; data confidence remains below institutional threshold.',
    })
  if (m.customerClarity < 5 && m.monetization < 5)
    constraints.push({
      label: 'Go-to-Market Uncertainty',
      description: 'Unclear ICP combined with unvalidated pricing prevents reliable channel strategy.',
    })
  if (m.marketDemand >= 7 && m.problemSeverity < 5)
    constraints.push({
      label: 'Engagement Depth Constraint',
      description: 'Market interest exists but problem lacks urgency; risk of shallow engagement.',
    })
  if (m.differentiation < 5 && m.scalability >= 7)
    constraints.push({
      label: 'Commoditization Trajectory',
      description: 'Scalable but undifferentiated offering will compress margins under competition.',
    })

  return constraints
}

function computeRiskAnalysis(metrics: Metrics, stage?: string): RiskAnalysis {
  const overallRisk = calculateRiskLevel(metrics)
  const meta = getRiskMeta(overallRisk)
  return {
    overallRisk,
    riskColor: meta.color,
    riskBg: meta.bg,
    primaryDrivers: deriveRiskDrivers(metrics),
    criticalWeaknesses: deriveCriticalWeaknesses(metrics),
    structuralConstraints: deriveStructuralConstraints(metrics, stage),
  }
}

// ─── Structured Action Roadmap Engine ─────────────────────────────────────────

type Stage = 'Pre-validation' | 'Validation' | 'Early Traction' | 'Growth'
type PhaseType = 'mandatory' | 'conditional' | 'optional'
type PhaseId =
  | 'problem-validation' | 'icp-refinement' | 'demand-verification'
  | 'positioning' | 'monetization-testing' | 'mvp-build'
  | 'traction-validation' | 'unit-economics' | 'scalability-assessment'
  | 'growth-optimization' | 'capital-strategy' | 'pivot-assessment'

interface RoadmapPhase {
  id: PhaseId
  name: string
  objective: string
  actions: string[]
  successCriteria: string
  riskMitigated: string
  duration: string
  type: PhaseType
  priority: number // lower = higher priority
  iconKey: string
}

interface ActivatedPhase extends RoadmapPhase {
  sequence: number
  activationReason: string
}

// Phase Library — 12 modular phases
const PHASE_LIBRARY: RoadmapPhase[] = [
  {
    id: 'problem-validation',
    name: 'Validate Problem Hypothesis',
    objective: 'Confirm problem severity justifies behavioral change and switching costs.',
    actions: [
      'Conduct 20+ structured problem interviews with target segment',
      'Map existing solutions and workaround patterns',
      'Quantify cost-of-inaction for target personas',
    ],
    successCriteria: '70%+ of interviewees confirm active solution-seeking behavior.',
    riskMitigated: 'Problem Irrelevance',
    duration: '2–4 weeks',
    type: 'mandatory',
    priority: 1,
    iconKey: 'search',
  },
  {
    id: 'icp-refinement',
    name: 'Refine ICP Definition',
    objective: 'Establish precise customer profile to enable channel optimization.',
    actions: [
      'Segment initial users by firmographics and behavior',
      'Identify highest-intent subsegment via engagement scoring',
      'Document ICP with quantifiable inclusion/exclusion criteria',
    ],
    successCriteria: 'ICP defined with 3+ measurable attributes and validated against pipeline.',
    riskMitigated: 'ICP Misalignment',
    duration: '2–3 weeks',
    type: 'conditional',
    priority: 2,
    iconKey: 'users',
  },
  {
    id: 'demand-verification',
    name: 'Verify Market Demand',
    objective: 'Validate willingness-to-engage before committing development resources.',
    actions: [
      'Deploy landing page with value proposition A/B variants',
      'Run paid acquisition test across 2+ channels ($500–2k budget)',
      'Measure signup intent rate and cost-per-lead',
    ],
    successCriteria: 'Signup conversion >3% and CPL below industry benchmark.',
    riskMitigated: 'Demand Collapse',
    duration: '2–4 weeks',
    type: 'conditional',
    priority: 3,
    iconKey: 'chart',
  },
  {
    id: 'positioning',
    name: 'Establish Competitive Positioning',
    objective: 'Define defensible value proposition that separates from incumbent solutions.',
    actions: [
      'Conduct competitive feature-gap analysis across top 5 alternatives',
      'Identify underserved need clusters from interview data',
      'Formulate positioning statement with quantifiable differentiation claim',
    ],
    successCriteria: 'Positioning validated by 60%+ target users as clearly distinct.',
    riskMitigated: 'Competitive Saturation',
    duration: '2–3 weeks',
    type: 'conditional',
    priority: 4,
    iconKey: 'target',
  },
  {
    id: 'mvp-build',
    name: 'Build Minimum Viable Product',
    objective: 'Develop functional prototype to test core assumptions with real users.',
    actions: [
      'Scope MVP to 3–5 critical user flows only',
      'Build with fastest-to-market stack; avoid premature optimization',
      'Deploy to closed beta cohort of 20–50 users',
    ],
    successCriteria: 'Beta cohort achieves 40%+ weekly active retention at Day 14.',
    riskMitigated: 'Validation Dependency',
    duration: '4–8 weeks',
    type: 'mandatory',
    priority: 5,
    iconKey: 'flask',
  },
  {
    id: 'monetization-testing',
    name: 'Test Monetization Model',
    objective: 'Validate willingness-to-pay and establish baseline pricing.',
    actions: [
      'Design 2–3 pricing tiers with feature differentiation',
      'Run price sensitivity survey (Van Westendorp or Gabor-Granger)',
      'Deploy paywall to subset of active users; measure conversion',
    ],
    successCriteria: 'Trial-to-paid conversion >5% or pre-sale commitment from 10+ users.',
    riskMitigated: 'Revenue Model Uncertainty',
    duration: '3–5 weeks',
    type: 'conditional',
    priority: 6,
    iconKey: 'dollar',
  },
  {
    id: 'traction-validation',
    name: 'Validate Traction Signals',
    objective: 'Confirm repeatable acquisition and engagement patterns.',
    actions: [
      'Initiate small-scale marketing campaign across validated channel',
      'Track cohort retention curves at Day 1, 7, 14, 30',
      'Measure organic referral coefficient and NPS',
    ],
    successCriteria: 'Month-over-month growth >15% with stable retention curve.',
    riskMitigated: 'Engagement Depth Constraint',
    duration: '4–6 weeks',
    type: 'conditional',
    priority: 7,
    iconKey: 'rocket',
  },
  {
    id: 'unit-economics',
    name: 'Validate Unit Economics',
    objective: 'Confirm LTV:CAC ratio supports sustainable growth.',
    actions: [
      'Calculate blended CAC across all active channels',
      'Project 12-month LTV from current retention and ARPU',
      'Model payback period and contribution margin per cohort',
    ],
    successCriteria: 'LTV:CAC ratio >3:1 or clear trajectory toward it within 2 quarters.',
    riskMitigated: 'Capital Dependency',
    duration: '2–4 weeks',
    type: 'conditional',
    priority: 8,
    iconKey: 'briefcase',
  },
  {
    id: 'scalability-assessment',
    name: 'Assess Scalability Architecture',
    objective: 'Identify infrastructure constraints before scaling investment.',
    actions: [
      'Load-test current architecture at 10x projected volume',
      'Audit operational bottlenecks in delivery pipeline',
      'Document scaling dependencies and cost-per-unit at scale',
    ],
    successCriteria: 'Architecture supports 10x growth without proportional cost increase.',
    riskMitigated: 'Scalability Ceiling',
    duration: '2–4 weeks',
    type: 'conditional',
    priority: 9,
    iconKey: 'cpu',
  },
  {
    id: 'growth-optimization',
    name: 'Optimize Growth Channels',
    objective: 'Scale validated channels while maintaining unit economics.',
    actions: [
      'Double budget on top-performing acquisition channel',
      'Implement systematic A/B framework for funnel optimization',
      'Build referral or virality loop into core product experience',
    ],
    successCriteria: 'CAC decreases 20%+ while maintaining acquisition volume growth.',
    riskMitigated: 'Commoditization Trajectory',
    duration: '4–8 weeks',
    type: 'optional',
    priority: 10,
    iconKey: 'trending',
  },
  {
    id: 'capital-strategy',
    name: 'Define Capital Strategy',
    objective: 'Determine funding approach aligned with validated metrics.',
    actions: [
      'Model 18-month runway scenarios (bootstrap vs. raise)',
      'Prepare data room with validated metrics and projections',
      'Identify optimal instrument (SAFE, equity, revenue-based)',
    ],
    successCriteria: 'Capital plan defined with clear milestone-based deployment schedule.',
    riskMitigated: 'Capital Dependency',
    duration: '2–4 weeks',
    type: 'optional',
    priority: 11,
    iconKey: 'dollar',
  },
  {
    id: 'pivot-assessment',
    name: 'Evaluate Pivot Indicators',
    objective: 'Determine if current trajectory warrants strategic redirection.',
    actions: [
      'Audit all validation metrics against original thresholds',
      'Identify highest-signal adjacent opportunities from user data',
      'Model resource cost of pivot vs. persistence',
    ],
    successCriteria: 'Decision framework outputs clear persist/pivot/terminate signal.',
    riskMitigated: 'Validation Dependency',
    duration: '1–2 weeks',
    type: 'conditional',
    priority: 12,
    iconKey: 'refresh',
  },
]

// Stage-based priority modifiers (lower number = earlier in sequence)
const STAGE_PRIORITY_MODIFIERS: Record<Stage, Partial<Record<PhaseId, number>>> = {
  'Pre-validation': {
    'problem-validation': -5,
    'icp-refinement': -3,
    'demand-verification': -2,
    'positioning': -1,
    'mvp-build': 0,
  },
  'Validation': {
    'mvp-build': -5,
    'monetization-testing': -3,
    'traction-validation': -2,
    'positioning': -1,
  },
  'Early Traction': {
    'unit-economics': -5,
    'traction-validation': -4,
    'scalability-assessment': -3,
    'growth-optimization': -2,
    'monetization-testing': -1,
  },
  'Growth': {
    'growth-optimization': -5,
    'capital-strategy': -4,
    'scalability-assessment': -3,
    'unit-economics': -2,
  },
}

// Activation conditions — returns reason string or null (not activated)
function evaluatePhaseActivation(
  id: PhaseId, m: Metrics, stage: Stage, risk: RiskLevel
): string | null {
  switch (id) {
    case 'problem-validation':
      if (m.problemSeverity < 6) return `Problem Severity at ${m.problemSeverity} — below validation threshold.`
      if (stage === 'Pre-validation') return 'Pre-validation stage requires problem confirmation.'
      return null
    case 'icp-refinement':
      if (m.customerClarity < 6) return `Customer Clarity at ${m.customerClarity} — ICP insufficiently defined.`
      return null
    case 'demand-verification':
      if (m.marketDemand < 7) return `Market Demand at ${m.marketDemand} — requires empirical verification.`
      if (stage === 'Pre-validation' && m.marketDemand < 9) return 'Pre-validation stage; demand unconfirmed.'
      return null
    case 'positioning':
      if (m.differentiation < 6) return `Differentiation at ${m.differentiation} — competitive positioning weak.`
      return null
    case 'mvp-build':
      if (stage === 'Pre-validation' || stage === 'Validation') return `${stage} stage — functional prototype required.`
      return null
    case 'monetization-testing':
      if (m.monetization < 6) return `Monetization at ${m.monetization} — revenue model unvalidated.`
      return null
    case 'traction-validation':
      if (stage === 'Validation' || stage === 'Early Traction') return `${stage} stage — traction signals required.`
      if (m.marketDemand >= 7 && m.problemSeverity < 6) return 'High demand with moderate problem — engagement depth unconfirmed.'
      return null
    case 'unit-economics':
      if (stage === 'Early Traction' || stage === 'Growth') return `${stage} stage — unit economics must be validated.`
      if (m.monetization >= 6 && m.scalability >= 7) return 'Monetization and scalability present — economics assessment needed.'
      return null
    case 'scalability-assessment':
      if (m.scalability < 6) return `Scalability at ${m.scalability} — infrastructure constraints likely.`
      if (stage === 'Early Traction' || stage === 'Growth') return `${stage} stage — scaling readiness assessment required.`
      return null
    case 'growth-optimization':
      if (stage === 'Growth') return 'Growth stage — channel optimization is primary objective.'
      if (stage === 'Early Traction' && m.marketDemand >= 7 && m.differentiation >= 6) return 'Strong demand with differentiation — growth levers available.'
      return null
    case 'capital-strategy':
      if (stage === 'Growth') return 'Growth stage — capital deployment planning required.'
      if (risk === 'High' || risk === 'Elevated') return `${risk} risk — capital runway planning critical.`
      if (m.scalability >= 7 && m.monetization < 5) return 'Scalable model without monetization — external capital likely needed.'
      return null
    case 'pivot-assessment':
      if (risk === 'High') return 'High risk profile — pivot evaluation warranted.'
      if (m.differentiation <= 3 && m.marketDemand < 5) return 'Critical weakness in both demand and differentiation.'
      return null
    default:
      return null
  }
}

function getPhaseIcon(key: string) {
  const map: Record<string, React.ReactNode> = {
    search: <LuSearch className='text-[#7C5CFF] text-xl' />,
    users: <LuUsers className='text-[#7C5CFF] text-xl' />,
    chart: <LuChartColumnIncreasing className='text-[#7C5CFF] text-xl' />,
    target: <LuTarget className='text-[#7C5CFF] text-xl' />,
    flask: <LuFlaskConical className='text-[#7C5CFF] text-xl' />,
    dollar: <LuDollarSign className='text-[#7C5CFF] text-xl' />,
    rocket: <LuRocket className='text-[#7C5CFF] text-xl' />,
    briefcase: <LuBriefcase className='text-[#7C5CFF] text-xl' />,
    cpu: <LuCpu className='text-[#7C5CFF] text-xl' />,
    trending: <LuTrendingUp className='text-[#7C5CFF] text-xl' />,
    refresh: <LuRefreshCw className='text-[#7C5CFF] text-xl' />,
    clipboard: <LuClipboardCheck className='text-[#7C5CFF] text-xl' />,
  }
  return map[key] ?? <LuClipboardCheck className='text-[#7C5CFF] text-xl' />
}

function generateRoadmap(m: Metrics, stage: Stage, risk: RiskLevel): ActivatedPhase[] {
  const activated: ActivatedPhase[] = []
  const stageModifiers = STAGE_PRIORITY_MODIFIERS[stage] || {}

  for (const phase of PHASE_LIBRARY) {
    const reason = evaluatePhaseActivation(phase.id, m, stage, risk)
    if (reason) {
      const modifier = stageModifiers[phase.id] ?? 0
      activated.push({
        ...phase,
        sequence: 0,
        priority: phase.priority + modifier,
        activationReason: reason,
      })
    }
  }

  // Sort by adjusted priority, then assign sequence numbers
  activated.sort((a, b) => a.priority - b.priority)
  activated.forEach((phase, i) => { phase.sequence = i + 1 })

  return activated
}

// ─── Roadmap Readiness Engine ──────────────────────────────────────────────

type ReadinessTier = 'Not Ready' | 'Conditionally Ready' | 'Execution Ready'

interface MetricBreakdownRow {
  key: keyof Metrics
  label: string
  value: number
  weight: number
  contribution: number
  meetsMinimum: boolean
}

interface ReadinessResult {
  rri: number
  tier: ReadinessTier
  hardStopViolations: string[]
  metricBreakdown: MetricBreakdownRow[]
  improvementSignal: {
    label: string
    currentValue: number
    rriGainPerPoint: number
    pointsToNextTier: number
  } | null
}

// Weights must sum to 100. Each point of a metric contributes weight/10 to RRI.
// Customer Clarity is highest-weighted: roadmap phases are ICP-defined.
// Market Demand is second: execution presupposes an addressable target.
// Scalability is lowest: a forward-looking output metric, not a prerequisite.
const RRI_WEIGHTS: Record<keyof Metrics, number> = {
  customerClarity:  25,
  marketDemand:     20,
  differentiation:  15,
  monetization:     15,
  problemSeverity:  15,
  scalability:      10,
}

const METRIC_LABELS: Record<keyof Metrics, string> = {
  marketDemand:    'Market Demand',
  problemSeverity: 'Problem Severity',
  customerClarity: 'Customer Clarity',
  differentiation: 'Differentiation',
  monetization:    'Monetization',
  scalability:     'Scalability',
}

function computeReadiness(m: Metrics): ReadinessResult {
  // Compute RRI — normalized to 0–100
  const rawRRI =
    m.customerClarity  * 25 +
    m.marketDemand     * 20 +
    m.differentiation  * 15 +
    m.monetization     * 15 +
    m.problemSeverity  * 15 +
    m.scalability      * 10
  const rri = Math.round(rawRRI / 10 * 10) / 10

  // Hard stop rules — fatal blockers regardless of RRI
  const hardStopViolations: string[] = []
  if (m.customerClarity < 3)
    hardStopViolations.push(
      `Customer Clarity (${m.customerClarity}) is below the minimum viable threshold of 3.0 — target customer is undefined. All roadmap phases require a defined ICP.`
    )
  if (m.marketDemand < 2)
    hardStopViolations.push(
      `Market Demand (${m.marketDemand}) is below the minimum viable threshold of 2.0 — no market signal present. Execution without demand evidence is structurally unsound.`
    )
  if (m.problemSeverity < 2)
    hardStopViolations.push(
      `Problem Severity (${m.problemSeverity}) is below the minimum viable threshold of 2.0 — no problem foundation. Roadmap intervention logic cannot be constructed.`
    )
  if (m.differentiation < 2 && m.monetization < 2)
    hardStopViolations.push(
      `Compound terminal weakness: Differentiation (${m.differentiation}) and Monetization (${m.monetization}) are both critically low. No competitive position and no revenue mechanism — roadmap generation would produce invalid output.`
    )

  // Structural minimums
  const metricValues = Object.values(m) as number[]
  const metricsBelow4 = metricValues.filter(v => v < 4).length
  const weightedAvg =
    (m.marketDemand * 1.5 + m.problemSeverity + m.customerClarity +
     m.differentiation + m.monetization * 1.5 + m.scalability) / 7

  // Metric breakdown — sorted by weight descending (highest contribution first)
  const metricBreakdown: MetricBreakdownRow[] = (
    Object.keys(RRI_WEIGHTS) as (keyof Metrics)[]
  )
    .sort((a, b) => RRI_WEIGHTS[b] - RRI_WEIGHTS[a])
    .map(key => ({
      key,
      label: METRIC_LABELS[key],
      value: m[key],
      weight: RRI_WEIGHTS[key],
      contribution: Math.round(m[key] * RRI_WEIGHTS[key] / 10 * 10) / 10,
      meetsMinimum: m[key] >= 4,
    }))

  // Determine tier — hard stops and structural minimums take precedence
  let tier: ReadinessTier
  if (
    hardStopViolations.length > 0 ||
    rri < 45 ||
    metricsBelow4 >= 3 ||
    weightedAvg < 4.5
  ) {
    tier = 'Not Ready'
  } else if (rri < 70) {
    tier = 'Conditionally Ready'
  } else {
    tier = 'Execution Ready'
  }

  // Improvement signal — highest-weight metric with room to improve
  // Shows what single metric change would most advance the RRI
  let improvementSignal: ReadinessResult['improvementSignal'] = null
  if (tier !== 'Execution Ready') {
    const nextThreshold = tier === 'Not Ready' ? 45 : 70
    const pointsToTier = nextThreshold - rri
    const candidates = metricBreakdown
      .filter(row => row.value < 9) // only metrics with room to grow
      .map(row => ({
        label: row.label,
        currentValue: row.value,
        rriGainPerPoint: Math.round(row.weight / 10 * 10) / 10,
        pointsToNextTier: Math.round(pointsToTier / (row.weight / 10) * 10) / 10,
      }))
      .sort((a, b) => b.rriGainPerPoint - a.rriGainPerPoint)

    improvementSignal = candidates[0] ?? null
  }

  return { rri, tier, hardStopViolations, metricBreakdown, improvementSignal }
}

// ─── Component ───────────────────────────────────────────────────────────────

function overview() {
  const score = 10

  // Metrics (same source as Core Metric Analysis)
  const metrics: Metrics = {
    marketDemand: 9.0,
    problemSeverity: 9.0,
    customerClarity: 9.0,
    differentiation: 9.0,
    monetization: 9.0,
    scalability: 9.0,
  }

  const stage: Stage = 'Pre-validation'
  const riskAnalysis = computeRiskAnalysis(metrics, stage)
  const roadmap = generateRoadmap(metrics, stage, riskAnalysis.overallRisk)
  const readiness = computeReadiness(metrics)
  const [readinessExpanded, setReadinessExpanded] = useState(false)

  return (
    <div className='space-y-5'>
      {/* ═══ Executive Strategic Summary ═══ */}
      <div id='executive-summary' className='w-full border border-white/8 rounded-[5px] bg-white/2'>
        {/* Section Header */}
        <div className='w-full px-5 py-3 border-b border-white/8 bg-white/3 rounded-t-md flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h1 className='text-base font-medium text-white/90 tracking-wide'>Executive Strategic Summary</h1>
            <span className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Investment Memo</span>
          </div>
          <BsThreeDots className='text-white/40 hover:text-white/65 cursor-pointer transition-colors' />
        </div>

        {/* ─── Tier 1: Primary Indicators ─── */}
        <div className='w-full grid grid-cols-1 lg:grid-cols-12'>

          {/* Opportunity Score — Primary KPI */}
          <div className='lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/8 px-6 py-7 flex flex-col items-center justify-center'>
            <p className='text-[11px] text-white/40 uppercase tracking-widest font-medium mb-0.5'>Opportunity Score</p>
            <p className='text-[10px] text-white/35 mb-4'>Investment Signal</p>
            <div className='relative'>
              <svg width={140} height={90} viewBox="0 0 200 110">
                <path
                  d="M 15 100 A 85 85 0 0 1 185 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={12}
                  strokeLinecap="round"
                />
                <path
                  d={`M 15 100 A 85 85 0 0 1 ${100 + 85 * Math.cos(Math.PI - (score / 100) * Math.PI)} ${100 - 85 * Math.sin(Math.PI - (score / 100) * Math.PI)}`}
                  fill="none"
                  stroke={score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : score >= 30 ? '#f97316' : '#ef4444'}
                  strokeWidth={12}
                  strokeLinecap="round"
                />
              </svg>
              <div className='absolute inset-0 flex items-end justify-center pb-0.5'>
                <span className='text-3xl font-semibold text-white/90 tabular-nums'>{score}</span>
              </div>
            </div>
            <p className='text-[10px] text-white/35 mt-2'>0–100 Composite</p>
          </div>

          {/* ─── Tier 2: Status Indicators + Confidence ─── */}
          <div className='lg:col-span-9 flex flex-col'>

            {/* Status Row — Three badges in a structured row */}
            <div className='grid grid-cols-1 sm:grid-cols-3 border-b border-white/8'>
              {/* Strategic Status */}
              <div className='px-6 py-5 border-b sm:border-b-0 sm:border-r border-white/8'>
                <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-2.5'>Strategic Status</p>
                <span className='inline-flex items-center px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-400/80 rounded border border-amber-500/15'>
                  Validation Recommended
                </span>
              </div>
              {/* Current Stage */}
              <div className='px-6 py-5 border-b sm:border-b-0 sm:border-r border-white/8'>
                <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-2.5'>Current Stage</p>
                <span className='inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-400/70 rounded border border-blue-500/15'>
                  Pre-validation
                </span>
              </div>
              {/* Overall Risk Level */}
              <div className='px-6 py-5'>
                <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-2.5'>Overall Risk Level</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border ${
                  riskAnalysis.overallRisk === 'High' ? 'bg-red-500/10 text-red-400/80 border-red-500/15' :
                  riskAnalysis.overallRisk === 'Elevated' ? 'bg-orange-500/10 text-orange-400/80 border-orange-500/15' :
                  riskAnalysis.overallRisk === 'Moderate' ? 'bg-amber-500/10 text-amber-400/70 border-amber-500/15' :
                  'bg-emerald-500/10 text-emerald-400/70 border-emerald-500/15'
                }`}>
                  <IoWarning className='text-[10px]' />
                  {riskAnalysis.overallRisk}
                </span>
              </div>
            </div>

            {/* Confidence Index — Secondary KPI, horizontal layout */}
            <div className='px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
              <div className='shrink-0'>
                <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-1'>Confidence Index</p>
                <p className='text-[10px] text-white/30'>Model Certainty</p>
              </div>
              {/* Horizontal bar gauge */}
              <div className='flex-1 w-full max-w-md'>
                <div className='flex items-center gap-3'>
                  <div className='flex-1 h-2 bg-white/6 rounded-full overflow-hidden'>
                    <div
                      className='h-full rounded-full transition-all duration-500'
                      style={{
                        width: '72%',
                        backgroundColor: 'rgba(255,255,255,0.35)',
                      }}
                    />
                  </div>
                  <span className='text-lg font-semibold text-white/70 tabular-nums w-14 text-right'>72%</span>
                </div>
                <div className='flex justify-between mt-1.5'>
                  <span className='text-[9px] text-white/30'>Low</span>
                  <span className='text-[9px] text-white/30'>High</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Tier 3: Metadata Footer ─── */}
        <div className='px-5 py-2.5 border-t border-white/6 bg-white/1.5 flex flex-wrap items-center gap-x-6 gap-y-1'>
          <span className='text-[10px] text-white/35'>Last Updated: <span className='text-white/40'>Feb 18, 2026</span></span>
          <span className='text-[10px] text-white/35'>Model Version: <span className='text-white/40'>v2.4</span></span>
          <span className='text-[10px] text-white/35'>Basis: <span className='text-white/40'>6 Core Metrics</span></span>
          <span className='text-[10px] text-white/35'>Evaluation Type: <span className='text-white/40'>Automated</span></span>
        </div>
      </div>

      {/* ═══ Strategic Interpretation ═══ */}
      <div id='strategic-interpretation' className='w-full border border-white/8 rounded-[5px] bg-white/2'>
        {/* Section Header */}
        <div className='w-full px-5 py-3 border-b border-white/8 bg-white/3 rounded-t-[5px] flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h1 className='text-base font-medium text-white/90 tracking-wide'>Strategic Interpretation</h1>
            <span className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Analytical Brief</span>
          </div>
          <BsThreeDots className='text-white/40 hover:text-white/65 cursor-pointer transition-colors' />
        </div>

        {/* Signal Architecture — Structured insight blocks */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>

          {/* Signal 1: Primary Strength */}
          <div className='px-5 py-5 border-b md:border-b lg:border-b-0 md:border-r border-white/8'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-1 h-3.5 rounded-full bg-emerald-500/40' />
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Strength Signal</p>
            </div>
            <p className='text-sm text-white/75 leading-relaxed'>
              Market demand scores well above threshold, indicating validated interest in the problem space.
            </p>
            <p className='text-[10px] text-white/35 mt-3'>Driven by Market Demand (8.5)</p>
          </div>

          {/* Signal 2: Structural Weakness */}
          <div className='px-5 py-5 border-b lg:border-b-0 lg:border-r border-white/8'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-1 h-3.5 rounded-full bg-amber-500/40' />
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Structural Weakness</p>
            </div>
            <p className='text-sm text-white/75 leading-relaxed'>
              Differentiation remains below defensibility threshold. Competitive positioning lacks a durable moat.
            </p>
            <p className='text-[10px] text-white/35 mt-3'>Driven by Differentiation (4.5)</p>
          </div>

          {/* Signal 3: Strategic Tension */}
          <div className='px-5 py-5 border-b md:border-b-0 md:border-r border-white/8'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-1 h-3.5 rounded-full bg-white/20' />
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Strategic Tension</p>
            </div>
            <p className='text-sm text-white/75 leading-relaxed'>
              High demand in a space with low differentiation creates winner-take-all pressure. Speed to validation is critical.
            </p>
            <p className='text-[10px] text-white/35 mt-3'>Demand vs. Differentiation spread</p>
          </div>

          {/* Signal 4: Implication */}
          <div className='px-5 py-5'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-1 h-3.5 rounded-full bg-blue-500/30' />
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Implication</p>
            </div>
            <p className='text-sm text-white/75 leading-relaxed'>
              Pre-validation stage is warranted. Prioritize competitive positioning refinement before committing development capital.
            </p>
            <p className='text-[10px] text-white/35 mt-3'>Recommended: Position before build</p>
          </div>
        </div>

        {/* Synthesis Row — One-line executive takeaway */}
        <div className='px-5 py-3 border-t border-white/6 bg-white/1.5'>
          <div className='flex items-start gap-2.5'>
            <span className='text-[10px] text-white/40 uppercase tracking-widest font-medium shrink-0 mt-0.5'>Synthesis</span>
            <p className='text-xs text-white/65 leading-relaxed'>
              Viable demand signal with insufficient defensibility. The opportunity is real but unprotected — validation and positioning must precede investment escalation.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Core Metric Analysis ═══ */}
      <div id='core-metrics' className='w-full border border-white/8 rounded-[5px] bg-white/2'>
        {/* Section Header */}
        <div className='w-full px-5 py-3 border-b border-white/8 bg-white/3 rounded-t-[5px] flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h1 className='text-base font-medium text-white/90 tracking-wide'>Core Metric Analysis</h1>
            <span className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Evidence Layer</span>
          </div>
          <BsThreeDots className='text-white/40 hover:text-white/65 cursor-pointer transition-colors' />
        </div>

        {/* Column Headers — Desktop only */}
        <div className='hidden md:grid md:grid-cols-12 px-5 py-2 border-b border-white/6 bg-white/1.5'>
          <div className='col-span-1'>
            <span className='text-[9px] text-white/35 uppercase tracking-widest'>Score</span>
          </div>
          <div className='col-span-3'>
            <span className='text-[9px] text-white/35 uppercase tracking-widest'>Metric</span>
          </div>
          <div className='col-span-3'>
            <span className='text-[9px] text-white/35 uppercase tracking-widest'>Signal</span>
          </div>
          <div className='col-span-5'>
            <span className='text-[9px] text-white/35 uppercase tracking-widest'>Assessment</span>
          </div>
        </div>

        {/* Metric Rows */}
        <div className='divide-y divide-white/6'>
          {[
            { score: 8.5, label: 'Market Demand', weight: '1.5x', assessment: 'High level of interest and demand in the target segment. Acquisition economics are favorable.' },
            { score: 6, label: 'Problem Severity', weight: '1.0x', assessment: 'Moderate problem being addressed. Not yet critical enough to guarantee switching behavior.' },
            { score: 6.5, label: 'Customer Clarity', weight: '1.0x', assessment: 'Reasonable understanding of customer needs and personas. ICP requires further refinement.' },
            { score: 4.5, label: 'Differentiation', weight: '1.0x', assessment: 'Limited unique advantage over existing solutions. Competitive moat is insufficient.' },
            { score: 7, label: 'Monetization', weight: '1.5x', assessment: 'Clear monetization principles established but revenue model requires empirical validation.' },
            { score: 7.5, label: 'Scalability', weight: '1.0x', assessment: 'Good potential to scale with targeted investment. Architecture supports growth trajectory.' },
          ].map((metric) => {
            const isBelowThreshold = metric.score < 5
            const isModerate = metric.score >= 5 && metric.score < 7
            return (
              <div key={metric.label} className='group'>
                {/* Desktop layout */}
                <div className='hidden md:grid md:grid-cols-12 items-center px-5 py-4 gap-x-2'>
                  {/* Score */}
                  <div className='col-span-1'>
                    <span className={`text-xl font-semibold tabular-nums ${
                      isBelowThreshold ? 'text-amber-400/70' : 'text-white/65'
                    }`}>
                      {metric.score}
                    </span>
                  </div>
                  {/* Metric name + weight */}
                  <div className='col-span-3'>
                    <p className={`text-sm font-medium ${isBelowThreshold ? 'text-white/80' : 'text-white/65'}`}>
                      {metric.label}
                    </p>
                    <p className='text-[10px] text-white/30 mt-0.5'>Weight: {metric.weight}</p>
                  </div>
                  {/* Signal bar */}
                  <div className='col-span-3 pr-4'>
                    <div className='w-full h-1 bg-white/6 rounded-full overflow-hidden'>
                      <div
                        className='h-full rounded-full transition-all duration-500'
                        style={{
                          width: `${(metric.score / 10) * 100}%`,
                          backgroundColor: isBelowThreshold
                            ? 'rgba(251, 191, 36, 0.5)'
                            : isModerate
                              ? 'rgba(255, 255, 255, 0.25)'
                              : 'rgba(255, 255, 255, 0.30)',
                        }}
                      />
                    </div>
                    <div className='flex justify-between mt-1'>
                      <span className='text-[8px] text-white/20'>0</span>
                      <span className='text-[8px] text-white/20'>10</span>
                    </div>
                  </div>
                  {/* Assessment */}
                  <div className='col-span-5'>
                    <p className='text-xs text-white/55 leading-relaxed'>{metric.assessment}</p>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className='md:hidden px-5 py-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-3'>
                      <span className={`text-lg font-semibold tabular-nums ${
                        isBelowThreshold ? 'text-amber-400/70' : 'text-white/65'
                      }`}>
                        {metric.score}
                      </span>
                      <p className={`text-sm font-medium ${isBelowThreshold ? 'text-white/80' : 'text-white/65'}`}>
                        {metric.label}
                      </p>
                    </div>
                    <span className='text-[10px] text-white/30'>{metric.weight}</span>
                  </div>
                  <div className='w-full h-1 bg-white/6 rounded-full overflow-hidden mb-2'>
                    <div
                      className='h-full rounded-full'
                      style={{
                        width: `${(metric.score / 10) * 100}%`,
                        backgroundColor: isBelowThreshold
                          ? 'rgba(251, 191, 36, 0.5)'
                          : 'rgba(255, 255, 255, 0.25)',
                      }}
                    />
                  </div>
                  <p className='text-xs text-white/55 leading-relaxed'>{metric.assessment}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Footer */}
        <div className='px-5 py-2.5 border-t border-white/6 bg-white/1.5 flex flex-wrap items-center gap-x-6 gap-y-1'>
          <span className='text-[10px] text-white/35'>Weighted Average: <span className='text-white/40'>6.6</span></span>
          <span className='text-[10px] text-white/35'>Metrics Below Threshold: <span className='text-white/40'>1 of 6</span></span>
          <span className='text-[10px] text-white/35'>Score Spread: <span className='text-white/40'>4.0</span></span>
        </div>
      </div>

      {/* ═══ Risk & Constraint Analysis ═══ */}
      <div id='risk-analysis' className='w-full border border-white/8 rounded-[5px] bg-white/2'>
        {/* Section Header with Risk Classification */}
        <div className='w-full px-5 py-3 border-b border-white/8 bg-white/3 rounded-t-[5px] flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h1 className='text-base font-medium text-white/90 tracking-wide'>Risk & Constraint Analysis</h1>
            <span className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Fragility Assessment</span>
          </div>
          <div className='flex items-center gap-3'>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded border ${
              riskAnalysis.overallRisk === 'High' ? 'bg-red-500/8 text-red-400/70 border-red-500/12' :
              riskAnalysis.overallRisk === 'Elevated' ? 'bg-orange-500/8 text-orange-400/70 border-orange-500/12' :
              riskAnalysis.overallRisk === 'Moderate' ? 'bg-amber-500/8 text-amber-400/60 border-amber-500/12' :
              'bg-emerald-500/8 text-emerald-400/60 border-emerald-500/12'
            }`}>
              {riskAnalysis.overallRisk} Risk
            </span>
            <BsThreeDots className='text-white/40 hover:text-white/65 cursor-pointer transition-colors' />
          </div>
        </div>

        {/* Risk Content — Two-column on desktop, stacked on mobile */}
        <div className='grid grid-cols-1 lg:grid-cols-2'>

          {/* Left Column: Risk Drivers */}
          {riskAnalysis.primaryDrivers.length > 0 && (
            <div className='px-5 py-5 border-b lg:border-b-0 lg:border-r border-white/8'>
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-4'>Primary Risk Drivers</p>
              <div className='space-y-3'>
                {riskAnalysis.primaryDrivers.map((driver, i) => (
                  <div key={i} className='flex items-start gap-2.5'>
                    <div className='w-1 h-1 rounded-full bg-amber-500/40 mt-1.5 shrink-0' />
                    <span className='text-sm text-white/65 leading-relaxed'>
                      {driver.label.split(driver.boldWord).map((part, j, arr) => (
                        <React.Fragment key={j}>
                          {part}
                          {j < arr.length - 1 && <span className='text-white/80 font-medium'>{driver.boldWord}</span>}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Column: Structural Constraints */}
          {riskAnalysis.structuralConstraints.length > 0 && (
            <div className='px-5 py-5'>
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-4'>Structural Constraints</p>
              <div className='space-y-4'>
                {riskAnalysis.structuralConstraints.map((constraint, i) => (
                  <div key={i}>
                    <p className='text-sm text-white/65 font-medium mb-0.5'>{constraint.label}</p>
                    <p className='text-xs text-white/40 leading-relaxed'>{constraint.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Critical Weaknesses — Full-width bottom section, conditionally rendered */}
        {riskAnalysis.criticalWeaknesses.length > 0 && (
          <div className='border-t border-white/8'>
            <div className='px-5 py-4'>
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-4'>Critical Weaknesses</p>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {riskAnalysis.criticalWeaknesses.map((weakness, i) => (
                  <div key={i} className='border-l-2 border-amber-500/25 pl-3.5'>
                    <p className='text-sm text-white/70 font-medium mb-1'>{weakness.title}</p>
                    <p className='text-xs text-white/40 leading-relaxed'>{weakness.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Risk Summary Footer */}
        <div className='px-5 py-2.5 border-t border-white/6 bg-white/1.5 flex flex-wrap items-center gap-x-6 gap-y-1'>
          <span className='text-[10px] text-white/35'>Drivers Identified: <span className='text-white/40'>{riskAnalysis.primaryDrivers.length}</span></span>
          <span className='text-[10px] text-white/35'>Critical Weaknesses: <span className='text-white/40'>{riskAnalysis.criticalWeaknesses.length}</span></span>
          <span className='text-[10px] text-white/35'>Constraints: <span className='text-white/40'>{riskAnalysis.structuralConstraints.length}</span></span>
        </div>
      </div>

      {/* ═══ Primary Strategic Recommendation ═══ */}
      <div id='recommendation' className='w-full border border-white/8 rounded-[5px] bg-white/2'>
        {/* Section Header */}
        <div className='w-full px-5 py-3 border-b border-white/8 bg-white/3 rounded-t-[5px] flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h1 className='text-base font-medium text-white/90 tracking-wide'>Primary Strategic Recommendation</h1>
            <span className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>System Directive</span>
          </div>
          <BsThreeDots className='text-white/40 hover:text-white/65 cursor-pointer transition-colors' />
        </div>

        {/* Directive Body — Split layout */}
        <div className='grid grid-cols-1 lg:grid-cols-12'>

          {/* Left: Strategic Decision */}
          <div className='lg:col-span-8 border-b lg:border-b-0 lg:border-r border-white/8'>
            {/* Verdict Statement */}
            <div className='px-5 py-5 border-b border-white/6'>
              <div className='flex items-center gap-2.5 mb-3'>
                <div className='w-1.5 h-1.5 rounded-full bg-[#7C5CFF]/50' />
                <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Decision</p>
              </div>
              <h2 className='text-lg font-medium text-white/90 mb-2'>Pursue Immediate Validation</h2>
              <p className='text-sm text-white/65 leading-relaxed max-w-2xl'>
                Limited defensibility necessitates verification of market demand before further development investment. Current metric profile does not support capital escalation without empirical confirmation of core assumptions.
              </p>
            </div>

            {/* Supporting Rationale */}
            <div className='px-5 py-4'>
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-3'>Rationale</p>
              <div className='space-y-2'>
                <div className='flex items-start gap-2.5'>
                  <span className='text-[10px] text-white/35 mt-0.5 shrink-0'>01</span>
                  <p className='text-xs text-white/65 leading-relaxed'>High market demand (8.5) confirms addressable interest, but low differentiation (4.5) exposes the position to competitive erosion.</p>
                </div>
                <div className='flex items-start gap-2.5'>
                  <span className='text-[10px] text-white/35 mt-0.5 shrink-0'>02</span>
                  <p className='text-xs text-white/65 leading-relaxed'>Pre-validation stage requires empirical evidence before resource commitment. Validation reduces downside exposure while preserving optionality.</p>
                </div>
                <div className='flex items-start gap-2.5'>
                  <span className='text-[10px] text-white/35 mt-0.5 shrink-0'>03</span>
                  <p className='text-xs text-white/65 leading-relaxed'>Monetization (7.0) and scalability (7.5) are supportive but conditional on differentiation improvements to sustain margin.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Immediate Focus Areas */}
          <div className='lg:col-span-4 px-5 py-5'>
            <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-4'>Immediate Priorities</p>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='w-6 h-6 shrink-0 rounded border border-white/10 bg-white/3 flex items-center justify-center mt-0.5'>
                  <LuFlaskConical className='text-white/40 text-xs' />
                </div>
                <div>
                  <p className='text-sm text-white/65 font-medium'>Build MVP</p>
                  <p className='text-[11px] text-white/40 mt-0.5'>Functional prototype for assumption testing</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-6 h-6 shrink-0 rounded border border-white/10 bg-white/3 flex items-center justify-center mt-0.5'>
                  <LuMessageSquare className='text-white/40 text-xs' />
                </div>
                <div>
                  <p className='text-sm text-white/65 font-medium'>Conduct Customer Interviews</p>
                  <p className='text-[11px] text-white/40 mt-0.5'>20+ structured interviews with target ICP</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-6 h-6 shrink-0 rounded border border-white/10 bg-white/3 flex items-center justify-center mt-0.5'>
                  <LuRocket className='text-white/40 text-xs' />
                </div>
                <div>
                  <p className='text-sm text-white/65 font-medium'>Launch Test Campaign</p>
                  <p className='text-[11px] text-white/40 mt-0.5'>Paid acquisition test across 2+ channels</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Directive Footer */}
        <div className='px-5 py-2.5 border-t border-white/6 bg-white/1.5 flex flex-wrap items-center gap-x-6 gap-y-1'>
          <span className='text-[10px] text-white/35'>Confidence: <span className='text-white/40'>72%</span></span>
          <span className='text-[10px] text-white/35'>Risk-Adjusted: <span className='text-white/40'>Yes</span></span>
          <span className='text-[10px] text-white/35'>Stage-Aligned: <span className='text-white/40'>Pre-validation</span></span>
        </div>
      </div>

      {/* ═══ Execution Readiness Framework + Structured Action Roadmap ═══ */}
      <div id='action-roadmap' className='w-full space-y-3'>

        {/* ─ Execution Readiness Framework ─ */}
        <div className='w-full border border-white/8 rounded-[5px] bg-white/2'>
          <div className='w-full px-5 py-3 border-b border-white/8 bg-white/3 rounded-t-[5px] flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <h1 className='text-base font-medium text-white/90 tracking-wide'>Execution Readiness Framework</h1>
              <span className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>Governance Policy</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded border ${
                readiness.tier === 'Execution Ready'
                  ? 'bg-emerald-500/8 text-emerald-400/70 border-emerald-500/12'
                  : readiness.tier === 'Conditionally Ready'
                    ? 'bg-amber-500/8 text-amber-400/70 border-amber-500/12'
                    : 'bg-red-500/8 text-red-400/60 border-red-500/12'
              }`}>
                {readiness.tier}
              </span>
              <button
                onClick={() => setReadinessExpanded(v => !v)}
                className='text-[11px] text-white/35 hover:text-white/60 transition-colors'
              >
                {readinessExpanded ? 'Collapse' : 'Show Breakdown'}
              </button>
              <BsThreeDots className='text-white/40 hover:text-white/65 cursor-pointer transition-colors' />
            </div>
          </div>

          {/* RRI score + threshold bar — always visible */}
          <div className='px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5'>
            <div className='shrink-0'>
              <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-1'>Readiness Index</p>
              <div className='flex items-baseline gap-1.5'>
                <span className='text-3xl font-semibold text-white/90 tabular-nums'>{readiness.rri}</span>
                <span className='text-sm text-white/30'>/ 100</span>
              </div>
            </div>
            <div className='flex-1 w-full max-w-xl'>
              <div className='relative h-1.5 bg-white/6 rounded-full overflow-hidden'>
                <div
                  className='absolute left-0 top-0 h-full rounded-full transition-all duration-500'
                  style={{
                    width: `${readiness.rri}%`,
                    backgroundColor:
                      readiness.tier === 'Execution Ready'      ? 'rgba(34,197,94,0.45)'
                      : readiness.tier === 'Conditionally Ready' ? 'rgba(251,191,36,0.45)'
                      : 'rgba(239,68,68,0.35)',
                  }}
                />
                <div className='absolute top-0 bottom-0 w-px bg-white/20' style={{ left: '45%' }} />
                <div className='absolute top-0 bottom-0 w-px bg-white/20' style={{ left: '70%' }} />
              </div>
              <div className='relative flex mt-1.5 text-[9px] text-white/20'>
                <span>0</span>
                <span className='absolute' style={{ left: 'calc(45% - 6px)' }}>45</span>
                <span className='absolute' style={{ left: 'calc(70% - 6px)' }}>70</span>
                <span className='ml-auto'>100</span>
              </div>
            </div>
          </div>

          {/* Collapsible breakdown */}
          {readinessExpanded && (
            <div className='border-t border-white/8'>

              {/* Gate violations */}
              {readiness.hardStopViolations.length > 0 && (
                <div className='px-5 py-4 border-b border-white/8'>
                  <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-3'>Gate Violations</p>
                  <div className='space-y-2.5'>
                    {readiness.hardStopViolations.map((v, i) => (
                      <div key={i} className='flex items-start gap-2.5'>
                        <div className='w-1 h-1 rounded-full bg-red-400/50 mt-1.5 shrink-0' />
                        <p className='text-xs text-red-300/55 leading-relaxed'>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signal contribution table */}
              <div className='px-5 py-4 border-b border-white/8'>
                <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-3'>Signal Contribution Breakdown</p>
                <div className='hidden md:grid grid-cols-12 mb-2 gap-x-2'>
                  <span className='col-span-4 text-[9px] text-white/25 uppercase tracking-widest'>Metric</span>
                  <span className='col-span-2 text-[9px] text-white/25 uppercase tracking-widest'>Value</span>
                  <span className='col-span-2 text-[9px] text-white/25 uppercase tracking-widest'>Weight</span>
                  <span className='col-span-2 text-[9px] text-white/25 uppercase tracking-widest'>Contribution</span>
                  <span className='col-span-2 text-[9px] text-white/25 uppercase tracking-widest'>Status</span>
                </div>
                <div className='divide-y divide-white/[0.04]'>
                  {readiness.metricBreakdown.map((row) => (
                    <div key={row.key} className='grid grid-cols-12 items-center py-2 gap-x-2'>
                      <span className='col-span-4 text-xs text-white/55'>{row.label}</span>
                      <span className={`col-span-2 text-xs tabular-nums font-medium ${
                        !row.meetsMinimum ? 'text-amber-400/70' : 'text-white/50'
                      }`}>{row.value}</span>
                      <span className='col-span-2 text-xs text-white/25 tabular-nums'>{row.weight}%</span>
                      <span className='col-span-2 text-xs text-white/45 tabular-nums'>{row.contribution}</span>
                      <span className='col-span-2 text-[10px]'>
                        {row.meetsMinimum
                          ? <span className='text-white/20'>—</span>
                          : <span className='text-amber-400/45'>Below min.</span>
                        }
                      </span>
                    </div>
                  ))}
                </div>
                <div className='mt-3 pt-2.5 border-t border-white/6 flex flex-wrap items-center gap-x-5 gap-y-1'>
                  <span className='text-[10px] text-white/35'>RRI Total: <span className='text-white/50 font-medium tabular-nums'>{readiness.rri} / 100</span></span>
                  <span className='text-[10px] text-white/20'>Conditional gate: 45 · Execution gate: 70</span>
                </div>
              </div>

              {/* Improvement signal */}
              {readiness.improvementSignal && (
                <div className='px-5 py-4'>
                  <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-2'>Improvement Signal</p>
                  <p className='text-xs text-white/45 leading-relaxed'>
                    A +1.0 improvement in{' '}
                    <span className='text-white/65 font-medium'>{readiness.improvementSignal.label}</span>
                    {' '}(currently {readiness.improvementSignal.currentValue}) advances the Readiness Index by{' '}
                    <span className='text-white/65 font-medium'>+{readiness.improvementSignal.rriGainPerPoint} points</span>.
                    {readiness.tier === 'Conditionally Ready' && (
                      <span className='text-white/30'>
                        {' '}{readiness.improvementSignal.pointsToNextTier} metric points needed in this dimension to reach Execution Ready.
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Framework footer */}
          <div className='px-5 py-2.5 border-t border-white/6 bg-white/1.5 flex flex-wrap items-center gap-x-6 gap-y-1'>
            <span className='text-[10px] text-white/25'>Not Ready: RRI &lt; 45 or hard stop violated</span>
            <span className='text-[10px] text-white/25'>Conditional: 45–69</span>
            <span className='text-[10px] text-white/25'>Execution Ready: ≥ 70</span>
          </div>
        </div>

        {/* ─ Roadmap — gated by readiness tier ─ */}
        {readiness.tier === 'Not Ready' ? (
          <div className='w-full border border-white/6 rounded-[5px]'>
            <div className='px-5 py-3 border-b border-white/5 bg-white/[0.015] rounded-t-[5px] flex items-center gap-3'>
              <h1 className='text-base font-medium text-white/25 tracking-wide'>Structured Action Roadmap</h1>
              <span className='text-[10px] text-white/20 uppercase tracking-widest font-medium'>Generation Blocked</span>
            </div>
            <div className='px-5 py-10 text-center'>
              <p className='text-sm text-white/20 mb-1.5'>Roadmap generation blocked.</p>
              <p className='text-xs text-white/15 max-w-sm mx-auto leading-relaxed'>
                One or more structural prerequisites have not been satisfied. Resolve gate violations in the Execution Readiness Framework above.
              </p>
            </div>
          </div>
        ) : (
          <div className='w-full'>

            {/* Conditional governance banner */}
            {readiness.tier === 'Conditionally Ready' && (
              <div className='mb-3 px-4 py-3 border border-amber-500/12 rounded-[5px] bg-amber-500/[0.025] flex items-start gap-3'>
                <div className='w-0.5 shrink-0 self-stretch rounded-full bg-amber-500/25' />
                <div>
                  <p className='text-[10px] text-amber-400/55 uppercase tracking-widest font-medium mb-1'>Conditional Analytical Maturity</p>
                  <p className='text-xs text-white/30 leading-relaxed'>
                    Readiness Index {readiness.rri}/100 — below the Execution Ready threshold of 70.
                    This roadmap is directional. Execution confidence is constrained by weak signals. Validate inputs before committing resources.
                  </p>
                </div>
              </div>
            )}

            <div className='flex justify-between items-center px-2 mb-3'>
              <h1 className='text-xl text-white/90'>Structured Action Roadmap</h1>
              <div className='flex items-center gap-3'>
                <span className='text-xs text-white/40'>{roadmap.length} phases activated</span>
                <BsThreeDots className='text-white/40 hover:text-white cursor-pointer' />
              </div>
            </div>
            <div className='space-y-0'>
              {roadmap.map((phase, i) => (
                <div key={phase.id} className='relative flex gap-0'>
                  <div className='flex flex-col items-center w-10 shrink-0'>
                    <div className='w-7 h-7 rounded-full border border-[#7C5CFF]/50 bg-[#7C5CFF]/10 flex items-center justify-center z-10'>
                      <span className='text-xs font-semibold text-[#7C5CFF]'>{phase.sequence}</span>
                    </div>
                    {i < roadmap.length - 1 && (
                      <div className='w-px flex-1 bg-[#7C5CFF]/20' />
                    )}
                  </div>
                  <div className='flex-1 mb-3 ml-2 border border-white/10 rounded-[5px] overflow-hidden'>
                    <div className='flex items-center gap-3 px-4 py-3 bg-white/2'>
                      <div className='w-8 h-8 shrink-0 rounded-[5px] border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 flex items-center justify-center'>
                        {getPhaseIcon(phase.iconKey)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-semibold text-white/90'>{phase.name}</h3>
                      </div>
                      <span className='text-xs text-white/40 shrink-0'>{phase.duration}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-[3px] shrink-0 ${
                        phase.type === 'mandatory' ? 'bg-[#7C5CFF]/15 text-[#7C5CFF]' :
                        phase.type === 'conditional' ? 'bg-yellow-500/10 text-yellow-500/70' :
                        'bg-white/5 text-white/40'
                      }`}>{phase.type}</span>
                      <BsThreeDots className='text-white/35 hover:text-white cursor-pointer shrink-0' />
                    </div>
                    <div className='px-4 py-3 space-y-2.5'>
                      <p className='text-sm text-white/50 leading-5'>{phase.objective}</p>
                      <div className='space-y-1.5'>
                        {phase.actions.map((action, j) => (
                          <div key={j} className='flex items-start gap-2'>
                            <LuDot className='text-white/35 text-lg shrink-0 -mt-0.5' />
                            <span className='text-xs text-white/45 leading-4'>{action}</span>
                          </div>
                        ))}
                      </div>
                      <div className='flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 border-t border-white/5'>
                        <span className='text-xs text-white/40'>
                          Success: <span className='text-white/50'>{phase.successCriteria}</span>
                        </span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <span className='text-xs text-white/35'>Activation:</span>
                        <span className='text-xs text-[#7C5CFF]/60'>{phase.activationReason}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══ Strategic Advisor ═══ */}
      <div id='strategic-advisor' className='w-full border border-white/8 rounded-[5px] bg-white/2'>
        <div className='w-full px-5 py-3 border-b border-white/8 bg-white/3 rounded-t-[5px] flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h1 className='text-base font-medium text-white/90 tracking-wide'>Strategic Advisor</h1>
            <span className='text-[10px] text-white/40 uppercase tracking-widest font-medium'>AI Panel</span>
          </div>
        </div>
        <div className='px-5 py-5'>
          <p className='text-[10px] text-white/40 uppercase tracking-widest font-medium mb-3'>Advisory Interface</p>
          <p className='text-sm text-white/55 leading-relaxed max-w-xl'>
            The Strategic Advisor panel is available on the right. Submit questions to interrogate assumptions, challenge the risk profile, or explore alternative strategic positions based on this evaluation.
          </p>
          <div className='mt-4 flex items-center gap-2'>
            <div className='w-1.5 h-1.5 rounded-full bg-[#7C5CFF]/50' />
            <p className='text-[11px] text-white/35'>Active — see panel on the right</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default overview
