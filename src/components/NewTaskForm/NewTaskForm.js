import React, { useState } from 'react'
import propTypes from 'prop-types'
import './NewTaskForm.css'

export default function NewTaskForm({ addNewTodoItem }) {
  const [description, setDescription] = useState('')
  const [min, setMin] = useState('')
  const [sec, setSec] = useState('')

  const onDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const onMinChange = (event) => {
    setMin(event.target.value)
  }

  const onSecChange = (event) => {
    setSec(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()

    addNewTodoItem(description, min, sec)
    setDescription('')
    setMin('')
    setSec('')
  }

  return (
    <form className="new-todo-form" onSubmit={onSubmit}>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        onChange={onDescriptionChange}
        value={description}
        required
      />
      <input
        className="new-todo-form__timer"
        placeholder="Min"
        onChange={onMinChange}
        value={min}
        type="number"
        min={0}
        required
      />
      <input
        className="new-todo-form__timer"
        placeholder="Sec"
        onChange={onSecChange}
        value={sec}
        type="number"
        min={0}
        required
      />
      <button type="submit" />
    </form>
  )
}

NewTaskForm.propTypes = {
  addNewTodoItem: propTypes.func.isRequired,
}
