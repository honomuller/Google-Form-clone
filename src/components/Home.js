import React, { useEffect, useState } from 'react'
import { FaEye, FaListAlt } from 'react-icons/fa'
import { LuEye } from "react-icons/lu";
import { BsFile, BsImage, BsPlus, BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { RiArrowGoForwardLine } from "react-icons/ri";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoColorPaletteOutline } from "react-icons/io5";
//import Tab from './Tab';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4} from 'uuid'
import axios from 'axios';
import { ExistingForm } from '../action/action';
import HomeNavbar from './layout/HomeNavbar';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './layout/Sidebar';
import CreateForm from './CreateForm';
import TabQuestion from './layout/Tab';

function Home() {
    const questions = useSelector(state=> state.QuestionReducer)
    const user = useSelector(state=>state.UserReducer)
    const ui = uuidv4()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    var token

    if(user.isLoggedIn === true){
        token = jwtDecode(JSON.stringify(user.user))
    }

    const questio={
        FormName:"Untitled Form",
        FormDescription:"Form Description",
        section:[{
            questionName:"Untitled Question Name",
            questionType:"radio",
            questionOption:[{optionText:"option 1"}],
            Required:false,
            open:true
          }]
        }


    const handleQuestion=(e)=>{
    e.preventDefault()
    console.log(questions)
     }
    const [formData,setFormData]=useState([])

    useEffect(()=>{
        if(user.isLoggedIn===false){
            navigate('/')
        }else{
            axios.get(`http://localhost:5000/getUserForms/${token.user_id}`).then(res=>{
                //console.log(res.data)
                 setFormData(res.data)
             }).catch(err=>{
                 console.log(err)
             })
        }
         
    },[])

  const handleFormCreation =(e)=>{
    const data ={
        question:questio,
        user:token.user_id
    }
    axios.post(`http://localhost:5000/getForm/${ui}`,data).then(res=>{
        console.log(res.data)
        navigate(`/new/${ui}`)
      }).catch(err=>{
         console.log(err)
     })
  }

  
  return (
    <div className='flex-col'>
           <Sidebar/>
    <HomeNavbar/>
    {/* <TabQuestion/> */}
     <CreateForm/>
    </div>
  )
}

export default Home