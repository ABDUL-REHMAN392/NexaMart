import { FaMobileAlt, FaLaptop } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { GiDelicatePerfume } from "react-icons/gi";
import { IoCarSportOutline, IoBedOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const data = [
  { id: 1, title: "Smartphones", path: "category/smartphones", icon: <FaMobileAlt /> },
  { id: 2, title: "Laptops", path: "category/laptops", icon: <FaLaptop /> },
  { id: 3, title: "Fragrances", path: "category/fragrances", icon: <GiDelicatePerfume /> },
  { id: 4, title: "Groceries", path: "category/groceries", icon: <FaBasketShopping /> },
  { id: 5, title: "Home Decoration", path: "category/home-decoration", icon: <IoBedOutline /> },
  { id: 6, title: "Vehicles", path: "category/vehicle", icon: <IoCarSportOutline /> },
];

function Category() {
  return (
    <section className="py-12 px-6 md:px-20 bg-white">
      <h2 className="text-center text-3xl  mb-8">
        Browse by <span className="pacifico text-indigo-700">Category</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {data.map((item) => (
          <NavLink
            to={item.path}
            key={item.id}
            className="flex flex-col items-center justify-center p-5 bg-gray-50 hover:bg-indigo-50 rounded-2xl shadow-sm transition-transform duration-300 hover:scale-105"
          >
            <div className="text-indigo-600 text-3xl mb-2">{item.icon}</div>
            <p className="text-sm font-medium text-gray-700 text-center">{item.title}</p>
          </NavLink>
        ))}
      </div>
    </section>
  );
}

export default Category;
