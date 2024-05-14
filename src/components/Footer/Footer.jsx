import React from 'react'
import PropTypes from 'prop-types'

function Footer({ todoCount, setFilter, currentFilter, clearCompleted }) {
  return (
    <footer className="footer">
      <span className="todo-count">{todoCount}</span>
      <ul className="filters">
        <li>
          <button
            className={currentFilter === 'all' ? 'selected' : ''}
            onClick={() => setFilter('all')}
            type="button"
          >
            All
          </button>
        </li>
        <li>
          <button
            className={currentFilter === 'active' ? 'selected' : ''}
            onClick={() => setFilter('active')}
            type="button"
          >
            Active
          </button>
        </li>
        <li>
          <button
            className={currentFilter === 'completed' ? 'selected' : ''}
            onClick={() => setFilter('completed')}
            type="button"
          >
            Completed
          </button>
        </li>
      </ul>
      <button
        className="clear-completed"
        onClick={clearCompleted}
        type="button"
      >
        Clear completed
      </button>
    </footer>
  )
}
Footer.propTypes = {
  todoCount: PropTypes.number.isRequired,
  setFilter: PropTypes.func.isRequired,
  currentFilter: PropTypes.string.isRequired,
  clearCompleted: PropTypes.func.isRequired,
}
export default Footer
