import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { getUserJwtToken, getUserData } from '../../utils.jsx';
import axios from 'axios';
import Input from '../../components/Input.jsx';
import { ImagePlus, Clapperboard, Paperclip, Mic } from 'lucide-react';
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import Button from '../../components/Button.jsx';

function GetWidget() {
    const [posts, setPosts] = useState("");
    const [userData, setUserData] = useState(null);
    const [isPhotoUpload, setIsPhotoUpload] = useState(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef();


    const userId = getUserData()._id;

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${getUserJwtToken()}`
                }
            });
            if (response.data.success) {
                setUserData(response.data.data);
            } else {
                console.error("Failed to fetch user data:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const authenticator = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        const file = fileInput.files[0];

        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        try {
            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
            });

            setIsPhotoUpload({
                url: uploadResponse.url,
                fileId: uploadResponse.fileId,
            })


            setProgress(0);
            fileInput.value = "";
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                console.error("Upload error:", error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (!userData) {
        return null;
    }

    const { photos } = userData;

    const postHandle = async () => {

        const response = await axios.post("http://localhost:8080/posts",
            {
                userId,
                description: posts,
                picturePath: isPhotoUpload ? isPhotoUpload.url : [],
            },
            {
                headers: {
                    Authorization: `Bearer ${getUserJwtToken()}`
                }
            });

        const post = await response.data;
        setPosts("");
        setIsPhotoUpload(null);
    }

    return (
        <div className='border border-gray-300 shadow p-3 w-150 mt-5 rounded mx-2'>
            <div className='flex items-center gap-5'>
                <img src={photos[0]} alt="Profile" className='w-12 h-12 rounded-full object-cover ' />
                <div className='ml-2'>
                    <Input
                        placeholder="What's on your mind?"
                        className='w-full ml-3'
                        value={posts}
                        onChange={(e) => setPosts(e.target.value)}
                    />
                </div>

            </div>
            <div className=''>
                <input
                    type="file"
                    ref={fileInputRef}
                    className='border border-gray-300 px-2 py-1 rounded w-full mt-3 text-gray-400'
                    onChange={(e) => {
                        if(e.target.files.length > 0){
                            handleUpload();
                        }
                    }}
                />
            </div>

            <div className='flex items-center gap-14 mt-3 text-gray-400'>
                <div className='flex items-center gap-2 cursor-pointer'><ImagePlus />Image</div>
                <div className='flex items-center gap-2 cursor-pointer'><Clapperboard />Clip</div>
                <div className='flex items-center gap-2 cursor-pointer'><Paperclip />Attachment</div>
                <div className='flex items-center gap-2 cursor-pointer'><Mic />Audio</div>
                <Button title='Post' size='small' variant='primary' onClick={postHandle} />
            </div>
        </div>
    )
}

export default GetWidget
