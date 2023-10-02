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
   project_id: number
   id: number;
   head_task: string;
   body_task: string;
   date_of_creat: Date;
   time_at_work: Date;
   date_end: Date;
   priority: number;
   files_task: MyFile;
   status: string;
   subtasks: StateTask[]=[];
   comments: Comments[] = [];
}
export class Comments{
   name_user: string = 'Default user';
   date?: Date;
   comment: string;
   comments?: Comments[] = [];
}
export interface MyFile extends File {
   readonly lastModifiedDate: Date;
}