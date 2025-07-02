import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaGooglePay, FaMoneyBillAlt, FaPaypal } from 'react-icons/fa';
import { RiVisaLine, RiMastercardFill } from 'react-icons/ri';
import { CiDeliveryTruck } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { setCart } from '../redux/cartSlice';

function UserInformation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector(state => state.cart);

  const totalPrice = cart.reduce((accumulator, item) => {
    return accumulator + item.quantity * item.finalPrice;
  }, 0);

  return (
    <div className="p-4">
      <h1 className="pacifico text-center text-2xl my-6 text-indigo-600">Billing Details</h1>

      <div className="flex md:flex-row flex-col md:justify-around">
        {/* User Info */}
        <div className="flex flex-col gap-4 md:w-1/2">
          {['Name', 'Email', 'Phone', 'Address', 'Country', 'State', 'City'].map(label => (
            <div className="flex flex-col gap-2" key={label}>
              <label htmlFor={label}>{label}:</label>
              <input
                type="text"
                id={label}
                className="border focus:outline-indigo-500 transition-all duration-300 rounded-md px-4 py-1 border-gray-300 text-gray-700"
              />
            </div>
          ))}

          <div className="flex gap-2 items-center">
            <input type="checkbox" className="cursor-pointer w-4 h-4" />
            <p className="text-sm text-gray-600">Save this information for faster check-out next time</p>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="md:w-1/3 bg-gray-50 rounded-xl p-6 shadow-md mt-8 md:mt-0">
          <div className="border-b pb-4 mb-4 flex justify-between items-center">
            <p className="font-medium">Shipping:</p>
            <p className="text-xl font-semibold text-gray-700">Free</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <p className="font-medium">Total:</p>
            <p className="text-xl font-bold text-indigo-600">${totalPrice.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <input type="radio" name="payment" className="w-4 h-4 cursor-pointer" />
            <p className="text-sm text-gray-700">From Bank:</p>
            <div className="flex items-center gap-2">
              <RiVisaLine color="indigo" size={24} />
              <FaPaypal color="indigo" size={24} />
              <RiMastercardFill color="orange" size={24} />
              <FaGooglePay color="red" size={34} />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input type="radio" name="payment" className="w-4 h-4 cursor-pointer" />
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-700">Cash on delivery</p>
              <FaMoneyBillAlt color="green" size={23} />
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Coupon code (Optional)"
              className="text-sm w-full border focus:outline-indigo-500 transition-all duration-300 rounded-md px-4 py-2 border-gray-300 text-gray-700"
            />
            <button className="text-sm border border-gray-300 mt-3 px-3 py-1.5 rounded-md cursor-pointer hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300">
              Apply Coupon
            </button>
          </div>

          <button
            onClick={() => {
              dispatch(setCart([]));
              toast.success('Order successfully placed');
              navigate('/');
            }}
            className="flex items-center group-only: justify-center gap-2 w-full py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-300"
          >
            <CiDeliveryTruck size={23} />
            <p className="text-sm group-hover:cursor-pointer font-medium">Place Order</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserInformation;
