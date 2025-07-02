import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function Favorite() {
  const [favoritesData, setFavoritesData] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("favoriteIds");
    const ids = stored ? JSON.parse(stored) : [];

    if (ids.length === 0) return;

    const fetchDataByIds = async () => {
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`https://dummyjson.com/products/${id}`);
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
          })
        );
        setFavoritesData(results);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchDataByIds();
  }, []);

  const handleRemoveFavorite = (id) => {
    const stored = localStorage.getItem("favoriteIds");
    const favorites = stored ? JSON.parse(stored) : [];
    const updated = favorites.filter((favId) => favId !== id);

    localStorage.setItem("favoriteIds", JSON.stringify(updated));
    setFavoritesData((prev) => prev.filter((item) => item.id !== id));

    toast.success("Removed from favorites");
  };

  return (
    <div className="p-4">
      <h1 className="flex justify-center items-center my-8 text-2xl gap-2 font-medium">
        <span>Your</span>
        <span className="pacifico text-indigo-500">Favorite Choices</span>
      </h1>

      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {favoritesData.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-30">
            No favorites found.
          </p>
        ) : (
          favoritesData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image Section */}
              <div className="w-[60px] h-[60px] flex-shrink-0 rounded overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info Section */}
              <div className="flex-1 mx-4">
                <h2 className="text-md font-semibold mb-1 line-clamp-1">{item.title}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-indigo-500 font-bold">
                    $
                    {(
                      item.price -
                      (item.price * item.discountPercentage) / 100
                    ).toFixed(2)}
                  </span>

                  <span className="text-sm line-through text-gray-500">
                    ${item.price}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleRemoveFavorite(item.id)}
                className="cursor-pointer hover:text-indigo-500 transition-colors duration-300"
                aria-label="Remove from favorites"
              >
                <FaTrash size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorite;
