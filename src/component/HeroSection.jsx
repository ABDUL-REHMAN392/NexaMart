import { NavLink } from "react-router-dom";
import Carousel from "./Carousel";
import { FaTshirt, FaFemale, FaSpa, FaHome, FaMobileAlt, FaFootballBall } from "react-icons/fa";

const sidebarLinks = [
  { id: 1, title: "Men's Clothing", path: "category/mens-shirts", icon: <FaTshirt /> },
  { id: 2, title: "Women's Clothing", path: "category/womens-dresses", icon: <FaFemale /> },
  { id: 3, title: "Skin Care", path: "category/skin-care", icon: <FaSpa /> },
  { id: 4, title: "Home & Kitchen", path: "category/kitchen-accessories", icon: <FaHome /> },
  { id: 5, title: "Electronics", path: "category/mobile-accessories", icon: <FaMobileAlt /> },
  { id: 6, title: "Sports", path: "category/sports-accessories", icon: <FaFootballBall /> },
];

function HeroSection() {
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 px-6 md:px-20 py-10">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col gap-3 w-1/4 bg-white shadow-md rounded-2xl p-4">

        {sidebarLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.path}
            className="flex items-center gap-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 px-4 py-2 rounded-md transition"
          >
            <span className="text-indigo-600 text-lg">{link.icon}</span>
            <span>{link.title}</span>
          </NavLink>
        ))}
      </aside>

      {/* Carousel */}
      <div className="w-full md:w-3/4">
        <Carousel />
      </div>
    </div>
  );
}

export default HeroSection;
