import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', disabled = false, className = '' }) => {
  return (
    <button
      type={type}
      className={`custom-button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
