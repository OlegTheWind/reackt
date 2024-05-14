import React, { useState } from 'react'
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
