import React from 'react'
import AdvertImg from "../../assets/advert.png"

function AdvertWidget({ className }) {
  return (
    <div className={`border border-gray-300 shadow px-5 py-6 w-80 mt-5 rounded ${className}`}>
      <h1 className='text-xl font-bold'>Sponsored</h1>
      <div className='flex justify-between items-center'>
         <p>Create Ad</p>
      </div>

      <div className='mt-3'>
        <img src={AdvertImg} alt="advert" width={"100%"} height={"auto"} className="rounded-lg transition-transform duration-100 hover:scale-105" />
      </div>

      <div className='my-2 flex justify-between'>
        <p className='font-medium'>MikeCosmetice</p>
        <p className='text-sm text-gray-500'>mikecosmetice.com</p>
      </div>

      <div className='mt-2 text-gray-500 text-sm'>
        <p>Ad description goes here. This is a placeholder for the actual ad content.</p>
      </div>
    </div>
  )
}

export default AdvertWidget