import React, { useEffect, useRef, useState } from 'react';
import ShowItem from './ShowItem';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function NewArrival() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://dummyjson.com/products?limit=8&skip=90');
        const data = await res.json();

        await new Promise(resolve => setTimeout(resolve, 500));

        const updated = data.products.map(item => {
          const discount = (item.price * item.discountPercentage) / 100;
          return {
            ...item,
            finalPrice: item.price - discount,
            image: item.images[0] || item.thumbnail
          };
        });

        setNewArrivals(updated);
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const scroll = (direction) => {
    const amount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 px-6 md:px-20 relative">
      <h2 className="text-center text-3xl mb-6">
        New <span className="pacifico text-indigo-700">Arrivals</span>
      </h2>

      {/* Arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute group left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-indigo-100 transition"
      >
        <FaChevronLeft className="text-indigo-600 group-hover:cursor-pointer text-lg" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute group right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-indigo-100 transition"
      >
        <FaChevronRight className="text-indigo-600 group-hover:cursor-pointer text-lg" />
      </button>

      {/* Product List */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-4"
      >
        {loading
          ? Array(8).fill(0).map((_, idx) => (
              <div key={idx} className="min-w-[240px]">
                <ShowItem isLoading={true} />
              </div>
            ))
          : newArrivals.map(product => (
              <div key={product.id} className="min-w-[240px]">
                <ShowItem {...product} />
              </div>
            ))}
      </div>
    </section>
  );
}

export default NewArrival;
