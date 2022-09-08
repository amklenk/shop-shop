import React, { useEffect } from 'react'; 
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
import { useStoreContext } from '../../utils/GlobalState';
import { ADD_MULTIPLE_TO_CART, TOGGLE_CART } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
    // set up useStoreContext state
    const [state, dispatch] = useStoreContext();

    // data contains session, after getCheckout is called
    const[getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
        };

        if (!state.cart.length) {
            getCart();
        }
    }, [state.cart.length, dispatch]);

    // for Stripe
    useEffect(() => {
        if (data) {
            stripePromise.then((res) => {
                res.redirectToCheckout({ sessionId: data.checkout.session });
            });
        }
    }, [data]);

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

    // submit to Stripe
    function submitCheckout() {
        const productIds = [];
      
        state.cart.forEach((item) => {
          for (let i = 0; i < item.purchaseQuantity; i++) {
            productIds.push(item._id);
          }
        });

        getCheckout({
            variables: { products: productIds }
        });
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
                        <button onClick={submitCheckout}>
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