import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SidebarAction } from '../../action/SidebarAction'
import { BsFile } from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'
import { SiGoogledocs, SiGoogledrive } from "react-icons/si";
import { jwtDecode } from 'jwt-decode';
import { UserLogout } from '../../action/UserAction';
import { MdDashboard } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';

function Sidebar() {
  const questions = useSelector(state=> state.QuestionReducer)
  const user = useSelector(state=>state.UserReducer)
  const sidebar = useSelector(state=>state.sidebarReducer)
  const dispatch = useDispatch()
  const id = useParams()
  const navigate = useNavigate()

    //console.log(sidebar)
    const handleLogout=(e)=>{
      e.preventDefault()
      dispatch(UserLogout())
      //setVisibleDropdown(false)
      navigate("/")
    }

    var token = { token: ''}
  
    if(user.isLoggedIn){
        token[token] = jwtDecode(JSON.stringify(user.user))
      }
    
    useEffect(()=>{
        if(user.isLoggedIn === false){
            navigate('/')
        }
    },[])

  return (
    <div className={`${sidebar.sidebarR && user.isLoggedIn ? 'fixed transition ease-in-out delay-150 -translate-y-1 ' : ' hidden '}h-screen w-64 overflow-auto bg-white shadow-md`} onMouseLeave={()=>{dispatch(SidebarAction(false))}}>
<aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
   <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
         <li className='mb-5'>
            <a href="/home" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <img src='logo192.png' className='h-12'/>
               <span class="ms-3">Forms Application</span>
            </a>
         </li>
         <li>
            <a href="/home" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <SiGoogledocs size={20}/>
               <span class="flex-1 ms-3 whitespace-nowrap">Forms</span>
            </a>
         </li>
         <li>
            <a href="/drive" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <SiGoogledrive size={20}/>
               <span class="flex-1 ms-3 whitespace-nowrap">Files</span>
            </a>
         </li>
         
         {
            token[token].role === "admin" 
            ?
            <li>
            <a href="/admin" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <FiSettings size={20}/>
               <span class="flex-1 ms-3 whitespace-nowrap">Settings</span>
            </a>
         </li> : ""
         }
        
         
         <hr className='mt-5'/>
         <li>
            <a href="#" onClick={handleLogout} class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <BiLogOut size={20}/>
               <span class="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
            </a>
         </li>
         
      </ul>
   </div>
</aside>
    </div>
  )
}

export default Sidebar