import React from 'react'; 
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART } from '../../utils/actions';

const Cart = () => {
    // set up useStoreContext state
    const [state, dispatch] = useStoreContext();

    console.log(state);

    // function to toggle the cart to open or close
    function toggleCart() {
        dispatch({ type: TOGGLE_CART });
    };

    // add up the prices of everything in state.cart
    function calculateTotal() {
        let sum = 0;
        state.cart.forEach(item => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    // this will toggle, clicking this will open and give expanded cart
    if (!state.cartOpen) {
        return (
            <div className='cart-closed' onClick={toggleCart}>
                <span role='img' aria-label='trash'>🛒</span>
            </div>
        );
    }

    return (
    <div className="cart">
        <div className="close" onClick={toggleCart}>[close]</div>
        <h2>Shopping Cart</h2>
        {state.cart.length ? (
            <div>
                {state.cart.map(item => (
                <CartItem key={item._id} item={item} />
                ))}
                <div className="flex-row space-between">
                    <strong>Total: ${calculateTotal()}</strong>
                    {
                        Auth.loggedIn() ?
                        <button>
                            Checkout
                        </button>
                        :
                        <span>(log in to check out)</span>
                    }
                </div>
            </div>
            ) : (
                <h3>
                    <span role="img" aria-label="shocked">
                        😱
                    </span>
                    You haven't added anything to your cart yet!
                </h3>
            )}
    </div>
    )};

export default Cart;