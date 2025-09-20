import React, { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom"; 
import logoImage from "../images/logo.png"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [menuHeight, setMenuHeight] = useState(0);

  // Calculate height dynamically for smooth slide
  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 md:py-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={logoImage}
            alt="BUSINFO.CLICK Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-extrabold">Businfo.Click</h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 font-medium text-base md:text-lg">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/fares" className="hover:text-yellow-400 transition">Fares</Link>
          <Link to="/routes" className="hover:text-yellow-400 transition">Routes</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with slide + fade + bounce */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden bg-gray-800 transition-all duration-300 ease-in-out ${
          isOpen ? "animate-slideBounce" : ""
        }`}
        style={{
          maxHeight: isOpen ? `${menuHeight}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <Link to="/" className="block px-4 py-2 hover:text-yellow-400 transition-opacity duration-300">Home</Link>
        <Link to="/fares" className="block px-4 py-2 hover:text-yellow-400 transition-opacity duration-300">Fares</Link>
        <Link to="/routes" className="block px-4 py-2 hover:text-yellow-400 transition-opacity duration-300">Routes</Link>
        <Link to="/contact" className="block px-4 py-2 hover:text-yellow-400 transition-opacity duration-300">Contact</Link>
      </div>

      {/* Tailwind Keyframe Animation */}
      <style jsx>{`
        @keyframes slideBounce {
          0% { transform: translateY(-20px); opacity: 0; }
          60% { transform: translateY(10px); opacity: 1; }
          80% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        .animate-slideBounce {
          animation: slideBounce 0.4s ease forwards;
        }
      `}</style>
    </header>
  );
};

export default Navbar;

