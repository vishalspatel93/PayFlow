import { useMemo, useState } from 'react'
import { paymentMethods } from './config/paymentMethods'

type ViewMode = 'flow' | 'fees' | 'ai'

function App() {
  const [selectedMethodId, setSelectedMethodId] = useState('card_visa_mc')
  const [amount, setAmount] = useState(100)
  const [chaosEnabled, setChaosEnabled] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('flow')

  const selectedMethod = useMemo(
    () => paymentMethods.find((m) => m.id === selectedMethodId),
    [selectedMethodId],
  )

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-950/80 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/20 text-sm font-semibold text-violet-300 ring-1 ring-inset ring-violet-500/40">
                PF
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">
                PayFlow
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Payment system visualizer & transaction flow simulator
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-200">
              Portfolio prototype
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline">
              No real payments. Educational only.
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 md:flex-row">
        {/* Left panel: configuration */}
        <section className="flex w-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-lg shadow-black/40 md:w-72">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Payment method
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Each method has a distinct flow, fee model, and failure profile.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {paymentMethods.map((method) => {
              const isSelected = method.id === selectedMethodId
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethodId(method.id)}
                  className={[
                    'flex flex-col items-start rounded-xl border px-3 py-2 text-left text-xs transition',
                    isSelected
                      ? 'border-violet-500/80 bg-violet-500/15 shadow-sm shadow-violet-500/30'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900',
                  ].join(' ')}
                >
                  <span className="text-[13px] font-medium text-slate-50">
                    {method.name}
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-400">
                    {method.tagline}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
                    {method.participants.length} participants ·{' '}
                    {method.steps.length} steps
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-2 space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <div className="flex items-center justify-between text-xs text-slate-200">
              <label htmlFor="amount-slider" className="cursor-pointer">
                Transaction amount
              </label>
              <span className="tabular-nums text-slate-100">
                ${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <input
              id="amount-slider"
              type="range"
              min={5}
              max={5000}
              step={5}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value, 10))}
              className="w-full accent-violet-400"
              aria-describedby="amount-help"
            />
            <p id="amount-help" className="text-[11px] text-slate-300">
              Move the slider to see how fees and economics change at different
              price points.
            </p>
          </div>

          <div className="mt-1 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs">
            <div>
              <p id="chaos-mode-label" className="font-medium text-slate-100">
                Chaos mode
              </p>
              <p id="chaos-mode-help" className="text-[11px] text-slate-300">
                Simulate failures like declines, timeouts, and NSFs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setChaosEnabled((v) => !v)}
              className={[
                'relative inline-flex h-6 w-11 items-center rounded-full border border-slate-700 transition',
                chaosEnabled ? 'bg-rose-500/70' : 'bg-slate-900',
              ].join(' ')}
              role="switch"
              aria-checked={chaosEnabled}
              aria-labelledby="chaos-mode-label chaos-mode-help"
            >
              <span
                className={[
                  'inline-block h-4 w-4 transform rounded-full bg-white shadow transition',
                  chaosEnabled ? 'translate-x-5' : 'translate-x-1',
                ].join(' ')}
              />
            </button>
          </div>

          <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-400">
            <p className="font-medium text-slate-200">
              Built by Vishal for payments PMs, engineers, and stakeholders.
            </p>
            <p className="mt-1">
              This prototype focuses on the visualization shell. The AI
              explainer will plug in later without changing the hosting model.
            </p>
          </div>
        </section>

        {/* Center + right: canvas & context */}
        <section className="flex min-h-[420px] flex-1 flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-lg shadow-black/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                {selectedMethod?.name ?? 'Payment flow'}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Animated transaction path across customers, gateways, processors,
                networks, banks, and settlement systems.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Simulated only
              </span>
              <span className="hidden sm:inline">No live money movement.</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            {/* Flow canvas placeholder */}
            <div className="flex flex-1 flex-col gap-3 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-900/80 p-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Transaction graph</span>
                <span className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Request path
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Approval
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    Failure
                  </span>
                </span>
              </div>

              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-950/80">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                  <div className="absolute left-1/2 top-6 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-violet-500/70 via-slate-700 to-transparent" />
                  <div className="absolute left-6 top-1/2 w-10 -translate-y-1/2 bg-gradient-to-r from-sky-500/60 via-slate-700 to-transparent" />
                  <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full border border-slate-700/80" />
                </div>

                <div className="relative grid w-full max-w-xl grid-cols-3 gap-6 text-[11px] text-slate-200">
                  <FlowNode label="Customer" variant="primary" />
                  <FlowNode label="Merchant" variant="muted" />
                  <FlowNode label="Gateway" variant="muted" />
                  <FlowNode label="Processor" variant="muted" />
                  <FlowNode label="Network" variant="muted" />
                  <FlowNode label="Issuer" variant="muted" />
                  <FlowNode label="Acquirer" variant="muted" />
                  <FlowNode label="Settlement" variant="muted" />

                  <div className="pointer-events-none absolute inset-0">
                    <BezierArrow />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>
                  This canvas will evolve into a fully animated, stepable
                  transaction flow with latency, data, and fee overlays.
                </span>
                <span className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                  >
                    Play (coming soon)
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                  >
                    Step Through
                  </button>
                </span>
              </div>
            </div>

            {/* Right context panel */}
            <aside className="flex w-full flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 md:w-80">
              <div className="flex items-center justify-between">
                <nav className="flex gap-1 rounded-full border border-slate-800 bg-slate-900/80 p-0.5 text-[11px]">
                  <Tab
                    label="Flow detail"
                    active={viewMode === 'flow'}
                    onClick={() => setViewMode('flow')}
                  />
                  <Tab
                    label="Fee breakdown"
                    active={viewMode === 'fees'}
                    onClick={() => setViewMode('fees')}
                  />
                  <Tab
                    label="AI explainer (stub)"
                    active={viewMode === 'ai'}
                    onClick={() => setViewMode('ai')}
                  />
                </nav>
              </div>

              <div className="mt-1 flex-1 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-slate-300">
                {viewMode === 'flow' && (
                  <FlowDetailPanel
                    methodName={selectedMethod?.name ?? 'Selected method'}
                  />
                )}
                {viewMode === 'fees' && selectedMethod && (
                  <FeePanel amount={amount} methodId={selectedMethod.id} />
                )}
                {viewMode === 'ai' && (
                  <AiStubPanel methodName={selectedMethod?.name ?? 'this flow'} />
                )}
              </div>

              <div className="mt-auto flex items-center justify-between text-[11px] text-slate-500">
                <span>Playback controls (planned)</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 text-[10px]">
                    1x
                  </span>
                  <span className="hidden sm:inline">Speed slider, pause, step</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  )
}

