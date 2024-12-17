import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { BiShareAlt, BiTrash } from 'react-icons/bi'
import { BsChevronDown, BsChevronUp, BsDownload, BsFile, BsFolder, BsFolderPlus, BsPlus, BsSearch, BsThreeDotsVertical } from 'react-icons/bs'
import { CiFileOn, CiShare1 } from 'react-icons/ci'
import { FiFile } from 'react-icons/fi'
import { LuFolderInput } from 'react-icons/lu'
import { MdFileOpen, MdPeopleAlt, MdRestoreFromTrash } from 'react-icons/md'
import { SiGoogledrive } from 'react-icons/si'
import ReactPaginate from 'react-paginate'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { v4 as uuidv4} from 'uuid'

function MyDrive() {
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

    const [visibleDropdown,setVisibleDropdown]=useState(false)
    const [visibleDropdownLocation,setVisibleDropdownLocation]=useState(false)
    const [visibleModalFolder,setVisibleModalFolder]=useState(false)
    const [visibleModalFile,setVisibleModalFile]=useState(false)
    const [sharedFile,setSharedFile]=useState(false)
    const [trashFile,setTrashFile]=useState(false)
    const [showFolder,setShowFolder]=useState('')
    const [visibleDropdownFile,setVisibleDropdownFile]=useState('')
    const [visibleModalShare,setVisibleModalShare]=useState('')
    const [visibleModalMove,setVisibleModalMove]=useState('')
    const [visibleDropdownFolder,setVisibleDropdownFolder]=useState('')
    const [visibleModalShareFolder,setVisibleModalShareFolder]=useState('')


    const [message,setMessage]=useState('')
    const [folderName,setFolderName]=useState('')
    const [fileName,setFileName]=useState('')
    const [userValue,setUserValue]=useState('')
    const [typeValue,setTypeValue]=useState('')
    const [folderValue,setFolderValue]=useState('')
    const [searchValue,setSearchValue]=useState('')

    const [folderData,setFolderData]=useState([])
    const [fileData,setFileData]=useState([])
    const [userNotData,setUserNotData]=useState([])
    const [filterData,setFilterData]=useState([])
    const [deletedFileData,setDeletedFileData]=useState([])
    const [deletedFolderData,setDeletedFolderData]=useState([])
    const [sharedData,setSharedData]=useState([])

    const handleCreateFile=(e)=>{
        e.preventDefault()
        const form = new FormData()
        form.append('file',fileName)
        form.append('user',token.user_id)
        axios.post('http://localhost:5000/drive/uploadFile',form).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }).catch(err=>{
            console.log(err)
        })
        
    }

    const handleCreateFolder=(e)=>{
        e.preventDefault()
        const data ={
            name:folderName,
            user:token.user_id
        }
        axios.post('http://localhost:5000/drive/createFolder',data).then(res=>{
            toast(`${res.data}`)
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }).catch(err=>{
            console.log(err)
        })
    }

    const handleShareFormFile=(e,value)=>{
        e.preventDefault()
        const data={
            app:value,
            user:userValue,
            type:typeValue
          }
          axios.post(`http://localhost:5000/share/shareForm`,data).then(res=>{
            //console.log(res.data)
            toast(`${res.data}`)
            setTimeout(() =>
              window.location.reload()
           ,3000)
             
            
          }).catch(err=>{
            console.log(err)
          })
    }

    const handleMoveFolder=(e,value)=>{
        e.preventDefault()
        const data={
            folder:folderValue,
          }
          axios.put(`http://localhost:5000/drive/moveFileFolder/${value}`,data).then(res=>{
            //console.log(res.data)
            toast(`${res.data}`)
            setTimeout(() =>
              window.location.reload()
           ,3000)
          }).catch(err=>{
            console.log(err)
          })
    }

    const handleDeleteFile=(e,value)=>{
        e.preventDefault()
        axios.put(`http://localhost:5000/drive/deleteFile/${value}`).then(res=>{
            //console.log(res.data)
            toast(`${res.data}`)
            setTimeout(() =>
              window.location.reload()
           ,3000)
          }).catch(err=>{
            console.log(err)
          })
    }

    const handleRestoreFile=(e,value)=>{
      e.preventDefault()
      axios.put(`http://localhost:5000/drive/restoreFile/${value}`).then(res=>{
        toast(`${res.data}`)
        setTimeout(() =>
          window.location.reload()
       ,3000);
      }).catch(err=>{
        console.log(err)
      })
    }

    const handleDeleteFolder=(e,value)=>{
      e.preventDefault()
      axios.put(`http://localhost:5000/drive/deleteFolder/${value}`).then(res=>{
        toast(`${res.data}`)
        setTimeout(() =>
          window.location.reload()
       ,3000);
      }).catch(err=>{
        console.log(err)
      })

    }

    const handleRestoreFolder=(e,value)=>{
      e.preventDefault()
      axios.put(`http://localhost:5000/drive/restoreFolder/${value}`).then(res=>{
        toast(`${res.data}`)
        setTimeout(()=>window.location.reload(),3000)
      }).catch(err=>console.log(err))

    }
    
    useEffect(()=>{
        if(user.isLoggedIn===false){
            navigate('/')
        }
            axios.get(`http://localhost:5000/drive/getFolder/${token.user_id}`).then(res=>{
                setFolderData(res.data)
            }).catch(err=>{
                console.log(err)
            })
            axios.get(`http://localhost:5000/drive/getFile/${token.user_id}`).then(res=>{
                setFileData(res.data.response)
                setFilterData(res.data.response)
                // setMessage(res.data.message)
            }).catch(err=>{
                console.log(err)
            })
            axios.get(`http://localhost:5000/user/usersNotId/${token.user_id}`).then(res=>{
                // console.log(res.data)
                  setUserNotData(res.data)
              }).catch(err=>{
                  console.log(err)
              })
              axios.get(`http://localhost:5000/drive/deletedFile/${token.user_id}`).then(res=>{
                // console.log(res.data)
                  setDeletedFileData(res.data)
              }).catch(err=>{
                  console.log(err)
              })

              axios.get(`http://localhost:5000/drive/deletedFolder/${token.user_id}`).then(res=>{
                // console.log(res.data)
                  setDeletedFolderData(res.data)
              }).catch(err=>{
                  console.log(err)
              })

              axios.get(`http://localhost:5000/drive/sharedFile/${token.user_id}`).then(res=>{
                // console.log(res.data)
                  setSharedData(res.data)
              }).catch(err=>{
                  console.log(err)
              })
        
    },[])
   
    const itemsPerPage = 100
