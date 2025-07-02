import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShowStarRating from '../component/ShowStarRating';
import { CiHeart } from 'react-icons/ci';
import { FiShoppingCart } from 'react-icons/fi';
import { IoBagCheckOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { addCart } from '../redux/cartSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SingleProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const { id } = useParams();

  const handleFavorite = () => {
    if (!data?.id) return;

    const stored = localStorage.getItem('favoriteIds');
    let favorites = stored ? JSON.parse(stored) : [];

    if (!favorites.includes(data.id)) {
      favorites.push(data.id);
      localStorage.setItem('favoriteIds', JSON.stringify(favorites));
      toast.success("Added to favorites");
    } else {
      toast.info("Already in favorites");
    }
  };

  useEffect(() => {
    const fetchById = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // simulate delay
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const product = await res.json();

        const discount = (product.price * product.discountPercentage) / 100;
        const finalPrice = product.price - discount;
        const image = product.images?.[0] || product.image;

        setData({ ...product, finalPrice, image });
      } catch (error) {
        console.error(error);
        toast.error('Error loading product');
      } finally {
        setIsLoading(false);
      }
    };
    fetchById();
  }, [id]);

  if (!isLoading && !data) {
    return (
      <div className="container mx-auto px-4 mt-10 text-center text-red-600 font-semibold">
        Product not found.
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!data) return;
    const newItem = {
      id: data.id,
      stock: data.stock,
      image: data.image,
      finalPrice: data.finalPrice,
      price: data.price,
      title: data.title,
      quantity: 1,
    };
    dispatch(addCart(newItem));
    return newItem;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-2 text-xl font-medium text-center">
        <p>{isLoading ? <Skeleton width={80} /> : 'Discover'}</p>
        <p className="pacifico text-indigo-600">
          {isLoading ? <Skeleton width={120} /> : data?.title}
        </p>
        <p>{isLoading ? <Skeleton width={100} /> : '- A Must-Have!'}</p>
      </div>

      <div className="flex flex-col md:flex-row mt-10 gap-12 md:gap-20">
        <div className="bg-gray-100 rounded-xl flex justify-center items-center md:ml-20 p-4 w-80 h-80 shadow-sm">
          {isLoading ? (
            <Skeleton height={250} width={250} />
          ) : (
            <img
              src={data?.thumbnail || data?.image}
              alt={data?.title || 'Product'}
              className="object-contain cursor-pointer w-full h-full hover:scale-110 transition-transform duration-700"
            />
          )}
        </div>

        <div className="flex flex-col md:w-1/2 gap-4">
          <h1 className="text-2xl font-bold">
            {isLoading ? <Skeleton width={`60%`} /> : data?.title}
          </h1>

          <div className="flex flex-wrap my-1 gap-4 items-center">
            {isLoading ? (
              <Skeleton width={100} />
            ) : (
              <>
                <ShowStarRating rating={data?.rating || 0} />
                <p>{data?.rating ? `(${data.rating})` : null}</p>
              </>
            )}
            {!isLoading && (
              <div className="flex items-center gap-2">
                <span className="bg-gray-500 w-[1px] h-6"></span>
                <span className="text-green-500 text-sm">
                  {data?.availabilityStatus || 'In Stock'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-indigo-600">
              {isLoading ? <Skeleton width={60} /> : `$${data?.finalPrice?.toFixed(2)}`}
            </p>
            {!isLoading && data?.price != null && (
              <p className="text-gray-500 line-through">${data.price}</p>
            )}
          </div>

          <p className="text-sm text-gray-700">
            {isLoading ? <Skeleton count={3} /> : data?.description}
          </p>

          <p className="text-sm border-b pb-4 border-gray-300">
            {isLoading ? <Skeleton width={`80%`} /> : data?.returnPolicy || '30-day return policy'}
          </p>

          <div className="flex flex-wrap items-center mt-4 gap-3">
            {isLoading ? (
              <Skeleton width={90} height={36} />
            ) : (
              <button onClick={handleFavorite} className="flex items-center gap-2 text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md group hover:border-indigo-500 hover:bg-indigo-50">
                <CiHeart className="group-hover:text-indigo-600" />
                <span className="text-sm cursor-pointer group-hover:text-indigo-600">Favorite</span>
              </button>
            )}

            {isLoading ? (
              <Skeleton width={90} height={36} />
            ) : (
              <button
                onClick={() => {
                  handleAddToCart();
                  toast.success('Added to cart');
                }}
                className="flex cursor-pointer items-center gap-2 text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md group hover:border-indigo-500 hover:bg-indigo-50"
              >
                <FiShoppingCart className="group-hover:text-indigo-600" />
                <span className="text-sm group-hover:text-indigo-600">Cart</span>
              </button>
            )}

            {isLoading ? (
              <Skeleton width={90} height={36} />
            ) : (
              <button
                onClick={() => {
                  handleAddToCart();
                  navigate('/user_Details');
                }}
                className="flex cursor-pointer items-center gap-2 text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md group hover:border-indigo-500 hover:bg-indigo-50"
              >
                <IoBagCheckOutline className="group-hover:text-indigo-600" />
                <span className="text-sm group-hover:text-indigo-600">Buy now</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-12">
        {isLoading
          ? Array(3).fill(0).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center border rounded-md shadow-sm border-gray-300 gap-2 p-6 text-center"
              >
                <Skeleton width={100} />
                <Skeleton width={120} />
                <Skeleton width={80} />
                <Skeleton count={2} width={`90%`} />
              </div>
            ))
          : data?.reviews?.length > 0 ? (
              data.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center border rounded-md shadow-sm border-gray-300 gap-2 p-6 text-center"
                >
                  <p className="font-semibold">{review.reviewerName}</p>
                  <p className="text-sm text-gray-500">{review.reviewerEmail}</p>
                  <div className="flex items-center gap-1">
                    <ShowStarRating rating={review.rating} />
                    <p>{`(${review.rating})`}</p>
                  </div>
                  <p className="text-sm mt-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center w-full col-span-full text-gray-500">No reviews available.</p>
            )}
      </div>
    </div>
  );
}

export default SingleProduct;
