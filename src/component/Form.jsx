import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Form({ onSearch }) {
  const navigate = useNavigate();
  const [input, setInput]     = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`search?q=${input.trim()}`);
    setInput("");
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 3px rgba(99,102,241,0.15)'
            : '0 0 0 0px rgba(99,102,241,0)',
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'flex', alignItems: 'center',
          borderRadius: 12,
          border: `1.5px solid ${focused ? '#a5b4fc' : '#ebebf5'}`,
          background: focused ? '#fafafe' : '#f8f8fc',
          overflow: 'hidden',
          transition: 'border-color 0.18s ease, background 0.18s ease',
          height: 38,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type="text"
          placeholder="Search products..."
          style={{
            flex: 1,
            padding: '0 12px',
            fontSize: 13,
            fontFamily: 'inherit',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#1e1b4b',
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          style={{
            height: '100%',
            padding: '0 14px',
            background: focused
              ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
              : '#ededf8',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: focused ? '#fff' : '#9ca3af',
            transition: 'background 0.2s ease, color 0.2s ease',
            flexShrink: 0,
          }}
        >
          <IoIosSearch size={18} />
        </button>
      </motion.div>
    </form>
  );
}

export default Form;