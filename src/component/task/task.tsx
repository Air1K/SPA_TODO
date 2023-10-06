import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {MyFile, Root} from "../../models/root";
import {Alert, Button, Col, Container, FloatingLabel, Form, Modal, Row} from "react-bootstrap";
import {IoChevronBackOutline} from 'react-icons/io5'
import styles from './task-style.module.scss'
import styles_project from '../project/project-style.module.scss'
import {GrAdd} from "react-icons/gr";
import Modal1 from "../myModal/modal_1";
import {vakidateFromAddTask} from "../../validation/validated";
import {
   MdClose,
   MdOutlineArrowBackIosNew,
} from 'react-icons/md'
import {BsLink45Deg} from 'react-icons/bs'
import {addSubtaskAction, addTaskAction, editSubtaskAction, editTaskAction} from "../../store/task";
import {StateEnum} from "../../enums/state.enum";
import SubTask from "../subTask/sub-task";
import {SaveStatusEnum} from "../../enums/saveStatus.enum";
import {saveFile} from "../../service/saveFile";
import TaskBlock from "./task-block";
import {Simulate} from "react-dom/test-utils";
import pointerDown = Simulate.pointerDown;

const Exit = () => {
   return (
      <Link
         className={`position-absolute d-flex align-items-center justify-content-center ${styles.back} transition_v2`}
         to={'/'}><IoChevronBackOutline/></Link>
   )
}
const Task = () => {
   const [searchParams, setSearchParams] = useSearchParams();
   const dispatch = useDispatch()
   const project = useSelector((state: Root) => state.project.project)
   const [subtaskIndex, setSubtaskIndex] = useState(null)
   const tasks_redux = useSelector((state: Root) => state.task.task.filter(task => (task.project_id === Number(searchParams.get('_id')))))
   const [tasks, setTasks] = useState([])
   const [modalShow, setModalShow] = useState(false)
   const [edit, setEdit] = useState(null)
   const [errors, setErrors] = useState({})
   const [stateErrors, setStateErrors] = useState({})
   const [detailsModal, setDetailsModal] = useState(false)
   const [editStatus, setEditStatus] = useState('')
   const [ondrag, setOnDrag] = useState(false)
   const [search, setSearch] = useState('')
   const refQueue = useRef() as MutableRefObject<HTMLDivElement>
   const refDevelopment = useRef() as MutableRefObject<HTMLDivElement>
   const refDone = useRef() as MutableRefObject<HTMLDivElement>
   const [form, setForm] = useState({
      head_task: '',
      body_task: '',
      priority: 1,
      files_task: {} as MyFile,
      status: '',
      subtasks: [],
      comments: [],
   })

   console.log("999999999")
   const editStatusTask = (index) => {
      console.log(index, "------------",  editStatus)
      switch (getStatus()) {
         case SaveStatusEnum.ADD_TASK || SaveStatusEnum.EDIT_TASK:
            dispatch(editTaskAction({
               index: index + 1,
               newTaskName: tasks[index].head_task,
               newBodyTask: tasks[index].body_task,
               newPriority: tasks[index].priority,
               newFilesTask: tasks[index].files_task,
               newStatus: editStatus,
            }))
            break
         case SaveStatusEnum.ADD_SUBTASK || SaveStatusEnum.EDIT_SUBTASK:
            dispatch(editSubtaskAction({
               index: index + 1,
               task: subtaskIndex,
               newTaskName: tasks[index].head_task,
               newBodyTask: tasks[index].body_task,
               newPriority: tasks[index].priority,
               newFilesTask: tasks[index].files_task,
               newStatus: editStatus,
            }))
            break
      }

   }

   const setField = (field, value) => {
      setForm({
         ...form,
         [field]: value
      })
      if (!!errors[field]) {
         setErrors({
            ...errors,
            [field]: null
         })
      }
   }
   const save = (event, types) => {
      event.preventDefault();
      const {formErrors, stateErr} = vakidateFromAddTask(form)
      if (Object.keys(formErrors).length > 0) {
         setErrors(formErrors)
      } else {
         if (subtaskIndex === null) {
            switch (types) {
               case SaveStatusEnum.ADD_TASK:
                  const taski = {
                     project_id: Number(searchParams.get('_id')),
                     id: Date.now(),
                     head_task: form.head_task,
                     body_task: form.body_task,
                     date_of_creat: new Date(),
                     time_at_work: Date.now(),
                     date_end: null,
                     priority: form.priority,
                     files_task: form.files_task,
                     status: StateEnum.QUEUE,
                     subtasks: [],
                     comments: []
                  }
                  dispatch(addTaskAction(taski))
                  break
               case SaveStatusEnum.EDIT_TASK:
                  console.log("EDIT")
                  dispatch(editTaskAction({
                     index: edit,
                     newTaskName: form.head_task,
                     newBodyTask: form.body_task,
                     newPriority: form.priority,
                     newFilesTask: form.files_task,
                     newStatus: form.status,
                  }))
                  break
            }
         } else {
            switch (types) {
               case SaveStatusEnum.ADD_SUBTASK:
                  const taski = [{
                     project_id: Number(searchParams.get('_id')),
                     id: Date.now(),
                     head_task: form.head_task,
                     body_task: form.body_task,
                     date_of_creat: new Date(),
                     time_at_work: Date.now(),
                     date_end: null,
                     priority: form.priority,
                     files_task: form.files_task,
                     status: StateEnum.QUEUE,
                     comments: []
                  }, {task: subtaskIndex}]
                  dispatch(addSubtaskAction(taski))
                  break
               case SaveStatusEnum.EDIT_SUBTASK:
                  dispatch(editSubtaskAction({
                     index: edit,
                     task: subtaskIndex,
                     newTaskName: form.head_task,
                     newBodyTask: form.body_task,
                     newPriority: form.priority,
                     newFilesTask: form.files_task,
                     newStatus: form.status,
                  }))
                  break
            }
         }

         setEdit(null);
         setModalShow(false);
      }
      setStateErrors(stateErr)
   }
   useEffect(() => {
      if (edit) {
         setForm({
            head_task: tasks[edit - 1].head_task,
            body_task: tasks[edit - 1].body_task,
            priority: tasks[edit - 1].priority,
            files_task: tasks[edit - 1].files_task,
            status: tasks[edit - 1].status,
            subtasks: tasks[edit - 1].subtasks,
            comments: tasks[edit - 1].comments,
         })
      }
   }, [edit])

   useEffect(() => {
      if (!modalShow) {
         setForm({
            head_task: '',
            body_task: '',
            priority: 1,
            files_task: {} as MyFile,
            status: '',
            subtasks: [],
            comments: [],
         })
         setStateErrors({})
         setErrors({})
      }

   }, [modalShow])

   function getStatus() {
      if (subtaskIndex !== null) {
         if (edit) {
            return SaveStatusEnum.EDIT_SUBTASK
         } else {
            return SaveStatusEnum.ADD_SUBTASK
         }
      } else {
         if (edit) {
            return SaveStatusEnum.EDIT_TASK
         } else {
            return SaveStatusEnum.ADD_TASK
         }
      }
   }

   useEffect(() => {

      if (subtaskIndex !== null) {
         if (search === '') {
            setTasks(tasks_redux[subtaskIndex - 1].subtasks)
         } else {
            if (!isNaN(Number(search))) {
               setTasks(tasks_redux[subtaskIndex - 1].subtasks.filter(task => (task.id.toString().indexOf(search) > -1)))
            } else {
               setTasks(tasks_redux[subtaskIndex - 1].subtasks.filter(task => (task.head_task.indexOf(search) > -1)))
            }
         }

      } else {
         if (search === '') {
            setTasks(tasks_redux)
         } else {
            if (!isNaN(Number(search))) {
               setTasks(tasks_redux.filter(task => (task.id.toString().indexOf(search.toString()) > -1)))
            } else {
               setTasks(tasks_redux.filter(task => (task.head_task.indexOf(search) > -1)))
            }
         }
      }
   }, [subtaskIndex, search])
   useEffect(() => {
      if (subtaskIndex !== null) {
         if (search === '') {
            if (JSON.stringify(tasks_redux[subtaskIndex - 1].subtasks) !== JSON.stringify(tasks)) {
               setTasks(tasks_redux[subtaskIndex - 1].subtasks)
            }
         } else {
            if (!isNaN(Number(search))) {
               if (JSON.stringify(tasks_redux[subtaskIndex - 1].subtasks.filter(task => (task.id.toString().indexOf(search.toString()) > -1))) !== JSON.stringify(tasks)) {
                  setTasks(tasks_redux[subtaskIndex - 1].subtasks.filter(task => (task.id.toString().indexOf(search.toString()) > -1)))
               }
            } else {
               if (JSON.stringify(tasks_redux[subtaskIndex - 1].subtasks.filter(task => (task.head_task.toString().indexOf(search) > -1))) !== JSON.stringify(tasks)) {
                  setTasks(tasks_redux[subtaskIndex - 1].subtasks.filter(task => (task.head_task.indexOf(search) > -1)))
               }
            }
         }
      } else {

         if (search === '') {
            if (JSON.stringify(tasks_redux) !== JSON.stringify(tasks)) {
               setTasks(tasks_redux)
            }
         } else {
            if (!isNaN(Number(search))) {
               if (JSON.stringify(tasks_redux.filter(task => (task.id.toString().indexOf(search.toString()) > -1))) !== JSON.stringify(tasks)) {
                  setTasks(tasks_redux.filter(task => (task.id.toString().indexOf(search.toString()) > -1)))
               }
               // setTasks(tasks.filter(task=>(task.id.indexOf(search) > -1)))
            } else {
               if (JSON.stringify(tasks_redux.filter(task => (task.head_task.indexOf(search) > -1))) !== JSON.stringify(tasks)) {
                  setTasks(tasks_redux.filter(task => (task.head_task.indexOf(search) > -1)))
               }
            }
         }
      }
   }, [tasks_redux])

   function deleteFile() {
      setForm({...form, files_task: {} as MyFile})
   }

   function statusTask(event, type, mobile?) {
      if(mobile){
         const refQx = refQueue.current.getBoundingClientRect().x
         const refQy = refQueue.current.getBoundingClientRect().y
         const height_refQ = refQy + refQueue.current.getBoundingClientRect().height
         const width_refQ = refQx + refQueue.current.getBoundingClientRect().width

         const refDx = refDevelopment.current.getBoundingClientRect().x
         const refDy = refDevelopment.current.getBoundingClientRect().y
         const height_refD = refDy + refDevelopment.current.getBoundingClientRect().height
         const width_refD = refDx + refDevelopment.current.getBoundingClientRect().width

         const refDone_x = refDone.current.getBoundingClientRect().x
         const refDone_y = refDone.current.getBoundingClientRect().y
         const height_refDone = refDone_y + refDone.current.getBoundingClientRect().height
         const width_refDone = refDone_x + refDone.current.getBoundingClientRect().width

         const eventY = event.touches[0].clientY
         const eventX = event.touches[0].clientX

         if(refQy <= eventY && height_refQ  >= eventY && refQx <= eventX && width_refQ >= eventX){
            if(StateEnum.QUEUE !== editStatus){
               setEditStatus(StateEnum.QUEUE)
            }
         }
         if(refDy <= eventY && height_refD  >= eventY && refDx <= eventX && width_refD >= eventX){
            if(StateEnum.DEVELOPMENT !== editStatus){
               setEditStatus(StateEnum.DEVELOPMENT)
            }
         }
         if(refDone_y <= eventY && height_refDone  >= eventY && refDone_x <= eventX && width_refDone >= eventX){
            if(StateEnum.DONE !== editStatus){
               setEditStatus(StateEnum.DONE)
            }
         }
      }
      else{
         if (ondrag) {
            event.target.style.transform = "scale(1.01)"
            setEditStatus(type)
         }
      }

   }

   function statusTaskLeave(event) {
      if (event.target.style.transform !== "scale(1)") {
         event.target.style.transform = "scale(1)"
      }
   }


   if (project.findIndex(project => project.name === searchParams.get('name') && project.id === Number(searchParams.get('_id'))) !== -1)
      return (
         <Container className={`mt-2`}>
            <div>
               <h4 className={`text-center`}>Диспетчер {subtaskIndex === null ? 'задач' : 'подзадач'}</h4>
               <hr/>
               <div className={`d-flex justify-content-start flex-column-reverse gap-2 ${styles.header}`}>
                  <div className={styles.taskDir}>
                     <p className={`text-center`}><span>Проект </span> <Button variant="secondary" size={'sm'}
                                                                               className={`ms-1`}><Link
                        className={`d-flex align-items-center gap-2`}
                        to={'/'}><MdOutlineArrowBackIosNew/> {searchParams.get('name')}</Link></Button></p>
                     {subtaskIndex === null ? `` :
                        <p className={`text-center`}><span>/ Задача</span> <Button variant="secondary" size={'sm'}
                                                                                   onClick={() => setSubtaskIndex(null)}
                                                                                   className={`ms-1`}><span
                           className={`d-flex align-items-center gap-2`}><MdOutlineArrowBackIosNew/> {`${tasks_redux[subtaskIndex - 1].head_task}`}</span></Button>
                        </p>}
                  </div>

                  <div className={`ms-auto d-flex ${styles.searchs} flex-row`}>
                     <Form.Control
                        type="search"
                        placeholder="Поиск"
                        className={`me-2 rounded-pill ${styles.search}`}
                        aria-label="Search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                     />
                     <Button className={`rounded-pill ${styles.search} py-1`} variant="outline-primary">
                        Найти
                     </Button>
                  </div>
               </div>
            </div>
            <Row sm={12} className={`justify-content-center`}>
               <Col sm={4} className={`${styles.col} px-1`}>
                  <div className={styles.head}><h5 className={`text-center`}>Очередь</h5></div>
                  <div
                     ref={refQueue}
                     onPointerEnter={(event) => statusTask(event, StateEnum.QUEUE)}
                     // onMouseEnter={}
                     onTouchMove={(event) => statusTask(event, StateEnum.QUEUE, true)}
                     onPointerLeave={(event) => statusTaskLeave(event)}
                     // onMouseLeave={}
                     className={`${styles.body} transition_v2 ${!ondrag ? styles.resetActiveHover : null}`}>
                     <div onClick={() => setModalShow(true)}
                          className={`${styles_project.add_block} mx-auto d-flex justify-content-center align-items-center`}>
                        <GrAdd/> Добавить
                     </div>
                     <TaskBlock setDetailsModal={setDetailsModal}
                                setModalShow={setModalShow}
                                setEdit={setEdit}
                                subtaskIndex={subtaskIndex}
                                tasks={tasks}
                                setTasks={setTasks}
                                tasks_redux={tasks_redux}
                                col={StateEnum.QUEUE}
                                editStatusTask={editStatusTask}
                                setOnDrag={setOnDrag}
                                getStatus={getStatus}
                                setEditStatus={setEditStatus}/>
                  </div>
               </Col>
               <Col sm={4} className={`${styles.col} px-1`}>
                  <div className={styles.head}><h5 className={`text-center`}>Разработка</h5></div>
                  <div onPointerEnter={(event) => statusTask(event, StateEnum.DEVELOPMENT)}
                       onTouchMove={(event) => statusTask(event, StateEnum.DEVELOPMENT, true)}
                       onPointerLeave={(event) => statusTaskLeave(event)}
                       ref={refDevelopment}
                       className={`${styles.body} transition_v2 ${!ondrag ? styles.resetActiveHover : null}`}>
                     <div onClick={() => setModalShow(true)}
                          className={`${styles_project.add_block} mx-auto d-flex justify-content-center align-items-center`}
                          style={{opacity: 0, pointerEvents: 'none'}}>
                        <GrAdd/> Добавить
                     </div>
                     <TaskBlock setDetailsModal={setDetailsModal}
                                setModalShow={setModalShow}
                                setEdit={setEdit}
                                subtaskIndex={subtaskIndex}
                                tasks={tasks}
                                setTasks={setTasks}
                                tasks_redux={tasks_redux}
                                col={StateEnum.DEVELOPMENT}
                                editStatusTask={editStatusTask}
                                setOnDrag={setOnDrag}
                                getStatus={getStatus}
                                setEditStatus={setEditStatus}/>
                  </div>
               </Col>
               <Col sm={4} className={`${styles.col} px-1`}>
                  <div className={styles.head}><h5 className={`text-center`}>Исполнено</h5></div>
                  <div className={`${styles.body} transition_v2 ${!ondrag ? styles.resetActiveHover : null}`}
                       onPointerEnter={(event) => statusTask(event, StateEnum.DONE)}
                       ref={refDone}
                       onTouchMove={(event)=>statusTask(event, StateEnum.DONE, true)}
                       onPointerLeave={(event) => statusTaskLeave(event)}
                  >
                     <div onClick={() => setModalShow(true)}
                          className={`${styles_project.add_block} mx-auto d-flex justify-content-center align-items-center`}
                          style={{opacity: 0, pointerEvents: 'none'}}>
                        <GrAdd/> Добавить
                     </div>
                     <TaskBlock setDetailsModal={setDetailsModal}
                                setModalShow={setModalShow}
                                setEdit={setEdit}
                                subtaskIndex={subtaskIndex}
                                tasks={tasks}
                                setTasks={setTasks}
                                tasks_redux={tasks_redux}
                                col={StateEnum.DONE}
                                editStatusTask={editStatusTask}
                                setOnDrag={setOnDrag}
                                getStatus={getStatus}
                                setEditStatus={setEditStatus}/>
                  </div>
               </Col>
            </Row>
            <Exit/>

            {modalShow || detailsModal ?
               <Modal1 show={detailsModal ? detailsModal : modalShow} onHide={() => {
                  if (!detailsModal) {
                     setEdit(null);
                     setModalShow(false);
                  } else {
                     if (subtaskIndex === null) {
                        searchParams.delete('task')
                     } else {
                        searchParams.delete('subtask')
                     }
                     setSearchParams(searchParams)
                     setDetailsModal(false)
                  }
               }}
                       size={detailsModal && subtaskIndex === null ? 'xl' : 'lg'}>
                  {detailsModal ?
                     <SubTask subtaskIndex={subtaskIndex} setSubtaskIndex={setSubtaskIndex}
                              setDetailsModal={setDetailsModal}/>
                     :
                     <Form noValidate validated={!errors} onSubmit={(event) => save(event, getStatus())}
                           className={'d-block w-100'}>
                        <Modal.Header closeButton>
                           <Modal.Title id="contained-modal-title-vcenter">
                              {!edit ? "Создание задачи" : "Изменение задачи"}
                           </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={'d-block'}>

                           <FloatingLabel
                              controlId="floatingInput"
                              label="Заголовок"
                              className="mb-3"
                           >
                              <Form.Control type="text" value={form.head_task}
                                            onChange={event => setField('head_task', event.target.value)}
                                            required
                                            placeholder="head task"
                                            isInvalid={!!errors['head_task']}
                                            isValid={stateErrors["head_task"]}/>
                              <Form.Control.Feedback type="invalid">
                                 {errors['head_task']}
                              </Form.Control.Feedback>
                           </FloatingLabel>

                           <FloatingLabel
                              controlId="floatingTextarea2"
                              label="Описание"
                              className="mb-3"
                           >
                              <Form.Control type="text"
                                            as="textarea"
                                            style={{height: '100px'}}
                                            value={form.body_task}
                                            onChange={event => setField('body_task', event.target.value)}
                                            required
                                            placeholder="body task"
                                            isInvalid={!!errors['body_task']}
                                            isValid={stateErrors["body_task"]}/>
                              <Form.Control.Feedback type="invalid">
                                 {errors['body_task']}
                              </Form.Control.Feedback>
                           </FloatingLabel>
                           <FloatingLabel
                              controlId="floatingSelectGrid"
                              label="Приоритет"
                              className="mb-3"
                           >
                              <Form.Select aria-label="Default select example"
                                           defaultValue={!edit ? "1" : tasks[edit - 1].priority}
                                           onChange={event => setField('priority', Number(event.target.value))}>
                                 <option value="1">Первый приоритет</option>
                                 <option value="2">Второй приоритет</option>
                                 <option value="3">Третий приоритет</option>
                                 <option value="4">Четвертый приоритет</option>
                                 <option value="5">Пятый приоритет</option>
                              </Form.Select>
                           </FloatingLabel>
                           <Form.Group onChange={(event) => {
                              setField('files_task', (event.target as HTMLInputElement).files[0])
                           }}
                                       controlId="formFile"
                                       className="mb-3">
                              <Form.Label>Вложенный файл</Form.Label>
                              <Form.Control isInvalid={!!errors['files_task']}
                                            isValid={stateErrors["files_task"]}
                                            type="file"/>
                              {form.files_task?.name ?
                                 <a href={'#'} className={'link-success text-decoration-underline'} download
                                    onClick={(event) => saveFile(form.files_task, event)}><BsLink45Deg/>{form.files_task.name}
                                    <a href="#" className={"link-danger"} onClick={(event) => {
                                       deleteFile();
                                       event.stopPropagation()
                                    }}><MdClose/></a></a> : null}
                              <Form.Control.Feedback type="invalid">
                                 {errors['files_task']}
                              </Form.Control.Feedback>
                           </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                           <Button variant={'outline-dark'}
                                   type={'submit'}>Сохранить</Button>
                        </Modal.Footer>
                     </Form>
                  }

               </Modal1> : null}
         </Container>
      );
   else {
      return (
         <Container>
            <Alert variant={'danger'} className={'mt-3 d-table mx-auto'}>
               Указанного проекта не существует :(
            </Alert>
         </Container>
      )
   }
};
export default Task;