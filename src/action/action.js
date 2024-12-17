export const AddQuestion =(question)=> {
    return{
        type: "ADDQUESTION",
        payload:question
    }
}

export const AddOption =(option)=> {
    return{
        type: "ADDOPTION",
        payload:option
    }
}

export const DeleteOption =(option)=> {
    return{
        type: "DELETEOPTION",
        payload:option
    }
}

export const DeleteQuestion =(index)=> {
    return{
        type: "DELETEQUESTION",
        payload:index
    }
}

export const CopyQuestion =(index)=> {
    return{
        type: "COPYQUESTION",
        payload:index
    }
}


export const UpdateQuestion =(question)=> {
    return{
        type: "UPDATEQUESTION",
        payload:question
    }
}

export const UpdateQuestionCondition=(question)=>{
    return{
        type:"UPDATEQUESTIONCONDITION",
        payload:question
    }
}

export const UpdateQuestionName=(name)=>{
    return{
        type:"UPDATEQUESTIONNAME",
        payload:name
    }
}

export const UpdateOptionName=(name)=>{
    return{
        type:"UPDATEOPTIONNAME",
        payload:name
    }
}

export const RequiredQuestion=(question)=>{
    return{
        type:"REQUIRED",
        payload:question
    }
}


export const UpdateFormName =(question)=> {
    return{
        type: "UPDATEFORMNAME",
        payload:question
    }
}

export const UpdateFormDescription =(question)=> {
    return{
        type: "UPDATEFORMDESCRIPTION",
        payload:question
    }
}

export const OpenQuestion =(question)=> {
    return{
        type: "OPENQUESTION",
        payload:question
    }
}

export const CloseQuestion =(question)=> {
    return{
        type: "QUESTION",
        payload:question
    }
}

export const ExistingForm =(question)=> {
    return{
        type: "EXISTINGFORM",
        payload:question
    }
}

export const CloseApplication=(close)=>{
    return{
        type:"CLOSEAPPLICATION",
        payload:close
    }

}

export const UpdateEmail=(email)=>{
    return{
        type:"UPDATEMAIL",
        payload:email
    }
}

export const UpdateImage=(image)=>{
    return{
        type:"UPDATEIMAGE",
        payload:image
    }
}