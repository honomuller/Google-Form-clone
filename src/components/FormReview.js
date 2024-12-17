import React, { useEffect, useState } from 'react'
import { BsCopy, BsEye, BsPlus, BsThreeDotsVertical, BsTrash } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { LuPlusCircle } from "react-icons/lu";
import { MdEdit, MdOutlineTitle } from "react-icons/md";
import { FaEye, FaImage, FaStar } from "react-icons/fa";
import { IoRadioButtonOn } from 'react-icons/io5';
import { MdClose } from "react-icons/md";
import { FaQuestion } from "react-icons/fa";
import { AddOption, AddQuestion, ChangeTypeQuestion, CloseQuestion, CopyQuestion, DeleteOption, DeleteQuestion, ExistingForm, OpenQuestion, RequiredQuestion, UpdateFormDescription, UpdateFormName, UpdateOptionName, UpdateQuestion, UpdateQuestionCondition, UpdateQuestionName } from '../action/action';
import axios from 'axios'
import { Link, useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Question from './Question';
import TabQuestion from './layout/Tab';
import { ExistingFormAnswer, RadioAnswer, TextAnswer, TextAreaAnswer } from '../action/AnswerAction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiSolidEdit } from 'react-icons/bi';

function FormReview() {
    const question = useSelector(state => state.QuestionReducer)

  const id = useParams()
  const dispatch = useDispatch()


  const [answerData,setAnswerData]=useState({})
  const [checkedData,setCheckedData]=useState([])
  const [rateColor, setRateColor]=useState(null)

  const handleCheckbox=(e)=>{
    if(e.target.checked==true){
      checkedData.push(e.target.value)
    } 
    setCheckedData(checkedData)
   setAnswerData((prev)=>({...prev, [e.target.id]:checkedData}))
  }

  
  const handleSaveQuestion=(e)=>{
    e.preventDefault()
      const formData = new FormData();
    formData.append("answerData", JSON.stringify(answerData));
    formData.append("formName",question.FormName);
    formData.append("column",Object.keys(answerData).map(item=>item))
    formData.append("answer",Object.values(answerData).map(item=>item))
    Object.keys(answerData).filter((i,idex)=> Object.values(answerData)[idex] instanceof File ? formData.append('file',Object.values(answerData)[idex]): "")
    //console.log(answerData)
    axios.post(`http://localhost:5000/answer/createFormTable/${id.id}`,formData).then(res=>{
      toast(`${res.data.message}`)
     // console.log(res)
    }).catch(err=>{
      console.log(err)
    })
  }

  const handleRating=(id,value)=>{
    setRateColor(value)
    setAnswerData((prev)=>({...prev, [id]:value}))
  }

  useEffect(()=>{
    axios.get(`http://localhost:5000/getForm/${id.id}`).then(res=>{
      //console.log(res.data[0])
        dispatch(ExistingForm(res.data[0]))
      }).catch(err=>{
         console.log(err)
      })
  },[])


  return (
    <>
    {
      question.AcceptAnswer 
      ?
    <div className='relative bg-gray-500/10'>
    <div className='flex flex-col items-center justify-center'>
    <form onSubmit={handleSaveQuestion} enctype='multipart/form-data' className='flex-col items-center justify-center'>
   <div className='flex-col justify-center items-center'>
   <div className='w-full flex h-full justify-center items-center'>
     <div className='flex gap-4 items-center'>
   <div className='rounded-md mt-10 m-5 h-full w-[600px] min-w-max mx-auto p-5 border border-t-blue-500 bg-white'>
       <div className='flex justify-between items-center border-teal-500 '>
       <input disabled type="text" placeholder={question.FormName}  className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus-visible:border-b border-teal-500'/>  
       {/* <BsThreeDotsVertical/> */}
       </div>          
       <input disabled type="text" placeholder={question.FormDescription} className=' appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-b border-teal-500'/>  
     </div>

    
     </div>
     
   </div>
   {
    question.Image !=="image" ? 
    <div className='rounded-md mt-5 h-full w-[600px] min-w-max mx-auto p-5 border border-t-blue-500 bg-white'>
        <div className='flex-col justify-between items-center '>
      <div className='flex justify-between items-center m-5'>
        
    <img src={`/documentAnswer/form/${question.Image}`} className='w-full h-52'/>  
    </div>
    </div>
    </div>:""
   }
     
 
   
   <div className='w-full flex h-full justify-center items-center'>
   <div className='flex gap-4 items-center'>
   <div className='rounded-md mt-5 m-5 h-full w-[600px] min-w-max mx-auto p-5 border border-t-blue-500 bg-white'>
       <div className='flex justify-between items-center border-teal-500 '>
       <input type="email" placeholder={question.Email} id={question.Email} onChange={(e)=>{setAnswerData((prev)=>({...prev, [e.target.id]:e.target.value}))}}  className=' appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-b border-teal-500' required/>  
     </div>
     
     </div>
     
     </div>
     </div>
   </div>
   

    {
       question.section.map((item,index)=>(
        
 
         //questions.map((item,inde)=>(
          <div className='flex justify-center items-center' >
      <div className='w-full flex h-full justify-center items-center'>
        <div className='flex gap-4 items-center'>
 <div className='rounded-md mt-5 m-5 h-full w-[600px] min-w-max mx-auto p-5 border border-l-blue-500 bg-white' >
 <div className='flex justify-between items-center gap-4'> 
  <label className='text-xl font-medium flex items-center justify-between gap-4'>{item.questionName} </label>  
       </div> 
     {
        
          item.questionType =="text" ? 
          <div className='flex justify-between items-center m-5'>
            {item.questionOption.map((option,inde)=>(
                <input type={item.questionType} placeholder='Short Answer' required={`${item.required}`} id={item.questionName} onChange={(e)=>{setAnswerData((prev)=>({...prev, [e.target.id]:e.target.value}))}} className='bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
            ))}
                </div>
          :
          item.questionType =="textarea" ?
          <div className='flex justify-between items-center m-5'>
            {item.questionOption.map((option,inde)=>(
          <item.questionType placeholder='Long Answer' required={`${item.required}`} id={item.questionName} onChange={(e)=>{setAnswerData((prev)=>({...prev, [e.target.id]:e.target.value}))}} className='bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
            ))}
          </div>
          :
          item.questionType =="file" ?
          <div className='flex justify-between items-center m-5'>
            {item.questionOption.map((option,inde)=>(
          <input type={item.questionType} name="file" required id={item.questionName} onChange={(e)=>{setAnswerData((prev)=>({...prev, [e.target.id]:e.target.files[0]}))}} className='bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500' multiple/>  
            ))}
          </div>
    :
    item.questionType =="radio" ?
         
            item.questionOption.map((option,inde)=>(
              <div className='flex justify-between items-center m-5'>
            <div className='flex gap-4 items-center justify-center'>
          <input value={option} defaultChecked={false} name="radio" id={item.questionName} onChange={(e)=>{setAnswerData((prev)=>({...prev, [e.target.id]:e.target.value}))}} required={item.required ? "required" :"" } type={item.questionType}/> 
          <p className='text-xl font-medium'>{Object.values(option)}</p>
           </div>
           </div>
            ))
           
    :
    item.questionType =="checkbox" ?
          
            item.questionOption.map((option,inde)=>(
              <div className='flex justify-between items-center m-5'>
            <div className='flex gap-4 items-center justify-center'>
          <input value={option} name="checkbox" id={item.questionName} onChange={handleCheckbox} type={item.questionType}/> 
          <p className='text-xl font-medium'>{Object.values(option)}</p>
           </div>
           </div>
            ))
           
    :
    item.questionType=="select" ?
    <div className='flex justify-between items-center m-5'>
    <item.questionType id={item.questionName} onChange={(e)=>{setAnswerData((prev)=>({...prev, [e.target.id]:e.target.value}))}} className='bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'>
    {item.questionOption.map((option,inde)=>(
      <option value={option}>{option}</option>
    ))}
    </item.questionType>
     </div>
    :
    item.questionType=="rating" ?
      <div className='flex justify-between items-center m-5 w-2'>
        {[...Array(5)].map((star,index)=>{
          const currentRating = index+1
        return(
          <label>
             <input type="radio" value={currentRating} id={item.questionName} onChange={(e)=>{handleRating(e.target.id,currentRating)}} className='appearance-none bg-transparent text-gray-700 leading-tight focus:outline-none border-0 focus-visible:border-b border-teal-500'/>  
             <FaStar size={20} color={ currentRating <= rateColor ? "yellow" : "grey" }/>
          </label>
          )})}
       </div>
      :
     <></>
    }
 
 
  </div>
 
       
        </div>
        
        
      </div>
      
    </div>
       
           ))
       }
     {/* <button type='submit' className='p-2 rounded-md bg-blue-500 text-white font-medium w-32 m-3'>Send</button> */}
     </form>
    
 </div>
 <div className='absolute bottom-0 m-5'>
  <div className='flex items-center justify-center'>
    <Link to={`/new/${id.id}`} title='Edit this form'><MdEdit size={20} className='bg-white w-full h-full p-5 rounded-full'/></Link>
  </div>
 </div>
 </div>
 :
<div className='flex flex-col items-center justify-center'>
        <div className='w-full flex h-full justify-center items-center'>
     <div className='flex gap-4 items-center'>
   <div className='rounded-md mt-10 m-5 h-full w-[600px] min-w-max mx-auto p-5 shadow-md border border-t-blue-500'>
       <div className='flex justify-between items-center m-4'>
       <p className='text-xl font-bold'>This Application Form have been Close!! </p>  
       </div> 
     </div>
     </div>
   </div>
    </div>}
    <ToastContainer/>
   </>
  )
  
}

export default FormReview