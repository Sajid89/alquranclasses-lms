import React from 'react';

const StepComponent = ({ stepNumber, stepTitle, stepTexts, activeStep }) => {
    return (
        <div className='w-full max-w-sm text-center'>
            {/* <p>Step {stepNumber} of 3</p> */}
            <h3 className='text-2xl sm:text-2xl md:text-2xl lg:text-2xl 
                font-semibold pb-3'>{stepTitle}</h3>

            <div className='max-w-20 mb-10 ml-auto mr-auto'>
                <div className='w-full block  m-auto'>
                    <div className='flex items-center justify-center'>
                        {stepTexts.map((stepText, index) => (
                            <React.Fragment key={index}>
                                <div className={`w-6 h-6 rounded-full border-1 
                                    ${index <= activeStep ? 'green-border' : 'border-gray-300'} 
                                    flex items-center justify-center ${index <= activeStep-1 ? 'bg-green' : ''}`}>
                                    <div className='w-2 h-2 rounded-full bg-transparent'></div>
                                </div>
                                {index < stepTexts.length - 1 && <div className={`flex-grow border-t-1 ${index < activeStep ? 'green-border' : 'border-gray-200'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className='w-full'>
                    <div className='flex justify-between mt-1'>
                        {stepTexts.map((stepText, index) => (
                            <span key={index} className={index === activeStep ? 'font-semibold' : ''} style={{ fontSize: '9px' }}>{stepText}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepComponent;