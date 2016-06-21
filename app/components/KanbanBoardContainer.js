import React, { Component } from 'react';
import update from 'react-addons-update';
import { throttle } from '../utils';
import KanbanBoard from './KanbanBoard';
import { Container } from 'flux/utils';
import CardActionCreators from '../actions/CardActionCreators.js';
import CardStore from '../stores/CardStore.js';
import 'whatwg-fetch';
import 'babel-polyfill';


class KanbanBoardContainer extends Component {
  
  componentDidMount() {
    CardActionCreators.fetchCards();
  }

  render() {
    let kanbanBoard = this.props.children && React.cloneElement(this.props.children, {
      cards: this.state.cards
    });

    return kanbanBoard; 
  }
}

KanbanBoardContainer.getStores = () => ([CardStore]);
KanbanBoardContainer.calculateState = (prevState) => ({
  cards: CardStore.getState()
});

export default Container.create(KanbanBoardContainer);