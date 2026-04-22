import Navbar from './../../components/Navbar.jsx'
import UserWidget from './UserWidget.jsx'
import FriendListWidget from './FriendListWidget'
import MyPostWidget from './MyPostWidget.jsx'
import PostsWidget from './PostsWidget'
import { useParams } from 'react-router'
import { getUserData } from '../../utils.jsx'

function ProfilePage() {
  const { userId } = useParams();
  const loggedInUserId = getUserData()._id;
  const isOwnProfile = userId === loggedInUserId;

  console.log("ALL PARAMS:", useParams());
  console.log("userId:", userId);

  return (
    <div>
      <Navbar />

      <div className='flex flex-col md:flex-row justify-center gap-10 mx-5 md:mx-20 py-8'>

        <div className='flex flex-col gap-5 md:basis-1/3'>
          <UserWidget userId={userId} isOwnProfile={isOwnProfile} />
          <FriendListWidget userId={userId} />
        </div>

        <div className='flex flex-col gap-5 md:basis-2/3'>
          {isOwnProfile && <MyPostWidget />} 
          <PostsWidget isProfile userId={userId} />
        </div>

      </div>
    </div>
  )
}

export default ProfilePage