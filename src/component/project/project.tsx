import React, {useEffect, useState} from 'react';
import styles from './project-style.module.scss'
import {GrAdd} from "react-icons/gr";
import Logo from "./logo/logo";
import {Button, Col, FloatingLabel, Modal, Form} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {Root} from "../../models/root";
import Modal1 from "../myModal/modal_1";
import {validateFormAddProject} from "../../validation/validated";
import {MdDeleteOutline, MdOutlineModeEditOutline} from 'react-icons/md'
import {AnimatePresence, motion} from "framer-motion";
import {addProjectAction, delProjectAction, editProjectAction} from "../../store/project";
import {Link} from "react-router-dom";

const Project = () => {
   const dispatch = useDispatch()
   const project = useSelector((state: Root) => state.project.project)
   const [modalShow, setModalShow] = useState(false)
   const [edit, setEdit] = useState(null)
   const [errors, setErrors] = useState({})
   const [stateErrors, setStateErrors] = useState({})
   const [form, setForm] = useState({name: ''})

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
      const {formErrors, stateErr} = validateFormAddProject(form)
      event.preventDefault();
      console.log("eeee", formErrors, stateErr)
      if (Object.keys(formErrors).length > 0) {
         setErrors(formErrors)
      } else {
         if (types === 'save') {
            const project = {
               id: Date.now(),
               name: form.name
            }
            dispatch(addProjectAction(project))
         } else {
            dispatch(editProjectAction({index: edit, newProjectName: form.name}))
         }
         setEdit(null);
         setModalShow(false)
      }
      setStateErrors(stateErr)
   }
   const deleteProject = (id) => {
      dispatch(delProjectAction(id))
   }
   useEffect(() => {
      setForm({name: ''})
      setStateErrors({})
      setErrors({})
   }, [modalShow])
   useEffect(() => {
      if (edit) {
         setForm({name: project[edit - 1].name})
      }
   }, [edit])
   return (
      <div className={`px-1`}>
         <Logo/>
         <main className={`${styles.main} mx-auto`}>
            <p className={`text-center`}>{project.length === 0 ? 'Список проектов пуст но вы можете его создать :)' : 'Выберите нужный проект'}</p>
            <div
               className={`${styles.add_block} transition_v2 mx-auto d-flex justify-content-center align-items-center`}
               onClick={() => setModalShow(true)}><GrAdd/>Добавить</div>

            <Col className={'mt-2'}>
               <AnimatePresence mode={"sync"}>
                  {project.map((proj, index) =>
                     <motion.div key={proj.id}
                                 layout
                                 initial={{scale: 0.8, opacity: 0}}
                                 animate={{scale: 1, opacity: 1}}
                                 exit={{scale: 0.8, opacity: 0}}
                                 transition={{type: "just"}}
                                 className={'position-relative'}>
                        <div
                              className={`${styles.row} d-flex align-items-center justify-content-between mb-1 px-4 transition_v2`}>
                           <div className={``}>{index + 1}. {proj.name}</div>
                           <div className={`position-relative z-2 ms-2 ${styles.button_project}`}>
                              <MdOutlineModeEditOutline className={`svg_edit transition_v2`}
                                                        onClick={() => {
                                                           setEdit(index + 1)
                                                           setModalShow(true)
                                                        }}/>
                              <MdDeleteOutline className={'svg_delete transition_v2'}
                                               onClick={() => deleteProject(proj.id)}/>
                           </div>
                           <Link to={`/project?name=${proj.name}&_id=${proj.id}`} className={`position-absolute top-0 start-0 end-0 bottom-0`}></Link>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </Col>

         </main>

         {modalShow ?
            <Modal1 show={modalShow} onHide={() => {
               setEdit(null);
               setModalShow(false);
            }}>
               <Form noValidate validated={!errors} onSubmit={event => save(event, !edit ? 'save' : 'edit')}
                     className={'d-block w-100'}>
                  <Modal.Header closeButton>
                     <Modal.Title id="contained-modal-title-vcenter">
                        {!edit ? "Создание проекта" : "Изменение названия проекта"}
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className={'d-block'}>

                     <FloatingLabel
                        controlId="floatingInput"
                        label="Название проекта"
                        className="mb-3"
                     >
                        <Form.Control type="name" value={form.name}
                                      onChange={event => setField('name', event.target.value)}
                                      required
                                      placeholder="Project"
                                      isInvalid={!!errors['name']}
                                      isValid={stateErrors["name"]}/>
                        <Form.Control.Feedback type="invalid">
                           {errors['name']}
                        </Form.Control.Feedback>
                     </FloatingLabel>
                     <div className={`${styles.modal_save} d-block`}>

                     </div>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant={'outline-dark'}
                             type={'submit'}>Сохранить</Button>
                  </Modal.Footer>
               </Form>
            </Modal1> : null}
      </div>
   );
};

export default Project;