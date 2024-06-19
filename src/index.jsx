import { formatDistance, subDays } from 'date-fns'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import TodoList from './components/TodoList/TodoList'

export default class ToDoApp extends React.Component {
  constructor() {
    super()
    this.state = {
      todoData: [],
      filter: 'all',
      min: 0,
      sec: 0,
    }
  }

  setMin = (min) => {
    this.setState({ min: parseInt(min, 10) || 0 })
  }

  setSec = (sec) => {
    this.setState({ sec: parseInt(sec, 10) || 0 })
  }

  setFilter = (filter) => {
    this.setState({ filter })
  }

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const newArray = todoData.filter((el) => el.id !== id)
      return {
        todoData: newArray,
      }
    })
  }

  addItem = (text) => {
    this.setState(({ todoData, min, sec }) => {
      const addTodoData = [
        ...todoData,
        {
          label: text,
          time: formatDistance(subDays(new Date(), 0), new Date(), {
            addSuffix: true,
          }),
          id: Math.random().toString(36).slice(2),
          min,
          sec,
        },
      ]
      return {
        todoData: addTodoData,
      }
    })
  }

  onEditItem = (id, newText, newMin, newSec) => {
    this.setState(({ todoData }) => {
      const updatedData = todoData.map((item) =>
        item.id === id
          ? { ...item, label: newText, min: newMin, sec: newSec }
          : item,
      )
      return {
        todoData: updatedData,
      }
    })
  }

  handleDescriptionToggle = (id, isDescription) => {
    this.setState(({ todoData }) => {
      const updatedData = todoData.map((item) =>
        item.id === id
          ? { ...item, className: isDescription ? 'description' : '' }
          : item,
      )
      return {
        todoData: updatedData,
      }
    })
  }

  clearCompleted = () => {
    this.setState(({ todoData }) => {
      const newArray = todoData.filter((el) => !el.className)
      return {
        todoData: newArray,
      }
    })
  }

  render() {
    const { todoData, filter, min, sec } = this.state
    const filteredData = todoData.filter((todo) => {
      if (filter === 'all') return true
      if (filter === 'active') return !todo.className
      if (filter === 'completed') return todo.className
      return false
    })

    const todoCount = todoData.filter(
      (todo) =>
        !todo.completed &&
        (!todo.className || !todo.className.includes('description')),
    ).length
    return (
      <section className="todoapp">
        <Header
          addItem={this.addItem}
          setMin={this.setMin}
          setSec={this.setSec}
        />
        <TodoList
          todos={filteredData}
          onDeleted={this.deleteItem}
          onEditItem={this.onEditItem}
          onToggleDescription={this.handleDescriptionToggle}
          min={min}
          sec={sec}
        />
        <Footer
          todoCount={todoCount}
          setFilter={this.setFilter}
          currentFilter={filter}
          clearCompleted={this.clearCompleted}
        />
      </section>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<ToDoApp />)
