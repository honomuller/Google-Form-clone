import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { BsChevronDown, BsChevronUp, BsEye, BsFileExcel, BsList, BsPlus, BsSearch, BsThreeDotsVertical } from 'react-icons/bs'
import { FaFileExcel, FaMinus, FaPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CloseApplication, ExistingForm } from '../action/action'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoLockClosedSharp, IoLockOpen, IoLockOpenSharp } from 'react-icons/io5'
import fileDownload from 'js-file-download'
import { AiOutlineInteraction } from 'react-icons/ai'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TableAction from './editor/TableAction'
import { CiShare1 } from 'react-icons/ci'
//import logo from '../documentAnswer/rwanda logo.jpg'
//import logo from ''

function Response() {
  const [hs,setHs]=useState(false)
  const question = useSelector(state => state.QuestionReducer)
  const user = useSelector(state=>state.UserReducer)
  const [formData,setFormData]=useState([])
  const [singleData,setSingleData]=useState([])
  const [filterData,setFilterData]=useState([])
  const [message,setMessage]=useState('')
  const [visibleAction,setVisibleAction]=useState('')
  const [emailType,setEmailType]=useState('')
  const [searchValue,setSearchValue]=useState('')
  const [searchValueColumn,setSearchValueColumn]=useState('')
  const [column,setColumn]=useState('')
  const [sharedAppType,setSharedAppType]=useState('')
  const [downloadSheet,setDownloadSheet]=useState(false)
  const [excelSheet,setExcelSheet]=useState('')
  const [visibleModal,setVisibleModal]=useState(0)
  const [marks,setMarks]=useState(0)
  const [markCategory,setMarkCategory]=useState([])
  const [userMark,setUserMark]=useState({})

  const id = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  var token
  if(user.isLoggedIn === true){
    token = jwtDecode(JSON.stringify(user.user))
  }

  const handleSearch=(value1)=>{
    setSearchValue(value1)
    const filter = formData.filter(it =>searchValue.toLowerCase() == '' ? it : Object.values(it).toLocaleString().toLowerCase().includes(searchValue.toLowerCase()));
    setFilterData(filter)
  }

  const handleSearchColumn=(value,column)=>{
    setSearchValueColumn(value)
    const filterg = formData.filter(it => Object.keys(it).toLocaleString().toLowerCase().includes(column.toLowerCase()) ? searchValueColumn.toLowerCase() == '' ? it : Object.values(it).toLocaleString().toLowerCase().includes(searchValueColumn.toLowerCase()):it)
    setFilterData(filterg)
  }

  const handleSaveQuestion=(e,value)=>{
    e.preventDefault()
      dispatch(CloseApplication(value))
    const form = new FormData()
    form.append('FormName',question.FormName)
    form.append('FormDescription',question.FormDescription)
    form.append('Email',question.Email)
    form.append('Image',question.Image)
    form.append('section',JSON.stringify(question.section))
    form.append('AcceptAnswer',value)
    form.append('id',id.id)
    axios.post("http://localhost:5000/createForm",form).then((res)=>{
      setTimeout(()=>{
        toast(`${res.data.message}`)
        window.location.reload()
      },2000)
    }).catch((err)=>{
      console.log(err)
    })
  }

  const handleExcelSheet =(e)=> {
    e.preventDefault()
    axios.get(`http://localhost:5000/answer/getExcelSheet/${id.id}`).then(res=>{
        toast(`${res.data.message}`)
    }).catch(err=>{
       console.log(err)
   })
  }

  const handleAction=(e,value,id)=>{
    const data={
      id:id,
      action:value,
      formName:question.FormName
    }
    axios.post(`http://localhost:5000/answer/changeStatus`,data).then(res=>{
      toast(`${res.data}`)
      setVisibleAction(false)
      setTimeout(()=>{
        window.location.reload()
      },2000)
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
      setFilterData(res.data)
     // console.log(res.data)
     }).catch(err=>{
      console.log(err)
     })
     axios.get(`http://localhost:5000/share/getSharedApp/${id.id}/${token.user_id}`).then(res=>{
      setSharedAppType(res.data[0].type)
    }).catch(err=>{
      console.log(err)
    })
    axios.get(`http://localhost:5000/marks/getCategoryForm/${id.id}`).then(res=>{
      setMarkCategory(res.data)
    }).catch(err=>{
      console.log(err)
    })
    }
},[])
var idi = 0 
const columns = []
const rows = []
formData.slice(0,1).map(it => Object.keys(it).map(i=> columns.push({ field: i, headerName: i})))
formData.map((it,index) => rows.push(it))
const paginationModel = { page: 0, pageSize: 100 };
//console.log(columns)
//console.log(rows)
const handleModalShow = (value)=>{
  setVisibleModal(value)
  axios.get(`http://localhost:5000/answer/getFormData/${id.id}/${value}`,).then(res=>{
    setSingleData(res.data)
    setFilterData(res.data)
   // console.log(res.data)
   }).catch(err=>{
    console.log(err)
   })

}


const handleSubmitMarks=(e,value)=>{
  e.preventDefault()
  console.log(userMark)
  const data ={
    id:id.id,
    user:value,
    data:userMark
  }
  axios.post('http://localhost:5000/marks/insertMarks',data).then(res=>{
    toast(`${res.data}`)
  }).then(err=>{
    console.log(err)
  })
}

const itemsPerPage = 100
const [itemOffset, setItemOffset] = useState(0);
var [i, setI] = useState(0)
var sum = 0

const endOffset =  itemOffset+ itemsPerPage;
//console.log(`Loading items from ${itemOffset} to ${endOffset}`);
const currentItems = filterData.slice(itemOffset, endOffset);
const pageCount = Math.ceil(filterData.length / itemsPerPage);

