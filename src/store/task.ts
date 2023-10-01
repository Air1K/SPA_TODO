import {SaveStatusEnum} from "../enums/saveStatus.enum";
interface Edit{
   index: number,
   newTaskName: string,
   newBodyTask: string;
   newPriority: number;
   newFilesTask: Object;
   newStatus: string;
}
interface EditSub{
   index: number,
   task: number,
   newTaskName: string,
   newBodyTask: string;
   newPriority: number;
   newFilesTask: Object;
   newStatus: string;
}
const getTask = () => {
   if(localStorage.getItem('task') && localStorage.getItem('task') !== "[]" ) {
      const tasks = {task: JSON.parse(localStorage.getItem('task'))}
      for(let i in tasks.task){
         if(localStorage.getItem(`${tasks.task[i].id}`) && localStorage.getItem(`${tasks.task[i].id}`) !== `{}`){
            const files = JSON.parse(localStorage.getItem(`${tasks.task[i].id}`));
            const file = decode(files.dataURL, files.filesName, files.filesType)
            tasks.task[i].files_task = file;
         }
         for(let j in tasks.task[i].subtasks){
            if(localStorage.getItem(`${tasks.task[i].subtasks[j].id}`) && localStorage.getItem(`${tasks.task[i].subtasks[j].id}`) !== `{}`){
               const files = JSON.parse(localStorage.getItem(`${tasks.task[i].subtasks[j].id}`));
               const file = decode(files.dataURL, files.filesName, files.filesType)
               tasks.task[i].subtasks[j].files_task = file;
            }
         }
      }
      return tasks
   }
   return {task: []}
}
const localStoreSave = (task, typ = null)=> {
   const tasks = task.task.map(({project_id, id, head_task, body_task, date_of_creat, time_at_work, date_end, priority, status, subtasks, comments})=>({project_id, id, head_task, body_task, date_of_creat, time_at_work, date_end, priority, status, subtasks, comments}))
   if(typ?.payload || typ){
      readSingleFile(null, typ.payload)
      for(let i in typ.old?.subtasks){
         readSingleFile(null, typ.old.subtasks[i].id)
      }
   } else {
      for(let i in task.task){
         if(task.task[i]?.files_task){
            readSingleFile(task.task[i].files_task, task.task[i].id)
         }
         for(let j in task.task[i].subtasks){
            if(task.task[i].subtasks[j]?.files_task){
               readSingleFile(task.task[i].subtasks[j].files_task, task.task[i].subtasks[j].id)
            }
         }
      }
   }
   localStorage.setItem('task', JSON.stringify(tasks))
}
export const taskReducer = (state = getTask(), action) =>{
   switch (action.type){
      case SaveStatusEnum.ADD_TASK:
         localStoreSave({...state, task: [...state.task, action.payload]});
         return {...state, task: [action.payload, ...state.task]}
      case SaveStatusEnum.DELETE_TASK:
         const oldSubtaskID = state.task.filter(task => task.id === action.payload)
         const del = {old: oldSubtaskID[0], payload: action.payload}
         const newTask = state.task.filter(task => task.id !== action.payload)
         localStoreSave( {...state, task: newTask}, del);
         return {...state, task: newTask}
      case SaveStatusEnum.EDIT_TASK:
         state.task[action.payload.index - 1].head_task = action.payload.newTaskName
         state.task[action.payload.index - 1].body_task = action.payload.newBodyTask
         state.task[action.payload.index - 1].priority = action.payload.newPriority
         state.task[action.payload.index - 1].files_task = action.payload.newFilesTask
         state.task[action.payload.index - 1].status = action.payload.newStatus
         localStoreSave({...state, task: [...state.task]})
         return {...state, task: [...state.task]}
      case SaveStatusEnum.ADD_SUBTASK:
         state.task[action.payload[1].task - 1].subtasks.push(action.payload[0])
         localStoreSave({...state})
         return {...state}
      case SaveStatusEnum.EDIT_SUBTASK:
         state.task[action.payload.task - 1].subtasks[action.payload.index - 1].head_task = action.payload.newTaskName
         state.task[action.payload.task - 1].subtasks[action.payload.index - 1].body_task = action.payload.newBodyTask
         state.task[action.payload.task - 1].subtasks[action.payload.index - 1].priority = action.payload.newPriority
         state.task[action.payload.task - 1].subtasks[action.payload.index - 1].files_task = action.payload.newFilesTask
         state.task[action.payload.task - 1].subtasks[action.payload.index - 1].status = action.payload.newStatus
         localStoreSave({...state, task: [...state.task]})
         return {...state}
      default:
         return state;
   }
}

export const addTaskAction = (payload)=>({type: SaveStatusEnum.ADD_TASK, payload})
export const delTaskAction = (payload)=>({type: SaveStatusEnum.DELETE_TASK, payload})
export const editTaskAction = (payload: Edit) =>({type: SaveStatusEnum.EDIT_TASK, payload})
export const addSubtaskAction = (payload) => ({type: SaveStatusEnum.ADD_SUBTASK, payload})
export const editSubtaskAction = (payload: EditSub) => ({type: SaveStatusEnum.EDIT_SUBTASK, payload})
function readSingleFile(file, id) {

   if (file?.size) {
      const reader = new FileReader();
      reader.onload = function() {
         const dataURL = reader.result;
         const files = {
            filesName: file.name,
            filesType: file.type,
            dataURL: dataURL
         }
         localStorage.setItem(`${id}`, JSON.stringify(files))
      };
      reader.readAsDataURL(file);
   } else {
      localStorage.removeItem(`${id}`)
   }
}
function decode(dataUri, filesName, filesType) {
   const byteString = window.atob(dataUri.split(',')[1]);
   const arrayBuffer = new ArrayBuffer(byteString.length);
   const intArray = new Uint8Array(arrayBuffer);
   for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
   }
// Создание нового файла
   const blob = new Blob([arrayBuffer], {type: filesType});
   const file = new File([blob], filesName);
   return file
}
