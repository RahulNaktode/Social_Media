import Navbar from '../components/Navbar'
import UserWidget from './Widget/UserWidget.jsx'
import FriendListWidget from './Widget/FriendListWidget'
import { getUserData } from '../utils.jsx'
import MyPostWidget from './Widget/MyPostWidget.jsx'
import PostsWidget from './Widget/PostsWidget'


function ProfilePage() {
    
  return (
    <div>
      <Navbar />
      <div className='flex md:flex flex-col justify-center gap-5'>
        <div className='flex flex-col mx-5 gap-5'>
        <UserWidget />
        <FriendListWidget />
        </div>
        <div className='flex flex-col mx-5 gap-5'>
            <MyPostWidget />
            <PostsWidget isProfile />
        </div>
        </div>
    </div>
  )
}

export default ProfilePage
