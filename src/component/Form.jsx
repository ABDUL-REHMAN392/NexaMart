import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Form({ onSearch }) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim().length === 0) return;

    navigate(`search?q=${input}`);
    setInput("");

    // Call onSearch callback if provided (to close menu)
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex focus-within:outline-1 outline-blue-500 rounded-md justify-between">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="What are you looking for..."
          className="text-gray-500 w-full py-1.5 border border-gray-300 rounded-l-md px-3 outline-none"
        />
        <div className="flex items-center group bg-gray-200 px-2 rounded-r-md">
          <button type="submit" className="flex items-center">
            <IoIosSearch
              size={23}
              className="group-hover:cursor-pointer w-full"
              aria-label="Search"
            />
          </button>
        </div>
      </div>
    </form>
  );
}

export default Form;
