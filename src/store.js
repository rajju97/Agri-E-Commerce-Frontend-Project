import { legacy_createStore as createStore } from 'redux'
import { cartReducer } from './reducers';
// Initial state
export const initialState = {
    cart: {
        items: [],
        itemCount: 0,
    },
    showLoader: true,
};

const store = createStore(cartReducer);

export default store;