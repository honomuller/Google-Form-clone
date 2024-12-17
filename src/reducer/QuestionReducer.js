const rand =  Math.floor(Math.random() * 1000000000)
const initialState={
    FormName:"Untitled Form",
    FormDescription:"Form Description",
    Image:'image',
    Email:'email',
    section:[{
        questionId:`${rand}`,
        questionName:"Untitled Question Name",
        questionType:"radio",
        questionOption:[{optionText:"option 1"}],
        Required:false,
        open:true
      }],
    AcceptAnswer:true
}


export const QuestionReducer=(state=initialState,action)=>{
    switch(action.type){
        case "EXISTINGFORM": return action.payload

        case "ADDQUESTION":return{...state, section: [...state.section, action.payload]}

        case "DELETEQUESTION": return{...state , section: state.section.filter((i,index) => index !== action.payload)}

        case "UPDATEQUESTION": return{...state, section : [...state.section.filter((i,index)=> index==action.payload.index ? i.questionType=action.payload.value : i)]}

        case "UPDATEQUESTIONCONDITION": return{...state, section : [...state.section.filter((i,index)=> index==action.payload.index ? action.payload.value !== 'radio' || action.payload.value !== 'checkbox' ? i.questionOption.splice(1) : i : i)]}

        case "ADDOPTION": return {...state, ...state.section.filter((i,index)=> index===action.payload.index ? i.questionOption.push(action.payload.option) : "" )} 

        case "DELETEOPTION": return {...state, ...state.section.filter((i,index)=> index==action.payload.index ? action.payload.inde>0 ? i.questionOption.splice(action.payload.inde, 1) :" ": "" )}

        case "UPDATEQUESTIONNAME": return{...state, ...state.section.filter((i,index)=> index==action.payload.index ? i.questionName=action.payload.value : "")}

        case "UPDATEOPTIONNAME": return{...state, ...state.section.filter((i,index)=>index==action.payload.index ? i.questionOption.splice(action.payload.inde,1,action.payload.name) :"")}

        case "REQUIRED": return{...state, ...state.section.filter((i,index)=> index==action.payload.index ? i.Required=action.payload.value : i )}

        case "UPDATEFORMNAME": return{...state, FormName: action.payload}
        
        case "UPDATEIMAGE": return{...state, Image: action.payload}

        case "UPDATEFORMDESCRIPTION": return{...state, FormDescription: action.payload}

        case "OPENQUESTION": return{...state, ...state.section.filter((i,index)=> index==action.payload.index ? i.open=action.payload.name : "" )}

        case "CLOSEAPPLICATION": return {...state, AcceptAnswer: action.payload}

        default : return state
    }
}
