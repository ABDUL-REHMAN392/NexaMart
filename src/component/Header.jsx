
import { NavLink } from 'react-router-dom';
import Form from './Form';
import { IoMdMenu } from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import { CiHeart } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { showMenu } from '../redux/conditionSlices';
import ShowMenu from './ShowMenu';
import { AnimatePresence, motion } from 'framer-motion';

function Header() {
  const dispatch = useDispatch();
  const { Menu } = useSelector(state => state.condition);
  const { cart } = useSelector(state => state.cart || { cart: [] });
  const quantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="flex justify-between items-center md:px-10 px-4 py-4 shadow-sm border-b bg-white relative z-30">
      {/* Logo */}
      <motion.div
        className="text-2xl font-extrabold tracking-tight"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <NavLink to="/">
          Nexa<span className="pacifico text-indigo-600">Mart</span>
        </NavLink>
      </motion.div>

      {/* Desktop nav */}
      <motion.nav
        className="hidden md:flex gap-6 text-sm font-medium text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <NavLink to="/" className={({ isActive }) => isActive ? 'border-b-2 border-indigo-600 text-indigo-600 pb-1' : 'hover:text-indigo-600 transition'}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'border-b-2 border-indigo-600 text-indigo-600 pb-1' : 'hover:text-indigo-600 transition'}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'border-b-2 border-indigo-600 text-indigo-600 pb-1' : 'hover:text-indigo-600 transition'}>Contact</NavLink>
      </motion.nav>

      {/* Right icons */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <Form />
        </div>

        <NavLink to="/favorite" className="relative group hover:text-indigo-600">
          <CiHeart size={24} />
        </NavLink>

        <NavLink to="/cart" className="relative group hover:text-indigo-600">
          <FiShoppingCart size={24} />
          {quantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {quantity}
            </span>
          )}
        </NavLink>

        <button onClick={() => dispatch(showMenu())} className="md:hidden focus:outline-none">
          <IoMdMenu size={26} />
        </button>
      </div>

      <AnimatePresence>
        {Menu && <ShowMenu key="mobile-menu" />}
      </AnimatePresence>
    </header>
  );
}

export default Header;
