import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'Messages', path: '/messages' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/20"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold"
          >
            <Link to="/">TeamCollab</Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <span className={`block w-full h-0.5 bg-white transform transition-transform ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block w-full h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-full h-0.5 bg-white transform transition-transform ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {menuItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation; 