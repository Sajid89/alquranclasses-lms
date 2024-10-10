import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

import { Breadcrumb, PlanCard } from '../../../../components';

const RecordingPlans = () => {
    const { studentName } = useParams();

    const plans = [
        {
            name: 'Standard',
            price: 65,
            recommended: false,
            features: ['Accessible up to 15 days', 'Feature 2', 'Feature 3']
        },
        {
            name: 'Premium',
            price: 85,
            recommended: true,
            features: ['Accessible up to 30 days', 'Feature 2', 'Feature 3']
        },
        {
            name: 'Ultimate',
            price: 100,
            recommended: false,
            features: ['Accessible up to 45 days', 'Feature 2', 'Feature 3']
        }
    ];

    return (
        <div className='mt-20 md:mt-8 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Recording Plans
                </h3>

                <div>
                    <Breadcrumb items={[
                        { name: 'Recordings', link: `/student/${studentName.toLowerCase()}/recordings` },
                        { name: 'Recording Plans', active: true }
                    ]} />
                </div>
            </div>

            <div className='flex items-center justify-center' style={{ height: 'calc(100vh - 2rem)' }}>
                <div className='grid place-items-center'>
                    <div className='w-full flex flex-col items-center text-center'>
                        <h3 className='font-semibold text-xl'>
                            Choose the best plan
                        </h3>
                        <p>
                            Choose a plan now and enjoy the recordings
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {plans.map((plan, index) => (
                                <PlanCard key={index} plan={plan} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecordingPlans