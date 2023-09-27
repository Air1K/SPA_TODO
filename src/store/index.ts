import {combineReducers, createStore} from "redux";
// legacy_createStore as createStore
import {projectReducer} from "./project";
import {taskReducer} from "./task";
const rootReducer = combineReducers({
   project: projectReducer,
   task: taskReducer
})
export const store = createStore(rootReducer)
