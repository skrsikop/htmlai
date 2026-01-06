import { CircleIcon, ScanLineIcon, SquareIcon, TriangleIcon } from "lucide-react"
import { useEffect, useState } from "react"

const steps = [
  { icon: ScanLineIcon, label: "Analyzing your request..." },
  { icon: SquareIcon, label: "Generating assets..." },
  { icon: TriangleIcon, label: "Assembling UI components..." },
  { icon: CircleIcon, label: "Finalizing your website..." }
]

const STEP_DURATION = 7000

const LoaderSteps = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setCurrent((s) => (s + 1) % steps.length), STEP_DURATION)
    return () => clearInterval(interval)
  }, [])

  const Icon = steps[current].icon as React.ComponentType<React.SVGProps<SVGSVGElement>>
  const progress = ((current + 1) / steps.length) * 100

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-6">
      <div className="relative max-w-md w-full bg-white/6 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* decorative animated gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-pink-500/20 via-purple-400/10 to-indigo-400/10 blur-3xl animate-[spin_18s_linear_infinite]" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-400/10 via-blue-400/10 to-pink-500/10 blur-2xl" />
        </div>

        <div className="relative z-10 p-8 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-br from-white/6 to-white/3 ring-1 ring-white/10 shadow-lg">
              <div className="absolute inset-2 rounded-full bg-white/3/20 blur-sm" />
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow-inner transform transition-transform duration-700 ease-out scale-100">
                <Icon className="w-10 h-10 text-white stroke-[1.5] animate-bounce" />
              </div>
              <div className="absolute -inset-1 rounded-full border border-white/6 opacity-60 animate-pulse" />
            </div>

            <h3 className="mt-4 text-xl font-semibold tracking-wide text-white/95">
              {steps[current].label}
            </h3>

            <p className="mt-2 text-sm text-white/70">This may take around 2–3 minutes</p>
          </div>

          {/* progress bar */}
          <div className="w-full mt-4 px-2">
            <div className="h-2 bg-white/6 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-purple-400 to-pink-400 transition-all duration-700"
                style={{ width: `${progress}%` }}
                aria-hidden
              />
            </div>

            {/* step indicators */}
            <div className="mt-3 flex items-center justify-center gap-3">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${i === current ? "bg-white/100 scale-110 shadow-lg" : "bg-white/20"}`}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          {/* accessibility: live region for step changes */}
          <div className="sr-only" aria-live="polite">
            {steps[current].label}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoaderSteps
