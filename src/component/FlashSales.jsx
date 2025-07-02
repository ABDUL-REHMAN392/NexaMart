import { useEffect, useRef, useState } from "react";
import ShowItem from "./ShowItem";
import 'react-loading-skeleton/dist/skeleton.css';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function FlashSales() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    const flashSales = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://dummyjson.com/products");
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
        console.error('Error fetching flash sales:', error);
      } finally {
        setIsLoading(false);
      }
    };

    flashSales();
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
        Today's <span className="pacifico text-indigo-700">Flash Sales</span>
      </h2>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute group left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-indigo-100 transition"
      >
        <FaChevronLeft className="group-hover:cursor-pointer text-indigo-600 text-lg" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute group right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-indigo-100 transition"
      >
        <FaChevronRight className="group-hover:cursor-pointer text-indigo-600 text-lg" />
      </button>

      {/* Scrollable Items (Scrollbar Hidden) */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
      >
        {isLoading
          ? Array(6).fill(0).map((_, idx) => (
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

export default FlashSales;
