import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

function ListComponent({
  label,
  time,
  id,
  className = '',
  onDeleted,
  onEditItem,
  onToggleDescription,
  min,
  sec,
  currentTab,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditedText] = useState(label)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [done, setDone] = useState(() => {
  const saveDone = localStorage.getItem(`done-${id}`)
    return saveDone ? JSON.parse(saveDone) : false
  })
  const [timerValue, setTimerValue] = useState(() => {
    const savedTimer = localStorage.getItem(`timer-${id}`)
    return savedTimer ? parseInt(savedTimer, 10) : min * 60 + sec
  })
  const [isTabActive, setIsTabActive] = useState(false)
  const [completedTime, setCompletedTime] = useState(0)

  const startTimeRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    clearInterval(intervalRef.current)

    if (isTimerRunning) {
      startTimeRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        const elapsedTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        )
        startTimeRef.current = Date.now()
        setTimerValue((prevValue) => {
          const newValue = prevValue - elapsedTime
          if (newValue <= 0) {
            clearInterval(intervalRef.current)
            return 0
          }
          return newValue
        })
      }, 1000)
    }

    return () => clearInterval(intervalRef.current)
  }, [isTimerRunning])
  const handleTabClose = () => {
    const currentTime = Date.now()
    localStorage.setItem(`lastTime-${id}`, currentTime.toString())
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleTabClose)

    return () => {
      window.removeEventListener('beforeunload', handleTabClose)
      handleTabClose()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(`done-${id}, JSON.stringify(done)`)
  }, [done, id])

  useEffect(
    () => () => {
      localStorage.setItem(`timer-${id}`, timerValue.toString())
      localStorage.setItem(`isTimerRunning-${id}`, isTimerRunning.toString())
      localStorage.setItem(`currentTab-${id}`, currentTab)
    },
    [timerValue, isTimerRunning, id, currentTab],
  )

  useEffect(() => {
    let intervalId
    if (currentTab === 'Completed' && isTimerRunning) {
      intervalId = setInterval(() => {
        setTimerValue((prevValue) => prevValue + 1)
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [currentTab, isTimerRunning, timerValue])

  useEffect(() => {
    const lastTime = parseInt(localStorage.getItem(`lastTime-${id}`), 10)
    const currentTime = Date.now()

    if (lastTime) {
      const timeSpent = (currentTime - lastTime) / 1000 // Время в секундах
      setCompletedTime(timeSpent)
    }

    const savedTimer = parseInt(localStorage.getItem(`timer-${id}`), 10)
    const savedIsTimerRunning =
      localStorage.getItem(`isTimerRunning-${id}`) === 'true'
    if (savedTimer && savedIsTimerRunning) {
      const adjustedTimerValue = savedTimer - completedTime
      setTimerValue(adjustedTimerValue > 0 ? adjustedTimerValue : 0)
      setIsTimerRunning(true)
    }
  }, [id, completedTime])

  useEffect(() => {
    const savedTimer = localStorage.getItem(`timer-${id}`)
    const savedIsTimerRunning =
      localStorage.getItem(`isTimerRunning-${id}`) === 'true'
    if (savedTimer && savedIsTimerRunning) {
      setTimerValue(parseInt(savedTimer, 10))
      setIsTimerRunning(true)
    }

    if (currentTab === 'Completed' && savedIsTimerRunning) {
      const currentTime = Date.now()
      const lastTime = parseInt(localStorage.getItem(`lastTime-${id}`), 10)
      const timeSpent = (currentTime - lastTime) / 1000
      setCompletedTime(timeSpent)
    }
  }, [id, currentTab])

  const startTimer = () => {
    clearInterval(intervalRef.current)

    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setTimerValue((prevValue) => {
        const newValue = prevValue - elapsedTime
        if (newValue <= 0) {
          clearInterval(intervalRef.current)
          return 0
        }
        return newValue
      })
    }, 1000)
  }

  useEffect(() => {
    if (currentTab === 'Completed') {
      if (!isTimerRunning) {
        startTimer()
        setIsTabActive(true)
      }
    } else if (isTimerRunning) {
      clearInterval(intervalRef.current)
      setIsTimerRunning(false)
      setCompletedTime((prevTime) => prevTime + timerValue)
      setIsTabActive(false)
    }
  }, [currentTab])

  useEffect(() => {
    if (currentTab === 'Completed' && isTabActive) {
      setCompletedTime((prevTime) => prevTime + timerValue)
    }
  }, [timerValue, currentTab, isTabActive])
  function updateCompletedTime() {
    if (isTimerRunning) {
      setCompletedTime((prevTime) => prevTime - timerValue)
    }
  }
  useEffect(() => {
    updateCompletedTime()
  }, [])

  function onLabelClick() {
    const newDoneState = !done
    setDone(newDoneState)
    onToggleDescription(id, newDoneState)
  }

  function handleEditClick() {
    setIsEditing(true)
  }

  function handleInputChange(event) {
    setEditedText(event.target.value)
  }

  function handleInputBlur() {
    setIsEditing(false)
    if (editText !== label) {
      onEditItem(id, editText, min, sec)
    }
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      setIsEditing(false)
      if (editText !== label) {
        onEditItem(id, editText, min, sec)
      }
    }
  }
  function handlePlayClick() {
    setIsTimerRunning(true)
    setIsTabActive(true)
  }

  function handlePauseClick() {
    setIsTimerRunning(false)
    setIsTabActive(false)
  }

  function handleResetClick() {
    if (currentTab === 'Completed') {
      setTimerValue(completedTime)
    } else {
      setTimerValue(min * 60 + sec)
    }
    setIsTimerRunning(false)
  }

  useEffect(() => {
    updateCompletedTime()
  }, [])

  function handleDelete() {
    if (isTimerRunning) {
      setCompletedTime((prevTime) => prevTime + timerValue)
    }
    onDeleted(id)
  }

  return (
    <li
      className={`completed ${className} ${isEditing ? 'editing' : ''}`}
      id={id}
    >
      <div className="view">
        {isEditing ? (
          <>
            <input
              className="edit"
              type="text"
              value={editText}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
            />
            <input
              className="new-todo-form__timer"
              type="text"
              placeholder="Min"
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              value={Math.floor(timerValue / 60)}
              onChange={(event) => {
                setTimerValue(event.target.value * 60 + (timerValue % 60))
              }}
            />
            <input
              className="new-todo-form__timer"
              type="text"
              placeholder="Sec"
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              value={Math.floor(timerValue % 60)}
              onChange={(event) => {
                setTimerValue(
                  Math.floor(timerValue / 60) * 60 +
                    parseInt(event.target.value, 10),
                )
              }}
            />
          </>
        ) : (
          <>
            <input className="toggle" type="checkbox" onClick={onLabelClick} />
            <label htmlFor="inputId">
              <span className={className}>{label}</span>
              <span className="description">
                <button
                  type="button"
                  className="icon icon-play"
                  onClick={handlePlayClick}
                  aria-label="button_play"
                />
                <button
                  type="button"
                  className="icon icon-pause"
                  onClick={handlePauseClick}
                  aria-label="button_pause"
                />
                <button
                  type="button"
                  className="icon icon-reset"
                  onClick={handleResetClick}
                  aria-label="button_reset"
                />
                <span className="task-time">
                  {Math.floor((timerValue - completedTime) / 60)}:
                  {Math.floor((timerValue - completedTime) % 60)}
                </span>
              </span>
              <span className="created">{time}</span>
            </label>
          </>
        )}
        <button
          className="icon icon-edit"
          type="button"
          aria-label="Редактировать"
          onClick={handleEditClick}
        />
        <button
          className="icon icon-destroy"
          type="button"
          aria-label="Удалить"
          onClick={handleDelete}
        />
      </div>
    </li>
  )
}

ListComponent.propTypes = {
  label: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onDeleted: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  onToggleDescription: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  sec: PropTypes.number.isRequired,
  currentTab: PropTypes.string.isRequired,
}

export default ListComponent
