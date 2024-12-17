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
import { CiShare1, CiTrash } from 'react-icons/ci';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LiaTrashRestoreAltSolid } from "react-icons/lia";
import ReactPaginate from 'react-paginate';

function CreateForm() {
    const questions = useSelector(state=> state.QuestionReducer)
    const user = useSelector(state=>state.UserReducer)
    const ui = uuidv4()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    var token
    var rand =  Math.floor(Math.random() * 1000000000)

    if(user.isLoggedIn === true){
        token = jwtDecode(JSON.stringify(user.user))
    }


    const questio={
        FormName:"Untitled Form",
        FormDescription:"Form Description",
        Image:"image",
        Email:"email",
        section:[{
            questionId:`${rand}`,
            questionName:"Untitled Question Name",
            questionType:"radio",
            questionOption:[{optionText:"option 1"}],
            Required:false,
            open:true
          }],
        AcceptAnswer:true
        }

    const [formData,setFormData]=useState([])
    const [formTrashData,setFormTrashData]=useState([])
    const [formShareData,setFormShareData]=useState([])
    const [userData,setUserData]=useState([])
    const [userNotData,setUserNotData]=useState([])
    const [visibleDropdown,setVisibleDropdown]=useState('')
    const [visibleModal,setVisibleModal]=useState('')
    const [selected,setSelected]=useState(false)
    const [selectedTrash,setSelectedTrash]=useState(false)
    const [userValue,setUserValue]=useState('')
    const [typeValue,setTypeValue]=useState('')
    const [message,setMessage]=useState('')

    const [searchValue,setSearchValue]=useState('')

    const handleSelectedTrash=(value)=>{
      if(value===true){
        setSelectedTrash(value)
        setSelected(false)
      }else{
        setSelectedTrash(value)
        setSelected(false)
      } //console.log(value)
    }

    const handleSelected =(value)=>{
      if(value===true){
        setSelectedTrash(false)
        setSelected(true)
      }else{
        setSelectedTrash(false)
        setSelected(false)
      }
    }

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
             axios.get(`http://localhost:5000/getUserFormsTrash/${token.user_id}`).then(res=>{
              //console.log(res.data)
               setFormTrashData(res.data)
           }).catch(err=>{
               console.log(err)
           })
             axios.get(`http://localhost:5000/user/getUsers`).then(res=>{
             // console.log(res.data)
               setUserData(res.data)
           }).catch(err=>{
               console.log(err)
           })
           axios.get(`http://localhost:5000/user/usersNotId/${token.user_id}`).then(res=>{
            // console.log(res.data)
              setUserNotData(res.data)
          }).catch(err=>{
              console.log(err)
          })
           axios.get(`http://localhost:5000/share/getSharedForm/${token.user_id}`).then(res=>{
            // console.log(res.data)
            setFormShareData(res.data)
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
        //console.log(res.data)
        navigate(`/new/${ui}`)
      }).catch(err=>{
         console.log(err)
     })
  }
  const handleShareForm=(e,value)=>{
    e.preventDefault()
    const data={
      app:value,
      user:userValue,
      type:typeValue
    }
    axios.post(`http://localhost:5000/share/shareForm`,data).then(res=>{
      //console.log(res.data)
      toast(`${res.data.message}`)
      setTimeout(() =>
        window.location.reload()
     ,3000)
       
      
    }).catch(err=>{
      console.log(err)
    })
  }
  const handleDeleteForm=(e,value)=>{
    e.preventDefault()
    axios.post(`http://localhost:5000/deleteForm/${value}`).then(res=>{
      //setMessage(res.data.message)
      toast(`${res.data.message}`)
      setTimeout(() =>
         window.location.reload()
      ,3000)
    }).catch(err=>{
      console.log(err)
    })
  }

  const handleRecoverForm=(e,value)=>{
    e.preventDefault()
    axios.post(`http://localhost:5000/recoverForm/${value}`).then(res=>{
      //setMessage(res.data.message)
      toast(`${res.data.message}`)
      setTimeout(() =>
         window.location.reload()
      ,3000)
    }).catch(err=>{
      console.log(err)
    })
  }

  const itemsPerPage = 7
const [itemOffset, setItemOffset] = useState(0);
var [i, setI] = useState(0)
var sum = 0
var sums = 0
var sumt = 0


const endOffset =  itemOffset+ itemsPerPage;
//console.log(`Loading items from ${itemOffset} to ${endOffset}`);
const currentItems = formData.filter(it => searchValue.toLowerCase() ==='' ? it : it.app_title.toLowerCase().includes(searchValue.toLowerCase())).slice(itemOffset, endOffset);
const currentItemtrash = formTrashData.filter(it => searchValue.toLowerCase() ==='' ? it : it.app_title.toLowerCase().includes(searchValue.toLowerCase())).slice(itemOffset, endOffset);
const currentItemshared = formShareData.filter(it => searchValue.toLowerCase() ==='' ? it : it.app_title.toLowerCase().includes(searchValue.toLowerCase())).slice(itemOffset, endOffset);

