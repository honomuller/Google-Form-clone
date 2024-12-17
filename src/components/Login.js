import axios from 'axios'
import React, { useState } from 'react'
import { BsImage, BsLock } from 'react-icons/bs'
import { MdClose, MdEmail, MdLock, MdSentimentSatisfied } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { UserLogin } from '../action/UserAction'
import {jwtDecode} from "jwt-decode"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Otp from './layout/Otp'
import { CiShare1 } from 'react-icons/ci'
import { TbLockCode } from "react-icons/tb";

function Login() {
    const User = useSelector(state=> state.UserReducer)
    const dispatch = useDispatch()
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [message,setMessage]=useState('')
    const navigate = useNavigate()
    const [visibleOtpModal,setVisibleOtpModal]=useState(false)
    const [otp,setOTP]=useState('')

    const handleSubmit=(e)=>{
        e.preventDefault()
        const data={
            email:email,
            password:password
        }
        axios.post("http://localhost:5000/user/login",data).then(res=>{
            if(res.data.token === ''){
                setTimeout(()=>{
                    toast(`${res.data.message}`)
                    navigate('/')
                },3000)
            }else{
                const token = jwtDecode(JSON.stringify(res.data.token))
                dispatch(UserLogin(res.data.token))
                    toast(`${res.data.message}`)
                    setTimeout(()=>{
                        navigate('/home')
                    },3000)
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleOtpSubmit=()=>{

    }

    const handleCloseModal=()=>{
        setVisibleOtpModal('')
        setTimeout(()=>{window.location.reload()},1000)
    }
  return (
    <>
    <div className='flex justify-center items-center h-screen bg-slate-500/10'>
        <form onSubmit={handleSubmit}>
        <div className='border rounded-md shadow-md flex-col w-96 bg-white'>
            <div className='w-full flex items-center justify-center p-5'>
                
                <img src='logo192.png' className='h-40 w-40'/>
            </div>

            <div className='w-full p-5'>
            <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
<div class="relative mb-6">
  <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
  <MdEmail/>
  </div>
  <input type="email" onChange={(e)=>{setEmail(e.target.value)}} id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required/>
</div>
<label for="website-admin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
<div class="relative mb-6">
  <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
  <MdLock/>
  </div>
  <input type="password" onChange={(e)=>{setPassword(e.target.value)}}  id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="password" required/>
</div>
            </div>
            <div className='w-full flex items-center justify-center p-5'>
            <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign In</button>
            </div>
        </div>
        </form>
        {/* <div class={`${visibleOtpModal ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
<div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
    <form class=" w-full">
      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div class="sm:flex-col sm:items-start">
          <div class="px-4 w-full py-3 sm:flex justify-between sm:px-6">
            <TbLockCode size={20}/>
            <MdClose onClick={handleCloseModal} size={20}/>  
          </div>
          <div class="mt-10 text-center sm:ml-4 sm:mt-0 sm:text-left w-full flex items-center justify-center">
            <Otp value={otp} />
          </div>
        </div>
      </div>
      
      </form>
    </div>
  </div>
</div>
</div> */}
    </div>
    <ToastContainer/>
    </>
  )
}

export default Login