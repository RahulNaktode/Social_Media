import React from 'react'
import Navbar from '../components/Navbar'
import UserWidget from './Widget/UserWidget.jsx'
import MyPostWidget from './Widget/MyPostWidget.jsx'
import PostsWidget from './Widget/PostsWidget.jsx'
import AdvertWidget from './Widget/AdvertWidget.jsx'
import FriendListWidget from './Widget/FriendListWidget.jsx'
import { getUserData } from '../utils.jsx'

function Home() {
  const userId = getUserData()?._id; // ✅ logged in user ka id lo

  return (
    <div>
      <Navbar />
      <div className='md:flex md:mx-40 gap-10'>
        <div>
          <UserWidget userId={userId} isOwnProfile={true} /> {/* ✅ userId pass karo */}
        </div>
        <div>
          <MyPostWidget />
          <PostsWidget />
        </div>
        <div>
          <AdvertWidget className="hidden md:block" />
          <FriendListWidget userId={userId} /> {/* ✅ userId pass karo */}
        </div>
      </div>
    </div>
  )
}

export default Home