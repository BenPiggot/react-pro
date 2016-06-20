import React, { Component } from 'react';
import update from 'react-addons-update';
import { throttle } from '../utils';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';
import 'babel-polyfill';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'bens-special-react-app'
};

class KanbanBoardContainer extends Component {
  constructor() {
  super(...arguments) 
    this.state = {
      cards: []
    };

    this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
    this.updateCardPosition = throttle(this.updateCardPosition.bind(this), 500)
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

  addCard(card) {
    let prevState = this.state;

    if(card.id === null) {
      let card = Object.assign({}, card, {id: Date.now() });
    }

    let nextState = update(this.state.cards, { $push: [card] });

    this.setState({cards: nextState});

    fetch(`${API_URL}/cards`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(card)
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Server response not OK!')
      }
    })
    .then((responseData) => {
      card.id = responseData.id;
      this.setState({ cards: nextState })
    })
    .catch((error) => {
      this.setState(prevState);
    })
  }

  updateCard(card) {
    let prevState = this.state;
    let cardIndex = this.state.cards.findIndex((c) => c.id == card.id);
    let nextState = update(
                      this.state.cards, {
                        [cardIndex]: { $set: card }
                      });

    this.setState({ cards: nextState });

    fetch(`${API_URL}/cards/${card.id}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify(card)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Server response not OK!')
      }
    })
    .catch((error) => {
      console.error({'Fetch error': error})
      this.setState(prevState)
    })
  }

  addTask(cardId, taskName) {
    let prevState = this.state;
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);

    let newTask = { id: Date.now(), name: taskName, done: false };

    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: { $push: [newTask] }
      }
    })

    this.setState({ cards: nextState });

    fetch(`${API_URL}/cards/${cardId}/tasks`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newTask)
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Server response not OK')
      }
    })
    .then((responseData) => {
      newTask.id = responseData.id,
      this.setState({ cards: nextState })
    })
    .catch((error) => {
      console.error('Fetch Error:', error)
      this.setState({ cards: prevState })
    })
  }


  deleteTask(cardId, taskId, taskIndex) {
    let prevState = this.state;
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);

    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: { $splice: [[taskIndex, 1]] }
      }
    })

    this.setState({ cards: nextState })

    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: API_HEADERS
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Server response not OK')
      }
    })
    .catch((error) => {
      console.error('Fetch Error:', error)
      this.setState(prevState)
    })
  }

  toggleTask(cardId, taskId, taskIndex) {
    let prevState = this.state;
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);

    let newDoneValue;

    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {
          [taskIndex]: {
            done: { $apply: (done) => {
              newDoneValue = !done
              return newDoneValue;
              }
            }
          }
        }
      }
    });

    this.setState({ cards: nextState })

    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({ done: newDoneValue })
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Server response not OK')
      }
    })
    .catch((error) => {
      console.error('Fetch Error:', error)
      this.setState(prevState)
    })
  }


  updateCardStatus(cardId, listId) {
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
    let card = this.state.cards[cardIndex];

    if (card.status !== listId) {
      this.setState(update(this.state, {
        cards: {
          [cardIndex]: {
            status: { $set: listId }
          }
        }
      }));
    }
  }


  updateCardPosition(cardId, afterId) {
    if (cardId !== afterId) {
      let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
      let card = this.state.cards[cardIndex];
      let afterIndex = this.state.cards.findIndex((card) => card.id == afterId);

      this.setState(update(this.state, {
        cards: {
          $splice: [
            [cardIndex, 1],
            [cardIndex, 0, card]
          ]
        }
      }));
    }
  }

  persistCardDrag(cardId, status) {
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
    let card = this.state.cards[cardIndex];

    fetch(`${API_URL}/cards/${cardId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({ status: card.status, row_order_position: cardIndex })
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Server response not OK');
      }
    })
    .catch((error) => {
      console.log('Fetch error:', error);
      this.setState(
        update(this.state, {
          cards: {
            [cardIndex]: {
              status: { $set: status }
            }
          }
        })
      );
    });
  }

  render() {
    let kanbanBoard = this.props.children && React.cloneElement(this.props.children, {
      cards: this.state.cards,
      taskCallbacks: {
        toggle: this.toggleTask.bind(this),
        delete: this.deleteTask.bind(this),
        add: this.addTask.bind(this) 
      },
      cardCallbacks: {
        addCard: this.addCard.bind(this),
        updateCard: this.updateCard.bind(this),
        updateStatus: this.updateCardStatus,
        updatePosition: this.updateCardPosition,
        persistCardDrag: this.persistCardDrag.bind(this)
      }
    });

    return kanbanBoard; 
  }
}

export default KanbanBoardContainer;