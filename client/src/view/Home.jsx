import React from 'react'
import Navbar from '../components/Navbar'
import UserWidget from './Widget/UserWidget.jsx'
import MyPostWidget from './Widget/MyPostWidget.jsx'
import PostsWidget from './Widget/PostsWidget.jsx'
import AdvertWidget from './Widget/AdvertWidget.jsx'
import FriendListWidget from './Widget/FriendListWidget.jsx'
import { getUserData } from '../utils.jsx'


function Home() {
  return (
    <div>
      <Navbar />
      <div className='flex mx-14 gap-5'>
      <div>
        <UserWidget />
      </div>
      <div>
        <MyPostWidget />
        <PostsWidget />
      </div>
      <div>
        <AdvertWidget />
        <FriendListWidget/>
      </div>
      </div>
    </div>
  )
}

export default Home
