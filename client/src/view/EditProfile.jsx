import { useEffect } from 'react'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import SubNavbar from '../components/SubNavbar.jsx'
import { Link } from 'react-router'
import { useState, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import { getUserJwtToken } from '../utils.jsx';
import { useParams } from 'react-router';

function EditProfile() {
    const [existingUser, setExistingUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        photos: [],
        password: '',
        location: '',
        occupation: ''
    });

    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef();

    const { userId } = useParams();
    console.log("User ID from URL:", userId);

    const authenticator = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth`);
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

            setExistingUser((prev) => {
             const updatedData = {
          ...prev,
          photos: [uploadResponse.url]
        };
        localStorage.setItem("userData", JSON.stringify(updatedData));

        return updatedData;
     })


            setProgress(0)
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

    const editUser = async () => {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/user/${userId}`, existingUser, {
            headers: {
                Authorization: `Bearer ${getUserJwtToken()}`,
            }
        });

        if (response.data.success) {
            toast.success(response.data.message, { id: "addTourSuccess" });
            setExistingUser({
                firstName: '',
                lastName: '',
                email: '',
                photos: [],
                password: '',
                location: '',
                occupation: ''
            });

            setTimeout(() => {
                window.location.href = `/profile/${userId}`;
            }, 1000);
        } else {
            toast.error(response.data.message, { id: "addTourError" });
        }
    }

    const loadUserDetails = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${getUserJwtToken()}`,
            }
        });

        if (response.data.success) {
            toast.success(response.data.message, { id: "loadTourDetailsSuccess" });
            setExistingUser({
                ...response.data.data
            });
        } else {
            toast.error(response.data.message, { id: "loadTourDetailsError" });
        }
    }

    useEffect(() => {
        loadUserDetails();
    }, [userId])

    return (
        <div>
            <SubNavbar />
            <div className='border border-gray-300 shadow rounded w-110 p-6 mx-auto mt-10'>
                <h1 className='text-xl font-bold mb-6 text-center'>Update Profile</h1>

                <div>
                    <Input
                        type={"text"}
                        placeholder={"First Name"}
                        value={existingUser.firstName}
                        onChange={(e) => setExistingUser({ ...existingUser, firstName: e.target.value })}
                    />
                    <Input type={"text"} placeholder={"Last Name"}
                        value={existingUser.lastName}
                        onChange={(e) => setExistingUser({ ...existingUser, lastName: e.target.value })}
                    />

                    <div className="flex justify-center">
                        {existingUser.photos?.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Profile Photo`}
                                className="w-16 h-16 object-cover rounded-full"
                            />
                        ))}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className='px-2 py-1 my-2 text-lg border border-gray-400 w-full hover:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

                    />

                    <Input type={"text"} placeholder={"Email"}
                        value={existingUser.email}
                        onChange={(e) => setExistingUser({ ...existingUser, email: e.target.value })}
                    />

                    <Input type={"text"} placeholder={"Location"}
                        value={existingUser.location}
                        onChange={(e) => setExistingUser({ ...existingUser, location: e.target.value })}
                    />
                    <Input type={"text"} placeholder={"Occupation"}
                        value={existingUser.occupation}
                        onChange={(e) => setExistingUser({ ...existingUser, occupation: e.target.value })}
                    />

                    <Button title={"Update Profile"} variant={"primary"} size={"medium"} onClick={editUser} />

                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default EditProfile
