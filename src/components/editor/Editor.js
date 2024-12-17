import React, { useMemo, useRef, useState } from 'react'
import JoditEditor from 'jodit-react'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';


const Editor=({id})=>{
  const options = [ 'bold', 'italic', '|', 'ul', 'ol', '|', 'font', 'fontsize', '|', 'outdent', 'indent', 'align', '|', 'hr', '|', 'fullsize', 'brush', '|', 'table', 'link','image', '|', 'undo', 'redo',];
  const config = useMemo(
    () => ({
    readonly: false,
    placeholder: '',
    defaultActionOnPaste: 'insert_as_html',
    defaultLineHeight: 1.5,
    enter: 'div',
    buttons: options,
    buttonsMD: options,
    buttonsSM: options,
    buttonsXS: options,
    statusbar: false,
    sizeLG: 900,
    sizeMD: 700,
    sizeSM: 400,
    toolbarAdaptive: false,
    }),
    [],
   );
   const editor = useRef(null);
   //const [data,setData]=useState({})
   const [review,setReview]=useState('')
   const [confirm,setConfirm]=useState('')
   const [reject,setReject]=useState('')
   const [content, setContent] = useState('');
   const [emailType,setEmailType]=useState('')

   const handleEmails=(e)=>{
    e.preventDefault()
    const data = {
      content:content,
      type:emailType,
      id:id
    }
    axios.post(`http://localhost:5000/email/insertEmail`,data).then(dt=>{
      toast(`${dt.data}`)
    }).catch(err=>{
      console.log(err)
    })
  }
  return (
    <>
    <div className='p-5'>
    <label className='m-5 text-md font-medium'>Choose Emai Type:</label>
    <select onChange={(e)=>{setEmailType(e.target.value)}} id="countries" class="bg-gray-50 m-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected>Choose a Email Type</option>
        <option value="review">Review Email</option>
        <option value='confirm'>Confirmation Email</option>
        <option value='reject'>Rejection Email</option>
      </select>
    <label className='m-5 text-md font-medium'>Compose Review Emai:</label>
    <JoditEditor
    ref={editor}
     value={''}
      config={config}
      tabIndex={1}
      className='m-5'
      onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={newContent => {}}
    />
    </div>
    <div className='flex items-center justify-center'>
          <button onClick={handleEmails} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Save</button>
         </div>
         <ToastContainer/>
    </>
  )

}

export default Editor