// Invoke when user click to request another page.
const handlePageClick = (event) => {
  const newOffset = (event.selected * itemsPerPage) % filterData.length;
  setItemOffset(newOffset);
  setI(newOffset)
};

var jpg = ".jpg"
var png = ".pnp"
var jpeg = ".jpeg"
  return (
    <>
    <div className='grid grid-cols-1 md:flex md:flex-col items-center justify-center'>
        <div className='w-full flex h-full justify-center items-center'>
     <div className='flex gap-4 items-center'>
   <div className='rounded-md mt-10 m-5 h-full w-[600px] min-w-max mx-auto p-5 shadow-md border border-t-blue-500'>
       <div className='flex justify-between items-center m-4'>
       <p className='text-xl font-bold'>0 Responses</p>  
       <div className='flex gap-4 items-center'>
        {
          downloadSheet ? 
          <Link to={`/fileAnswer/${excelSheet}`} target="_blank" download className='text-md font-medium hover:bg-blue-500/10 p-1 flex gap-2 items-center'> <FaFileExcel/> Download ExcelSheet</Link>
          : 
          <p className='text-md font-medium hover:bg-blue-500/10 p-1 flex gap-2 items-center' onClick={handleExcelSheet}> <FaFileExcel/> Generate to ExcelSheet</p>
       }       
       {/* <BsThreeDotsVertical/> */}
       </div>
       </div> 
       {
       sharedAppType === 'full' ? 
       <label class="inline-flex items-center cursor-pointer m-4">  
       {
        question.AcceptAnswer === "true"
        ? 
        <>
        <IoLockClosedSharp class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300" onClick={(e)=>{handleSaveQuestion(e,false)}} />
        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Close Response</span>
        </>
        :
        <>
        <IoLockOpenSharp class="ms-3 text-sm font-medium text-red-900 dark:text-gray-300" onClick={(e)=>{handleSaveQuestion(e,true)}} />
        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Open Response</span>
        </>
       }       
         
          </label>
          :
          <label class="inline-flex items-center cursor-pointer m-4">  
          {
          question.AcceptAnswer === "true"
           ? 
           <>
           <IoLockClosedSharp class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300" onClick={(e)=>{handleSaveQuestion(e,false)}} />
           <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Close Response</span>
           </>
           :
           <>
           <IoLockOpenSharp class="ms-3 text-sm font-medium text-red-900 dark:text-gray-300" onClick={(e)=>{handleSaveQuestion(e,true)}} />
           <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Open Response</span>
           </>
          }       
            
             </label>
       }
        
     </div>
     </div>
   </div>
   
     <Paper className='text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 max-w-screen-lg mx-auto overflow-x-auto border border-black/5'>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10,  50, 100]}
        getRowId={(row) => row.form_id}
        onRowClick={(rows)=>handleModalShow(rows.id)}
        sx={{ border: 0 }}
        className='w-full'
      />
    <div class={`${visibleModal !==0 ? 'relative' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
          <button type="button" onClick={(e)=>{handleAction(e,"Confirmed",visibleModal)}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto">Confirm</button>
          <button type="button" onClick={(e)=>{handleAction(e,"Rejected",visibleModal)}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto">Reject</button>
          <button type="button" onClick={()=>{}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto">Send Email</button>
          <button type="button" onClick={()=>{marks ? setMarks(0) : setMarks(visibleModal)}}class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-500  hover:text-white sm:mt-0 sm:w-auto">{marks ? <FaMinus/> :<FaPlus/> } Marks</button>
          </div>
          {
            marks ? 
            <form>
             { markCategory.map(item=>(
                 <div className='m-5'>
                 <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{item.categ_name}</label>
                 <div className='flex items-center gap-3'>
                 <input type="number" max={`${item.mark}`} id={item.categ_id} onChange={(e)=>{setUserMark(prev => ({...prev, [e.target.id]: e.target.value}))}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                 <p className='text-xl font-bold'>/{item.mark}</p>
                 </div>
                 </div>
              ))}
                 <button type="button" onClick={(e)=>{handleSubmitMarks(e,visibleModal)}} class="w-fit text-black bg-white-600 hover:bg-blue-700 hover:text-white border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">Save</button>
                 </form>
            :
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            
           <div class="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg m-5">

    <div class="px-4 py-5 sm:px-6">
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Details and informations about user.
        </p>
    </div>
    <div class="border-t border-gray-200 text-gray-500">
        <div>
              {
            singleData.map(item =>
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
              `${ite}`.includes(jpg) ||  `${ite}`.includes(png) ||  `${ite}`.includes(jpeg)
              ?
              <p class="mt-1 text-sm text-gray-900 p-2"> <a href={`/documentAnswer/${ite}`}>Click on Image Here: {ite}</a></p>
              :
             <p class="mt-1 text-sm text-gray-900 p-2">{ite}</p>
              ))}
             </div>
             </div>

            )
           }
        </div>
    </div>
    
</div>
          </div>
          }
          
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button type="button" onClick={()=>{setVisibleModal(0)}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>
    </Paper>
     {/* <p className='flex '>Showing {itemOffset} to {endOffset} of {sum=sum+i} Entries</p> */}
     {/* <ReactPaginate
    breakLabel="..."
    nextLabel="next >"
    onPageChange={handlePageClick}
    pageRangeDisplayed={5}
    pageCount={pageCount}
    previousLabel="< previous"
    renderOnZeroPageCount={null}
    className='flex items-center gap-2'
  /> */}
    </div>
    <ToastContainer/>
    </>
  )
}

export default Response