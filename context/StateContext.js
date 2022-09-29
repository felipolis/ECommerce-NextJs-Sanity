import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
	const [showCart, setShowCart] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantities, setTotalQuantities] = useState(0);
	const [qty, setQty] = useState(1);

	let foundProduct;
	let index;

	const onAdd = (product, quantity) => {
		const checkProductInCart = cartItems.find((item) => item._id === product._id);

		setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
		setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
		if (checkProductInCart) {

			const updatedCartItems = cartItems.map((cartProduct) => {
				if (cartProduct._id === product._id) {
					return {
						...cartProduct,
						quantity: cartProduct.quantity + quantity,
					};
				} else {
					return cartProduct;
				}
			});

			setCartItems(updatedCartItems);
		} else{
			
			product.quantity = quantity;
			setCartItems([...cartItems, { ...product }]);	
			
		}
		
		toast.success(`${qty} ${product.name} added to cart`);

	}

	const onRemove = (product) => {
		foundProduct = cartItems.find((item) => item._id === product._id);
		index = cartItems.indexOf(foundProduct);

		setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
		setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
		setCartItems([...cartItems.slice(0, index), ...cartItems.slice(index + 1)]);
		toast.error(`${foundProduct.name} removed from cart`);
	}

	const toggleCartItemQuantity = (id, value) => {
		foundProduct = cartItems.find((item) => item._id === id);
		index = cartItems.findIndex((product) => product._id === id);


		if(value === 'inc'){

			let newCartItems = [...cartItems];
			newCartItems[index].quantity = foundProduct.quantity + 1;
			setCartItems(newCartItems);
			
			setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
			setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
			
			
		} else if(value === 'dec'){
			
			if(foundProduct.quantity > 1){

				let newCartItems = [...cartItems];
				newCartItems[index].quantity = foundProduct.quantity - 1;
				setCartItems(newCartItems);
				
	
				setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
				setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);

			}

		}
	}

	const incQty = (prevQty) => {
		setQty((prevQty) => prevQty + 1);
	};

	const decQty = (prevQty) => {
		setQty((prevQty) => {
			if (prevQty - 1 < 1) return 1;

			return prevQty - 1;
		});
	};

	return (
		<Context.Provider
			value={{
				showCart,
				setShowCart,
				cartItems,
				setCartItems,
				totalPrice,
				setTotalPrice,
				totalQuantities,
				setTotalQuantities,
				qty,
				incQty,
				decQty,
				onAdd,
				toggleCartItemQuantity,
				onRemove,
			}}
		>
			{children}
		</Context.Provider>
	);
}

export const useStateContext = () => useContext(Context);