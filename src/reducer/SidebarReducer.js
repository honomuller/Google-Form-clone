const initialState = {
    sidebarR:false
}

export const SidebarReducer = (state=initialState,action)=>{
    switch(action.type){
        case "OPENSIDEBAR":
            return{...state, sidebarR: action.payload }
        default:
            return state
    }

}

