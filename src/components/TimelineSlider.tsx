import { useState, useEffect } from 'react'

interface TimelineSliderProps {
  startDate: Date
  endDate: Date
  currentDate: Date
  onDateChange: (date: Date) => void
  step?: 'day' | 'week' | 'month' | 'quarter'
  disabled?: boolean
}

export default function TimelineSlider({
  startDate,
  endDate,
  currentDate,
  onDateChange,
  step = 'day',
  disabled = false
}: TimelineSliderProps) {
  const [sliderValue, setSliderValue] = useState(0)

  // Calculate number of steps
  const getStepMs = () => {
    switch (step) {
      case 'day':
        return 24 * 60 * 60 * 1000
      case 'week':
        return 7 * 24 * 60 * 60 * 1000
      case 'month':
        return 30 * 24 * 60 * 60 * 1000
      case 'quarter':
        return 90 * 24 * 60 * 60 * 1000
      default:
        return 24 * 60 * 60 * 1000
    }
  }

  const stepMs = getStepMs()
  const totalMs = endDate.getTime() - startDate.getTime()
  const totalSteps = Math.floor(totalMs / stepMs)

  // Update slider value when currentDate changes
  useEffect(() => {
    const currentMs = currentDate.getTime() - startDate.getTime()
    const value = Math.floor(currentMs / stepMs)
    setSliderValue(Math.max(0, Math.min(value, totalSteps)))
  }, [currentDate, startDate, stepMs, totalSteps])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setSliderValue(value)
    
    const newDate = new Date(startDate.getTime() + value * stepMs)
    onDateChange(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const goToPrevious = () => {
    if (sliderValue > 0) {
      const newValue = sliderValue - 1
      setSliderValue(newValue)
      const newDate = new Date(startDate.getTime() + newValue * stepMs)
      onDateChange(newDate)
    }
  }

  const goToNext = () => {
    if (sliderValue < totalSteps) {
      const newValue = sliderValue + 1
      setSliderValue(newValue)
      const newDate = new Date(startDate.getTime() + newValue * stepMs)
      onDateChange(newDate)
    }
  }

  const goToStart = () => {
    setSliderValue(0)
    onDateChange(new Date(startDate))
  }

  const goToEnd = () => {
    setSliderValue(totalSteps)
    onDateChange(new Date(endDate))
  }

  return (
    <div className="bg-bg-secondary p-4 rounded-lg shadow-xl border border-border-primary">
      <div className="flex items-center gap-4">
        {/* Start date button */}
        <button
          onClick={goToStart}
          disabled={disabled || sliderValue === 0}
          className="px-4 py-2 text-lg font-bold bg-accent-green hover:bg-accent-green-dark disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all text-white shadow-md hover:shadow-lg disabled:shadow-none border-2 border-white"
          style={{ minWidth: '48px', minHeight: '48px' }}
          title="Go to start"
        >
          ⏮
        </button>

        {/* Previous button */}
        <button
          onClick={goToPrevious}
          disabled={disabled || sliderValue === 0}
          className="px-4 py-2 text-lg font-bold bg-accent-green hover:bg-accent-green-dark disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all text-white shadow-md hover:shadow-lg disabled:shadow-none border-2 border-white"
          style={{ minWidth: '48px', minHeight: '48px' }}
          title="Previous"
        >
          ⏪
        </button>

        {/* Date display */}
        <div className="flex-1 text-center">
          <div className="text-sm text-text-secondary mb-1">
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
          <div className="text-lg font-semibold text-text-primary">
            {formatDate(currentDate)}
          </div>
        </div>

        {/* Slider */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={totalSteps}
            value={sliderValue}
            onChange={handleSliderChange}
            disabled={disabled}
            className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${(sliderValue / totalSteps) * 100}%, #d1fae5 ${(sliderValue / totalSteps) * 100}%, #d1fae5 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>0%</span>
            <span>{Math.round((sliderValue / totalSteps) * 100)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={goToNext}
          disabled={disabled || sliderValue >= totalSteps}
          className="px-4 py-2 text-lg font-bold bg-accent-green hover:bg-accent-green-dark disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all text-white shadow-md hover:shadow-lg disabled:shadow-none border-2 border-white"
          style={{ minWidth: '48px', minHeight: '48px' }}
          title="Next"
        >
          ⏩
        </button>

        {/* End date button */}
        <button
          onClick={goToEnd}
          disabled={disabled || sliderValue >= totalSteps}
          className="px-4 py-2 text-lg font-bold bg-accent-green hover:bg-accent-green-dark disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all text-white shadow-md hover:shadow-lg disabled:shadow-none border-2 border-white"
          style={{ minWidth: '48px', minHeight: '48px' }}
          title="Go to end"
        >
          ⏭
        </button>
      </div>

      {/* Step selector */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-sm font-semibold text-text-primary">Step:</span>
        {(['day', 'week', 'month', 'quarter'] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              // This would need to be handled by parent component
              // For now, just visual
            }}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg border-2 ${
              step === s
                ? 'bg-accent-green text-white border-white shadow-lg'
                : 'bg-white text-text-primary border-accent-green hover:bg-accent-green-light hover:text-white'
            }`}
            style={{ minWidth: '70px' }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

