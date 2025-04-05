import React from 'react';

const Slider = ({ min, max, step, value, onChange }) => {
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full"
        />
    );
};

export default Slider;
