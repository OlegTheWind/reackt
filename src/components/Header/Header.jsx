import React from 'react'
import PropTypes from 'prop-types'

export default class Header extends React.Component {
  constructor() {
    super()
    this.state = {
      newTodo: ' ',
    }
  }

  handelInput = (event) => {
    this.setState({ newTodo: event.target.value })
  }

  handleKey = (event) => {
    const { addItem } = this.props
    const { newTodo } = this.state
    if (event.key === 'Enter') {
      addItem(newTodo)
      this.setState({ newTodo: '' })
    }
  }

  render() {
    const { newTodo } = this.state
    return (
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(event) => this.handelInput(event)}
          onKeyDown={this.handleKey}
        />
      </header>
    )
  }
}
Header.propTypes = {
  addItem: PropTypes.func.isRequired,
}
