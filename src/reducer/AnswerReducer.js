const initialState={
    FormName:"Untitled Form",
    FormDescription:"Form Description",
    section:[{
        questionName:"Untitled Question Name",
        questionType:"radio",
        questionOption:[{optionText:"option 1"}],
        Required:false,
        open:true
      }]
}

const AnswerReducer=(state=initialState,action)=>{
    switch(action.type){
        case "EXISTINGFORMANSWER": return action.payload
        case "TEXTANSWER": return {...state, ...state.section.filter((i,index)=>index===action.payload.index ? i.questionOption.filter((ii,inde)=>inde===action.payload.inde ? ii.optionText=action.payload.value :ii ): i )}
        case "TEXTAREA": return {...state, ...state.section.filter((i,index)=>index===action.payload.index ? i.questionOption.filter((ii,inde)=>inde===action.payload.inde ? ii.optionText=action.payload.value :ii ): i )}
        case "RADIOANSWER" : return {...state, ...state.section.filter((i,index)=>index===action.payload.index ? i.questionOption.splice(action.payload.inde,1,action.payload.value) : i )}
        default: return{...state}
    }
}

export {AnswerReducer}