import { motion } from 'framer-motion';

const Card = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      transition={{ duration: 0.3 }}
      className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card; 