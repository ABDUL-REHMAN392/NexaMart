import { RxCross1 } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideMenu } from "../redux/conditionSlices";
import { motion } from "framer-motion";
import Form from './Form';

const menuVariants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: {
      type: "tween",
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    y: "100%",  // slide down to close
    transition: {
      type: "tween",
      duration: 0.4,
      when: "afterChildren",
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
};

function ShowMenu() {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideMenu());
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 backdrop-blur-md bg-white/30 p-4 flex flex-col"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
    >
      <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
        <h1 className="text-2xl font-bold">Nexa<span className="pacifico text-indigo-600">Mart</span></h1>
        <RxCross1 size={30} onClick={handleClose} className="cursor-pointer"/>
      </motion.div>

      <motion.div className="flex flex-col items-center gap-6 mt-6">
        {['/', '/about', '/contact'].map((path, idx) => (
          <motion.div key={path} variants={itemVariants}>
            <NavLink to={path} className="text-2xl font-medium" onClick={handleClose}>
              {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
            </NavLink>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="mt-8" variants={itemVariants}>
        <Form onSearch={handleClose} />
      </motion.div>
    </motion.div>
  );
}

export default ShowMenu;
