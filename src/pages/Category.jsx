import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowItem from "../component/ShowItem";
import 'react-loading-skeleton/dist/skeleton.css';

function Category() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { category } = useParams();

 useEffect(() => {
  const fetchBestProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/products/category/${category}`);
      const result = await res.json();
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      const updatedData = result.products.map(item => {
        const discount = (item.price * item.discountPercentage) / 100;
        return {
          ...item,
          finalPrice: item.price - discount,
          image: item.images[0] || "https://via.placeholder.com/200"
        };
      });

      setData(updatedData);
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchBestProducts();
}, [category]);


  return (
    <div>
      <h1 className="text-2xl text-center font-medium mt-10">
        <span>Best Products of </span>
        <span className="pacifico text-indigo-600">{category}</span>
      </h1>
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 p-4">
            {/* Show 8 skeleton placeholders */}
            {Array(8).fill(0).map((_, idx) => (
              <ShowItem key={idx} isLoading={true} />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 p-4">
            {data.map(product => (
              <ShowItem {...product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
