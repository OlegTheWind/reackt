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

  handleInputMin = (event) => {
    const { setMin } = this.props
    setMin(event.target.value)
  }

  handleInputSec = (event) => {
    const { setSec } = this.props
    setSec(event.target.value)
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
    const { min, sec } = this.props

    return (
      <header className="header new-todo-form">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(event) => this.handelInput(event)}
          onKeyDown={this.handleKey}
        />
        <input
          className="new-todo-form__timer"
          type="number"
          placeholder="Min"
          value={min}
          onChange={this.handleInputMin}
        />
        <input
          className="new-todo-form__timer"
          type="number"
          placeholder="Sec"
          value={sec}
          onChange={this.handleInputSec}
        />
      </header>
    )
  }
}
Header.propTypes = {
  addItem: PropTypes.func.isRequired,
  setMin: PropTypes.func.isRequired,
  setSec: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  sec: PropTypes.number.isRequired,
}
