import React, {useEffect, useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {MyFile, Root} from "../../models/root";
import {Accordion, Alert, Button, Col, Container, FloatingLabel, Form, Modal, Row} from "react-bootstrap";
import {IoChevronBackOutline} from 'react-icons/io5'
import styles from './task-style.module.scss'
import styles_project from '../project/project-style.module.scss'
import {GrAdd} from "react-icons/gr";
import Modal1 from "../myModal/modal_1";
import {vakidateFromAddTask} from "../../validation/validated";
import {MdDeleteOutline, MdOutlineModeEditOutline, MdOutlineInfo} from 'react-icons/md'
import {addTaskAction, delTaskAction, editTaskAction} from "../../store/task";
import {AnimatePresence, motion} from 'framer-motion';
import {delProjectAction} from "../../store/project";
import {StateEnum} from "../../enums/state.enum";
import SubTask from "../subTask/sub-task";

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
   const tasks = useSelector((state: Root) => state.task.task.filter(task => task.project_id === Number(searchParams.get('_id'))))


   const [modalShow, setModalShow] = useState(false)
   const [edit, setEdit] = useState(null)
   const [errors, setErrors] = useState({})
   const [stateErrors, setStateErrors] = useState({})
   const [detailsModal, setDetailsModal] = useState(false)
   const [form, setForm] = useState({
      head_task: '',
      body_task: '',
      priority: 1,
      files_task: {},
      status: '',
      subtasks: [],
      comments: [],
   })

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
      const {formErrors, stateErr} = vakidateFromAddTask(form)
      event.preventDefault();
      if (Object.keys(formErrors).length > 0) {
         setErrors(formErrors)
      } else {
         if (types === 'save') {
            const project = {
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
            dispatch(addTaskAction(project))
         } else {
            dispatch(editTaskAction({
               index: edit,
               newTaskName: form.head_task,
               newBodyTask: form.body_task,
               newPriority: form.priority,
               newFilesTask: form.files_task,
               newStatus: form.status,
            }))
         }
         setEdit(null);
         setModalShow(false);
      }
      setStateErrors(stateErr)
   }
   const deleteTask = (id) => {
      dispatch(delTaskAction(id))
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
            files_task: {},
            status: '',
            subtasks: [],
            comments: [],
         })
         setStateErrors({})
         setErrors({})
      }

   }, [modalShow])


   if (project.findIndex(project => project.name === searchParams.get('name') && project.id === Number(searchParams.get('_id'))) !== -1)
      return (
         <Container className={`mt-2`}>
            <div>
               <h4 className={`text-center`}>Диспетчер задач</h4>
               <hr/>
               <p className={`text-center`}>Выбран проект '{searchParams.get('name')}'</p>
            </div>
            <Row sm={12} className={`justify-content-center`}>
               <Col sm={4} className={`${styles.col} px-1`}>
                  <div className={styles.head}><h5 className={`text-center`}>Очередь</h5></div>
                  <div className={styles.body}>
                     <div onClick={() => setModalShow(true)}
                          className={`${styles_project.add_block} ${styles.task_add} transition_v2 mx-auto d-flex justify-content-center align-items-center`}>
                        <GrAdd/> Добавить
                     </div>
                     <AnimatePresence mode={"sync"}>
                        {tasks.map((task, index) =>
                           <motion.div key={task.id}
                                       layout
                                       initial={{scale: 0.8, opacity: 0}}
                                       animate={{scale: 1, opacity: 1}}
                                       exit={{scale: 0.8, opacity: 0}}
                                       transition={{type: "just"}}
                                       className={'position-relative mt-2'}>
                              <div className={`${styles.hover_task}`}>
                                 <Accordion className={`${styles.row_task}`} flush>
                                    <Accordion.Item eventKey="0">
                                       <Accordion.Header>{index + 1}. {task.head_task}</Accordion.Header>
                                       <Accordion.Body>
                                          <div className={`${styles.body_task}`}>
                                             <div><span>Номер задачи: </span> {task.id}</div>
                                             <div><span>Описание: </span> {task.body_task}</div>
                                             <div><span>Приоритет: </span> {task.priority}</div>
                                             <div><span>Статус: </span> {task.status}</div>
                                             <div><span>Кол-во подзадачь: </span> {task.subtasks.length}</div>
                                             ...
                                          </div>
                                          <div
                                             className={`w-100 d-flex justify-content-center mt-3 ${styles.group_button}`}>
                                             <Button variant="warning" size={"sm"}
                                                     className={`mx-1 d-flex align-items-center justify-content-center`}
                                                     onClick={() => {
                                                        setModalShow(true)
                                                        setEdit(index + 1)
                                                     }}>Изменить
                                                <MdOutlineModeEditOutline className={`ms-1`}/>
                                             </Button>
                                             <Button variant="secondary" size={"sm"}
                                                     className={`mx-1 d-flex align-items-center justify-content-center`}
                                                     onClick={() => {
                                                        setDetailsModal(true)
                                                        setSearchParams(searchParams + `&task=${index}`)
                                                     }}>Подробнее
                                                <MdOutlineInfo className={`ms-1`}/></Button>
                                             <Button variant="danger" size={"sm"}
                                                     className={`mx-1 d-flex align-items-center justify-content-center`}
                                                     onClick={() => deleteTask(task.id)}>Удалить
                                                <MdDeleteOutline className={`ms-1`}/>
                                             </Button>
                                          </div>
                                       </Accordion.Body>
                                    </Accordion.Item>
                                 </Accordion>
                                 {/*<span>{index + 1}. {task.body_task} {task.priority}</span>*/}
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </Col>
               <Col sm={4} className={`${styles.col} px-1`}>
                  <div className={styles.head}><h5 className={`text-center`}>Разработка</h5></div>
                  <div className={styles.body}>

                  </div>
               </Col>
               <Col sm={4} className={`${styles.col} px-1`}>
                  <div className={styles.head}><h5 className={`text-center`}>Исполнено</h5></div>
                  <div className={styles.body}>

                  </div>
               </Col>
            </Row>
            <Exit/>

            {modalShow || detailsModal ?
               <Modal1 show={detailsModal?detailsModal:modalShow} onHide={() => {
                  if(!detailsModal){
                     setEdit(null);
                     setModalShow(false);
                  } else{
                     searchParams.delete('task')
                     setSearchParams(searchParams)
                     setDetailsModal(false)
                  }
               }}>
                  {detailsModal?
                     <SubTask/>
                     :
                     <Form noValidate validated={!errors} onSubmit={event => save(event, !edit ? 'save' : 'edit')}
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
                              <Form.Label>Вложенные файлы</Form.Label>
                              <Form.Control isInvalid={!!errors['files_task']}
                                            isValid={stateErrors["files_task"]}
                                            type="file"/>
                              <Form.Control.Feedback type="invalid">
                                 {errors['files_task']}
                              </Form.Control.Feedback>
                           </Form.Group>
                           <div className={`${styles.modal_save} d-block`}>

                           </div>
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