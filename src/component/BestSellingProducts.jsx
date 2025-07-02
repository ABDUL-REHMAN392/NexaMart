import React, { useEffect, useRef, useState } from 'react';
import ShowItem from './ShowItem';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function BestSellingProducts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchBestProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('https://dummyjson.com/products/category/womens-dresses');
        const result = await res.json();

        await new Promise(resolve => setTimeout(resolve, 500));

        const updatedData = result.products.map(item => {
          const discount = (item.price * item.discountPercentage) / 100;
          return {
            ...item,
            finalPrice: parseFloat(item.price - discount),
            image: item.images[0] || item.image,
          };
        });

        setData(updatedData);
      } catch (error) {
        console.error('Failed to fetch best selling products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestProducts();
  }, []);

  const scroll = (direction) => {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 px-6 md:px-20 relative">
      <h2 className="text-center text-3xl mb-6">
        Best <span className="pacifico text-indigo-700">Selling Products</span>
      </h2>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute group left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-indigo-100 transition"
      >
        <FaChevronLeft className="text-indigo-600 group-hover:cursor-pointer text-lg" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute group right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-indigo-100 transition"
      >
        <FaChevronRight className="text-indigo-600 group-hover:cursor-pointer text-lg" />
      </button>

      {/* Product List */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-4"
      >
        {isLoading
          ? Array(5).fill(0).map((_, idx) => (
              <div key={idx} className="min-w-[240px]">
                <ShowItem isLoading={true} />
              </div>
            ))
          : data.map(product => (
              <div key={product.id} className="min-w-[240px]">
                <ShowItem {...product} />
              </div>
            ))}
      </div>
    </section>
  );
}

export default BestSellingProducts;
