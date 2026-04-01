import React from 'react'
import AdvertImg from "../../assets/advert.png"

function AdvertWidget() {
  return (
    <div className='border border-gray-300 shadow px-5 py-6 w-80 mt-5 rounded'>
      <h1 className='text-xl font-bold'>Sponsored</h1>
      <p>Create Ad</p>

      <div>
        <img src={AdvertImg} alt="advert" width={"100%"} height={"auto"} />
      </div>

      <div className='my-2'>
        <p >MikeCosmetice</p>
        <p>mikecosmetice.com</p>
      </div>

      <div className='mt-2 text-gray-500'>
        <p>Ad description goes here. This is a placeholder for the actual ad content.</p>
      </div>
    </div>
  )
}

export default AdvertWidget
