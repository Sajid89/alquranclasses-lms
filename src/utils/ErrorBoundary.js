import React from 'react';
import * as Sentry from '@sentry/react';
import Image from '../data/images/500.png';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        Sentry.captureException(error);
    }

    render() {
        if (this.state.hasError) {
            return <div className='flex flex-col items-stretch min-h-screen main-wrapper'>
                <div className='w-full flex-grow bg-white flex flex-col 
                    items-center rounded-bl-10xl justify-center text-center'>
                    <h3 className='text-2xl sm:text-2xl md:text-2xl lg:text-2xl 
                    text-left font-semibold pb-3'>Whoops! Something Went Wrong!</h3>
                    <p>
                        Sorry for inconvenience, we are working on it. You’ll get this page in a while.
                    </p>

                    <img src={Image} alt="something went wrong" 
                        style={{ width: '320px' }} />
                </div> 
            </div>
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;