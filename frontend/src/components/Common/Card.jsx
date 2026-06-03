import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`card-minimal ${className}`}>
      {children}
    </div>
  );
};

export default Card;
