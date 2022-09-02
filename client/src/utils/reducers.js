import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from './actions';
import { useReducer } from 'react';

export const reducer = (state, action) => {
    switch(action.type) {
        // if action type is `UPDATE_PRODUCTS`, return a new state object with updated products array
        case UPDATE_PRODUCTS: 
            return {
                ...state,
                products: [...action.products],
            };
        // if action type is `UPDATE_CATEGORIES`, return a new state object with updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            };
        // if action type is `UPDATE_CURRENT_CATEGORY`
        case UPDATE_CURRENT_CATEGORY: 
            return {
                ...state,
                currentCategory: action.currentCategory
            };
        // if it isn't that action, do not update the state at all
        default: 
            return state;
    };
};

// helps initialize global state object and provides functionality for updating the state with custom reducer function
export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
}