import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { BsPeople, BsPerson, BsPersonAdd, BsPlus, BsSearch, BsTrash } from 'react-icons/bs'
import { FaGoogleDrive, FaUserEdit } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { MdPassword } from "react-icons/md";

function Admin() {
    const user = useSelector(state=> state.UserReducer)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [firstName,setFirstName]=useState('')
    const [lastName,setLastName]=useState('')
    const [phone,setPhone]=useState('')
    const [institution,setInstitution]=useState('')
    const [role,setRole]=useState('')

    const [emailUpdate,setEmailUpdate]=useState('')
    const [firstNameUpdate,setFirstNameUpdate]=useState('')
    const [lastNameUpdate,setLastNameUpdate]=useState('')
    const [phoneUpdate,setPhoneUpdate]=useState('')
    const [institutionUpdate,setInstitutionUpdate]=useState('')
    const [roleUpdate,setRoleUpdate]=useState('')

    const [passwordChange,setPasswordChange]=useState('')

    const [visibleModal,setVisibleModal]=useState('')
    const [visibleModalApp,setVisibleModalApp]=useState('')

    const [showRegister,setShowRegister]=useState(false)
    const [showUser,setShowUser]=useState(false)
    const [showEdit,setShowEdit]=useState('')
    const [showEditPassword,setShowEditPassword]=useState('')
    const [showFile,setShowFile]=useState(false)

    const [userData,setUserData]=useState([])
    const [formData,setFormData]=useState([])
    const [driveData,setDriveData]=useState([])

    var token 
    if(user.isLoggedIn===true){
        token = jwtDecode(JSON.stringify(user.user))
    }

    const handleSubmit =(e)=>{
        e.preventDefault()
        const data = {
            email:email,
            password:password,
            firstName:firstName,
            lastName:lastName,
            phone:phone,
            institution:institution,
            role:role
        }
        axios.post('http://localhost:5000/user/register',data).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>{window.location.reload()},3000)
        }).catch(err =>{
            console.log(err)
        })
    }
    useEffect(()=>{
        if(!user.isLoggedIn){
            navigate('/')
        }
        axios.get('http://localhost:5000/user/getUsers').then(res=>{
            setUserData(res.data)
        }).catch(err=>{
            console.log(err)
        })
        axios.get('http://localhost:5000/getForm').then(res=>{
            setFormData(res.data)
        }).catch(err=>{
            console.log(err)
        })
        axios.get('http://localhost:5000/drive/getFolder').then(res=>{
            setDriveData(res.data)
        }).catch(err=>{
            console.log(err)
        })

    },[])

    const handleShowRegister=()=>{
        if(showRegister=== true){
            setShowRegister(false) 
         setShowUser(false)
         setVisibleModal('')
         setShowFile(false)
        }else{
            setShowRegister(true)
            setShowUser(false)
            setVisibleModal('')
            setShowFile(false)
        }
    }

    const handleShowUser=()=>{
        if(showUser === true){
            setShowRegister(false) 
         setShowUser(false)
         setVisibleModal('')
         setShowFile(false)
        }else{
            setShowRegister(false)
            setShowUser(true)
            setVisibleModal('')
            setShowFile(false)
        }
    }

    const columns = []
    const rows = []
    userData.slice(0,1).map(it => Object.keys(it).map(i => columns.push({ field: i, headerName: i})))
    userData.map((it,index) => rows.push(it))
    const paginationModel = { page: 0, pageSize: 100 };

    const columnsapp = []
    const rowsapp = []
    formData.slice(0,1).map(it => Object.keys(it).slice(1,4).map(i => columnsapp.push({ field: i, headerName: i})))
    formData.map((it,index) => rowsapp.push(it))
    const paginationModelapp = { page: 0, pageSize: 100 };

    const handleModalShow=(value)=>{
        if(visibleModal !== ''){
            setVisibleModal('')
        }else{
            setVisibleModal(value)
        }
        
    }
    
    const handleModalShowApp=(value)=>{
        if(visibleModalApp !==''){
            setVisibleModalApp('')
        }else{
            setVisibleModalApp(value)
        }
    }

    const handleShowEdit=(value)=>{
        setShowEdit(value)
        axios.get(`http://localhost:5000/user/usersId/${value}`).then(res=>{
            setEmailUpdate(res.data[0].email)
            setFirstNameUpdate(res.data[0].firstname)
            setLastNameUpdate(res.data[0].lastname)
            setPhoneUpdate(res.data[0].phone)
            setRoleUpdate(res.data[0].role)
            setInstitutionUpdate(res.data[0].institution)
        }).catch(err =>{
            console.log(err)
        })
    }

    const handleUpdateSubmit=(e,value)=>{
        e.preventDefault()
        const data = {
            email:emailUpdate,
            firstname:firstNameUpdate,
            lastname:lastNameUpdate,
            phone:phoneUpdate,
            institution:institutionUpdate,
            role:roleUpdate
        }
        axios.put(`http://localhost:5000/user/userUpdate/${value}`,data).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>{window.location.reload()},3000)
        }).catch(err =>{
            console.log(err)
        })

    }

    const handleDeleteSubmit=(e,value)=>{
        e.preventDefault()
        axios.delete(`http://localhost:5000/user/userDelete/${value}`).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }).catch(err => console.log(err))
    }

    const handleDeleteAppSubmit=(e,value)=>{
        e.preventDefault()
        //console.log(value)
        axios.delete(`http://localhost:5000/drive/deleteFile/${value}`).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }).catch(err=>{
            console.log(err)
        })
    }

    const handleUpdatePasswordSubmit=(e,value)=>{
        e.preventDefault()
        const data={
            password:passwordChange
        }
        axios.put(`http://localhost:5000/user/passwordUpdate/${value}`,data).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>window.location.reload(),3000)
        }).catch(err => console.log(err))
    }

    const handleVisibleModal=()=>{
        setVisibleModal('')
        setShowEdit('')
        setShowFile('')
    }

    const handleVisibleModalApp=()=>{
        setVisibleModalApp('')
    }
    const handleShowFile=()=>{
        if(showFile === true){
            setShowFile(false)
            setShowRegister(false) 
         setShowUser(false)
        }else{
            setShowFile(true)
            setShowRegister(false) 
         setShowUser(false)
        }
    }
    const handleShowEditPassword=(value)=>{
            setShowEditPassword(value)
        
    }

  return (
    <>
    <div className=' bg-slate-300/10 p-5'>
         <div className='mx-auto max-w-screen-lg'>
            <div className='flex-col'>
                <div class="flex items-center w-96 mx-auto max-w-screen-lg">   
                     <div onClick={handleShowRegister} className='p-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100 gap-3 ml-5'>
                         <BsPersonAdd size={20}/> Add User
                     </div>
                     <div onClick={handleShowUser} className='p-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100 gap-3 ml-5'>
                         <BsPeople size={20}/> Users
                     </div>
                     <div onClick={handleShowFile} className='p-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100 gap-3 ml-5'>
                         <FaGoogleDrive size={20}/> Files
                     </div>
                </div>
            </div>
         </div>
    </div>
    <div className=' bg-white p-5'>
        {
            showRegister ?

            <div className='mx-auto max-w-screen-lg'>
            <p className='text-xl font-medium'> Register User</p>
    <form class="max-w-md mx-auto">
      <div class="relative z-0 w-full mb-5 group">
          <input type="email" onChange={(e)=>{setEmail(e.target.value)}} name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
      </div>
      <div class="relative z-0 w-full mb-5 group">
          <input type="password" onChange={(e)=>{setPassword(e.target.value)}} name="floating_password" id="floating_password" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" onChange={(e)=>{setFirstName(e.target.value)}}  name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" onChange={(e)=>{setLastName(e.target.value)}}  name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" onChange={(e)=>{setPhone(e.target.value)}} name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" onChange={(e)=>{setInstitution(e.target.value)}}  name="floating_company" id="floating_company" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_company" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company (Ex. MoYa)</label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <select type="tel" onChange={(e)=>{setRole(e.target.value)}} name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required>
                <option className='font-medium'>---Select Role---</option>
                <option value={'user'}>User</option>
                <option value={'admin'}>Admin</option>
            </select>
            <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Roles</label>
        </div>
      </div>
      <button type="button" onClick={handleSubmit} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>
            </div>

            :
            showUser
            ?
            <div className='mx-auto max-w-screen-lg'>
            <p className='text-xl font-medium'> All Users</p>
            <Paper className='text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 max-w-screen-md mx-auto overflow-x-auto border border-black/5'>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10,  50, 100]}
        getRowId={(row) => row.user_id}
        onRowClick={(rows)=>handleModalShow(rows.id)}
        sx={{ border: 0 }}
        className='w-full'
      />
    <div class={`${visibleModal !== '' ? 'relative' : 'hidden' }`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
<div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <div class="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all max-w-screen-lg mx-auto w-full max-h-max">
    <form class=" w-full">
      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start flex-col">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            User details
          </h3>
          <div className='flex gap-4 m-5'>
          <button type="button" onClick={()=>{showEdit ? handleShowEdit('') : handleShowEdit(visibleModal)}} class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto"><FaUserEdit size={20}/></button>
          <button type="button" onClick={(e)=>{showEditPassword ? handleShowEditPassword('') : handleShowEditPassword(visibleModal) }} class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto"><MdPassword size={20}/></button>
          <button type="button" onClick={(e)=>{handleDeleteSubmit(e,visibleModal)}} class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto"><BsTrash size={20}/></button>
          </div>
            {/* handleUpdatePasswordSubmit(e,visibleModal) */}
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            
           <div class="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg m-5">

    <div class="px-4 py-5 sm:px-6">
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Details and informations about user.
        </p>
    </div>
    <div class="border-t border-gray-200 text-gray-500">
        {
            showEdit === visibleModal ?
            <form class="max-w-md mx-auto m-5">
      <div class="relative z-0 w-full mb-5 group">
          <input type="email" defaultValue={emailUpdate} onChange={(e)=>{setEmailUpdate(e.target.value)}} name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" defaultValue={firstNameUpdate} onChange={(e)=>{setFirstNameUpdate(e.target.value)}}  name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" defaultValue={lastNameUpdate} onChange={(e)=>{setLastNameUpdate(e.target.value)}}  name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" defaultValue={phoneUpdate} onChange={(e)=>{setPhoneUpdate(e.target.value)}} name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
            <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" defaultValue={institutionUpdate} onChange={(e)=>{setInstitutionUpdate(e.target.value)}}  name="floating_company" id="floating_company" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_company" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company (Ex. Google)</label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <select type="tel" onChange={(e)=>{setRoleUpdate(e.target.value)}} name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required>
                <option className='font-medium'>---Select Role---</option>
                    <option value={`user`} selected={roleUpdate == 'user' ? "selected" : ""}>User</option>
                    <option value={'admin'} selected={roleUpdate == 'admin' ? "selected" : ""}>Admin</option>
            </select>
            <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Roles</label>
        </div>
      </div>
      <button type="button" onClick={(e)=>{handleUpdateSubmit(e,visibleModal)}} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>
             :
             showEditPassword === visibleModal ? 
             <form class="max-w-md mx-auto m-5">
      <div class="relative z-0 w-full mb-5 group">
          <input type="password" onChange={(e)=>{setPasswordChange(e.target.value)}} name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Change Password</label>
      </div>
      <button type="button" onClick={(e)=>{handleUpdatePasswordSubmit(e,visibleModal)}} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>
             :
        <div>
              {
            userData.map(item =>
                item.user_id === visibleModal ?
              <div className='flex max-w-2xl'>
              <div class=" px-4 py-5 w-52">
            {Object.keys(item).map(itek=> 
            <>
            <p class=" mt-1 text-sm font-medium text-gray-500 p-2">
                   {itek}
            </p>
             </>)}
             </div>
             <div class=" px-4 py-5 bg-white w-full">
             {Object.values(item).map(ite=> (
                ite == null ?
                <p class="mt-1 text-sm text-gray-900 p-2">no data</p>
                :
             <p class="mt-1 text-sm text-gray-900 p-2">{ite}</p>
              ))}
             </div>
             </div>
             :""
            )
           }
        </div>
        

    }
    </div>
    
</div>
          </div>
          
          
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button type="button" onClick={handleVisibleModal}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>
    </Paper>
    </div>
            :
            showFile 
            ? 
           <div className='mx-auto max-w-screen-lg'>
            <div className='flex-col'>
            <p className='text-xl font-medium'> All Files</p>
            <Paper className='text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 max-w-screen-md mx-auto overflow-x-auto border border-black/5'>
      <DataGrid
        rows={rowsapp}
        columns={columnsapp}
        initialState={{ pagination: { paginationModelapp } }}
        pageSizeOptions={[5, 10,  50, 100]}
        getRowId={(row) => row.app_id}
        onRowClick={(rowsapp)=>handleModalShowApp(rowsapp.id)}
        sx={{ border: 0 }}
        className='w-full'
      />
    <div class={`${visibleModalApp !== '' ? 'relative' : 'hidden' }`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
<div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <div class="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all max-w-screen-lg mx-auto w-full max-h-max">
    <form class=" w-full">
      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start flex-col">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            File details
          </h3>
          <div className='flex gap-4 m-5'>
          <button type="button" onClick={(e)=>{handleDeleteAppSubmit(e,visibleModalApp)}} class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto"><BsTrash size={20}/></button>
          </div>
            
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            
           <div class="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg m-5">

    <div class="px-4 py-5 sm:px-6">
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Details and informations about File.
        </p>
    </div>
    <div class="border-t border-gray-200 text-gray-500">
        {
           
        <div>
              {
            formData.map(item =>
                item.app_id === visibleModalApp ?
              <div className='flex max-w-2xl'>
              <div class=" px-4 py-5 w-52">
            {Object.keys(item).slice(1).map(itek=> 
            <>
            <p class=" mt-1 text-sm font-medium text-gray-500 p-2">
                   {itek}
            </p>
             </>)}
             </div>
             <div class=" px-4 py-5 bg-white w-full">
             <p class="mt-1 text-sm text-gray-900 p-2">{item.app_title === '' ? "Uploaded File" : item.app_title}</p>

             <p class="mt-1 text-sm text-gray-900 p-2">{item.app_name === '' ? "Uploaded File" : item.app_name}</p>
             
             <p class="mt-1 text-sm text-gray-900 p-2">{item.filename}</p>
             
             <p class="mt-1 text-sm text-gray-900 p-2">{userData.map(i =>i.user_id===item.user_id ? i.firstname+""+i.lastname : "")}</p>
             
             <p class="mt-1 text-sm text-gray-900 p-2">{item.status == 1 ? "Active" : 'Not active'}</p>
             
             <p class="mt-1 text-sm text-gray-900 p-2">{driveData.map(i=> i.folder_id===item.folder_id ? i.folder_name : "")}</p>
             </div>
             </div>
             :""
            )
           }
        </div>
        

    }
    </div>
    
</div>
          </div>
          
          
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button type="button" onClick={handleVisibleModalApp}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>
    </Paper>
    </div>
           </div>

            :
            <div className='mx-auto max-w-screen-lg'>
            <p className='text-xl font-medium'> All Users</p>
            <Paper className='text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 max-w-screen-md mx-auto overflow-x-auto border border-black/5'>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10,  50, 100]}
        getRowId={(row) => row.user_id}
        onRowClick={(rows)=>handleModalShow(rows.id)}
        sx={{ border: 0 }}
        className='w-full'
      />
    <div class={`${visibleModal !== '' ? 'relative' : 'hidden' }`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
<div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <div class="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all max-w-screen-lg mx-auto w-full max-h-max">
    <form class=" w-full">
      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start flex-col">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            User details
          </h3>
          <div className='flex gap-4 m-5'>
          <button type="button" onClick={()=>{showEdit ? handleShowEdit('') : handleShowEdit(visibleModal)}} class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto"><FaUserEdit size={20}/></button>
          <button type="button" onClick={(e)=>{showEditPassword ? handleShowEditPassword('') : handleShowEditPassword(visibleModal) }} class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto"><MdPassword size={20}/></button>
          <button type="button" onClick={(e)=>{handleDeleteSubmit(e,visibleModal)}} class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto"><BsTrash size={20}/></button>
          </div>
            {/* handleUpdatePasswordSubmit(e,visibleModal) */}
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            
           <div class="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg m-5">

    <div class="px-4 py-5 sm:px-6">
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Details and informations about user.
        </p>
    </div>
    <div class="border-t border-gray-200 text-gray-500">
        {
            showEdit === visibleModal ?
            <form class="max-w-md mx-auto m-5">
      <div class="relative z-0 w-full mb-5 group">
          <input type="email" defaultValue={emailUpdate} onChange={(e)=>{setEmailUpdate(e.target.value)}} name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" defaultValue={firstNameUpdate} onChange={(e)=>{setFirstNameUpdate(e.target.value)}}  name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" defaultValue={lastNameUpdate} onChange={(e)=>{setLastNameUpdate(e.target.value)}}  name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" defaultValue={phoneUpdate} onChange={(e)=>{setPhoneUpdate(e.target.value)}} name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
            <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" defaultValue={institutionUpdate} onChange={(e)=>{setInstitutionUpdate(e.target.value)}}  name="floating_company" id="floating_company" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_company" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company (Ex. Google)</label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <select type="tel" onChange={(e)=>{setRoleUpdate(e.target.value)}} name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required>
                <option className='font-medium'>---Select Role---</option>
                    <option value={`user`} selected={roleUpdate == 'user' ? "selected" : ""}>User</option>
                    <option value={'admin'} selected={roleUpdate == 'admin' ? "selected" : ""}>Admin</option>
            </select>
            <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Roles</label>
        </div>
      </div>
      <button type="button" onClick={(e)=>{handleUpdateSubmit(e,visibleModal)}} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>
             :
             showEditPassword === visibleModal ? 
             <form class="max-w-md mx-auto m-5">
      <div class="relative z-0 w-full mb-5 group">
          <input type="password" onChange={(e)=>{setPasswordChange(e.target.value)}} name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Change Password</label>
      </div>
      <button type="button" onClick={(e)=>{handleUpdatePasswordSubmit(e,visibleModal)}} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>
             :
        <div>
              {
            userData.map(item =>
                item.user_id === visibleModal ?
              <div className='flex max-w-2xl'>
              <div class=" px-4 py-5 w-52">
            {Object.keys(item).map(itek=> 
            <>
            <p class=" mt-1 text-sm font-medium text-gray-500 p-2">
                   {itek}
            </p>
             </>)}
             </div>
             <div class=" px-4 py-5 bg-white w-full">
             {Object.values(item).map(ite=> (
                ite == null ?
                <p class="mt-1 text-sm text-gray-900 p-2">no data</p>
                :
             <p class="mt-1 text-sm text-gray-900 p-2">{ite}</p>
              ))}
             </div>
             </div>
             :""
            )
           }
        </div>
        

    }
    </div>
    
</div>
          </div>
          
          
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button type="button" onClick={handleVisibleModal}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>
    </Paper>
    </div>
            
        }
       <ToastContainer/>
    </div>
    </>
  )
}

export default Admin