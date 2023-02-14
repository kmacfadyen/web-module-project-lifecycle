import React from 'react';
import axios from 'axios';

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {

  state = {
    todos: [],
    error: '',
    todoNameInput: '',
  }

  fetchAllTodos = () => {
    axios.get(URL)
    .then(res => {
      this.setState({ ...this.state, todos: res.data.data })       // debugger pauses browser to debug
    })
    .catch(this.setAxiosReponseError)
  } 

  onTodoNameInputChange = (evt) => {
    const { value } = evt.target;   // always extract value first! could change later on
    this.setState({ ...this.state, todoNameInput: value })
  }

  resetForm = () => {
    this.setState({ ...this.state, todoNameInput: '' })
  }

  setAxiosReponseError = (err) => {
    this.setState({ ...this.state, error: err.response.data.message })
  }

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
    .then(res => {
      this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data) })
      this.resetForm()
    })
    .catch(this.setAxiosReponseError)
  }

  onTodoFormSubmit = (evt) => {
    evt.preventDefault();
    this.postNewTodo()
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
    .then(res => {
      this.setState({ ...this.state, todos: this.state.todos.map(td => {
          if(td.id !== id) return td;
          return res.data.data;
        })
      })
    })
    .catch(this.setAxiosReponseError) 
  }


  componentDidMount() {
    // fetch all todos from server
    this.fetchAllTodos();
  }

  render() {
    return (
      <div>
        <div id='error'>Error: {this.state.error}</div>
        <div id='todos'>
          { 
            this.state.todos.map(td => {
              return <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? ' T' : '' }</div>
            })
          }
        </div>
        <form id='todoForm' onSubmit={this.onTodoFormSubmit} >
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type='text' placeholder='Type todo'></input>
          <input type='submit'></input> 
          <button>Clear Completed</button>
        </form>
      </div>
    )
  }
}
