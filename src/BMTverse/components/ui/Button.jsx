import './Button.css'; // Importing the CSS file for button styles

import React from 'react';

const Button = ({ onClick, className, children, loading }) => {

    return (
        <button 
            onClick={onClick} 
            className={`bg-blue-500 text-white px-4 py-2 rounded ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={loading}
        >
            {loading ? <span className="loader"></span> : children}
        </button>
    );
};



export default Button;
