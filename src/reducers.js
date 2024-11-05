
// Reducer function
import { initialState } from "./store";
import { ADD_ITEM, REMOVE_ITEM, SHOW_LOADER, STOP_LOADER } from "./actions";
export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM:
            {
                const index = state.cart.items.findIndex((el)=>el.id===action.payload.id)
                const filteredItems=[...state.cart.items]
                if(index!=-1){
                    filteredItems[index].quantity=filteredItems[index].quantity+1
                }
                else{
                    filteredItems.push({...action.payload,quantity: action.payload.quantity+1})
                }
                return {
                    ...state,
                    cart: {
                        items: [...filteredItems],
                        itemCount: filteredItems.reduce((prev, curr) => {
                            return prev += curr.quantity
                        }, 0),
                    }
                }
            }
        case REMOVE_ITEM:
            
            {
                const index = state.cart.items.findIndex((el)=>el.id===action.payload.id)
                let filteredItems=[...state.cart.items]
                
                    if(filteredItems[index].quantity>1){
                        filteredItems[index].quantity=filteredItems.quantity-1
                    }
                    else{
                        filteredItems.splice(index,1)
                    }
                
                return {
                    ...state,
                    cart: {
                        items: [...filteredItems],
                        itemCount: filteredItems.reduce((prev, curr) => {
                            return prev += curr.quantity
                        }, 0),
                    }
                };
            }
        case SHOW_LOADER:
            return {
                ...state,
                showLoader: action.payload,
            };
        case STOP_LOADER:
            return {
                ...state,
                showLoader: action.payload,
            };
        default:
            return state;
    }
};