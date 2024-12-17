import React, { useEffect, useState } from 'react'
import Navbar from './layout/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { BsPlus, BsTable, BsTrash } from 'react-icons/bs'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { BiSolidEdit } from 'react-icons/bi'

const MarksCompose = () => {
    const questions = useSelector(state=> state.QuestionReducer)
    const user = useSelector(state=>state.UserReducer)
    const sidebar = useSelector(state=>state.sidebarReducer)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const id = useParams()
    var token

    if(user.isLoggedIn === true){
        token = jwtDecode(JSON.stringify(user.user))
    }
    const [category,setCategory]=useState('')
    const [mark,setMark]=useState('')
    const [categoryUpdate,setCategoryUpdate]=useState('')
    const [markUpdate,setMarkUpdate]=useState('')
    const [idUpdate,setIdUpdate]=useState('')
    const [categoryData,setCategoryData]=useState([])
    const [showForm,setForm]=useState(false)
    const [showUpdate,setUpdateShow]=useState(false)

    const handleSubmit=(e)=>{
        e.preventDefault()
        const data = {
            id:id.id,
            category:category,
            mark:mark
        }
        axios.post(`http://localhost:5000/marks/insertCategory`,data).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>{window.location.reload()},3000)
        }).catch(err=>{
            console.log(err)
        })

    }
    useEffect(()=>{
        if(user.isLoggedIn===false){
            navigate('/')
        }else{
            axios.get(`http://localhost:5000/marks/getCategory/${id.id}`).then(res=>{
                setCategoryData(res.data)
            }).catch(err=>{
                console.log(err)
            })
        }

    },[])

    const handleUpdateData=(e,value)=>{
        e.preventDefault()
        setUpdateShow(true)
        setForm(false)
        axios.get(`http://localhost:5000/marks/getCategoryId/${value}`).then(res=>{
            setCategoryUpdate(res.data[0].categ_name)
            setMarkUpdate(res.data[0].mark)
            setIdUpdate(res.data[0].categ_id)

        }).catch(err=>{
            console.log(err)
        })
    }

    const handleSubmitUpdate=(e)=>{
        e.preventDefault()
        const data={
            id:idUpdate,
            category:categoryUpdate,
            mark:markUpdate
        }
        axios.put('http://localhost:5000/marks/updateCategory',data).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>{window.location.reload()},3000)
        }).catch(err=>{
            console.log(err)
        })
    }

    const handleDelete=(e,value)=>{
        e.preventDefault()
        axios.delete(`http://localhost:5000/marks/deleteCategory/${value}`).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>{window.location.reload()},3000)
        }).catch(err=>{
            console.log(err)
        })
    }
  return (
    <>
    <Navbar/>
    <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col justify-start'>
         <div className='m-5'>
            <p className='text-xl font-medium'>Marking Schema</p>
         </div>
         <button onClick={()=>{showForm ? setForm(false) :setForm(true)}} class="flex items-center gap-2 w-fit text-black bg-white-600 hover:bg-blue-700 hover:text-white border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"><BsPlus/> Add</button>
         {
            showForm ?
            <div className='p-5 w-96'>
            <form  onSubmit={handleSubmit} class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                
                 <div>
                     <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category name</label>
                     <input type="text" onChange={(e)=>{setCategory(e.target.value)}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                 </div>
                 <div>
                     <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">mark</label>
                     <input type="number" onChange={(e)=>{setMark(e.target.value)}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                 </div>
                
                 <button type="submit" class="w-full text-black bg-white-600 hover:bg-blue-700 hover:text-white border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">Save</button>
             </form>
            </div>
             :
             showUpdate ?
             <div className='p-5 w-96'>
            <form  onSubmit={handleSubmitUpdate} class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                
                 <div>
                     <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category name</label>
                     <input type="text" defaultValue={categoryUpdate} onChange={(e)=>{setCategoryUpdate(e.target.value)}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                 </div>
                 <div>
                     <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">mark</label>
                     <input type="number" defaultValue={markUpdate} onChange={(e)=>{setMarkUpdate(e.target.value)}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                     <input type="number" defaultValue={idUpdate} onChange={(e)=>{setIdUpdate(e.target.value)}} class="hidden bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                
                 </div>
                
                 <button type="submit" class="w-full text-black bg-white-600 hover:bg-blue-700 hover:text-white border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">Update</button>
             </form>
            </div>
             :
             <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 m-5 border shadow-md'>
           
               <tr>
                 <th className='px-6 py-3'>Category</th>
                 <th className='px-6 py-3'>Mark</th>
                 <th className='px-6 py-3'>Action</th>
               </tr>
             
                {
                    categoryData.map(item=>(
                     <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 p-3'>
                 <td className='px-6 py-3'>{item.categ_name}</td>
                 <td className='px-6 py-3'>{item.mark}</td>
                 <td className='flex items-center gap-3 px-6 py-3'><BsTrash size={20} onClick={(e)=>{handleDelete(e,item.categ_id)}}/><BiSolidEdit size={20} onClick={(e)=>{handleUpdateData(e,item.categ_id)}}/></td>
                      </tr>
                    ))
                }
           </table>
         }
         
        </div>
        <div>
        </div>
        <ToastContainer/>
    </div>
    </>
  )
}

export default MarksCompose