import React, { useState } from 'react'
import { AiOutlineInteraction } from 'react-icons/ai'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'

function TableAction({id}) {
    const [visibleAction,setVisibleAction]=useState('')

  return (
    <div className="relative font-[sans-serif] w-max">
    <button onClick={()=>{visibleAction === id ?  setVisibleAction('') : setVisibleAction(id)}} type="button" id="ActionToggle" className="px-4 py-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100 gap-3 ml-20">
     
      <AiOutlineInteraction/>
      {
        visibleAction === id ? <BsChevronUp size={20} />:<BsChevronDown size={20} />
      }
    </button>

    <ul id="ActionMenu" className={`${visibleAction === id ? 'absolute block' : 'hidden' } shadow-lg bg-white py-2 min-w-full w-50 rounded-lg max-h-96 overflow-auto`}>
    <li onClick={(e)=>{}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
        View
      </li>
    <li onClick={(e)=>{}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
        Confirm
      </li>
      <li onClick={(e)=>{}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
        Reject
      </li>
    </ul>
  </div>
  )
}

export default TableAction