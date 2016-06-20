import AppDispatcher from '../AppDispatcher.js';
import constants from '../constants.js';
import KanbanAPI from '../api/KanbanApi.js';

let CardActionCreators = {
  fetchCards() {
    AppDispatcher.dispatchAsync(KanbanAPI.fetchCards(), {
      request: constants.FETCH_CARDS,
      success: constants.FETCH_CARDS_SUCCESS,
      failure: constants.FETCH_CARDS_ERROR
    })
  }
};

export default CardActionCreators;