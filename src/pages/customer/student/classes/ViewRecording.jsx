import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

import { Breadcrumb } from '../../../../components';

const ViewRecording = () => {
    const { studentName } = useParams();
    const [searchParams] = useSearchParams();
    const URL = searchParams.get('URL');

    // Extract video ID from URL
    const videoId = URL.split('v=')[1];
    const embedURL = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className='mt-20 md:mt-8 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Recording
                </h3>

                <div>
                    <Breadcrumb items={[
                        { name: 'Recordings', link: `/student/${studentName.toLowerCase()}/recordings` },
                        { name: 'View Recording', active: true }
                    ]} />
                </div>
            </div>

            <div className='flex flex-col lg:flex-row mt-6 pl-6 pr-6'>
                <div className='w-full'>
                    <div className='flex justify-center items-center'>
                        <iframe width="100%" height="415" src={embedURL} 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen>
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewRecording