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
  const [done, setDone] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditedText] = useState(label)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerValue, setTimerValue] = useState(() => {
    // Восстанавливаем значение таймера из localStorage при переходе на вкладку "Completed"
    if (currentTab === 'Completed') {
      const savedTimer = localStorage.getItem(`timer-${id}`)
      return savedTimer ? parseInt(savedTimer, 10) : min * 60 + sec
    }
    return min * 60 + sec
  })

  const startTimeRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    // Сохраняем значение таймера в localStorage только при переходе на вкладку "Completed"
    if (currentTab === 'Completed') {
      localStorage.setItem(`timer-${id}`, timerValue.toString())
    }

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
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isTimerRunning, timerValue, id, currentTab])

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
      onEditItem(id, editText)
    }
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      setIsEditing(false)
      if (editText !== label) {
        onEditItem(id, editText)
      }
    }
  }

  function handlePlayClick() {
    setIsTimerRunning(true)
  }

  function handlePauseClick() {
    setIsTimerRunning(false)
  }
  function handleResetClick() {
    setTimerValue(min * 60 + sec)
    setIsTimerRunning(false)
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
              value={Math.floor(timerValue / 60)}
              onChange={(event) => {
                setTimerValue(event.target.value * 60 + (timerValue % 60))
              }}
            />
            <input
              className="new-todo-form__timer"
              type="text"
              placeholder="Sec"
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
                <label htmlFor="inputTime">
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
                    {Math.floor(timerValue / 60)}:{timerValue % 60}
                  </span>
                </label>
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
          onClick={() => onDeleted(id)}
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
