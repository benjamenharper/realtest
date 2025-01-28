import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

export default function IslandsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const islands = [
    { name: 'Oahu', path: '/properties/oahu' },
    { name: 'Maui', path: '/properties/maui' },
    { name: 'Big Island', path: '/properties/big-island' },
    { name: 'Kauai', path: '/properties/kauai' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-1 text-slate-600 hover:text-gray-800"
      >
        Islands
        <FaChevronDown className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
          {islands.map((island) => (
            <Link
              key={island.name}
              to={island.path}
              className="block px-4 py-2 text-slate-600 hover:bg-gray-50 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              {island.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
