import React from 'react'

function Button({ title, size, variant, onClick }) {
    const SIZE_CLASSES = {
        small: 'px-3 py-1 text-sm',
        medium: 'px-5 py-1 text-lg',
        large: 'px-7 py-3 text-md',
    }

    const VARIANT_CLASSES = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    }

    return (
        <div>
            <button
                className={`${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} cursor-pointer rounded-md my-3`}
                onClick={onClick}>
                {title}
            </button>

        </div>
    )
}

export default Button
