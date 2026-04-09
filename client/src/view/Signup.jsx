import React from 'react'
import Input from '../components/Input'
import Button from '../components/Button.jsx'
import SubNavbar from '../components/SubNavbar.jsx'
import { Link } from 'react-router'
import { useState, useRef } from 'react'
import axios from 'axios'
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";

function Signup() {
  const [newUser, setNewUser] = useState({
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

      setNewUser({
        ...newUser,
        photos: [...newUser.photos, uploadResponse.url],
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

  const createUser = async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, newUser);

    if (response.data.success) {
      alert("User created successfully!");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      alert("Failed to create user. Please try again.");
    }
  }

  return (
    <div>
      <SubNavbar />
      <div className='border border-gray-300 shadow rounded w-full mx-1 md:w-110 p-6 md:mx-auto mt-10 '>
        <h1 className='text-xl font-bold mb-6 text-center'>Create your Account</h1>

        <div>
          <Input
            type={"text"}
            placeholder={"First Name"}
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          />
          <Input type={"text"} placeholder={"Last Name"}
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          />

          <div className="flex justify-center">
            {newUser.photos?.map((photo, index) => (
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
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Input type={"password"} placeholder={"Password"}
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <Input type={"text"} placeholder={"Location"}
            value={newUser.location}
            onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
          />
          <Input type={"text"} placeholder={"Occupation"}
            value={newUser.occupation}
            onChange={(e) => setNewUser({ ...newUser, occupation: e.target.value })}
          />

          <Button title={"Register"} variant={"primary"} size={"medium"} onClick={createUser} />
          <Link to="/"
            className='text-blue-500 hover:text-blue-700 text-lg'
          >Already have an account? Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
