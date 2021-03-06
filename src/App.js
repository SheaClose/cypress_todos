import React, { Component } from "react";
import axios from "axios";

import "./App.css";

import List from "./components/List";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTodo: "",
      todos: []
    };
    this.deleteTodo = this.deleteTodo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditSelect = this.handleEditSelect.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    axios.get("/api/todos").then(({ data }) => {
      this.setState({ todos: data });
    });
  }

  deleteTodo(id) {
    axios
      .delete(`/api/todos/${id}`)
      .then(({ data }) => {
        this.setState({ todos: data });
      })
      .catch(console.log);
  }
  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }
  handleSubmit(e) {
    e.preventDefault();
    axios
      .post("/api/todos", {
        title: this.state.currentTodo,
        isComplete: false
      })
      .then(({ data }) => {
        this.setState({
          todos: data,
          currentTodo: ""
        });
      })
      .catch(console.log);
  }

  handleEditSelect(id) {
    this.setState({
      todos: this.state.todos.map(
        c => (c.id === id ? Object.assign({}, c, { edit: true }) : c)
      )
    });
  }
  handleEditChange({ target: { value, id } }) {
    this.setState({
      todos: this.state.todos.map(
        c => (c.id === +id ? Object.assign({}, c, { title: value }) : c)
      )
    });
  }
  handleEditSubmit(id, title) {
    axios
      .put(`/api/todos/${id}`, { title })
      .then(({ data }) => {
        this.setState({ todos: data });
      })
      .catch(console.log);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" />
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="currentTodo"
            onChange={this.handleChange}
            value={this.state.currentTodo}
            className="new_todo"
            autoFocus
            placeholder="Add new Todo"
          />
        </form>
        <List
          deleteTodo={this.deleteTodo}
          todos={this.state.todos}
          handleEditSelect={this.handleEditSelect}
          handleEditChange={this.handleEditChange}
          handleEditSubmit={this.handleEditSubmit}
        />
      </div>
    );
  }
}

export default App;
