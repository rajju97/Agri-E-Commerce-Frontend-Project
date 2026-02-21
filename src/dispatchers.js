import { ADD_ITEM, REMOVE_ITEM, CLEAR_CART, SHOW_LOADER, STOP_LOADER } from "./actions";

export const addItem = (item) => ({
    type: ADD_ITEM,
    payload: item,
});

export const removeItem = (item) => ({
    type: REMOVE_ITEM,
    payload: item,
});

export const clearCart = () => ({
    type: CLEAR_CART,
});

export const showLoader = () => ({
    type: SHOW_LOADER,
});

export const stopLoader = () => ({
    type: STOP_LOADER,
});
