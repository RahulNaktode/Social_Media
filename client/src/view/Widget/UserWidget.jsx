import { useState, useEffect } from 'react';
import { getUserJwtToken, getUserData } from '../../utils.jsx';
import axios from 'axios';
import { MapPin, BriefcaseBusiness, UserPen } from 'lucide-react';
import LinkedinImg from './../../assets/linkedin.png';
import TwitterImg from '../../assets/twitter.png';
import Avatar from '../../components/Avatar.jsx';
import { useNavigate, Link } from 'react-router';

function UserWidget({ userId, isOwnProfile }) { // ✅ Props se userId lo
  const [userData, setUserData] = useState(null);
  const navigation = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${getUserJwtToken()}`
        }
      });
      if (response.data.success) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchUserData();
}, [userId]);

  if (!userData) return null;

  const { firstName, lastName, photos, location, occupation, viewedProfile, impressions, friends } = userData;

  return (
    <div className='border border-gray-300 shadow p-3 w-full md:w-80 mt-5 rounded'>
      <div className='flex items-center justify-between border-b-2 border-gray-300 pb-3 cursor-pointer'>
        <div className='flex items-center' onClick={() => navigation(`/profile/${userId}`)}>
          <div>
            {photos && photos.length > 0 ? (
              <img
                src={photos[0]}
                alt="Profile"
                className='w-14 h-14 rounded-full object-cover mb-2'
              />
            ) : (
              <Avatar name={firstName} />
            )}
          </div>
          <div className='ml-4'>
            <h1 className='text-lg font-bold'>{firstName} {lastName}</h1>
            <p>{friends.length} friends</p>
          </div>
        </div>

        {/* ✅ Sirf apne profile par edit button dikhao */}
        {isOwnProfile && (
          <UserPen
            onClick={() => navigation(`/profile/${userId}/edit`)}
            className='hover:scale-110 transition-transform cursor-pointer'
          />
        )}
      </div>

      <div className='border-b-2 border-gray-300 py-3 hidden md:block'>
        <p className='flex items-center gap-2 mb-2'><MapPin size={22} />{location}</p>
        <p className='flex items-center gap-2'><BriefcaseBusiness size={22} />{occupation}</p>
      </div>

      <div className='mt-3 border-b-2 border-gray-300 hidden md:block pb-3'>
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
        <p className='font-bold my-2'>Social Profiles</p>
        <Link to='https://www.linkedin.com/' className='flex items-center gap-2 text-sm mb-2'>
          <img src={LinkedinImg} alt="LinkedIn" className='w-7 h-7 mb-2' />Linkedin
        </Link>
        <Link to='https://x.com/' className='flex items-center gap-2 text-sm mb-2'>
          <img src={TwitterImg} alt="Twitter" className='w-7 h-7' />Twitter
        </Link>
      </div>
    </div>
  )
}

export default UserWidget;