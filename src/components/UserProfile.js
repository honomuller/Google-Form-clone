import React, { useEffect, useState } from 'react'
import HomeNavbar from './layout/HomeNavbar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { BsPersonSquare } from 'react-icons/bs'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import Sidebar from './layout/Sidebar'

function UserProfile() {
    const questions = useSelector(state=> state.QuestionReducer)
    const user = useSelector(state=>state.UserReducer)
    const sidebar = useSelector(state=>state.sidebarReducer)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    var token

    if(user.isLoggedIn === true){
        token = jwtDecode(JSON.stringify(user.user))
    }

    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')

    const handleChangePassword=(e)=>{
        e.preventDefault()
        if(password===confirmPassword){
            const data={
                password:password,
                id:token.user_id
            }
            axios.post(`http://localhost:5000/user/passwordChange`,data).then(res=>{
                toast(`${res.data.message}`)
                setTimeout(() =>
                    window.location.reload()
                ,4000)
            }).catch(err=>{
                console.log(err)
            })
        }else{
            toast('Password are not matching try again!!')
             setTimeout(() =>
                window.location.reload()
             ,3000)
        }
        
    }
     
    useEffect(()=>{
        if(user.isLoggedIn===false){
            navigate('/')
        }
    },[])
  return (
    <>
    <Sidebar/>
    <HomeNavbar/>
    <div class="bg-gray-100/10 max-w-screen-lg mx-auto">
    <div class="container mx-auto py-8">
        <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div class="col-span-4 sm:col-span-3">
                <div class="bg-white shadow rounded-lg p-6">
                    <div class="flex flex-col items-center">
                        <BsPersonSquare class="w-32 h-32 bg-gray-300 rounded-md mb-4 shrink-0"/>
                        <h1 class="text-xl font-bold">{token.firstname+ " " + token.lastname}</h1>
                        <p class="text-gray-700">{token.institution}</p>
                    </div>
                </div>
            </div>
            <div class="col-span-4 sm:col-span-9">
                <div class="bg-white shadow rounded-lg p-6">
                    {/* <h2 class="text-xl font-bold mb-4">About Me</h2> */}
                    
                    <div class="w-full p-6 bg-white dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
          </h2>
          <form  onSubmit={handleChangePassword} class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
             
              <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                  <input type="password" onChange={(e)=>{setPassword(e.target.value)}} name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
              </div>
              <div>
                  <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input type="password" onChange={(e)=>{setConfirmPassword(e.target.value)}} name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
              </div>
             
              <button type="submit" class="w-full text-black bg-white-600 hover:bg-blue-700 hover:text-white border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">Reset passwod</button>
          </form>
      </div>
                </div>
            </div>
        </div>
    </div>
</div>
<ToastContainer/>
    </>
    
  )
}

export default UserProfile