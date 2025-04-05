import React from 'react';

const Card = ({ children, className }) => {
    return (
        <div className={`bg-white shadow-lg rounded-lg p-4 transition-transform duration-300 hover:shadow-xl hover:scale-105 ${className}`}>

            {children}
        </div>
    );
};

export default Card;
