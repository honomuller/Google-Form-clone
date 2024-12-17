import React, {useState,useEffect} from 'react'
import Navbar from './layout/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { CloseApplication, ExistingForm } from '../action/action'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import Editor from './editor/Editor'

function ComposeEmail() {
    const [hs,setHs]=useState(false)
    const question = useSelector(state => state.QuestionReducer)
    const user = useSelector(state=>state.UserReducer)
    const [formData,setFormData]=useState([])
    const [message,setMessage]=useState('')
    const [review,setReview]=useState('')
    const [confirm,setConfirm]=useState('')
    const [reject,setReject]=useState('')
  
    const id = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    var token
    if(user.isLoggedIn === true){
      token = jwtDecode(JSON.stringify(user.user))
    }
  
    const handleSaveQuestion=(e,value)=>{
      e.preventDefault()
        dispatch(CloseApplication(value))
      //console.log(question)
      const data={
        FormName:question.FormName,
        FormDescription:question.FormDescription,
        section: question.section,
        AcceptAnswer:value,
        id:id.id
      }
      // console.log(data)
      axios.post("http://localhost:5000/createForm",data).then((res)=>{
        setTimeout(()=>{
          //setMessage(res.data.message)
          toast(`${res.data.message}`)
        },2000)
        
        //console.log(res)
      }).catch((err)=>{
        console.log(err)
      })
    }
  
    const handleExcelSheet=(e)=>{
      e.preventDefault()
      axios.post(`http://localhost:5000/answer/getExcelSheet/${id.id}`).then(res=>{
        toast(`${res.data.message}`)
        window.open(window.location.origin + '/answer/'+res.data.data,'_blank', 'noopener,noreferrer')
        //console.log(res.data.data)
      }).catch(err=>{
         console.log(err)
     })
    }
  
    
    useEffect(()=>{
      if(user.isLoggedIn===false){
          navigate('/')
      }else{
        axios.get(`http://localhost:5000/getForm/${id.id}`).then(res=>{
          // console.log(res.data[0])
          dispatch(ExistingForm(res.data[0]))
        }).catch(err=>{
           console.log(err)
       })
       axios.get(`http://localhost:5000/answer/getFormData/${id.id}`,).then(res=>{
        setFormData(res.data)
       // console.log(res.data)
       }).catch(err=>{
        console.log(err)
       })
      }
  },[])
  
  return (
    <>
    <Navbar/>
    <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col justify-start'>
         <div className='m-5'>
            <p className='text-xl font-medium'>Compose Emails</p>
         </div>
         <div className='p-5'>
          <Editor id={id.id} />
         </div>
        </div>
    </div>
    </>
    
  )
}

export default ComposeEmail