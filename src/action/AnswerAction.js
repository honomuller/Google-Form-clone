export const ExistingFormAnswer=(answer)=>{
    return{
        type:"EXISTINGFORMANSWER",
        payload:answer
    }
}

export const TextAnswer=(answer)=>{
    return{
        type:"TEXTANSWER",
        payload:answer
    }
}


export const TextAreaAnswer=(answer)=>{
    return{
        type:"TEXTAREA",
        payload:answer
    }
}


export const RadioAnswer=(answer)=>{
    return{
        type:"RADIOANSWER",
        payload:answer
    }
}