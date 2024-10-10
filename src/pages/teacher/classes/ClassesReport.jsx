import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ClassAttendance } from '../../../components';
import api from '../../../utils/api';
import { USER_TYPES } from '../../../data/TextConstants';

const ClassesReport = () => {
    const teacher = useSelector(state => state.auth.profile);
    
    return (
        <div className='mt-20 md:mt-0 mb-8'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Classes Report
                </h3>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6'>
                <div className='w-full'>
                    <ClassAttendance teacherId={teacher.id} user={USER_TYPES.TEACHER} />
                </div>
            </div>
        </div>
    );
}

export default ClassesReport