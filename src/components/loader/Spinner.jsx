import React from 'react';
import './Spinner.css';

const Spinner = ({ loading, text }) => {
    if (!loading) return null;

    return (
        <div className="spinner">
           <div className="dots"> {/* Add a new div for the dots */}
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            <p className='font-semibold'>{text}</p>
        </div>
    );
};

export default Spinner;