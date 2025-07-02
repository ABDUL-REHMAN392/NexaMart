import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Carousel = () => {
  const DEFAULT_ITEMS = [
    {
      id: 1,
      product: "iPhone 9",
      description: "A luxurious fragrance with notes of jasmine and vanilla.",
      price: 89.99,
    },
    {
      id: 2,
      product: "Dell XPS 13",
      description: "A compact and lightweight laptop with an impressive display.",
      price: 999.99,
    },
    {
      id: 3,
      product: "Cucumber Face Wash",
      description: "Gentle face wash infused with cucumber extract for refreshing clean.",
      price: 19.99,
    },
    {
      id: 4,
      product: "Fancy Perfume",
      description: "A luxurious fragrance with notes of jasmine and vanilla.",
      price: 89.99,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % DEFAULT_ITEMS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [DEFAULT_ITEMS.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
      <div className="relative h-72 sm:h-64 flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={DEFAULT_ITEMS[current].id}
            className="absolute w-full h-full p-6 text-center flex flex-col justify-center items-center"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6 }}
          >
            <p className="text-3xl sm:text-2xl font-bold mb-2 text-indigo-800">
              {DEFAULT_ITEMS[current].product}
            </p>
            <p className="text-gray-600 text-base sm:text-lg mb-4 max-w-md">
              {DEFAULT_ITEMS[current].description}
            </p>
            <p className="text-xl font-semibold text-indigo-500">
              ${DEFAULT_ITEMS[current].price}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 py-4">
        {DEFAULT_ITEMS.map((_, index) => (
          <div
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all duration-200 ${
              index === current ? "bg-indigo-500 scale-110" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
