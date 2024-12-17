import React, { useEffect, useState } from 'react'
import { BsCopy, BsEye, BsPlus, BsThreeDotsVertical, BsTrash } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { LuPlusCircle } from "react-icons/lu";
import { MdEdit, MdOutlineTitle } from "react-icons/md";
import { FaEye, FaImage } from "react-icons/fa";
import { IoRadioButtonOn } from 'react-icons/io5';
import { MdClose } from "react-icons/md";
import { AddOption, AddQuestion, ChangeTypeQuestion, CloseQuestion, CopyQuestion, DeleteOption, DeleteQuestion, ExistingForm, OpenQuestion, RequiredQuestion, UpdateFormDescription, UpdateFormName, UpdateOptionName, UpdateQuestion, UpdateQuestionCondition, UpdateQuestionName } from '../action/action';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Question from './Question';
import TabQuestion from './layout/Tab';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import QuestionData from './Question';
import Response from './Response';
import DataTableFunction from './editor/datatable';
import BasicTable from './editor/datatable';

function FormResponse() {
    const question = useSelector(state => state.QuestionReducer)
    const [questionData,setQuestionData]=useState({})
    const [showQuestion,setShowQuestion]=useState(0)
    const user = useSelector(state=>state.UserReducer)
    const id = useParams()
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
  
    const questions={
      questionName:"Untitled Question Name",
      questionType:"radio",
      questionOption:[{optionText:"option 1"}],
      Required:false,
      open:true
    }
  
  
    useEffect(()=>{
          if(!user.isLoggedIn){
              navigate('/')
          }
      },[])
  
   
  return (
    <>
    <Navbar/>
    <Sidebar/>
    {/* <BasicTable/> */}
    <Response/>
    </>
  )
}

export default FormResponse