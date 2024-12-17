import React, { useEffect, useState } from 'react'
import { BsCopy, BsPlus, BsThreeDotsVertical, BsTrash } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { LuPlusCircle } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { FaEye, FaImage, FaStar } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { AddOption, AddQuestion, CopyQuestion, DeleteOption, DeleteQuestion, ExistingForm, OpenQuestion, RequiredQuestion, UpdateFormDescription, UpdateFormName, UpdateImage, UpdateOptionName, UpdateQuestion, UpdateQuestionCondition, UpdateQuestionName } from '../action/action';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext,Draggable,Droppable } from 'react-beautiful-dnd';
import { PiDotsSixBold } from "react-icons/pi";

function QuestionData() {
  const question = useSelector(state => state.QuestionReducer)
  const user = useSelector(state=>state.UserReducer)
  //const [message,setMessage]=useState('')
  const id = useParams()
  const rand =  Math.floor(Math.random() * 1000000000)
  const [showImage,setShowImage]=useState(false)
  
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const questions={
    questionId:`${rand}`,
    questionName:"Untitled Question Name",
    questionType:"radio",
    questionOption:[{optionText:"option 1"}],
    Required:false,
    open:true
  }


  const handleSaveQuestion=(e)=>{
    e.preventDefault()
    const form = new FormData()
    form.append('FormName',question.FormName)
    form.append('FormDescription',question.FormDescription)
    form.append('Email',question.Email)
    form.append('Image',question.Image)
    form.append('section',JSON.stringify(question.section))
    form.append('AcceptAnswer',question.AcceptAnswer)
    form.append('id',id.id)
    axios.post("http://localhost:5000/createForm",form).then((res)=>{
      //console.log(res.data.message)
      setTimeout(()=>{
        toast(`${res.data.message}`)
        window.location.reload()
      },2000)
    }).catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    if(!user.isLoggedIn){
      navigate('/')
    }
    axios.get(`http://localhost:5000/getForm/${id.id}`).then(res=>{
      dispatch(ExistingForm(res.data[0]))
    }).catch(err=>{
       console.log(err)
   })
  },[])
  const handleDragDrop=(results)=>{
    
    const {source, destination,type} = results
    if(!destination) return;
    if(source.droppableId === destination.droppableId && source.index===destination.index) return;

    if(type === "group"){
      const order = [...question.section]
      const sourceIndex = source.index
      const destinationIndex = destination.index
      const [remove] = order.splice(sourceIndex,1)
      order.splice(destinationIndex,0,remove)
      return question.section=order
  }}

  

  return (
    <>
    <div className='flex flex-col items-center justify-center'>
   <div className='flex justify-center items-center'>
      {/* {
         message ? <p className='text-xl font-medium p-2 bg-green-400'>{message}</p>:""
      } */}
   <div className='w-full flex h-full justify-center items-center'>
     <div className='flex gap-4 items-center'>
     <div className='rounded-md h-full p-3 mt-5 shadow-md gap-4 flex-col'>
     <LuPlusCircle onClick={()=>{dispatch(AddQuestion(questions))}} className='text-xl hover:bg-slate-400/10 m-1'/>
     {/* <MdOutlineTitle className='text-xl  hover:bg-slate-400/10 m-1'/> */}
     <FaImage onClick={()=>{showImage ? setShowImage(false) : setShowImage(true)}} className='text-xl  hover:bg-slate-400/10 m-1'/> 
   </div>
   <div className='rounded-md mt-10 m-5 h-full w-[600px] min-w-max mx-auto p-5 shadow-md border border-t-blue-500'>
       <div className='flex justify-between items-center border-b border-teal-500 '>
       <input type="text" placeholder={question.FormName} onChange={(e)=>{dispatch(UpdateFormName(e.target.value))}} className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus-visible:border-b border-teal-500'/>  
       <BsThreeDotsVertical/>
       </div>          
       <input type="text" placeholder={question.FormDescription} onChange={(e)=>{dispatch(UpdateFormDescription(e.target.value))}} className=' appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus:border-b border-teal-500'/>  
    </div>
     
     
     </div>
   </div>
   </div>
   <div className='flex justify-center items-center'>
   {
      showImage ? 
      <>
      <div className='rounded-md mt-10 ml-16 h-full w-[600px] min-w-max mx-auto p-5 shadow-md border border-t-blue-500'>
        <div className='flex-col justify-between items-center border-b border-teal-500 '>
        <p className='text-md font-medium p-4'> Upload Image</p>
      <div className='flex justify-between items-center m-5'>
        
    <input type="file" name="Image" onChange={(e)=>{dispatch(UpdateImage(e.target.files[0]))}} className='bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
    </div>
    </div>
    </div></>:
    question.Image != 'image' ?
    <>
     <div className='rounded-md mt-10 ml-16 h-full w-[600px] min-w-max mx-auto p-5 shadow-md border border-t-blue-500'>
        <div className='flex-col justify-between items-center border-b border-teal-500 '>
        <p className='text-md font-medium p-4'> Upload Image</p>
      <div className='flex justify-between items-center m-5'>
    <img src={`/documentAnswer/form/${question.Image}`} className='w-full h-52'/>  
    </div>
    </div>
    </div>
    </>
    :<></>
     }
     </div>
   <>
   <DragDropContext onDragEnd={handleDragDrop}>
    <Droppable droppableId="root" type="group">
    {
        (provided)=>(
          <div {...provided.droppableProps} ref={provided.innerRef}>
             {
       question.section.map((item,index)=>(
        
        
        <Draggable draggableId={item.questionId} key={item.questionId} index={index}  className='flex justify-center items-center'>
          {
            (provided)=>(
              <>
              
              
        <div className='flex gap-4 items-center'>
        <div className='rounded-md h-full p-3 mt-5 shadow-md gap-4 flex-col'>
        <LuPlusCircle onClick={()=>{dispatch(AddQuestion(questions)); }} className='text-xl hover:bg-slate-400/10 m-1'/>
         {/* {
           item.open ?
           <BsEye onClick={()=>{dispatch(OpenQuestion({index,value:false}))}}  className='text-xl  hover:bg-slate-400/10 m-1'/> : */}
            {
             item.open ? 
             <FaEye onClick={()=>{dispatch(OpenQuestion({index,name:false}))}} className='text-xl  hover:bg-slate-400/10 m-1'/>
             :
             <MdEdit onClick={()=>{dispatch(OpenQuestion({index,name:true}))}} className='text-xl  hover:bg-slate-400/10 m-1'/>
            }
         {/* } */}
        
         
        <FaImage className='text-xl  hover:bg-slate-400/10 m-1'/>
      </div>
      <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} className='w-full flex h-full justify-center items-center'>
      {
        
      item.open ? 

       <div className='rounded-md mt-10 m-5 h-full w-[600px] min-w-max mx-auto p-5 shadow-md border border-l-blue-500' >
        <div className='flex items-center justify-center'>
        <PiDotsSixBold className='text-black/50'/>
        </div>
      <div className='flex justify-between items-center gap-4'>
      <input type="text" defaultValue={item.questionName} onChange={(e)=>{dispatch(UpdateQuestionName({value:e.target.value,index}))}} className='appearance-none bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
      {/* <FaImage className='text-2xl  hover:bg-slate-400/10 m-1'/> */}
      <select id="underline_select" onChange={(e)=>{dispatch(UpdateQuestion({index, value:e.target.value}));dispatch(UpdateQuestionCondition({index,value:e.target.value}))}} name="changeType" class="block py-2.5 px-3 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
        <option value="radio" className=' hover:bg-slate-400/10' selected> Multiple Choice</option>
        <option value="text">Short Answer</option>
        <option value="textarea">Paragraph</option>
        <option value="radio">Multiple Choice</option>
        <option value="checkbox">CheckBox</option>
        <option value="select">Dropdown</option>
        <option value="rating">Rating</option>
        <option value="file">Files</option>
      </select>
      </div> 
       {
          item.questionOption.map((option,inde)=>(
            item.questionType =="text" ? 
            <div className='flex justify-between items-center m-5'>
      <input type={item.questionType} defaultValue={option.optionText} placeholder="Short Unswer" onChange={()=>{}} className='appearance-none bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
      </div>
            :
            item.questionType =="textarea" ?
            <div className='flex justify-between items-center m-5'>
      <item.questionType defaultValue={option.optionText} placeholder="Long Unswer" onChange={()=>{}} className='appearance-none bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
      </div>
            :
            item.questionType =="file" ?
            <div className='flex justify-between items-center m-5'>
      <input type={item.questionType} onChange={()=>{}} className='appearance-none bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
      </div>
      :
      item.questionType =="radio" ||  item.questionType =="checkbox" ?
            <div className='flex justify-between items-center m-5'>
            <input type={item.questionType} onChange={()=>{}}/> 
      <input type="text" defaultValue={typeof option ==='object' ? option.optionText : option } onChange={(e)=>{dispatch(UpdateOptionName({name:e.target.value,inde,index}))}} placeholder="option 1" className='appearance-none bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
       <BsPlus  onClick={()=>{dispatch(AddOption({index,inde,option}))}} className='text-2xl  hover:bg-slate-400/10 m-1'/>
       <MdClose onClick={()=>{dispatch(DeleteOption({inde,index}))}} className='text-2xl  hover:bg-slate-400/10 m-1'/>
      </div>
      :
      item.questionType=="select" ?
      <div className='flex justify-between items-center m-5'>
      <input type="text" defaultValue={typeof option ==='object' ? option.optionText : option } onChange={(e)=>{dispatch(UpdateOptionName({name:e.target.value,inde,index}))}} placeholder="option 1" className='appearance-none bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
       <BsPlus  onClick={()=>{dispatch(AddOption({index,inde,option}))}} className='text-2xl  hover:bg-slate-400/10 m-1'/>
       <MdClose onClick={()=>{dispatch(DeleteOption({inde,index}))}} className='text-2xl  hover:bg-slate-400/10 m-1'/>
      </div>
      :
      item.questionType=="rating" ?
      <div className='flex justify-between items-center m-5 w-2'>
        {[...Array(5)].map((star,index)=>{
          const currentRating = index+1
        return(
          <label>
             <input type="radio" value={currentRating} onChange={(e)=>{dispatch(UpdateOptionName({name:e.target.value,inde,index}))}} className='appearance-none bg-transparent text-gray-700 leading-tight focus:outline-none border-0 focus-visible:border-b border-teal-500'/>  
             <FaStar/>
          </label>
          )})}
       </div>
      :
      <></>
        ))
        }
      <hr className='text-xl'/>
      <div className='flex justify-between items-center text-medium text-xl m-3'>
        <p></p>
        <div className='flex justify-center items-center gap-4'>
        {/* <BsCopy onClick={()=>{dispatch(CopyQuestion(index))}}/> */}
        <BsTrash onClick={()=>{dispatch(DeleteQuestion(index))}}/>
        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" onClick={()=>{dispatch(RequiredQuestion({index,value:true}))}} value="" class="sr-only peer"/>
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Required</span>
          </label>
 
        </div>
      </div>
    </div>
    : 
 <div className='rounded-md mt-10 m-5 h-full w-[600px] min-w-max mx-auto p-5 shadow-md border border-l-blue-500' >
<div className='flex items-center justify-center'>
        <PiDotsSixBold className='text-black/50'/>
        </div>
 <div className='flex justify-between items-center gap-4'>
       <input type="text" disabled defaultValue={item.questionName} className='appearance-none bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus-visible:border-b border-teal-500'/>  
       </div> 
     {
          item.questionType =="text" ? 
          <div className='flex justify-between items-center m-5'>
            {item.questionOption.map((option)=>(
    <input type={item.questionType} defaultValue={option.optionText} placeholder="Short Unswer" onChange={()=>{}} className='bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
  ))}
    </div>
          :
          item.questionType =="textarea" ?
          
          <div className='flex justify-between items-center m-5'>
            {item.questionOption.map((option)=>(
    <item.questionType defaultValue={option.optionText} placeholder="Long Unswer" onChange={()=>{}} className='bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
          ))}
    </div>
          :
          item.questionType =="file" ?
          <div className='flex justify-between items-center m-5'>
            {item.questionOption.map(()=>(
    <input type={item.questionType} onChange={()=>{}} className='bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'/>  
            ))}
    </div>
    :
    item.questionType == "radio" ||  item.questionType == "checkbox" ?
    
        item.questionOption.map((option)=>(
          <div className='flex justify-between items-center m-5'>
            <div className='flex gap-4 items-center justify-center'>
          <input type={item.questionType} onChange={()=>{}}/> 
          <p className='text-xl font-medium'>{option}</p>
           </div>
           </div>
        ))
    
    :
    item.questionType =="select" ?
    <div className='flex justify-between items-center m-5'>
    <item.questionType className='bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none border-0 hover:border-b-2 focus-visible:border-b border-teal-500'>
    {item.questionOption.map((option)=>(
      <option>{option}</option>
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
           <input type="radio" value={currentRating} className='appearance-none bg-transparent text-gray-700 leading-tight focus:outline-none border-0 focus-visible:border-b border-teal-500'/>  
           <FaStar/>
        </label>
        )})}
     </div>
     :
    <></>
    
      }
 
 
  </div>
 
       }
        </div>
        </div>
        </>
            )
          }

        </Draggable>
        
       )
       )}
       {provided.placeholder}
          </div>
        )
    }

    </Droppable>
   </DragDropContext>
      </>
 
   
   <button onClick={handleSaveQuestion} className='p-2 rounded-md bg-blue-500 text-white font-medium w-32 m-3'>Save</button>
 </div>
 <ToastContainer/>
   </>
  )
}

export default QuestionData