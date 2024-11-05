import { ADD_ITEM, REMOVE_ITEM, SHOW_LOADER, STOP_LOADER } from "./actions";

export const addItem = (item) => {
    return {
        type: ADD_ITEM,
        payload: item,
    };
};

export const removeItem = (item) => {
    return {
        type: REMOVE_ITEM,
        payload: item,
    };
};
export const showLoader = () => {
    return {
        type: SHOW_LOADER,
        payload: true,
    };
};
export const stopLoader = () => {
    return {
        type: STOP_LOADER,
        payload: false,
    };
};