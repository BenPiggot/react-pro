import React, { Component, PropTypes } from 'react';
import CardForm from './CardForm';
import DraftStore from '../stores/DraftStore.js';
import { Container } from 'flux/utils';
import CardActionCreators from '../actions/CardActionCreators.js';

class NewCard extends Component {
  handleChange(field, value) {
    CardActionCreators.updateDraft(field, value);
  }

  handleSubmit(event) {
    event.preventDefault();
    CardActionCreators.addCard(this.state.draft);
    this.props.history.pushState(null, '/');
  }

  handleClose(event) {
    this.props.history.pushState(null, '/');
  }

  componentDidMount() {
    setTimeout(() => CardActionCreators.createDraft(), 0)
  }

  render() {
    return <CardForm draftCard={this.state.draft}
             buttonLabel='Create Card'
             handleChange={this.handleChange.bind(this)}
             handleSubmit={this.handleSubmit.bind(this)}
             handleClose={this.handleClose.bind(this)} />
  }
}

NewCard.getStores = () => ([DraftStore]);
NewCard.calculateState = (prevState) => ({
  draft: DraftStore.getState()
})

export default Container.create(NewCard);