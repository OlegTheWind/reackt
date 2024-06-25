import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import './Task.css'

function Task({
  completed = false,
  onEdit,
  description = '',
  deleteItem,
  onToggleDone,
  createdTimeAgo = 'some time ago',
  id,
  timer,
  startTimer,
  stopTimer,
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')

  const handleDocumentClick = (event) => {
    const editInput = document.querySelector('.edit')
    if (editInput && !editInput.contains(event.target)) {
      setEditing(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [])

  const getTaskStatus = () => {
    let str
    if (completed) {
      str = 'completed'
    } else if (editing) {
      str = 'editing'
    } else {
      str = null
    }
    return str
  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onEdit(value)
    setValue('')
    setEditing(false)
  }

  const onEscDown = (event) => {
    if (event.keyCode === 27) {
      setEditing(false)
    }
  }

  const taskStatus = getTaskStatus()

  return (
    <li className={taskStatus} key={id}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={completed} onChange={() => onToggleDone(id)} />
        <label htmlFor="btn">
          <span className="title">{description}</span>
          <span className="description">
            <button
              className="icon icon-play"
              type="button"
              onClick={startTimer}
            />
            <button
              className="icon icon-pause"
              type="button"
              onClick={stopTimer}
            />
            <span className='task_time'>{`${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</span>
          </span>
          <span className="description">{createdTimeAgo}</span>
        </label>
        <button
          id="btn"
          type="button"
          className="icon icon-edit"
          onClick={(event) => {
            event.stopPropagation()
            setValue(description)
            setEditing((prevEditing) => !prevEditing.editing)
          }}
        />

        <button
          type="button"
          className="icon icon-destroy"
          onClick={deleteItem}
        />
      </div>

      {taskStatus === 'editing' && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="edit"
            onChange={handleChange}
            value={value}
            onKeyDown={onEscDown}
          />
        </form>
      )}
    </li>
  )
}

export default Task

Task.propTypes = {
  completed: propTypes.bool.isRequired,
  description: propTypes.string.isRequired,
  deleteItem: propTypes.func.isRequired,
  onToggleDone: propTypes.func.isRequired,
  onEdit: propTypes.func.isRequired,
  createdTimeAgo: propTypes.string.isRequired,
}
