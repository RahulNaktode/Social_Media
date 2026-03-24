import React from 'react'

function Input({ type, placeholder, value, onChange, onClick }) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={onClick}
        className='px-2 py-1 my-2 text-md border border-gray-400 w-full hover:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
    </div>
  )
}

export default Input
