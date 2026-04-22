import Navbar from './../../components/Navbar.jsx'
import UserWidget from './UserWidget.jsx'
import FriendListWidget from './FriendListWidget'
import MyPostWidget from './MyPostWidget.jsx'
import PostsWidget from './PostsWidget'

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