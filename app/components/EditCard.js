import React, { Component, PropTypes } from 'react';
import CardForm from './CardForm';
import CardStore from '../stores/CardStore.js';
import CardActionCreators from '../actions/CardActionCreators.js';
import 'babel-polyfill';

class EditCard extends Component {
  componentWillMount() {
    let card = CardStore.getCard(parseInt(this.props.params.card_id));
    this.setState(card)
  }

  handleChange(field, value) {
    this.setState({ [field]: value })
  }

  handleSubmit(event) {
    event.preventDefault();
    CardActionCreators.updateCard(CardStore.getCard(parseInt(this.props.params.card_id)), this.state);
    this.props.history.pushState(null, '/');
  }

  handleClose(event) {
    this.props.history.pushState(null, '/');
  }

  render() {
    return <CardForm draftCard={this.state}
                     buttonLabel='Edit Card'
                     handleChange={this.handleChange.bind(this)}
                     handleSubmit={this.handleSubmit.bind(this)}
                     handleClose={this.handleClose.bind(this)} />
  }
}

EditCard.propTypes = {
  cardCallbacks: PropTypes.object
}

export default EditCard;