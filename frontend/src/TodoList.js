import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TodoList.css';

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      newTask: '',
      editTask: '',
      editTodoId: null,
      showModal: false
    };
    this.remove = this.remove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.markComplete = this.markComplete.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleEditSave = this.handleEditSave.bind(this);
    this.handleEditCancel = this.handleEditCancel.bind(this);
  }

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos() {
    axios.get('/todos')
      .then(response => {
        this.setState({ todos: response.data });
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  }

  async remove(id) {
    try {
      await axios.delete(`/todos/${id}`);
      let updatedTodos = [...this.state.todos].filter(i => i.id !== id);
      this.setState({ todos: updatedTodos });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  handleChange(event) {
    this.setState({ newTask: event.target.value });
  }

  async handleAddTask(event) {
    event.preventDefault();
    const { newTask } = this.state;

    if (newTask.trim() !== '') {
      try {
        await axios.post('/todos', {
          task: newTask,
          completed: false
        });

        this.setState({ newTask: '' });
        this.fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  }

  async markComplete(id) {
    const { todos } = this.state;
    const todo = todos.find(todo => todo.id === id);

    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };

      try {
        await axios.put(`/todos/${id}`, updatedTodo);

        const updatedTodos = todos.map(todo =>
          todo.id === id ? updatedTodo : todo
        );

        this.setState({ todos: updatedTodos });
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  }

  handleEditClick(id, task, completed) {
    this.setState({
      editTodoId: id,
      editTask: task,
      editCompleted: completed,
      showModal: true
    });
  }
  
  handleEditChange(event) {
    console.log(event);
    this.setState({ editTask: event.target.value, editCompleted: true });
  }

  async handleEditSave() {
    const { editTodoId, editTask, editCompleted, todos } = this.state;

    try {
      await axios.put(`/todos/${editTodoId}`, {
        task: editTask,
        completed: editCompleted 
      });
  

      const updatedTodos = todos.map(todo =>
        todo.id === editTodoId ? { ...todo, task: editTask, completed: editCompleted } : todo
      );
      this.setState({
        todos: updatedTodos,
        showModal: false
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  handleEditCancel() {
    this.setState({
      editTodoId: null,
      editTask: '',
      showModal: false
    });
  }

  render() {
    const { todos, newTask, editTask, showModal } = this.state;
    return (
      <div>
        <Container fluid>
          <div className="float-right">
            <h3>Todo Input</h3>
            <Form inline onSubmit={this.handleAddTask}>
              <FormGroup>
                <Label for="home_task">Task</Label>
                <Input
                  type="text"
                  name="home_task"
                  id="home_task"
                  placeholder="New Task"
                  value={newTask}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <Button color="success" type="submit">
                Add Task
              </Button>
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
                    <span className={todo.completed ? 'completed' : ''}>
                      {todo.task}
                    </span>
                  </td>
                  <td>
                    {todo.completed ? 'Completed' : 'Not Completed'}
                  </td>
                  <td>
                    <ButtonGroup>
                      <Button
                        size="sm"
                        color="primary"
                        onClick={() =>
                          this.handleEditClick(todo.id, todo.task, todo.completed)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => this.markComplete(todo.id)}
                      >
                        {todo.completed ? 'Uncomplete' : 'Complete'}
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => this.remove(todo.id)}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        <Modal isOpen={showModal} toggle={this.handleEditCancel}>
          <ModalHeader toggle={this.handleEditCancel}>Edit Task</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              name="edit_task"
              id="edit_task"
              placeholder="Edit Task"
              value={editTask}
              onChange={this.handleEditChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleEditSave}>
              Save
            </Button>
            <Button color="secondary" onClick={this.handleEditCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default TodoList;
