import React, { createContext, useContext } from 'react';
import { useProductReducer } from './reducers';


const StoreContext = createContext();
const { Provider } = StoreContext;

const StoreProvider = ({ value = [], ...props}) => {
// state is the most up-to-date version, dispatch is method we use update
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: '',
    });

    console.log(state);
    return <Provider value={[state, dispatch]} {...props}/>;
};

// custom React Hook
const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
