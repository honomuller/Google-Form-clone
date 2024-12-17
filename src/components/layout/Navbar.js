import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { LuEye } from "react-icons/lu";
import { BsChevronDown, BsChevronUp, BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { RiArrowGoForwardLine, RiQuestionnaireLine } from "react-icons/ri";
import { RiArrowGoBackLine } from "react-icons/ri";
import { FcAnswers } from "react-icons/fc";
import { CiHome, CiLink } from "react-icons/ci";
import { IoColorPaletteOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import Tab from './Tab';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BiLogOut, BiSolidDashboard } from 'react-icons/bi'
import { SlSettings } from 'react-icons/sl'
import { FiSettings } from 'react-icons/fi'
import { UserLogout } from '../../action/UserAction';
import { MdCreditScore, MdMenu, MdOutlineEmail } from 'react-icons/md';
import { SidebarAction } from '../../action/SidebarAction';
import axios from 'axios';

function Navbar() {
  const questions = useSelector(state=> state.QuestionReducer)
  const user = useSelector(state=>state.UserReducer)
  const dispatch = useDispatch()
  const id = useParams()
  const navigate = useNavigate()
  var token 
  const [visibleDropdown,setVisibleDropdown]=useState(false)
  const [sharedAppType,setSharedAppType]=useState('')
  const [appId,setAppId]=useState('')
  //window.location.href
  //console.log(id)
  if(user.isLoggedIn){
    token = jwtDecode(JSON.stringify(user.user))
  }
  
  useEffect(()=>{
    if(user.isLoggedIn===false){
        navigate('/')
    }else{
     

      axios.get(`http://localhost:5000/share/getSharedApp/${id.id}/${token.user_id}`).then(res=>{
        setSharedAppType(res.data[0].type)
      }).catch(err=>{
        console.log(err)
      })

    }
},[])

  const handleCopy=(e)=>{
    e.preventDefault()
    navigator.clipboard.writeText(window.location.origin+""+`/response/${id.id}`)
  }

  const handleLogout=(e)=>{
      e.preventDefault()
      dispatch(UserLogout())
      setVisibleDropdown(false)
      navigate("/")
  }

  return (
    <div className='flex flex-col p-2 bg-slate-100 text-black'>
      {
        user.isLoggedIn ?
        
          <div className='flex justify-between'>
          <div className='flex justify-between items-center gap-4 w-40'>
          <img src='/logo192.png' className='h-12'/>
          </div>
         <div className='flex justify-between items-center gap-6 text-xl mr-6'>
          {/* <IoColorPaletteOutline/> */}

          <Link to={`/home`}><AiOutlineHome /></Link>
          { sharedAppType === 'full' ? 
          <>
          <Link to={`/new/${id.id}`}><RiQuestionnaireLine /></Link>
          <Link to={`/review/${id.id}`}><LuEye /></Link>
          <Link to={`/answers/${id.id}`}><FcAnswers /></Link>
          <Link to={`/emailCompose/${id.id}`}><MdOutlineEmail /></Link>
          <Link to={`/marksCompose/${id.id}`}><MdCreditScore /></Link>
          

          <button onClick={handleCopy} className='p-1 rounded-md bg-blue-500 text-white font-medium'><CiLink/></button>
          </>
          :
           sharedAppType === 'partial' ? 
          <>
          <Link to={`/answers/${id.id}`}><FcAnswers /></Link>
          </>
          :
          <>
          <Link to={`/new/${id.id}`}><RiQuestionnaireLine /></Link>
          <Link to={`/review/${id.id}`}><LuEye /></Link>
          <Link to={`/answers/${id.id}`}><FcAnswers /></Link>
          <Link to={`/emailCompose/${id.id}`}><MdOutlineEmail /></Link>
          <Link to={`/marksCompose/${id.id}`}><MdCreditScore /></Link>

          <button onClick={handleCopy} className='p-1 rounded-md bg-blue-500 text-white font-medium'><CiLink/></button>
          </>
          }
          
          <div className="relative font-[sans-serif] w-max mx-auto" onMouseOver={()=>{setVisibleDropdown(true)}} onMouseOut={()=>{setVisibleDropdown(false)}}>
        <button type="button" id="dropdownToggle" className="px-4 py-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100 gap-3 ml-20">
          {/* <img src="https://readymadeui.com/profile_6.webp" className="w-7 h-7 mr-3 rounded-full shrink-0"></img> */}
          <CgProfile/>
          {
            visibleDropdown ? <BsChevronUp size={20} />:<BsChevronDown size={20} />
          }
        </button>
  
        <ul id="dropdownMenu" className={`${visibleDropdown ? 'absolute block' : 'hidden' } shadow-lg bg-white py-2 min-w-full w-50 rounded-lg max-h-96 overflow-auto`}>
        <a href="/userprofile"><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
            <BsPersonFill size={20}/>
            Profile
          </li></a>
          {/* <a href="/settings"><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
            <FiSettings size={20}/>
            Settings
          </li></a> */}
          <li onClick={handleLogout} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
            <BiLogOut size={20}/>
            Logout
          </li>
        </ul>
      </div>
         </div>
      </div>
      :""}
      
    </div>

// <div className='flex justify-between p-2'>
// <h1 className='text-3xl font-bold'>Navbar</h1> 

// <div className='flex items-center justify-center w-full'>

//  <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
//   <div class="relative">
//       <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//           <BsSearch/>
//      </div>
//       <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
//      {/* <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
//  </div>
// </div>
// <CgProfile/>
// </div>
    
  )
}

export default Navbar