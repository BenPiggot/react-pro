import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import Card from './Card';
import constants from '../constants';
import CardActionCreators from '../actions/CardActionCreators.js';

const listTargetSpec = {
  hover(props, monitor) {
    const dragged = monitor.getItem();
    CardActionCreators.updateCardStatus(dragged.id, props.id)
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class List extends Component {
  render() {
    const { connectDropTarget } = this.props;

    const cards = this.props.cards.map((card) => {
    return <Card key={card.id}
      id={card.id}
      title={card.title}
      description={card.description}
      color={card.color}
      tasks={card.tasks} />
    });

    return connectDropTarget(
      <div className="list">
        <h1>{this.props.title}</h1>
        {cards}
      </div>
    );
  }
};

List.propTypes = {
  title: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object),
  connectDropTarget: PropTypes.func.isRequired
};

export default DropTarget(constants.CARD, listTargetSpec, collect)(List);