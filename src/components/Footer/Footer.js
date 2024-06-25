import React from 'react'
import propTypes from 'prop-types'

import './Footer.css'
import TaskFilters from '../TaskFilters/TaskFilters'

function Footer({
  itemsLeft = 0,
  deleteAllCompleted,
  onFilterChange,
  filter = 'all',
}) {
  return (
    <footer className="footer">
      <span className="todo-count">{itemsLeft} item(s) left</span>
      <TaskFilters onFilterChange={onFilterChange} filter={filter} />
      <button
        type="button"
        className="clear-completed"
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  )
}

Footer.propTypes = {
  itemsLeft: propTypes.number.isRequired,
  deleteAllCompleted: propTypes.func.isRequired,
  onFilterChange: propTypes.func.isRequired,
  filter: propTypes.string.isRequired,
}

export default Footer
