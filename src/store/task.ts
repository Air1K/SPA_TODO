const getTask = () => {
   console.log("getTask")
   if(localStorage.getItem('task') && localStorage.getItem('task') !== "[]" ) {
      const tasks = {task: JSON.parse(localStorage.getItem('task'))}
      for(let i in tasks.task){

         if(localStorage.getItem(`${tasks.task[i].id}`) && localStorage.getItem(`${tasks.task[i].id}`) !== `{}`){
            const files = JSON.parse(localStorage.getItem(`${tasks.task[i].id}`));
            const file = decode(files.dataURL, files.filesName, files.filesType)
            tasks.task[i].files_task = file;
         }
      }
      return tasks
   }
   return {task: []}
}
const ADD_TASK = 'ADD_TASK'
const DEL_TASK = 'DEL_TASK'
const EDIT_TASK = 'EDIT_TASK'
export const taskReducer = (state = getTask(), action) =>{
   switch (action.type){
      case ADD_TASK:
         localStoreSave({...state, task: [...state.task, action.payload]});
         return {...state, task: [action.payload, ...state.task]}
      case DEL_TASK:
         const newTask = state.task.filter(task => task.id !== action.payload)
         localStoreSave( {...state, task: newTask}, action.payload);
         return {...state, task: newTask}
      case EDIT_TASK:
         state.task[action.payload.index - 1].head_task = action.payload.newTaskName
         state.task[action.payload.index - 1].body_task = action.payload.newBodyTask
         state.task[action.payload.index - 1].priority = action.payload.newPriority
         state.task[action.payload.index - 1].files_task = action.payload.newFilesTask
         state.task[action.payload.index - 1].status = action.payload.newStatus
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
   newPriority: number;
   newFilesTask: Object;
   newStatus: string;
}
export const editTaskAction = (payload: Edit) =>({type: EDIT_TASK, payload})
const localStoreSave = (task, typ = null)=> {
   const tasks = task.task.map(({project_id, id, head_task, body_task, date_of_creat, time_at_work, date_end, priority, status, subtasks, comments})=>({project_id, id, head_task, body_task, date_of_creat, time_at_work, date_end, priority, status, subtasks, comments}))
   if(typ){
      console.log("delet!!!!!!!!!!!!!!!!")
      readSingleFile(null, typ)
   }
   for(let i in task.task){
      readSingleFile(task.task[i].files_task, !typ?task.task[i].id:typ)
   }
   localStorage.setItem('task', JSON.stringify(tasks))
   localStorage.setItem('task', JSON.stringify(tasks))
}
function readSingleFile(file, id) {
   if (file) {
      var reader = new FileReader();
      reader.onload = function() {
         var dataURL = reader.result;
         const files = {
            filesName: file.name,
            filesType: file.type,
            dataURL: dataURL
         }
         localStorage.setItem(`${id}`, JSON.stringify(files))
      };
      reader.readAsDataURL(file);
   } else {
      console.log("delet!!!!!!!!!!!!!!!!", id)
      localStorage.removeItem(`${id}`) //Нот воркинг
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
   // var link = document.createElement('a');
   // link.href = URL.createObjectURL(file);
   // link.download = file.name;
   // link.click();
   // console.log(file);
}

// function downloadFile(file, filename) {
//    var a = document.createElement("a");
//    a.download = filename;
//    a.href = URL.createObjectURL(file);
//    a.click();
// }