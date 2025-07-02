import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ShowItem from '../component/ShowItem';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

function Search() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { cart } = useSelector(state => state.cart);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const url = `https://dummyjson.com/products/search?q=${query}&limit=0`;

  useEffect(() => {
    const fetchQueryResult = async () => {
      setIsLoading(true);
      setCurrentPage(1);
      try {
        const res = await fetch(url);
        const data = await res.json();

        await new Promise(resolve => setTimeout(resolve, 500));

        const updatedData = data.products.map(item => {
          const discount = (item.price * item.discountPercentage) / 100;
          return {
            ...item,
            finalPrice: item.price - discount,
            image: item.images[0] || item.image,
          };
        });

        setData(updatedData);
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) fetchQueryResult();
  }, [searchParams, query, url]);

  const totalPages = Math.max(Math.ceil(data.length / itemsPerPage), 1);
  const maxPage = Math.min(3, totalPages);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < maxPage) setCurrentPage(currentPage + 1);
  };

  const pagesToShow = [1, 2, 3];

  return (
    <div>
      <div className="flex justify-center font-medium items-center my-8 text-2xl gap-2">
        <h1>Search Results for</h1>
        <h1 className="pacifico text-indigo-600">{query}</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 place-items-center md:grid-cols-4 gap-4 p-4">
          {Array(10)
            .fill(0)
            .map((_, idx) => (
              <ShowItem key={idx} isLoading={true} />
            ))}
        </div>
      ) : data.length === 0 ? (
        <h1 className="text-2xl text-center mt-10">
          No results found for {`"${query}"`}.
        </h1>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 place-items-center p-4">
            {currentItems.map(item => (
              <ShowItem key={item.id} {...item} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 my-6 text-sm sm:text-base select-none">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className={`p-2 rounded-full border transition ${
                currentPage <= 1
                  ? 'cursor-not-allowed border-gray-300 text-gray-400 bg-gray-100'
                  : 'hover:border-indigo-600 hover:text-indigo-600 bg-white'
              }`}
              aria-label="Previous Page"
            >
              <AiOutlineLeft />
            </button>

            {pagesToShow.map(page => {
              const isActive = currentPage === page;
              const disabled = page > totalPages;
              return (
                <button
                  key={page}
                  onClick={() => !disabled && setCurrentPage(page)}
                  disabled={disabled}
                  className={`w-10 h-10 rounded-full border transition font-medium ${
                    disabled
                      ? 'cursor-not-allowed border-gray-300 text-gray-400 bg-gray-100'
                      : isActive
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:border-indigo-500'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={handleNextPage}
              disabled={currentPage >= maxPage}
              className={`p-2 rounded-full border transition ${
                currentPage >= maxPage
                  ? 'cursor-not-allowed border-gray-300 text-gray-400 bg-gray-100'
                  : 'hover:border-indigo-600 hover:text-indigo-600 bg-white'
              }`}
              aria-label="Next Page"
            >
              <AiOutlineRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Search;
