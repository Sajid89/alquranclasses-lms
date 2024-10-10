import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, paginate }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        totalItems > itemsPerPage && (
            <div className='pagination flex justify-end'>
                <button className={`mt-4 shadow bg-transparent hover:bg-green 
                    text-green focus:shadow-outline focus:outline-none  
                    green-border border py-2 px-8 rounded 
                    ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}>
                    Previous
                </button>

                <span className='mt-4 mx-1 shadow bg-dark-green text-white
                    focus:shadow-outline focus:outline-none  
                    py-2 px-8 rounded'>
                    {currentPage}
                </span>

                <button className={`mt-4 shadow bg-transparent hover:bg-green 
                    text-green focus:shadow-outline focus:outline-none  
                    green-border border py-2 px-8 rounded ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        )
    );
}

export default Pagination;