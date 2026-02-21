import { initialState } from "./store";
import { ADD_ITEM, REMOVE_ITEM, CLEAR_CART, SHOW_LOADER, STOP_LOADER } from "./actions";

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM: {
            const index = state.cart.items.findIndex((el) => el.id === action.payload.id);
            const updatedItems = state.cart.items.map((item, i) => {
                if (i === index) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            if (index === -1) {
                updatedItems.push({ ...action.payload, quantity: 1 });
            }

            return {
                ...state,
                cart: {
                    items: updatedItems,
                    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
                }
            };
        }
        case REMOVE_ITEM: {
            const index = state.cart.items.findIndex((el) => el.id === action.payload.id);
            if (index === -1) return state;

            let updatedItems;
            if (state.cart.items[index].quantity > 1) {
                updatedItems = state.cart.items.map((item, i) => {
                    if (i === index) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                });
            } else {
                updatedItems = state.cart.items.filter((_, i) => i !== index);
            }

            return {
                ...state,
                cart: {
                    items: updatedItems,
                    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
                }
            };
        }
        case CLEAR_CART:
            return {
                ...state,
                cart: {
                    items: [],
                    itemCount: 0,
                }
            };
        case SHOW_LOADER:
            return {
                ...state,
                showLoader: true,
            };
        case STOP_LOADER:
            return {
                ...state,
                showLoader: false,
            };
        default:
            return state;
    }
};
