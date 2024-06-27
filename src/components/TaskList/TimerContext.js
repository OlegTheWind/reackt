import React, { createContext, useEffect, useState, useMemo } from 'react'

export const TimerContext = createContext()

export function TimerProvider({ children }) {
  const [timers, setTimers] = useState({})

  const clearTimers = () => {
    Object.values(timers).forEach((timer) => {
      clearInterval(timer.intervalId)
    })
  }

  useEffect(() => () => clearTimers(), [])
  
  const contextValue = useMemo(() => ({ timers, setTimers }), [timers])

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  )
}