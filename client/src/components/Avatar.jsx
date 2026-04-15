function Avatar({name, size = "large"}) {

    const SIZE_CLASS = {
        small: "h-7 w-7 text-xs",
        medium: "md:h-8 h-7 md:w-8 w-7 text-sm",
        large: "md:h-11 h-10 md:w-11 w-10 text-lg",
    }

    const AVATAR_COLORS = [
        "bg-red-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-gray-500",
    ];

    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * AVATAR_COLORS.length);
        return AVATAR_COLORS[randomIndex];
    };


  return (
    <>
      <div className={`${getRandomColor()} text-white ${SIZE_CLASS[size]} flex items-center justify-center rounded-full mr-2`}>
        {name[0]}
      </div>
    </>
  )
}

export default Avatar
