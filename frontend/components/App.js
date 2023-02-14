import React from 'react';
import axios from 'axios';

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {

  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleted: true,
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

  toggleDisplayCompleted = () => {
    this.setState({ ...this.state, displayCompleted: !this.state.displayCompleted })
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
            this.state.todos.reduce((acc, td) => {
              if (this.state.displayCompleted) return acc.concat(
                  <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? ' T' : '' }</div>
                );
              // if (!td.completed) return acc.concat(td);
              return acc;

              // return 
              
          }
          
        </div>
        <form id='todoForm' onSubmit={this.onTodoFormSubmit} >
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type='text' placeholder='Type todo'></input>
          <input type='submit'></input> 
        </form>

        <button onClick={this.toggleDisplayCompleted}>{this.state.displayCompleted ? 'Hide' : 'Show' }Clear Completed</button>

      </div>
    )
  }
}
