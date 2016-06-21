import AppDispatcher from '../AppDispatcher.js';
import constants from '../constants.js';
import KanbanAPI from '../api/KanbanApi.js';
import { throttle } from '../utils.js';
import CardStore from '../stores/CardStore.js';

let CardActionCreators = {
  fetchCards() {
    AppDispatcher.dispatchAsync(KanbanAPI.fetchCards(), {
      request: constants.FETCH_CARDS,
      success: constants.FETCH_CARDS_SUCCESS,
      failure: constants.FETCH_CARDS_ERROR
    })
  },

  addCard(card) {
    AppDispatcher.dispatchAsync(KanbanAPI.addCard(card), {
      request: constants.CREATE_CARD,
      success: constants.CREATE_CARD_SUCCESS,
      failure: constants.CREATE_CARD_ERROR
    }, {card})
  },

  updateCard(card, draftCard) {
    AppDispatcher.dispatchAsync(KanbanAPI.updateCard(card, draftCard), {
      request: constants.UPDATE_CARD,
      success: constants.UPDATE_CARD_SUCCESS,
      failure: constants.UPDATE_CARD_ERROR
    }, {card, draftCard})
  },

  updateCardStatus: throttle((cardId, listId) => {
    AppDispatcher.dispatch({
      type: constants.UPDATE_CARD_STATUS,
      payload: {cardId, listId}
    })
  }),

  updateCardPosition: throttle((cardId, afterId) => {
    AppDispatcher.dispatch({
      type: constants.UPDATE_CARD_POSITION,
      payload: {cardId, afterId}
    })
  }, 500),

  persistCardDrag(cardProps) {
    let card = CardStore.getCard(cardProps.id);
    let cardIndex = CardStore.getCardIndex(cardProps.id);
    AppDispatcher.dispatchAsync(KanbanAPI.persistCardDrag(card.id, card.status, card.index), {
      request: constants.PERSIST_CARD_DRAG,
      success: constants.PERSIST_CARD_DRAG_SUCCESS,
      failure: constants.PERSIST_CARD_DRAG_ERROR  
    }, {cardProps});
  }
};

export default CardActionCreators;