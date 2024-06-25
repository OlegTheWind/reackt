import propTypes from 'prop-types'
import './TaskFilters.css'

function TaskFilters({ onFilterChange, filter = 'all' }) {
  return (
    <ul className="filters">
      <li>
        <button
          type="button"
          className={filter === 'all' ? 'selected' : ''}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
      </li>
      <li>
        <button
          type="button"
          className={filter === 'active' ? 'selected' : ''}
          onClick={() => onFilterChange('active')}
        >
          Active
        </button>
      </li>
      <li>
        <button
          type="button"
          className={filter === 'completed' ? 'selected' : ''}
          onClick={() => onFilterChange('completed')}
        >
          Completed
        </button>
      </li>
    </ul>
  )
}

TaskFilters.propTypes = {
  onFilterChange: propTypes.func.isRequired,
  filter: propTypes.string.isRequired,
}

export default TaskFilters
