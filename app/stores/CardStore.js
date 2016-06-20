import AppDispatcher from '../AppDispatcher.js';
import constants from '../constants.js';
import { ReduceStore } 'flux/utils';

class CardStore extends ReduceStore {
  getInitialState() {
    return [];
  }

  reduce(state, action) {
    switch(action.type) {
      default:
        return state;
    }
  }
}

export default new CardStore(AppDispatcher);