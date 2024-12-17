import React, { useState } from 'react'

function Otp({value}) {
    const [otpValue,setOtpValue]=useState('')
    const data = value
    console.log(data)

    const handleSubmit=(e)=>{
        e.preventdefault()
    }
  return (
   
        <form onSubmit={handleSubmit}>
            <div className='p-5 border rounded-md shadow-md flex-col w-96 bg-white'>
            <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your OTP Code</label>
<div class="relative mb-6">
  <input type="text" onChange={(e)=>{setOtpValue(e.target.value)}} id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="OTP code here..." required/>
</div>
            </div>
            <div className='w-full flex items-center justify-center p-5'>
            <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign In</button>
            </div>
        </form>

  )
}

export default Otp