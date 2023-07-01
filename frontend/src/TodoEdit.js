import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class TodoEdit extends Component {

    emptyItem = {
        task: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const todo = await (await fetch(`/todos/${this.props.match.params.id}`)).json();
            this.setState({item: todo});
        }
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState(prevState => ({
          item: { ...prevState.item, [name]: value }
        }));
      }
      

      async handleSubmit(event) {
        event.preventDefault();
        const { item } = this.state;
      
        try {
          const response = await fetch(`/todos/${item.id}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
          });
      
          if (response.ok) {
            this.props.history.push('/todos');
          } else {
            // Handle error case
            console.error('Error updating todo:', response.status);
          }
        } catch (error) {
          console.error('Error updating todo:', error);
        }
      }
      

    render() {
        const {item} = this.state;
        const title = <h2>{item.id ? 'Edit Todo' : 'Add Todo'}</h2>;
    
        return <div>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="task">Task</Label>
                        <Input type="text" name="task" id="task" value={item.task || ''}
                               onChange={this.handleChange} autoComplete="task"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="completed">Complete Status</Label>
                        <Input type="text" name="completed" id="completed" value={item.completed ? "Completed" : "Not Completed" || ''}
                               onChange={this.handleChange} autoComplete="completed"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }

}
export default withRouter(TodoEdit);