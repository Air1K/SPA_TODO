import {combineReducers, legacy_createStore as createStore} from "redux";
import {projectReducer} from "./project";
import {taskReducer} from "./task";
const rootReducer = combineReducers({
   project: projectReducer,
   task: taskReducer
})
export const store = createStore(rootReducer)
