import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import './App.css'
import NewTaskForm from './components/NewTaskForm/NewTaskForm'
import TaskList from './components/TaskLIst/TaskList'
import Footer from './components/Footer/Footer'

function App() {
  const [data, setData] = useState([])
  const [filter, setFilter] = useState('all')

  function isInputValid(input) {
    return typeof input === 'string' && input.trim() !== ''
  }

  function createTodoItem(description, min, sec) {
    return {
      id: uuidv4(),
      description,
      completed: false,
      editing: false,
      timeOfCreation: new Date(),
      time: Number(min) * 60 + Number(sec),
      shouldStartTimer: false,
    }
  }

  const addNewTodoItem = (description, min, sec) => {
    if (isInputValid(description)) {
      const newItem = createTodoItem(description, min, sec)
      setData((prevData) => {
        const newArr = [...prevData, newItem]
        return newArr
      })
    }
  }

  const deleteItem = (id) => {
    setData((prevData) => {
      const index = prevData.findIndex((el) => el.id === id)
      const newArray = [
        ...prevData.slice(0, index),
        ...prevData.slice(index + 1),
      ]
      return newArray
    })
  }

  const deleteAllCompleted = () => {
    setData((prevData) => {
      const newArr = prevData.filter((item) => !item.completed)
      return newArr
    })
  }

  const onFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  const onToggleDone = (id) => {
    setData((prevData) => prevData.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const onEdit = (id, value) => {
    if (isInputValid(value)) {
      setData((prevData) => {
        const index = prevData.findIndex((el) => el.id === id)
        const oldItem = prevData[index]
        const updatedItem = { ...oldItem, editing: true, description: value }
        const newData = [
          ...prevData.slice(0, index),
          updatedItem,
          ...prevData.slice(index + 1),
        ]

        return newData
      })
    }
  }

  const itemsLeft = data.filter((el) => !el.completed).length

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <NewTaskForm addNewTodoItem={addNewTodoItem} />
      </header>

      <section className="main">
        <TaskList
          className="hidden"
          data={data}
          deleteItem={deleteItem}
          onToggleDone={onToggleDone}
          filter={filter}
          onEdit={onEdit}
        />
        <Footer
          itemsLeft={itemsLeft}
          deleteAllCompleted={deleteAllCompleted}
          onFilterChange={onFilterChange}
          filter={filter}
        />
      </section>
    </section>
  )
}

export default App
