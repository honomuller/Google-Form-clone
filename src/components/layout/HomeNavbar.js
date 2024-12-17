import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { LuEye } from "react-icons/lu";
import { BsChevronDown, BsChevronUp, BsMenuApp, BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { RiArrowGoForwardLine } from "react-icons/ri";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoColorPaletteOutline } from "react-icons/io5";
import Tab from './Tab';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BiLogOut, BiSolidDashboard } from 'react-icons/bi'
import { SlSettings } from 'react-icons/sl'
import { FiSettings } from 'react-icons/fi'
import { UserLogout } from '../../action/UserAction';
import Sidebar from './Sidebar';
import { SidebarAction } from '../../action/SidebarAction';
import { MdMenu } from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';

function HomeNavbar() {
    const questions = useSelector(state=> state.QuestionReducer)
    const user = useSelector(state=>state.UserReducer)
    const sidebar = useSelector(state=>state.sidebarReducer)
    const dispatch = useDispatch()
    const id = useParams()
    const navigate = useNavigate()

    const [visibleDropdown,setVisibleDropdown]=useState(false)
    //window.location.href
    //console.log(id)
    var token
  
    if(user.isLoggedIn){
        token = jwtDecode(JSON.stringify(user.user))
      }
    
    useEffect(()=>{
        if(user.isLoggedIn===false){
            navigate('/')
        }
    },[])
  
    const handleQuestion=(e)=>{
      e.preventDefault()
      console.log(questions)
    }

    const handleLogout=(e)=>{
        e.preventDefault()
        dispatch(UserLogout())
        setVisibleDropdown(false)
        navigate("/")
    }
  
  return (
    <>
    <div className='flex flex-col p-2 bg-slate-100 text-black h-16 w-full'>
      {
        user.isLoggedIn ? 
        <div className='flex justify-between items-center'>
          <div className='flex justify-between items-center gap-4 w-40'>
            <MdMenu onMouseOver={()=>{dispatch(SidebarAction(true))}} size={25}/>
            <a href="/home"><img src='/logo192.png' className='h-12'/></a>
          </div>
          
       {/* <div className='flex justify-between items-center gap-6 text-xl mr-6'>
        <CgProfile/>
       </div> */}
      <div className="relative font-[sans-serif] w-max" onMouseOver={()=>{setVisibleDropdown(true)}} onMouseOut={()=>{setVisibleDropdown(false)}}>
      <button  type="button" id="dropdownToggle" className="px-4 py-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100 gap-3 ml-20">
        {/* <img src="https://readymadeui.com/profile_6.webp" className="w-7 h-7 mr-3 rounded-full shrink-0"></img> */}
        <CgProfile/>
        {
          visibleDropdown ? <BsChevronUp size={20} />:<BsChevronDown size={20} />
        }
      </button>

      <ul id="dropdownMenu" className={`${visibleDropdown ? 'absolute block' : 'hidden' } shadow-lg bg-white py-2 min-w-full w-50 rounded-lg max-h-96 overflow-auto`}>
      
      <a href="/home"><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <AiOutlineHome size={20}/>
          Home
        </li></a>
      <a href="/userprofile"><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <BsPersonFill size={20}/>
          Profile
        </li></a>
        {
          token.role === "admin" ?
          <a href="/admin"><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <FiSettings size={20}/>
          Settings
        </li></a>
         :""
        }
        
        <li onClick={handleLogout} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <BiLogOut size={20}/>
          Logout
        </li>
      </ul>
    </div>
       
    </div>
       
     :<></>
      } 
    </div>
    </>
  )
}

export default HomeNavbar