const [itemOffset, setItemOffset] = useState(0);
var [i, setI] = useState(0)
var sum = 0

const endOffset =  itemOffset+ itemsPerPage;
//console.log(`Loading items from ${itemOffset} to ${endOffset}`);
const currentItems = fileData.filter(it => searchValue.toLowerCase() ==='' ? it : it.filename.toLowerCase().includes(searchValue.toLowerCase())).slice(itemOffset, endOffset);
const currentItemtrash = deletedFileData.filter(it => searchValue.toLowerCase() ==='' ? it : it.filename.toLowerCase().includes(searchValue.toLowerCase())).slice(itemOffset, endOffset);
const currentItemshared = sharedData.filter(it => searchValue.toLowerCase() ==='' ? it : it.filename.toLowerCase().includes(searchValue.toLowerCase())).slice(itemOffset, endOffset);
const pageCount = Math.ceil(fileData.length / itemsPerPage);

// Invoke when user click to request another page.
const handlePageClick = (event) => {
  const newOffset = (event.selected * itemsPerPage) % fileData.length;
  setItemOffset(newOffset);
  setI(newOffset)
};
const handlePageClickDeleted = (event) => {
  const newOffset = (event.selected * itemsPerPage) % deletedFileData.length;
  setItemOffset(newOffset);
  setI(newOffset)
};

