import React, { useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import FormQuestion from '../FormQuestion';
import QuestionData from '../Question';
import Response from '../Response';
import { DragDropContext,Draggable,Droppable } from 'react-beautiful-dnd';

function TabQuestion() {
  const [data,setData]=useState([
    {id:"1",name:"hello",age:33},{id:"2",name:"koko",age:90},
    {id:"3",name:"kokokg",age:30},{id:"4",name:"ldpkoko",age:9}
  ])
  const handleDragDrop=(results)=>{
    const {source, destination,type} = results
    if(!destination) return;
    if(source.droppableId === destination.droppableId && source.index===destination.index) return;

    if(type === "group"){
      const order = [...data]

      const sourceIndex = source.index
      const destinationIndex = destination.index
      const [remove] = order.splice(sourceIndex,1)
      order.splice(destinationIndex,0,remove)

      return setData(order)
    }
  }
  return (
    <div className='flex justify-center items-center'>
    <DragDropContext onDragEnd={handleDragDrop}>
    <Droppable droppableId="root" type="group" className='flex-col justify-between items-center gap-4 bg-slate-400'>
      {
        (provided)=>(
          <div {...provided.droppableProps} ref={provided.innerRef}>
          {
            data.map((item,index)=>(
              <Draggable draggableId={item.id} key={item.id} index={index} className='flex bg-gray-50'>
              {(provided)=>(
                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                 <h1>{item.name}</h1>
                 <h5>{item.age}</h5>
                 </div>
              )}
              </Draggable>
            ))
          }
          {provided.placeholder}
          </div>
        )
      }
    </Droppable>
    </DragDropContext>
  </div>
  )
}

export default TabQuestion