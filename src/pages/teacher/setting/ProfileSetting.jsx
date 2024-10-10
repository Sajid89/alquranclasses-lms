import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Breadcrumb, Tabs, DynamicForm, TicketViewSkeletonLoader } from '../../../components';
import PersonalSettings from './Personal';
import AddressSettings from './Address';
import PasswordSettings from './Password';
import api from '../../../utils/api';

import { generateValidationSchema } from '../../../utils/ValidationSchema';
import * as Yup from 'yup';
import { to } from 'mathjs';

const ProfileSetting = () => {
    const [generalProfile, setGeneralProfile ] = useState([]);
    const [homeAddress, setHomeAddress] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get('/get-teacher-profile');
                const data = response.data.data;
                setGeneralProfile([
                    { 
                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        regularClassRate: data.regularClassRate,
                        trialClassRate: data.trialClassRate,
                        coordinator: data.teacherCoordinator,
                    }
                ]);

                setHomeAddress([
                    {
                        country: data.country,
                        city: data.city,
                        address: data.address,
                        postalCode: data.postalCode,
                    }
                ]);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileDetails();
    }, []);

    return (
        <div className='mt-20 md:mt-0 mb-4'>
            <div className='pl-6 pr-6'>
                <h3 className='font-semibold text-xl mb-4'>
                    Settings
                </h3>
            </div>
            <div className='flex flex-col lg:flex-row pl-6 pr-6 mt-4 md:mt-8'>
                <div className='w-full'>
                    {loading ? (
                        <TicketViewSkeletonLoader />
                    ) : (
                        <Tabs 
                            tabs={[
                                { label: 'General Profile', 
                                    content:  <PersonalSettings
                                        details={generalProfile}
                                    />
                                },
                                { label: 'Home Address', 
                                    content:  <AddressSettings
                                        details={homeAddress}
                                    />
                                },
                                { label: 'Password', 
                                    content: <PasswordSettings />
                                }
                            ]}
                            teacherSettings={true}
                        />
                    )}
                    
                    
                </div>
            </div>
        </div>
    );
}

export default ProfileSetting