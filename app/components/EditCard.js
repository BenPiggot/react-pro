import React, { Component, PropTypes } from 'react';
import CardForm from './CardForm';
import CardStore from '../stores/CardStore.js';
import DraftStore from '../stores/DraftStore.js';
import { Container } from 'flux/utils';
import CardActionCreators from '../actions/CardActionCreators.js';
import 'babel-polyfill';

class EditCard extends Component {
  handleChange(field, value) {
    CardActionCreators.updateDraft(field, value);
  }

  handleSubmit(event) {
    event.preventDefault();
    CardActionCreators.updateCard(CardStore.getCard(parseInt(this.props.params.card_id)), this.state.draft);
    this.props.history.pushState(null, '/');
  }

  handleClose(event) {
    this.props.history.pushState(null, '/');
  }

  componentDidMount() {
    setTimeout(() => {
      CardActionCreators.createDraft(CardStore.getCard(this.props.params.card_id))
    }, 0)
  }

  render() {
    return <CardForm draftCard={this.state.draft}
                     buttonLabel='Edit Card'
                     handleChange={this.handleChange.bind(this)}
                     handleSubmit={this.handleSubmit.bind(this)}
                     handleClose={this.handleClose.bind(this)} />
  }
}

EditCard.getStores = () => ([DraftStore]);
EditCard.calculateState = (prevState) => ({
  draft: DraftStore.getState()
})

export default Container.create(EditCard);