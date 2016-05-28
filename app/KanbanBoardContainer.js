import React, { Component } from 'react';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';
import 'babel-polyfill';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'bens-react-app'
};

class KanbanBoardContainer extends Component {
  constructor() {
  super(...arguments) 
    this.state = {
      cards: []
    };
  }

  addTask(cardId, taskName) {

  }

  deleteTask(cardId, taskId, taskIndex) {
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);

    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: { $splice: [[taskIndex, 1]] }
      }
    })

    this.setState({ cards: nextState })

    fetch(`${AP_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: 'API_HEADERS'
    })
  }

  toggleTask(cardId, taskId, taskIndex) {

  }

  componentDidMount() {
    fetch(API_URL + '/cards', { headers: API_HEADERS })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({ cards: responseData})
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  render() {
    return <KanbanBoard cards={this.state.cards} 
                        tasksCallbacks={{
                        toggle: this.toggleTask.bind(this),
                        delete: this.deleteTask.bind(this),
                        add: this.addTask.bind(this) }} />
  }
}

export default KanbanBoardContainer;