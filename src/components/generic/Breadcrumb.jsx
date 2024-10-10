import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineRight } from 'react-icons/ai';

const Breadcrumb = ({ items }) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb flex text-gray-300 space-x-2 items-center">
                {items.map((item, index) => (
                    <li key={index} className={`breadcrumb-item flex items-center ${item.active ? 'active' : ''}`} aria-current={item.active ? 'page' : undefined}>
                        {
                            item.link ? 
                            <Link to={item.link} className={`text-gray-300 hover:text-gray-500 ${item.active ? 'text-gray-700' : ''}`}>{item.name}</Link> 
                            : <span className={`${item.active ? 'text-gray-700' : 'text-gray-300'}`}>{item.name}</span>
                        }
                        {index < items.length - 1 && <AiOutlineRight className="mx-2" />}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;