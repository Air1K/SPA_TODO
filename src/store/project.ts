const getProject = () => {
   if(localStorage.getItem('project') && localStorage.getItem('project') !== "[]") return {project: JSON.parse(localStorage.getItem('project'))}
   return {project: []}
}
const ADD_PROJECT = 'ADD_PROJECT'
const DEL_PROJECT = 'DEL_PROJECT'
const EDIT_PROJECT = 'EDIT_PROJECT'
export const projectReducer = (state = getProject(), action) =>{
   switch (action.type){
      case ADD_PROJECT:
         localStoreSave({...state, project: [...state.project, action.payload]});
         return {...state, project: [action.payload, ...state.project]}
      case DEL_PROJECT:
         const newProject = state.project.filter(project => project.id !== action.payload)
         localStoreSave({...state, project: newProject});
         return {...state, project: newProject}
      case EDIT_PROJECT:
         state.project[action.payload.index - 1].name = action.payload.newProjectName
         localStoreSave({...state, project: [...state.project]})
         return {...state, project: [...state.project]}
      default:
         return state;
   }
}
export const addProjectAction = (payload)=>({type: ADD_PROJECT, payload})
export const delProjectAction = (payload)=>({type: DEL_PROJECT, payload})

interface Edit{
   index: number,
   newProjectName: string
}
export const editProjectAction = (payload: Edit) =>({type: EDIT_PROJECT, payload})
const localStoreSave = (proj)=>{
   localStorage.setItem('project', JSON.stringify(proj.project))
}