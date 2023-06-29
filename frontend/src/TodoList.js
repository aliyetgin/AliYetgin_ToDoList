import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import './TodoList.css'; 


class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      newTask: ''
    };
    this.remove = this.remove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.markComplete = this.markComplete.bind(this);
  }

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos() {
    fetch('/todos')
      .then(response => response.json())
      .then(data => this.setState({ todos: data }));
  }

  async remove(id) {
    await fetch(`/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedTodos = [...this.state.todos].filter(i => i.id !== id);
      this.setState({ todos: updatedTodos });
    });
  }

  handleChange(event) {
    this.setState({ newTask: event.target.value });
  }

  async handleAddTask(event) {
    event.preventDefault();
    const { newTask } = this.state;

    if (newTask.trim() !== '') {
      await fetch('/todos', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: newTask, completed: false })
      });

      this.setState({ newTask: '' });
      this.fetchTodos();
    }
  }

  async markComplete(id) {
    const { todos } = this.state;
    const todo = todos.find(todo => todo.id === id);

    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };

      await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo),
      });

      const updatedTodos = todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      );

      this.setState({ todos: updatedTodos });
    }
  }


  render() {
    const { todos, newTask } = this.state;
    return (
      <div>
        <Container fluid>
          <div className="float-right">
            <h3>Todo Input</h3>
            <Form inline onSubmit={this.handleAddTask}>
              <FormGroup>
                <Label for="home_task">Task</Label>
                <Input type="text" name="home_task" id="home_task" placeholder="New Task" value={newTask} onChange={this.handleChange} />
              </FormGroup>
              <Button color="success" type="submit">Add Task</Button>
            </Form>
          </div>
          <Table className="mt-4">
            <thead>
              <tr>
                <th width="30%">Task</th>
                <th width="30%">Complete Status</th>
                <th width="40%">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map(todo => (
                 <tr key={todo.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                  <span className={todo.completed ? 'completed' : ''}>{todo.task}</span>
                  </td>
                  <td>{todo.completed ? 'Completed' : 'Not Completed'}</td>
                  <td>
                    <ButtonGroup>
                      <Button size="sm" color="primary" tag={Link} to={`/todos/${todo.id}`}>Edit</Button>
                      <Button size="sm" color="success" onClick={() => this.markComplete(todo.id)}>
                      {todo.completed ? 'Uncomplete' : 'Complete'}
                      </Button>
                      <Button size="sm" color="danger" onClick={() => this.remove(todo.id)}>Delete</Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default TodoList;
