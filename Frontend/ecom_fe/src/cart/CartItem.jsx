import { Minus, Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCartItems, removeErrors, removeItemsFromcart } from "../features/cartF/cartSlice";
import { useState } from "react";

const CartItem = ({ item }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const dispatch = useDispatch()

    const decreasQuantity = () => {
        if (quantity <= 1) {
            toast.error("Quantity cannot be less then 1 ", 
                { Position: "top-center", autoClose: 3000 })
            dispatch(removeErrors())
        }
        const newQty = quantity - 1
        setQuantity(newQty);
        dispatch(addToCartItems({id:item.product ,quantity:newQty}))
    }
    const increaseQuantity = () => {
        if (item.stock <= quantity) {
            toast.error("Cannot exceed available stock!", 
                { Position: "top-center", autoClose: 3000 })
            dispatch(removeErrors())
        }
        const newQty = quantity + 1;
        setQuantity(newQty);
        dispatch(addToCartItems({id:item.product ,quantity:newQty}))
    }


    return (
        <>
            <div key={item.product} className="flex items-center gap-4 p-2 rounded-xl border border-gray-100
            bg-gray-50">
                <img src={item.image} alt={item.image} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-gray-500 truncate max-w-50">{item.description}</p>
                    <p className="font-bold text-amber-600 mt-2 ">Rs.{item.price}</p>
                    <p className="text-sm text-gray-500 ">₹ {item.price} * {item.quantity} = ₹ {item.price * item.quantity}</p>
                </div>
                <div className="flex item-center gap-2">
                    <button onClick={decreasQuantity} className="w-8 h-8  rounded-full border border-gray-300 flex items-center justify-center
            hover:bg-gray-200 transition-colors"><Minus /></button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={increaseQuantity} className="w-8 h-8  rounded-full border border-gray-300 flex items-center justify-center
            hover:bg-gray-200 transition-colors"><Plus /></button>
                </div>
                <button onClick={()=>dispatch(removeItemsFromcart(item.product))}
                 className="text-red-500 hover:text-red-700 transition-colors"><Trash2 /></button>
            </div>
        </>
    )
}

export default CartItem