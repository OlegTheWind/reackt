import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import propTypes from 'prop-types'

import Task from '../Task/Task'

import './TaskList.css'
import {TimerContext} from './TimerContext'

export default function TaskList({ data = [], onEdit, deleteItem, onToggleDone, filter = 'all' }) {
  const [timers, setTimers] = useState(TimerContext)

  const updateTimer = (taskId) => {
    setTimers((prevTimers) => {
      const currentTime = prevTimers[taskId].time
      if (currentTime && currentTime > 0) {
        return {
          ...prevTimers,
          [taskId]: {
            ...prevTimers[taskId],
            time: currentTime - 1,
          },
        }
      }
      clearInterval(prevTimers[taskId].intervalId)
      return {
        ...prevTimers,
        [taskId]: {
          ...prevTimers[taskId],
          intervalId: null,
        },
      }
    })
  }

  const startTimer = (taskId) => {
    setTimers((prevTimers) => {
      const newTimers = { ...prevTimers }
      if (!newTimers[taskId]) {
        newTimers[taskId] = {
          time: data.find((task) => task.id === taskId).time || 0,
          intervalId: null,
        }
      }
      if (!newTimers[taskId].intervalId) {
        const intervalId = setInterval(() => updateTimer(taskId), 1000)
        newTimers[taskId].intervalId = intervalId
      }
      return newTimers
    })
  }


  const stopTimer = (taskId) => {
    setTimers((prevTimers) => {
      if (prevTimers[taskId] && prevTimers[taskId].intervalId) {
        clearInterval(prevTimers[taskId].intervalId)
        return {
          ...prevTimers,
          [taskId]: {
            ...prevTimers[taskId],
            intervalId: null,
          },
        }
      }
      return prevTimers
    })
  }

  const onEditTask = (id, description) => {
    onEdit(id, description)
    stopTimer(id)
  }


  let filteredData = data
  if (filter === 'active') {
    filteredData = data.filter((item) => !item.completed)
  } else if (filter === 'completed') {
    filteredData = data.filter((item) => item.completed)
  }

  const elements = filteredData.map((item) => {
    const createdTimeAgo = formatDistanceToNow(item.timeOfCreation, {
      includeSeconds: true,
      addSuffix: true,
    })
    return (
      <Task
        key={item.id}
        id={item.id}
        completed={item.completed}
        editing={item.editing}
        description={item.description}
        timer={timers[item.id] ? timers[item.id].time : item.time}
        startTimer={() => startTimer(item.id)}
        stopTimer={() => stopTimer(item.id)}
        deleteItem={() => deleteItem(item.id)}
        onToggleDone={() => {
          onToggleDone(item.id)
          stopTimer(item.id)
        }}
        onEdit={(value) => onEditTask(item.id, value)}
        createdTimeAgo={createdTimeAgo}
      />
    )
  })

  return <ul className="todo-list">{elements}</ul>
}

TaskList.propTypes = {
  data: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string.isRequired,
      completed: propTypes.bool.isRequired,
      editing: propTypes.bool.isRequired,
      description: propTypes.string.isRequired,
      timeOfCreation: propTypes.instanceOf(Date).isRequired,
      time: propTypes.number.isRequired,
    })
  ).isRequired,
  deleteItem: propTypes.func.isRequired,
  onToggleDone: propTypes.func.isRequired,
  filter: propTypes.oneOf(['all', 'active', 'completed']).isRequired,
  onEdit: propTypes.func.isRequired,
}