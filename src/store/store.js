import { combineReducers, createStore } from "redux";
import { QuestionReducer } from "../reducer/QuestionReducer";
import { AnswerReducer } from "../reducer/AnswerReducer";
import { UserReducer } from "../reducer/UserReducer";
import {persistReducer,persistStore} from 'redux-persist'
import expireReducer from 'redux-persist-expire'
import storage from "redux-persist/lib/storage/session";
import { SidebarReducer } from "../reducer/SidebarReducer";

const authConfig = {
    key: "logins",
    storage,
    transforms:[
        expireReducer('logins', {
            persistedAtKey: 'loadedAt',
            expireSeconds: 1800,
            expiredState: [],
            autoExpire: true
          })
    ]
}

const perReducer = persistReducer(authConfig, UserReducer)


const storee = combineReducers({QuestionReducer:QuestionReducer,AnswerReducer:AnswerReducer,UserReducer:perReducer,sidebarReducer:SidebarReducer})

const store  = createStore(storee)
const perStore =  persistStore(store)

export {store, perStore}