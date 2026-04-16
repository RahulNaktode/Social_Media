import { useState, useEffect, useRef } from 'react';
import { getUserJwtToken, getUserData } from '../../utils.jsx';
import axios from 'axios';
import Input from '../../components/Input.jsx';
import { ImagePlus, Clapperboard, Paperclip, Mic, X } from 'lucide-react';
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import Button from '../../components/Button.jsx';
import Avatar from '../../components/Avatar.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router';

function MyPostWidget() {
    const [posts, setPosts] = useState("");
    const [userData, setUserData] = useState(null);
    const [isPhotoUpload, setIsPhotoUpload] = useState(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const userId = getUserData()._id;

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${getUserJwtToken()}`
                }
            });
            if (response.data.success) {
                setUserData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const authenticator = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth`);
            const data = await response.json();
            return {
                signature: data.signature,
                expire: data.expire,
                token: data.token,
                publicKey: data.publicKey
            };
        } catch (error) {
            console.error("Auth error:", error);
        }
    };

    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput?.files?.[0]) return;

        const file = fileInput.files[0];
        const authParams = await authenticator();

        try {
            const uploadResponse = await upload({
                ...authParams,
                file,
                fileName: file.name,
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
            });

            setIsPhotoUpload({
                url: uploadResponse.url,
                fileId: uploadResponse.fileId,
            });
            setProgress(0);
        } catch (error) {
            console.error("Upload error:", error);
            setProgress(0);
        }
    };

    const removeImage = () => {
        setIsPhotoUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const postHandle = async () => {
        if (!posts && !isPhotoUpload) return toast.error("Please enter some text or upload a photo to post.");

        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/posts`,
            {
                userId,
                description: posts,
                picturePath: isPhotoUpload ? isPhotoUpload.url : "",
            },
            {
                headers: { Authorization: `Bearer ${getUserJwtToken()}` }
            });

            if(response.data){
                toast.success("Post created successfully!");
            }

        setPosts("");
        setIsPhotoUpload(null);
        navigate(0);
        
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    if (!userData) return null;

    return (
        <div className='border border-gray-300 shadow p-5 w-full max-w-140 mt-5 rounded-xl mx-2'>

            <div className='flex items-center gap-4'>
                {userData.photos && userData.photos.length > 0 ? (
                    <img
                        src={userData.photos[0]}
                        alt="Profile"
                        className='w-12 h-12 rounded-full object-cover shadow-sm'
                    />
                ) : (
                    <Avatar name={userData.firstName} size="large" />
                )}
                <div className='flex-1'>
                    <Input
                        placeholder="What's on your mind?"
                        className='w-full'
                        value={posts}
                        onChange={(e) => setPosts(e.target.value)}
                    />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className='hidden'
                accept="image/*"
                onChange={(e) => e.target.files.length > 0 && handleUpload()}
            />

            {/* Progress Bar */}
            {progress > 0 && (
                <div className="w-full bg-gray-100 h-1 mt-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            {isPhotoUpload && (
                <div className='relative mt-4 group'>
                    <img
                        src={isPhotoUpload.url}
                        alt="Preview"
                        className='w-full h-60 object-cover rounded-lg border border-gray-200'
                    />
                    <button
                        onClick={removeImage}
                        className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition duration-200'
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <hr className='my-4 border-gray-100' />

            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-10 text-gray-500'>
                    <div
                        className='flex items-center gap-2 cursor-pointer hover:text-blue-500 transition'
                        onClick={handleIconClick}
                    >
                        <ImagePlus size={20} />
                        <span className='text-sm font-medium'>Image</span>
                    </div>

                    <div className='flex items-center gap-2 cursor-pointer hover:text-blue-500 transition'>
                        <Clapperboard size={20} />
                        <span className='text-sm font-medium'>Clip</span>
                    </div>

                    <div className='hidden sm:flex items-center gap-2 cursor-pointer hover:text-blue-500 transition'>
                        <Paperclip size={20} />
                        <span className='text-sm font-medium'>Attach</span>
                    </div>

                    <div className='hidden sm:flex items-center gap-2 cursor-pointer hover:text-blue-500 transition'>
                        <Mic size={20} />
                        <span className='text-sm font-medium'>Audio</span>
                    </div>
                </div>

                <Button
                    title='Post'
                    size='small'
                    variant='primary'
                    onClick={postHandle}
                    disabled={!posts && !isPhotoUpload}
                />
            </div>
            <Toaster />
        </div>
    );
}

export default MyPostWidget;