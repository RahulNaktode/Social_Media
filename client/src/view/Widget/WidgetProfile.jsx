import { useState, useEffect } from 'react';
import {  getUserData } from '../../utils';
import axios from 'axios';
import { MapPin, BriefcaseBusiness } from 'lucide-react';
import LinkedinImg from './../../assets/linkedin.png';
import TwitterImg from '../../assets/twitter.png';

function Widget() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const data = getUserData();
        console.log("User Data in Widget:", data);
        setUserData(data);
        
    }, []);

    if(!userData){
        return null;
    }

    const { firstName, lastName, photos, location, occupation, viewedProfile, impressions, friends } = userData;

  return (
    <div className='border border-gray-300 shadow p-3 w-70 mt-5 rounded mx-2'>
      <div className='flex items-center border-b-2 border-gray-300 pb-3'>
          <div>
         <img src={photos[0]} alt="Profile" className='w-14 h-14 rounded-full object-cover mb-2' />
         </div>
         <div className='ml-4'>
        <h1 className='text-lg font-bold'>{firstName} {lastName}</h1>
        <p>{friends.length} friends</p>
        </div>
      </div>

      <div className='border-b-2 border-gray-300 py-3'>
        <p className='flex items-center gap-2 mb-2'><MapPin size={22}/>{location}</p>
        <p className='flex items-center gap-2'><BriefcaseBusiness size={22}/>{occupation}</p>
      </div>

      <div className='mt-3 border-b-2 border-gray-300'>
        <div className='flex items-center justify-between mb-2'>
        <p>Who viewed your profile</p>
        <p className='font-bold'>{viewedProfile}</p>
        </div>

        <div className='flex items-center justify-between mb-3'>
        <p>Impressions of your post</p>
        <p className='font-bold'>{impressions}</p>
        </div>
      </div>

      <div>
        <p className=' font-bold mb-2'>Social Profiles</p>
        <p className='flex'>
          <img src={LinkedinImg} alt="LinkedIn" className='w-7 h-7 mb-2' />Linkedin
        </p>
        <p className='flex'>
          <img src={TwitterImg} alt="Twitter" className='w-7 h-7' />Twitter
        </p>
      </div>

    </div>
  )
}

export default Widget
