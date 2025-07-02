import ShowStarRating from './ShowStarRating';
import { CiHeart } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { addCart } from '../redux/cartSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


function ShowItem({ id, image, title, rating, price, finalPrice, stock, isLoading }) {
  const dispatch = useDispatch();

  const handleCart = () => {
    const newItem = {
      id,
      stock,
      image,
      finalPrice,
      price,
      title,
      quantity: 1,
    };
    dispatch(addCart(newItem));
    toast.success('Added to Cart');
  };

  const handleFavorite = (id) => {
    try {
      const stored = localStorage.getItem("favoriteIds");
      let favorites = [];

      if (stored) {
        favorites = JSON.parse(stored);
        if (!Array.isArray(favorites)) favorites = [];
      }

      if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem("favoriteIds", JSON.stringify(favorites));
        toast.success("Added to favorites");
      } else {
        toast.info("Already in favorites");
      }
    } catch (error) {
      console.error("Favorite Error:", error);
      toast.error("Error saving favorite");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-[240px] h-[320px] p-4 bg-white rounded-lg shadow-md animate-pulse">
        <Skeleton height={160} width={200} borderRadius={8} />
        <Skeleton height={20} width={150} className="mt-3" />
        <Skeleton height={20} width={100} className="mt-2" />
        <Skeleton height={15} width={80} className="mt-2" />
        <div className="flex mt-4 gap-2 w-full justify-between">
          <Skeleton height={32} width={90} borderRadius={6} />
          <Skeleton height={32} width={90} borderRadius={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[240px] h-[320px] p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-200 hover:border-indigo-400">
      <NavLink to={`/product/${id}`} className="mb-2">
        <img src={image} alt={title} className="w-full h-[160px] object-cover rounded-md hover:scale-105 transition duration-300" />
      </NavLink>
      <p className="font-semibold text-sm text-gray-800 line-clamp-2 text-center mb-1">{title}</p>
      <p className="flex gap-2 text-sm justify-center">
        <span className="text-indigo-600 font-bold">${finalPrice?.toFixed(2)}</span>
        <span className="line-through text-gray-400">${price}</span>
      </p>
      <div className="flex items-center gap-1 mt-1 justify-center">
        <ShowStarRating rating={rating} />
        <p className="text-sm text-gray-500">({rating})</p>
      </div>
      <div className="flex gap-2 mt-3 w-full justify-between">
        <button
          onClick={() => handleFavorite(id)}
          className="flex cursor-pointer border text-gray-600 items-center gap-2 border-gray-300 px-3 py-1.5 rounded-md group hover:border-indigo-500 hover:bg-indigo-50"
        >
          <CiHeart className="group-hover:text-indigo-600" />
          <span className="text-sm group-hover:text-indigo-600">Favorite</span>
        </button>

        <button
          onClick={handleCart}
          className="flex cursor-pointer border text-gray-600 items-center gap-2 border-gray-300 px-3 py-1.5 rounded-md group hover:border-indigo-500 hover:bg-indigo-50"
        >
          <FiShoppingCart className="group-hover:text-indigo-600" />
          <span className="text-sm group-hover:text-indigo-600">Cart</span>
        </button>
      </div>
    </div>
  );
}

export default ShowItem;
