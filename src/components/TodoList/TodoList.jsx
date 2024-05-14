import React from 'react'
import PropTypes from 'prop-types'
import ListComponent from '../ListComponent/ListComponent'

function TodoList({ todos, onDeleted, onEditItem, onToggleDescription }) {
  const elements = todos.map((item) => (
    <ListComponent
      label={item.label}
      time={item.time}
      key={item.id}
      id={item.id}
      className={item.className}
      onDeleted={() => onDeleted(item.id)}
      onEditItem={(id, newText) => onEditItem(item.id, newText)}
      onToggleDescription={() =>
        onToggleDescription(
          item.id,
          item.className ? !item.className.includes('description') : true,
        )
      }
    />
  ))
  return (
    <section className="main">
      <ul className="todo-list">{elements}</ul>
    </section>
  )
}
TodoList.propTypes = {
  onDeleted: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onToggleDescription: PropTypes.func.isRequired,
  todos: PropTypes.element.isRequired,
}
export default TodoList
