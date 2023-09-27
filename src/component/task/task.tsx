import React, {useEffect, useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Root} from "../../models/root";
import {Alert, Button, Col, Container, FloatingLabel, Form, Modal, Row} from "react-bootstrap";
import {IoChevronBackOutline} from 'react-icons/io5'
import styles from './task-style.module.scss'
import styles_project from '../project/project-style.module.scss'
import {GrAdd} from "react-icons/gr";
import Modal1 from "../myModal/modal_1";
import {vakidateFromAddTask, validateFormAddProject} from "../../validation/validated";
import {addProjectAction, editProjectAction} from "../../store/project";
import {addTaskAction, editTaskAction} from "../../store/task";
import {AnimatePresence, motion} from 'framer-motion';

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
   const tasks = useSelector((state: Root) => state.task.task)
   const [modalShow, setModalShow] = useState(false)
   const [edit, setEdit] = useState(null)
   const [errors, setErrors] = useState({})
   const [stateErrors, setStateErrors] = useState({})
   const [form, setForm] = useState({
      head_task: '',
      body_task: '',
      priority: '',
      files_task: '',
      status: '',
      subtasks: [],
      comments: [],
      name_user: 'Default user',
      comment: ''
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
               id: Date.now(),
               head_task: form.head_task,
               body_task: form.body_task,
               priority: form.priority,
               files_task: form.files_task,
               status: form.status,
               subtasks: form.subtasks,
               comments: form.comments,
               name_user: form.name_user,
               comment: form.comment
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
               newSubtasks: form.subtasks
            }))
         }
         setEdit(null);
         setModalShow(false);
      }
      setStateErrors(stateErr)
   }
   useEffect(() => {
      setForm({
         head_task: '',
         body_task: '',
         priority: '',
         files_task: '',
         status: '',
         subtasks: [],
         comments: [],
         name_user: 'Default user',
         comment: ''
      })
      setStateErrors({})
      setErrors({})
   }, [modalShow])

   if (project.findIndex(project => project.name === searchParams.get('name') && project.id === Number(searchParams.get('_id'))) !== -1)
      return (
         <Container className={`mt-2`}>
            <div>
               <h4 className={`text-center`}>Диспетчер задач</h4>
               <hr/>
               <p className={`text-center`}>Выбран проект '{searchParams.get('name')}'</p>
            </div>
            <Row className={`${styles.main}`}>
               <Col className={`${styles.col}`}>
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
                                       className={'position-relative'}>
                              <div>
                                 <span>{index + 1}. {task.body_task}</span>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </Col>
               <Col className={`${styles.col}`}>
                  <div className={styles.head}><h5 className={`text-center`}>Разработка</h5></div>
                  <div className={styles.body}></div>
               </Col>
               <Col className={`${styles.col}`}>
                  <div className={styles.head}><h5 className={`text-center`}>Исполнено</h5></div>
                  <div className={styles.body}></div>
               </Col>
            </Row>
            <Exit/>

            {modalShow ?
               <Modal1 show={modalShow} onHide={() => {
                  setEdit(null);
                  setModalShow(false);
               }}>
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
                           controlId="floatingInput"
                           label="Описание"
                           className="mb-3"
                        >
                           <Form.Control type="text" value={form.body_task}
                                         onChange={event => setField('body_task', event.target.value)}
                                         required
                                         placeholder="body task"
                                         isInvalid={!!errors['body_task']}
                                         isValid={stateErrors["body_task"]}/>
                           <Form.Control.Feedback type="invalid">
                              {errors['body_task']}
                           </Form.Control.Feedback>
                        </FloatingLabel>

                        {/*<FloatingLabel*/}
                        {/*   controlId="floatingInput"*/}
                        {/*   label="Вложенные файлы"*/}
                        {/*   className="mb-3"*/}
                        {/*>*/}
                        {/*   <Form.Control type="text" value={form.body_task}*/}
                        {/*                 onChange={event => setField('body_task', event.target.value)}*/}
                        {/*                 required*/}
                        {/*                 placeholder="body task"*/}
                        {/*                 isInvalid={!!errors['body_task']}*/}
                        {/*                 isValid={stateErrors["body_task"]}/>*/}
                        {/*   <Form.Control.Feedback type="invalid">*/}
                        {/*      {errors['body_task']}*/}
                        {/*   </Form.Control.Feedback>*/}
                        {/*</FloatingLabel>*/}

                        <div className={`${styles.modal_save} d-block`}>

                        </div>
                     </Modal.Body>
                     <Modal.Footer>
                        <Button variant={'outline-dark'}
                                type={'submit'}>Сохранить</Button>
                     </Modal.Footer>
                  </Form>
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