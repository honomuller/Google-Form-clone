import React, { useState } from "react"
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import {Button} from "@mui/material";

function createData(id, name, calories, fat, carbs, protein, isConnected) {
  return { id, name, calories, fat, carbs, protein, isConnected };
}

const data = [
  createData(1, "Frozen yoghurt", 159, 6.0, 24, 4.0, true),
  createData(2, "Ice cream sandwich", 237, 9.0, 37, 4.3, false),
  createData(3, "Eclair", 262, 16.0, 24, 6.0, false),
  createData(4, "Cupcake", 305, 3.7, 67, 4.3, false),
  createData(5, "Gingerbread", 356, 16.0, 49, 3.9, false)
];

export default function BasicTable() {
  const [rows, setRows] = React.useState(data);
  const handleChangeConnect = (id) => {
    console.log("The id is ", id);
    setRows(
      rows.map((row) => {
        if (row.id == id) {
          return { ...row, isConnected: !row.isConnected };
        } else return { ...row };
      })
    );
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
            <TableCell align="right">Is connected</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color={row.isConnected ? "primary" : "secondary"}
                  onClick={() => {
                    handleChangeConnect(row.id);
                  }}
                >
                  {row.isConnected ? "disconnect" : "connect"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

{/* <form class="w-96 m-5">   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <BsSearch/>
        </div>
        <input onChange={(e)=>{handleSearch(e.target.value)}} type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Here..." required />
        {/* <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> 
    </div>
</form> */}
   {/* <input type='text' onChange={(e)=>{handleSearch(e.target.value)}} className='p-3 text-md font-medium rounded-md border border-blue-300/10'/> */}
   
   {/* <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 max-w-screen-lg mx-auto overflow-x-auto border border-black/5'>
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>

      {
       
      formData.slice(0,1).map((response)=>(
        <><th>No</th>
       { Object.keys(response).slice(1).map(item=>(
          
         
        <th className='px-6 py-3'>{item} </th>
       
       ))}
       </>
      ))
     }
     <th className='px-6 py-3'>Action</th>
     </tr> 
     <tr>
     {formData.slice(0,1).map((response)=>(
      Object.keys(response).map(item=>(
      <td><input type='text' onChange={(e)=>{handleSearchColumn(e.target.value,item)}} className='p-3 text-md font-medium rounded-md border border-blue-300/10'/></td>
       ))
      ))
     }
     </tr>
      </thead>
      <tbody>
      {
      currentItems &&
      currentItems.map((response,index)=>(
        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
        <td>{i++}</td>
       {Object.values(response).slice(1).map(item=>(
        <td className='px-6 py-4'>{item}</td>
       ))}
       
       <td className='p-3'>
       <div className="relative font-[sans-serif] w-max">
        <button onClick={()=>{visibleAction === index ?  setVisibleAction('') : setVisibleAction(index)}} type="button" id="ActionToggle" className="px-4 py-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100 gap-3 ml-20">
         
          <AiOutlineInteraction/>
          {
            visibleAction === index ? <BsChevronUp size={20} />:<BsChevronDown size={20} />
          }
        </button>
  
        <ul id="ActionMenu" className={`${visibleAction === index ? 'absolute block' : 'hidden' } shadow-lg bg-white py-2 min-w-full w-50 rounded-lg max-h-96 overflow-auto`}>
        <li onClick={(e)=>{handleAction(e,'confirm',response.form_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
            View
          </li>
        <li onClick={(e)=>{handleAction(e,'confirm',response.form_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
            Confirm
          </li>
          <li onClick={(e)=>{handleAction(e,'reject',response.form_id)}} className='py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3'>
            Reject
          </li>
        </ul>
      </div>
       </td>
       </tr>
      ))
     }
     
      </tbody>
     </table> */}