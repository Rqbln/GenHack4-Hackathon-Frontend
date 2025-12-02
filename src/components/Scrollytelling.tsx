import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ScrollStep {
  id: string
  title: string
  content: string
  mapViewState?: {
    longitude: number
    latitude: number
    zoom: number
    pitch?: number
    bearing?: number
  }
  highlight?: string[]
}

interface ScrollytellingProps {
  steps: ScrollStep[]
  onStepChange?: (step: ScrollStep, index: number) => void
  onMapViewChange?: (viewState: ScrollStep['mapViewState']) => void
}

/**
 * Scrollytelling component for narrative visualization
 * Combines scroll-based storytelling with map interactions
 */
export default function Scrollytelling({
  steps,
  onStepChange,
  onMapViewChange
}: ScrollytellingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track which step is in view - create refs for each step
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Use IntersectionObserver to track all steps
    const observers: IntersectionObserver[] = []
    
    stepRefs.current.forEach((element, index) => {
      if (!element) return
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              if (index !== currentStep) {
                setCurrentStep(index)
                const step = steps[index]
                onStepChange?.(step, index)
                
                // Update map view if specified
                if (step.mapViewState && onMapViewChange) {
                  onMapViewChange(step.mapViewState)
                }
              }
            }
          })
        },
        {
          threshold: 0.5,
          rootMargin: '-50% 0px -50% 0px'
        }
      )
      
      observer.observe(element)
      observers.push(observer)
    })
    
    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [currentStep, steps, onStepChange, onMapViewChange])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Fixed narrative panel */}
      <div className="fixed top-0 left-0 w-full md:w-1/2 h-screen flex items-center justify-center z-40 pointer-events-none">
        <div className="max-w-2xl mx-auto px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 bg-opacity-95 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-gray-700"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                {steps[currentStep]?.title}
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                {steps[currentStep]?.content}
              </p>
              {steps[currentStep]?.highlight && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-blue-400 font-semibold">Key Points:</p>
                  <ul className="mt-2 space-y-1">
                    {steps[currentStep].highlight?.map((point, idx) => (
                      <li key={idx} className="text-sm text-gray-400">• {point}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scrollable content sections */}
      <div className="relative w-full md:w-1/2 ml-auto">
        {steps.map((step, index) => (
          <div
            key={step.id}
            ref={(el) => {
              stepRefs.current[index] = el
            }}
            data-step-index={index}
            className="min-h-screen flex items-center justify-center px-8 py-20"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="w-full max-w-4xl">
              {/* Placeholder for map or visualization */}
              <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
                <p className="text-sm">Step {index + 1}: {step.title}</p>
                <p className="text-xs mt-2">Map visualization would appear here</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

