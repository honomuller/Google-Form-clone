const initialState={
    user:[],
    isLoggedIn: false
}


const UserReducer =(state=initialState,action)=>{
    switch(action.type){
        case "LOGIN": return{...state, user: [...state.user, action.payload] , isLoggedIn: true}
        case "LOGOUT": return {...state, user: [], isLoggedIn:false}
        default: return {...state}
    }
}

export {UserReducer}