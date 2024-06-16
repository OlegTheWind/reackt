import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function ListComponent({
  label,
  time,
  id,
  className = '',
  onDeleted,
  onEditItem,
  onToggleDescription,
}) {
  const [done, setDone] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditedText] = useState(label)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerValue, setTimerValue] = useState(0)

  useEffect(() => {
    let interval = null
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerValue((prevValue) => prevValue + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

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
  const minutes = Math.floor(timerValue / 60)
  const seconds = timerValue % 60

  return (
    <li
      className={`completed ${className} ${isEditing ? 'editing' : ''}`}
      id={id}
    >
      <div className="view">
        {isEditing ? (
          <input
            className="edit"
            type="text"
            value={editText}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
          />
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
                  <span className="task-time">
                    {minutes}:{seconds}
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
}

export default ListComponent
