export interface Root{
   project: Project,
   task: Task
}
class Project{
   project:StateProject[] = []
}
class Task{
   task:StateTask[] = []
}

interface StateProject{
   id: number,
   name: string,
}

class StateTask{
   id: number;
   head_task: string;
   body_task: string;
   date_of_creat: Date;
   time_at_work: number;
   date_end: Date;
   priority: string;
   files_task: string;
   status: string;
   subtasks: StateTask[] = [];
   comments: Comments[] = [];
}
class Comments{
   name_user: string = 'Default user';
   date: Date;
   comment: string;
}