function FlowNode({
  label,
  variant,
}: {
  label: string
  variant: 'primary' | 'muted'
}) {
  const base =
    'relative flex h-16 items-center justify-center rounded-xl border text-[11px] shadow-sm'
  const styles =
    variant === 'primary'
      ? 'border-violet-500/70 bg-violet-500/20 text-violet-50 shadow-violet-500/30'
      : 'border-slate-700 bg-slate-900/80 text-slate-100 shadow-black/40'

  return (
    <div className={[base, styles].join(' ')}>
      <span>{label}</span>
    </div>
  )
}

function BezierArrow() {
  return (
    <svg
      className="h-full w-full text-sky-400/70"
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d="M 40 200 C 120 40, 280 40, 360 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        markerEnd="url(#arrow)"
      />
    </svg>
  )
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-3 py-1 transition',
        active
          ? 'bg-slate-100 text-slate-900'
          : 'text-slate-300 hover:bg-slate-800/80',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function FlowDetailPanel({ methodName }: { methodName: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-slate-200">
        Step-by-step transaction narrative
      </p>
      <p>
        This panel will walk through each hop in the {methodName} flow, showing
        authorization, clearing, and settlement paths with latency, data
        payloads, and failure points.
      </p>
      <ul className="mt-2 list-disc pl-4 text-slate-400">
        <li>Highlight the current node on the canvas.</li>
        <li>Show what data is added, transformed, or validated.</li>
        <li>Explain why this hop exists in modern card and ACH stacks.</li>
      </ul>
    </div>
  )
}

function FeePanel({ amount, methodId }: { amount: number; methodId: string }) {
  const basisPoints = methodId === 'ach_debit' ? 20 : 250
  const fixedFee = methodId === 'ach_debit' ? 0.25 : 0.3
  const variableFee = (basisPoints / 10000) * amount
  const total = variableFee + fixedFee

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-slate-200">
        Illustrative fee breakdown
      </p>
      <p className="text-slate-400">
        These numbers are representative only and tuned for education. They are
        not tied to any specific provider.
      </p>
      <div className="mt-2 space-y-1 rounded-lg border border-slate-800 bg-slate-950/70 p-2">
        <Row label="Transaction amount" value={`$${amount.toFixed(2)}`} />
        <Row
          label="Interchange (~basis points)"
          value={`${(basisPoints / 100).toFixed(2)}%`}
        />
        <Row label="Network & scheme fees" value="$0.05" />
        <Row label="Processor & gateway" value={`$${fixedFee.toFixed(2)}`} />
        <Row
          label="Estimated total cost"
          value={`$${total.toFixed(2)}`}
          strong
        />
      </div>
      <p className="text-[11px] text-slate-500">
        In the full version, these fee components will be driven entirely by a
        JSON configuration per payment method, so you can compare cards vs ACH
        vs wallets at a glance.
      </p>
    </div>
  )
}

function Row({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-slate-400">{label}</span>
      <span
        className={
          strong ? 'font-semibold text-emerald-300' : 'tabular-nums text-slate-100'
        }
      >
        {value}
      </span>
    </div>
  )
}

function AiStubPanel({ methodName }: { methodName: string }) {
  return (
    <div className="flex h-full flex-col gap-2">
      <p className="text-[11px] font-medium text-slate-200">
        AI explainer (planned Claude integration)
      </p>
      <p className="text-slate-400">
        Here users will be able to ask contextual questions like “Why is ACH
        cheaper than cards?” or “What happens if the processor goes down during{' '}
        {methodName}?”.
      </p>
      <div className="mt-1 flex flex-col gap-1 rounded-lg border border-dashed border-slate-700 bg-slate-950/70 p-2 text-[11px] text-slate-400">
        <span className="font-medium text-slate-200">
          Example questions this panel will handle:
        </span>
        <ul className="list-disc pl-4">
          <li>“Where in the flow do fraud checks actually run?”</li>
          <li>“Why does settlement timing differ between cards and ACH?”</li>
          <li>“What are the safest retry patterns for soft declines?”</li>
        </ul>
      </div>
      <p className="mt-auto text-[11px] text-slate-500">
        Under the hood this will call a small serverless API that wraps the
        Claude API, with the current payment method and step injected as
        context. The front-end and hosting remain fully static.
      </p>
    </div>
  )
}

export default App
