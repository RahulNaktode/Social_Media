import React from 'react'
import Navbar from '../components/Navbar'
import UserWidget from './Widget/UserWidget.jsx'
import MyPostWidget from './Widget/MyPostWidget.jsx'

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
      </div>
      </div>
    </div>
  )
}

export default Home
