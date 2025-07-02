import React from 'react';
import { motion } from 'framer-motion';

const brandLogos = [
  'paypal', 'visa', 'mastercard', 'googlepay', 'applepay',
  'audi', 'bmw', 'nike', 'tesla', 'adidas','honda','xiaomi'
];

const buildBrandList = () => {
  return brandLogos.map((name) => ({
    name,
    src: `https://cdn.simpleicons.org/${name}`
  }));
};

const TrustedPartners = () => {
  const brands = buildBrandList();
  const duplicatedBrands = [...brands, ...brands]; // Repeat for seamless scroll

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-3xl  ">Trusted <span className='text-indigo-700 pacifico'>Partners</span></h2>
        <p className="text-gray-500 mt-2">Brands we proudly work with</p>
      </div>

      <div className="w-full overflow-hidden">
        <motion.div
          className="flex w-max space-x-10" // <-- horizontal gap added here
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          {duplicatedBrands.map(({ name, src }, idx) => (
            <div
              key={name + idx}
              className="w-28 h-20 flex items-center justify-center"
            >
              <img
                src={src}
                alt={name}
                className="w-full h-full cursor-pointer object-contain grayscale hover:grayscale-0 transition duration-300"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedPartners;
