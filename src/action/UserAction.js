export const UserLogin=(user)=>{
    return{
        type:'LOGIN',
        payload:user
    }
}

export const UserLogout=()=>{
    return{
        type:'LOGOUT',
    }
}