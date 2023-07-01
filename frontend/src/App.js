import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TodoList from './TodoList';


class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route exact path='/'  component={TodoList}/>
          </Switch>
        </Router>
    )
  }
}
export default App;