const handlePageClickShared = (event) => {
  const newOffset = (event.selected * itemsPerPage) % sharedData.length;
  setItemOffset(newOffset);
  setI(newOffset)
};

  return (
    <>
    <div className=' bg-slate-300/10 p-5'>
    <div className='mx-auto max-w-screen-lg'>
     <div className='flex-col justify-between p-5'>
         <div class="flex items-center w-96 mx-auto max-w-screen-lg">   
    <label for="voice-search" class="sr-only">Search</label>
    <div class="md:relative w-full">
        <div class="md:absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <BsSearch/>
        </div>
        <input type="text" onChange={(e)=>{setSearchValue(e.target.value)}} id="voice-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search File..."/>
    </div>
     </div>
     <div className='flex items-center justify-center mt-5 gap-2'>
     <div className="relative font-[sans-serif] w-max" onMouseOver={()=>{setVisibleDropdown(true)}} onMouseOut={()=>{setVisibleDropdown(false)}}>
      <button  type="button" id="dropdownToggle" className="p-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100 gap-3 ml-5">
        <BsPlus/> Add New
        {
          visibleDropdown ? <BsChevronUp size={20} />:<BsChevronDown size={20} />
        }
      </button>

      <ul id="dropdownMenu" className={`${visibleDropdown ? 'absolute block' : 'hidden' } shadow-lg bg-white py-1 min-w-full w-52 rounded-lg max-h-96 overflow-auto`}>
      <li onClick={()=>{setVisibleModalFile(true)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <CiFileOn  size={20}/>
          File
        </li>
      <li  onClick={()=>{setVisibleModalFolder(true)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <BsFolder size={20}/>
          Folder
        </li>
      </ul>
      <div class={`${visibleModalFolder ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
<div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
    <form class=" w-full">
      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <BsFolder size={30} />
          </div>
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Create Folder Here!!</h3>
            {
              message ? <p className='p-2 text-xl font-medium bg-green-400/10'>{message}</p> : ""
            }
              
              <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name Folder</label>
               <input type="text" id="voice-search" onChange={(e)=>{setFolderName(e.target.value)}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Folder name" required />
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button type="button" onClick={handleCreateFolder} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Create</button>
        <button type="button" onClick={()=>{setVisibleModalFolder('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>
<div class={`${visibleModalFile ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
<div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
    <form class=" w-full">
      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <CiFileOn siz={30} />
          </div>
          <form enctype='multipart/form-data'>
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Upload Files Here!!</h3>
            {
              message ? <p className='p-2 text-xl font-medium bg-green-400/10'>{message}</p> : ""
            }
              <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload File</label>
               <input type="file" name='file' id="voice-search" onChange={(e)=>{setFileName(e.target.files[0])}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Folder name" required />
          </div>
          </form>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button type="button" onClick={handleCreateFile} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Upload</button>
        <button type="button" onClick={()=>{setVisibleModalFile('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>
    </div>

    <div className="relative font-[sans-serif] w-max" onMouseOver={()=>{setVisibleDropdownLocation(true)}} onMouseOut={()=>{setVisibleDropdownLocation(false)}}>
      <button  type="button" id="dropdownToggle" className="p-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100 gap-3 ml-5">
        <BsFolder/> Location
        {
          visibleDropdownLocation ? <BsChevronUp size={20} />:<BsChevronDown size={20} />
        }
      </button>

      <ul id="dropdownMenu" className={`${visibleDropdownLocation ? 'absolute block' : 'hidden' } shadow-lg bg-white py-1 min-w-full w-52 rounded-lg max-h-96 overflow-auto`}>
      <li onClick={()=>{setSharedFile(false);setTrashFile(false)}}className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <SiGoogledrive size={20}/>
          My Files
        </li>
      <li onClick={()=>{setSharedFile(true);setTrashFile(false)}}className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <MdPeopleAlt size={20}/>
          Shared Files
        </li>
        <li onClick={()=>{setTrashFile(true);setSharedFile(false)}}className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
          <BiTrash size={20}/>
          Trashed
        </li>
      </ul>
    </div>
     </div>
     </div>
    </div>
    </div>
    <div className=' bg-white p-5'>
    <div className='mx-auto max-w-screen-lg'>
      {
        sharedFile ?
        <>
        <div className='flex-col'>
      <p className='text-md font-bold'>Shared Files</p>
  
      <div class="md:relative overflow-x-auto m-5">
     <table class="relative w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
         <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
             <tr>
                 <th scope="col" class="px-6 py-3">
                     File name
                 </th>
                 <th scope="col" class="px-6 py-3">
                     User
                 </th>
                 <th scope="col" class="px-6 py-3">
                   
                 </th>
             </tr>
         </thead>
         <tbody>
             {currentItemshared.map(item =>(
             <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                 <td class="px-6 py-4 gap-4 items-center hidden">
                     {sum++}
                 </td>
                 <td class="px-6 py-4 flex gap-4 items-center">
                     <FiFile/>{item.filename}
                 </td>
                 <td class="px-6 py-4">
                     {item.user_id == token.user_id ? "me" : "shared to me"}
                 </td>
                 <td class="px-6 py-4">
                      <div className="relative font-[sans-serif] w-max mx-auto" onMouseOver={()=>{setVisibleDropdownFile(item.app_id)}} onMouseOut={()=>{setVisibleDropdownFile('')}}>
                      <BsThreeDotsVertical/>
                      {
                        item.type === "full" ? 
                        <ul id="dropdownMenu" className={`${visibleDropdownFile === item.app_id ? 'fixed' : 'hidden' } shadow-lg bg-white py-2 w-50 rounded-lg max-h-96 overflow-auto`}>
       <Link to={`/fileAnswer/${item.filename}`}  target="_blank" download><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BsDownload size={20}/>
           Download File
         </li></Link>
       <li onClick={()=>{setVisibleModalShare(item.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BiShareAlt size={20}/>
           Share File
         </li>
         <li onClick={()=>{setVisibleModalMove(item.app_id)}}  className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <LuFolderInput size={20}/>
           Move to Folder
         </li>
         <li onClick={(e)=>{handleDeleteFile(e,item.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BiTrash size={20}/>
           Move to Trash
         </li>
       </ul>
                        :
                        item.type === 'partial' ?
                        <ul id="dropdownMenu" className={`${visibleDropdownFile === item.app_id ? 'fixed' : 'hidden' } shadow-lg bg-white py-2 w-50 rounded-lg max-h-96 overflow-auto`}>
       <Link to={`/fileAnswer/${item.filename}`}  target="_blank" download><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BsDownload size={20}/>
           Download File
         </li></Link>
       </ul>
       :<></>

                      }
                      
     </div>
                 </td>
             </tr>
                 ))
             }
         </tbody>
     </table>
     <p className='flex '>Showing {itemOffset} to {endOffset} of {sum=sum+i} Entries</p>
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
 </div>
      </div>
      </>
        :

        trashFile ? 
        <>
        <div className='flex-col'>
        <p className='text-md font-bold'>Trash Folders</p>
        <div className='flex'>
        {
            deletedFolderData.map(item=>(
                <div onClick={()=>{setShowFolder(item.folder_id)}} className='flex items-center justify-between bg-slate-400/10 m-5 p-2 rounded-xl w-36'>
                <p className='flex gap-3 items-center p-2'> <BsFolder/>{item.folder_name}</p>
                <div className="relative font-[sans-serif] w-max mx-auto" onMouseOver={()=>{setVisibleDropdownFolder(item.folder_id)}} onMouseOut={()=>{setVisibleDropdownFolder('')}}>
                <BsThreeDotsVertical/>
 <ul id="dropdownMenu" className={`${visibleDropdownFolder === item.folder_id ? 'fixed' : 'hidden' } shadow-lg bg-white py-2 w-50 rounded-lg max-h-96 overflow-auto`}>
 <li onClick={(e)=>{handleRestoreFolder(e,item.folder_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <MdRestoreFromTrash size={20}/>
           Restore Folder
         </li>
 </ul>
</div>
</div>
            ))
        }
        </div>
     </div> 
        <div className='flex-col'>
      <p className='text-md font-bold'>Trash Files</p>
  
      <div class="md:relative overflow-x-auto m-5">
     <table class="relative w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
         <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
             <tr>
                 <th scope="col" class="px-6 py-3">
                     File name
                 </th>
                 <th scope="col" class="px-6 py-3">
                     User
                 </th>
                 <th scope="col" class="px-6 py-3">
                   
                 </th>
             </tr>
         </thead>
         <tbody>
             {currentItemtrash.map(item =>(
             <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                 <td class="px-6 py-4 gap-4 items-center hidden">
                     {sum++}
                 </td>
                 <td class="px-6 py-4 flex gap-4 items-center">
                     <FiFile/>{item.filename}
                 </td>
                 <td class="px-6 py-4">
                     {item.user_id == token.user_id ? "me" : "shared to me"}
                 </td>
                 <td class="px-6 py-4">
                      <div className="relative font-[sans-serif] w-max mx-auto" onMouseOver={()=>{setVisibleDropdownFile(item.app_id)}} onMouseOut={()=>{setVisibleDropdownFile('')}}>
                      <BsThreeDotsVertical/>
       <ul id="dropdownMenu" className={`${visibleDropdownFile === item.app_id ? 'fixed' : 'hidden' } shadow-lg bg-white py-2 w-50 rounded-lg max-h-96 overflow-auto`}>
       
       <li onClick={(e)=>{handleRestoreFile(e,item.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <MdRestoreFromTrash size={20}/>
           Restore File
         </li>
       </ul>
     </div>
                 </td>
             </tr>
                 ))
             }
         </tbody>
     </table>
     <p className='flex '>Showing {itemOffset} to {endOffset} of {sum=sum+i} Entries</p>
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
 </div>
      </div>
      </>
        : 
        <>
        <div className='flex-col'>
        <p className='text-md font-bold'>Suggested Folders</p>
        <div className='flex'>
        <div onClick={()=>{setShowFolder('')}} className='flex items-center justify-between bg-slate-400/10 m-5 p-2 rounded-xl w-36'>
                <p className='flex gap-3 items-center p-2'> <BsFolder/>All Files</p>
                <BsThreeDotsVertical/>
                </div>
        {
            folderData.map(item=>(
                <div onClick={()=>{setShowFolder(item.folder_id)}} className='flex items-center justify-between bg-slate-400/10 m-5 p-2 rounded-xl w-36'>
                <p className='flex gap-3 items-center p-2'> <BsFolder/>{item.folder_name}</p>
                <div className="relative font-[sans-serif] w-max mx-auto" onMouseOver={()=>{setVisibleDropdownFolder(item.folder_id)}} onMouseOut={()=>{setVisibleDropdownFolder('')}}>
                <BsThreeDotsVertical/>
 <ul id="dropdownMenu" className={`${visibleDropdownFolder === item.folder_id ? 'fixed' : 'hidden' } shadow-lg bg-white py-2 w-50 rounded-lg max-h-96 overflow-auto`}>
   <li onClick={(e)=>{handleDeleteFolder(e,item.folder_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
     <BiTrash size={20}/>
     Move to Trash
   </li>
 </ul>
</div>
</div>
            ))
        }
        </div>
     </div> 
      <div className='flex-col'>
      <p className='text-md font-bold'>Suggested Files</p>
  
      <div class="md:relative overflow-x-auto m-5">
     <table class="relative w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
         <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
             <tr>
                 <th scope="col" class="px-6 py-3">
                     File name
                 </th>
                 <th scope="col" class="px-6 py-3">
                     User
                 </th>
                 <th scope="col" class="px-6 py-3">
                   
                 </th>
             </tr>
         </thead>
         <tbody>
             {currentItems.map(item =>(
                 item.folder_id === showFolder ? 
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                 <td class="px-6 py-4 gap-4 items-center hidden">
                     {sum++}
                 </td>
                 <td class="px-6 py-4 flex gap-4 items-center">
                     <FiFile/>{item.filename}
                 </td>
                 <td class="px-6 py-4">
                     {item.user_id == token.user_id ? "me" : "shared to me"}
                 </td>
                 <td class="px-6 py-4">
                      <div className="relative font-[sans-serif] w-max mx-auto" onMouseOver={()=>{setVisibleDropdownFile(item.app_id)}} onMouseOut={()=>{setVisibleDropdownFile('')}}>
                      <BsThreeDotsVertical/>
       <ul id="dropdownMenu" className={`${visibleDropdownFile === item.app_id ? 'fixed' : 'hidden' } shadow-lg bg-white py-2 w-50 rounded-lg max-h-96 overflow-auto`}>
       <Link to={`/fileAnswer/${item.filename}`}  target="_blank" download><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BsDownload size={20}/>
           Download File
         </li></Link>
       <li onClick={()=>{setVisibleModalShare(item.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BiShareAlt size={20}/>
           Share File
         </li>
         <li onClick={()=>{setVisibleModalMove(item.app_id)}}  className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <LuFolderInput size={20}/>
           Move to Folder
         </li>
 
         <li onClick={(e)=>{handleDeleteFile(e,item.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BiTrash size={20}/>
           Move to Trash
         </li>
       </ul>
     </div>
                 </td>
                 <div class={`${visibleModalShare===item.app_id ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
             <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Share The File Here!!</h3>
          
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
         <button type="button" onClick={(e)=>{handleShareFormFile(e,item.app_id)}} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Share</button>
         <button type="button" onClick={()=>{setVisibleModalShare('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
       </div>
       </form>
     </div>
   </div>
 </div>
 </div>
 <div class={`${visibleModalMove===item.app_id ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-titlee" role="dialog" aria-modal="true">
 <div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
   <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
     <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
     <form class=" w-full">
       <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
         <div class="sm:flex sm:items-start">
           <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
           <LuFolderInput />
           </div>
           <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
             <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Move to The Folder Here!!</h3>
             
               <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Folder :</label>
               <select onChange={(e)=>{setFolderValue(e.target.value)}} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                   <option selected>Choose Folder</option>
                   { folderData.map(folder=>(
                     <option value={folder.folder_id}>{folder.folder_name}</option>
                   ))}
               </select>
           </div>
         </div>
       </div>
       <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
         <button type="button" onClick={(e)=>{handleMoveFolder(e,item.app_id)}} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Move</button>
         <button type="button" onClick={()=>{setVisibleModalMove('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
       </div>
       </form>
     </div>
   </div>
 </div>
 </div>
             </tr>
             :
             showFolder === '' ?
             <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                 <td class="px-6 py-4 gap-4 items-center hidden">
                     {sum++}
                 </td>
                 <td class="px-6 py-4 flex gap-4 items-center">
                     <FiFile/>{item.filename}
                 </td>
                 <td class="px-6 py-4">
                     {item.user_id == token.user_id ? "me" : "shared to me"}
                 </td>
                 <td class="px-6 py-4">
                      <div className="relative font-[sans-serif] w-max mx-auto" onMouseOver={()=>{setVisibleDropdownFile(item.app_id)}} onMouseOut={()=>{setVisibleDropdownFile('')}}>
                      <BsThreeDotsVertical/>
       <ul id="dropdownMenu" className={`${visibleDropdownFile === item.app_id ? 'fixed' : 'hidden' } shadow-lg bg-white py-2 w-50 rounded-lg max-h-96 overflow-auto`}>
       <Link to={`/fileAnswer/${item.filename}`}  target="_blank" download><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BsDownload size={20}/>
           Download File
         </li></Link>
       <li onClick={()=>{setVisibleModalShare(item.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BiShareAlt size={20}/>
           Share File
         </li>
         <li onClick={()=>{setVisibleModalMove(item.app_id)}}  className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <LuFolderInput size={20}/>
           Move to Folder
         </li>
 
         <li onClick={(e)=>{handleDeleteFile(e,item.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
           <BiTrash size={20}/>
           Move to Trash
         </li>
       </ul>
     </div>
                 </td>
                 <div class={`${visibleModalShare===item.app_id ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
             <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Share The File Here!!</h3>
          
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
         <button type="button" onClick={(e)=>{handleShareFormFile(e,item.app_id)}} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Share</button>
         <button type="button" onClick={()=>{setVisibleModalShare('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
       </div>
       </form>
     </div>
   </div>
 </div>
 </div>
 <div class={`${visibleModalMove===item.app_id ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-titlee" role="dialog" aria-modal="true">
 <div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
   <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
     <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
     <form class=" w-full">
       <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
         <div class="sm:flex sm:items-start">
           <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
           <LuFolderInput />
           </div>
           <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
             <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Move to The Folder Here!!</h3>
             
               <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Folder :</label>
               <select onChange={(e)=>{setFolderValue(e.target.value)}} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                   <option selected>Choose Folder</option>
                   { folderData.map(folder=>(
                     <option value={folder.folder_id}>{folder.folder_name}</option>
                   ))}
               </select>
           </div>
         </div>
       </div>
       <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
         <button type="button" onClick={(e)=>{handleMoveFolder(e,item.app_id)}} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Move</button>
         <button type="button" onClick={()=>{setVisibleModalMove('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
       </div>
       </form>
     </div>
   </div>
 </div>
 </div>
             </tr>:<></>
                 ))
             }
 
 
             
         </tbody>
     </table>
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
 </div>
      </div>
      </>
      }
    
    
     </div>
     <ToastContainer/>
    </div>
    </>
  )
}

export default MyDrive


// <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//                 <td class="px-6 py-4">
//                     {item.filename}
//                 </td>
//                 <td class="px-6 py-4">
//                     {item.user_id == token.user_id ? "me" : "shared to me"}
//                 </td>
//                 <td class="px-6 py-4">
//                      <div className="relative font-[sans-serif] w-max mx-auto" onMouseOver={()=>{setVisibleDropdownFile(item.app_id)}} onMouseOut={()=>{setVisibleDropdownFile('')}}>
//                      <BsThreeDotsVertical/>
//       <ul id="dropdownMenu" className={`${visibleDropdownFile === item.app_id ? 'fixed' : 'hidden' } shadow-lg bg-white py-2 w-50 rounded-lg max-h-96 overflow-auto`}>
//       <Link to={`/fileAnswer/${item.filename}`}  target="_blank" download><li className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
//           <BsDownload size={20}/>
//           Download File
//         </li></Link>
//       <li onClick={()=>{setVisibleModalShare(item.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
//           <BiShareAlt size={20}/>
//           Share File
//         </li>
//         <li onClick={()=>{setVisibleModalMove(item.app_id)}}  className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
//           <LuFolderInput size={20}/>
//           Move to Folder
//         </li>

//         <li onClick={(e)=>{handleDeleteFile(e,item.app_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
//           <BiTrash size={20}/>
//           Move to Trash
//         </li>
//       </ul>
//     </div>
//                 </td>
//                 <div class={`${visibleModalShare===item.app_id ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
// <div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
//   <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//     <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
//     <form class=" w-full">
//       <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
//         <div class="sm:flex sm:items-start">
//           <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//           <CiShare1 />
//           </div>
//           <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
//             <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Share The File Here!!</h3>
         
//               <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Users :</label>
//               <select onChange={(e)=>{setUserValue(e.target.value)}} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
//                   <option selected>Choose a User</option>
//                   { userNotData.map(user=>(
//                     <option value={user.user_id}>{user.email}</option>
//                   ))}
//               </select>
//               <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Type :</label>
//             <select onChange={(e)=>{setTypeValue(e.target.value)}} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
//                 <option selected>Choose a Type</option>
//                   <option value="full">Full Access</option>
//                   <option value="partial">Partial Access</option>
//             </select>
//           </div>
//         </div>
//       </div>
//       <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//         <button type="button" onClick={(e)=>{handleShareFormFile(e,item.app_id)}} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Share</button>
//         <button type="button" onClick={()=>{setVisibleModalShare('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
//       </div>
//       </form>
//     </div>
//   </div>
// </div>
// </div>
// <div class={`${visibleModalMove===item.app_id ? 'relative' : 'hidden'} z-10`} aria-labelledby="modal-titlee" role="dialog" aria-modal="true">
// <div class="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75">
//   <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//     <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
//     <form class=" w-full">
//       <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
//         <div class="sm:flex sm:items-start">
//           <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//           <LuFolderInput />
//           </div>
//           <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
//             <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Move to The Folder Here!!</h3>
            
//               <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Folder :</label>
//               <select onChange={(e)=>{setFolderValue(e.target.value)}} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
//                   <option selected>Choose Folder</option>
//                   { folderData.map(folder=>(
//                     <option value={folder.folder_id}>{folder.folder_name}</option>
//                   ))}
//               </select>
//           </div>
//         </div>
//       </div>
//       <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//         <button type="button" onClick={(e)=>{handleMoveFolder(e,item.app_id)}} class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Move</button>
//         <button type="button" onClick={()=>{setVisibleModalMove('');setVisibleDropdown('')}}class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
//       </div>
//       </form>
//     </div>
//   </div>
// </div>
// </div>
//             </tr>