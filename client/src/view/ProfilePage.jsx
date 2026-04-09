import Navbar from '../components/Navbar'
import UserWidget from './Widget/UserWidget.jsx'
import FriendListWidget from './Widget/FriendListWidget'
import MyPostWidget from './Widget/MyPostWidget.jsx'
import PostsWidget from './Widget/PostsWidget'

function ProfilePage() {
  return (
    <div  >
      <Navbar />

      <div className='flex flex-col md:flex-row justify-center gap-10 mx-5 md:mx-20 py-8'>

        <div className='flex flex-col gap-5 md:basis-1/3'>
          <UserWidget />
          <FriendListWidget />
        </div>

        <div className='flex flex-col gap-5 md:basis-2/3'>
          <MyPostWidget />
          <PostsWidget isProfile />
        </div>

      </div>
    </div>
  )
}

export default ProfilePage