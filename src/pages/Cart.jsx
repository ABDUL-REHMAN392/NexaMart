
import { useDispatch, useSelector } from 'react-redux';
import { decreaseQuantity, dltItem, increaseQuantity } from '../redux/cartSlice';
import { GoArrowLeft } from 'react-icons/go';
import { NavLink, useNavigate } from 'react-router-dom';
import { CiSquareRemove, CiSquarePlus } from 'react-icons/ci';
import { IoBagCheckOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector(state => state.cart);

  const totalPrice = cart.reduce((accumulator, item) => {
    return accumulator + item.quantity * item.finalPrice;
  }, 0);

  const handleBuyNow = () => {
    if (cart.length === 0) {
      toast.warn('Your cart is empty');
      return;
    }
    navigate('/user_Details');
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl my-6">
        <span>Items in </span>
        <span className="pacifico text-indigo-500">Your Cart</span>
      </h1>

      <div className="md:w-1/2 w-full p-4 flex flex-col gap-4 mt-4">
        {cart &&
          cart.map(item => (
            <div className="flex w-full shadow-md p-4 items-center gap-4 bg-white rounded-xl hover:shadow-lg transition-shadow" key={item.id}>
              <div>
                <img src={item.image} className="w-[60px] h-[60px] rounded-md" alt={item.title} />
              </div>
              <div className="w-full">
                <p className="text-xl font-bold">{item.title}</p>
                <div className="flex justify-between items-center">
                  <p className="text-indigo-500 font-bold">
                    ${(item.finalPrice * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="cursor-pointer group"
                    onClick={() => {
                      toast.success('Deleted from cart');
                      dispatch(dltItem(item.id));
                    }}
                  >
                    <MdDeleteOutline size={23} className="group-hover:text-indigo-500" />
                  </button>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <button
                    className="cursor-pointer hover:text-indigo-500"
                    onClick={() => {
                      if (item.quantity >= item.stock) {
                        toast.warn('You cannot add more than the available stock');
                        return;
                      }
                      dispatch(increaseQuantity(item.id));
                    }}
                  >
                    <CiSquarePlus size={23} />
                  </button>
                  <p className="font-medium px-2">{item.quantity}</p>
                  <button
                    className="cursor-pointer hover:text-indigo-500"
                    onClick={() => {
                      if (item.quantity <= 1) return;
                      dispatch(decreaseQuantity(item.id));
                    }}
                  >
                    <CiSquareRemove size={23} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {cart.length >= 1 && (
        <div className="flex items-center justify-between md:w-1/2 w-full p-4 mt-6">
          <NavLink
            to="/"
            className="border border-gray-300 text-sm py-2 group transition-all duration-300 cursor-pointer px-4 rounded-md flex items-center gap-2 hover:border-indigo-500 hover:text-indigo-500"
          >
            <GoArrowLeft />
            <span>Continue Shopping</span>
          </NavLink>

          <div className="flex flex-col items-end">
            <div className="flex items-center text-xl">
              <h1 className="mr-2">Total Price:</h1>
              <h1 className="font-bold text-indigo-500">${totalPrice.toFixed(2)}</h1>
            </div>

            <button
              onClick={handleBuyNow}
              className="flex mt-2 text-white font-medium cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 transition-all duration-500 bg-indigo-500 hover:bg-indigo-400 group"
            >
              <IoBagCheckOutline />
              <p className="text-sm">Buy now</p>
            </button>
          </div>
        </div>
      )}

      {cart.length === 0 && (
        <div className="flex flex-col items-center mt-40">
          <h1 className="text-center">No items found in cart!</h1>
          <NavLink
            to="/"
            className="bg-indigo-500 text-white text-sm py-1.5 hover:bg-indigo-400 transition-all duration-300 cursor-pointer mt-4 px-4 rounded-md flex items-center gap-2"
          >
            <GoArrowLeft />
            <span>Continue Shopping</span>
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default Cart;
