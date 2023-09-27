const getTask = () => {
   if(localStorage.getItem('task') && localStorage.getItem('task') !== "[]") return {task: JSON.parse(localStorage.getItem('task'))}
   return {task: []}
}
const ADD_TASK = 'ADD_TASK'
const DEL_TASK = 'DEL_TASK'
const EDIT_TASK = 'EDIT_TASK'
export const taskReducer = (state = getTask(), action) =>{
   switch (action.type){
      case ADD_TASK:
         console.log("ssss", action)
         localStoreSave({...state, task: [...state.task, action.payload]});
         return {...state, task: [action.payload, ...state.task]}
      case DEL_TASK:
         const newTask = state.task.filter(task => task.id !== action.payload)
         localStoreSave({...state, task: newTask});
         return {...state, task: newTask}
      case EDIT_TASK:
         state.task[action.payload.index - 1].name = action.payload.newTaskName
         localStoreSave({...state, task: [...state.task]})
         return {...state, task: [...state.task]}
      default:
         return state;
   }
}

export const addTaskAction = (payload)=>({type: ADD_TASK, payload})
export const delTaskAction = (payload)=>({type: DEL_TASK, payload})

interface Edit{
   index: number,
   newTaskName: string,
   newBodyTask: string;
   newPriority: string;
   newFilesTask: string;
   newStatus: string;
   newSubtasks: Edit[];
}
export const editTaskAction = (payload: Edit) =>({type: EDIT_TASK, payload})
const localStoreSave = (task)=> {
   localStorage.setItem('task', JSON.stringify(task.task))
}