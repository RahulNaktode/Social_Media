import React, { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button.jsx'
import { Link } from 'react-router'
import SubNavbar from '../components/SubNavbar.jsx'
import axios from 'axios'
import toast, {Toaster} from 'react-hot-toast'

function Login() {
    const [loggedinUser, setLoggedinUser] = useState({
        email: "",
        password: ""
    });

    const checkUserLogin = async () => {
        const response = await axios.post("http://localhost:8080/login", loggedinUser);

        if(response.data.success){
            toast.success(response.data.message, {id: "loginSuccess"});
            console.log("Login successful:", response.data);
            setLoggedinUser({
                email: "",
                password: ""
            });

            console.log("Login Response:", response.data);

            const { jwtToken, data } = response.data;

            localStorage.setItem("userJwtToken", jwtToken);
            localStorage.setItem("userData", JSON.stringify(data));

            setTimeout(() => {
                window.location.href = "/home";
            }, 1500);
            
        }else{
            toast.error(response.data.message, {id: "loginError"});
        }
    }
  return (
    <div>
        <SubNavbar />
        <div className='border border-gray-300 shadow rounded w-110 p-6 mx-auto mt-10'>
            <h1 className='text-xl font-bold mb-6 text-center'>Login your Account</h1>
            <Input 
            type={"text"} 
            placeholder={"Email"} 
            value={loggedinUser.email}
            onChange={(e) => setLoggedinUser({...loggedinUser, email: e.target.value})}
            />
            <Input 
            type={"password"}placeholder={"Password"} 
            value={loggedinUser.password}
            onChange={(e) => setLoggedinUser({...loggedinUser, password: e.target.value})}
            />

            <Button title={"Login"} variant={"primary"} size={"medium"} onClick={checkUserLogin} />
            <p>
                <Link to="/register" className='text-blue-500 hover:text-blue-700 text-lg'>
                    Don't have an account? Register here
                </Link>
            </p>
        </div>
        <Toaster />
    </div>
  )
}

export default Login
