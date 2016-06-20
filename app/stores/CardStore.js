import AppDispatcher from '../AppDispatcher.js';
import constants from '../constants.js';
import { ReduceStore } from 'flux/utils';

class CardStore extends ReduceStore {
  getInitialState() {
    return [];
  }

  reduce(state, action) {
    switch(action.type) {
      case constants.FETCH_CARDS_SUCCESS:
        return action.payload.response;
      default:
        return state;
    }
  }
}

export default new CardStore(AppDispatcher);