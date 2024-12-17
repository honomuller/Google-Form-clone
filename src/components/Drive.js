import React, { useEffect } from 'react'
import HomeNavbar from './layout/HomeNavbar'
import MyDrive from './MyDrive'
import Sidebar from './layout/Sidebar'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { v4 as uuidv4} from 'uuid'

function Drive() {
    const questions = useSelector(state=> state.QuestionReducer)
    const user = useSelector(state=>state.UserReducer)
    const ui = uuidv4()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    var token

    if(user.isLoggedIn === true){
        token = jwtDecode(JSON.stringify(user.user))
    }
    useEffect(()=>{
        if(user.isLoggedIn===false){
            navigate('/')
        }
         
    },[])

  return (

    <div className='flex-col'>
        <Sidebar/>
        <HomeNavbar/>
        <MyDrive/>
    </div>
  )
}

export default Drive