const pageCount = Math.ceil(formData.length / itemsPerPage);

// Invoke when user click to request another page.
const handlePageClick = (event) => {
  const newOffset = (event.selected * itemsPerPage) % formData.length;
  setItemOffset(newOffset);
  setI(newOffset)
};

const handlePageClickDeleted = (event) => {
  const newOffset = (event.selected * itemsPerPage) % formTrashData.length;
  setItemOffset(newOffset);
  setI(newOffset)
};

const handlePageClickShared = (event) => {
  const newOffset = (event.selected * itemsPerPage) % formShareData.length;
  setItemOffset(newOffset);
  setI(newOffset)
};
  return (
    <>
    <div className=' bg-slate-300/10 p-5'>
    <div className='mx-auto max-w-screen-lg'>
     <div className='flex justify-between p-5'>
         <h1 className='text-sm font-medium'> Start New Form</h1>
         
     </div>
     <div className='w-40'>
     <Link onClick={handleFormCreation}><BsPlus className='border border-gray-500/50 shadow-md h-full w-full p-5'/></Link>
     </div>
     <p className='p-4'>Blank Form</p>
    </div>
    </div>
    

    <div className=' bg-white p-5'>
     <div className='flex justify-between p-5 mx-auto max-w-screen-lg'>
     { selected === true ? 
     <h1 className='text-sm font-medium'> Shared Forms</h1> :  selectedTrash === true ? <h1 className='text-sm font-medium'> Trashed Forms</h1> : <h1 className='text-sm font-medium'> Recents Forms</h1>}
         <div class="md:relative mx-auto max-w-screen-lg">
        <div class="md:absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <BsSearch/>
        </div>
        <input type="text" onChange={(e)=>{setSearchValue(e.target.value)}} id="voice-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search File..."/>
    </div>
         <div className='flex justify-between items-center gap-4'>
          <div  className='flex items-center justify-between gap-3'>
          <div onClick={()=>{selected ? handleSelected(false): handleSelected(true)}} title={'Shared to me'} class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <CiShare1 />
            </div>
            <div onClick={()=>{selectedTrash ? handleSelectedTrash(false):  handleSelectedTrash(true)}} title={'Delete Forms'} class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <CiTrash />
            </div>
          </div>
         <BsThreeDotsVertical/>
         </div>
     </div>
     <div className='flex-col mx-auto max-w-screen-lg gap-2'>
      <div className='flex gap-3'>
     {
      selected === true ?
      <>
      
      { currentItemshared.map((form,index)=>(
        form.type === "full" ?
        <div className='w-40 flex flex-col border rounded-md shadow-xl'>
          <p className='hidden'>{sums++}</p>
            <div>
            <a href={`/new/${form.app_name}`}><BsImage className='border h-full w-full p-5'/></a>
        </div>
        <a href={`/new/${form.app_name}`}><p className='p-2'>{form.app_title}</p></a>
        <div className='flex justify-between items-center p-4'>
        <FaListAlt/>
        </div>
     </div>
     :
     form.type === "partial" ?
        <div className='w-40 flex flex-col border rounded-md shadow-xl'>
            <div>
            <a href={`/answers/${form.app_name}`}><BsImage className='border h-full w-full p-5'/></a>
        </div>
        <a href={`/answers/${form.app_name}`}><p className='p-2'>{form.app_title}</p></a>
        <div className='flex justify-between items-center p-4'>
        <FaListAlt/>
        </div>
     </div>
     :
     ""
    ))}
    </>
       :

       selectedTrash === true
       ?
<>
       {currentItemtrash.map((form,index)=>(
        <>
        <p className='hidden'>{sumt++}</p>
        <div className='w-40 flex flex-col border rounded-md shadow-xl'>
        <div>
        <BsImage className='border h-full w-full p-5'/>
        </div>
        <p className='p-2'>{form.app_title}</p>
        <div className='flex justify-between items-center p-4'>
        <FaListAlt/>
        <div className="relative font-[sans-serif]">
      {
        visibleDropdown ? <BsThreeDotsVertical onClick={()=>{visibleDropdown === index ?  setVisibleDropdown('') : setVisibleDropdown(index)}} /> :<BsThreeDotsVertical onClick={()=>{visibleDropdown ?  setVisibleDropdown(false) : setVisibleDropdown(true)}} /> 
      }
    <ul id="dropdownMenu" className={`${visibleDropdown === index ? 'absolute block' : 'hidden' } shadow-lg bg-white py-2 min-w-full w-50 rounded-lg max-h-96 overflow-auto`}>
       <li onClick={(e)=>{handleRecoverForm(e,form.app_id)}}className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
       <LiaTrashRestoreAltSolid />
        Recover
      </li>
      {/* <li onClick={(e)=>{}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
        <CiTrash />
        Delete
      </li> */}
      <div class={`${visibleModal===index ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
<div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
  <form class=" w-full">
    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <CiShare1 />
        </div>
        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Share The Form Here!!</h3>
          {
            message ? <p className='p-2 text-xl font-medium bg-green-400/10'>{message}</p> : ""
          }
            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Users</label>
            <select onChange={(e)=>{setUserValue(e.target.value)}} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected>Choose a User</option>
                { userData.map(user=>(
                  <option value={user.user_id}>{user.email}</option>
                ))}
            </select>
            
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
      <button type="button" onClick={(e)=>{handleShareForm(e,form.app_id)}} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Share</button>
      <button type="button" onClick={()=>{setVisibleModal('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
    </div>
    </form>
  </div>
</div>
</div>
</div>
    </ul>
  </div>
       
        </div>
     </div>
     
   </>
    ))}
    </>
        :
        currentItems.map((form,index)=>(
          <div className='w-40 flex flex-col border rounded-md shadow-xl'>
            <p className='hidden'>{sum++}</p>
          <div>
          <a href={`/new/${form.app_name}`}><BsImage className='border h-full w-full p-5'/></a>
          </div>
          <a href={`/new/${form.app_name}`}><p className='p-2'>{form.app_title}</p></a>
          <div className='flex justify-between items-center p-4'>
          <FaListAlt/>
          <div onMouseOut={()=>{setVisibleDropdown('')}} onMouseOver={()=>{setVisibleDropdown(index)}} className="relative font-[sans-serif]">
        <BsThreeDotsVertical  />

        
      <ul id="dropdownMenu" className={`${visibleDropdown === index ? 'absolute block' : 'hidden' } shadow-lg bg-white py-2 min-w-full w-50 rounded-lg max-h-96 overflow-auto`}>
         <li onClick={()=>{setVisibleModal(index)}}className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
         <CiShare1 />
          Share
        </li>
        <li onClick={(e)=>{handleDeleteForm(e,form.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <CiTrash />
          Delete
        </li>
        <div class={`${visibleModal===index ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
<div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
    <form class=" w-full">
      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <CiShare1 />
          </div>
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Share The Form Here!!</h3>
            {
              message ? <p className='p-2 text-xl font-medium bg-green-400/10'>{message}</p> : ""
            }
              <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Users :</label>
              <select onChange={(e)=>{setUserValue(e.target.value)}} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option selected>Choose a User</option>
                  { userNotData.map(user=>(
                    <option value={user.user_id}>{user.email}</option>
                  ))}
              </select>
              <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Type :</label>
            <select onChange={(e)=>{setTypeValue(e.target.value)}} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected>Choose a Type</option>
                  <option value="full">Full Access</option>
                  <option value="partial">Partial Access</option>
            </select>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button type="button" onClick={(e)=>{handleShareForm(e,form.app_id)}} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Share</button>
        <button type="button" onClick={()=>{setVisibleModal('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>
      </ul>
    </div>
         
          </div>
       </div>
      ))
     }
     </div>
     {
      selected === true ? 
      <>
       <p className='flex '>Showing {itemOffset} to {endOffset} of {sum=sums+i} Entries</p>
      <ReactPaginate
     breakLabel="..."
     nextLabel="next >"
     onPageChange={handlePageClickShared}
     pageRangeDisplayed={5}
     pageCount={pageCount}
     previousLabel="< previous"
     renderOnZeroPageCount={null}
     className='flex items-center gap-2'
   />
      </>
      :

      selectedTrash === true ? 
      <>
       <p className='flex '>Showing {itemOffset} to {endOffset} of {sum=sumt+i} Entries</p>
      <ReactPaginate
     breakLabel="..."
     nextLabel="next >"
     onPageChange={handlePageClickDeleted}
     pageRangeDisplayed={5}
     pageCount={pageCount}
     previousLabel="< previous"
     renderOnZeroPageCount={null}
     className='flex items-center gap-2'
   />
      </>
      :
      <>
      <p className='flex '>Showing {itemOffset} to {endOffset} of {sum=sum+i} Entries</p>
      <ReactPaginate
     breakLabel="..."
     nextLabel="next >"
     onPageChange={handlePageClick}
     pageRangeDisplayed={5}
     pageCount={pageCount}
     previousLabel="< previous"
     renderOnZeroPageCount={null}
     className='flex items-center gap-2'
   />
   </>
     }
     
     </div>
     
    </div>
    <ToastContainer/>
    </>
  )
}

export default CreateForm