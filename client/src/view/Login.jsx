import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Input from '../components/Input';
import Button from '../components/Button.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loggedinUser, setLoggedinUser] = useState({
        email: "",
        password: ""
    });

    const checkUserLogin = async () => {
        if (!loggedinUser.email || !loggedinUser.password) {
            return toast.error("Please fill in all fields");
        }

        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, loggedinUser);

            if (response.data.success) {
                toast.success(response.data.message);
                
                const { jwtToken, data } = response.data;
                localStorage.setItem("userJwtToken", jwtToken);
                localStorage.setItem("userData", JSON.stringify(data));

                setTimeout(() => {
                    navigate("/home");
                }, 1500);
            } else {
                toast.error(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <SubNavbar />
            <div className='border border-gray-300 shadow rounded w-full mx-1 md:w-110 p-6 md:mx-auto mt-10'>
                <h1 className='text-xl font-bold mb-6 text-center'>Login your Account</h1>
                
                <Input 
                    type="email"
                    placeholder="Email" 
                    value={loggedinUser.email}
                    onChange={(e) => setLoggedinUser({...loggedinUser, email: e.target.value})}
                />
                
                <Input 
                    type="password"
                    placeholder="Password" 
                    value={loggedinUser.password}
                    onChange={(e) => setLoggedinUser({...loggedinUser, password: e.target.value})}
                />

                <Button 
                    title={loading ? "Logging in..." : "Login"} 
                    variant="primary" 
                    size="medium" 
                    onClick={checkUserLogin} 
                    disabled={loading}
                />
                
                <p className='mt-4'>
                    <Link to="/register" className='text-blue-500 hover:text-blue-700 text-sm'>
                        Don't have an account? Register here
                    </Link>
                </p>
            </div>
            <Toaster />
        </div>
    );
}

export default Login;