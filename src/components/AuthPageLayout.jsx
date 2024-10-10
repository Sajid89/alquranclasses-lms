import React from 'react';

const AuthPageLayout = ({ title, children, image }) => {
    return (
        <div className='sm:block w-full sm:w-1/2 flex-grow bg-green flex flex-col items-center 
            justify-center col-one-content py-10 px-10 pb-5 sm:py-05 sm:px-10 sm:pb-5
            md:py-05 md:px-10 md:pb-5 lg:py-20 lg:px-30 lg:pb-5 xl:px-32 xl:pl-20 
            lg:-mr-18 xl:-mr-18 text-white'>
            <h1 className='text-2xl sm:text-3xl md:text-3xl lg:text-4xl'>{title}</h1>
            <p className='mt-4 lg:w-4/5'>{children}</p>
            <div className="image-wrapper">
                <img src={image} alt="Page Image" className="image" />
            </div>
        </div>
    );
}

export default AuthPageLayout;