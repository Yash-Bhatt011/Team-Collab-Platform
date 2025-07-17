import React from 'react';
import './Popup.css';

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="popup-close-button" onClick={onClose} aria-label="Close popup">&times;</button>
        </div>
        <div className="popup-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
