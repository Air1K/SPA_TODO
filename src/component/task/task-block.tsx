import React, {useEffect, useRef, useState} from 'react';
import styles from "./task-style.module.scss";
import {Accordion, Button} from "react-bootstrap";
import {MdDeleteOutline, MdOutlineInfo, MdOutlineModeEditOutline} from "react-icons/md";
import {AnimatePresence, motion, useDragControls} from "framer-motion";
import {delTaskAction} from "../../store/task";
import {useDispatch} from "react-redux";
import {useSearchParams} from "react-router-dom";

const TaskBlock = ({tasks, setTasks, tasks_redux, setModalShow, setEdit, setDetailsModal, subtaskIndex, col, editStatusTask, setOnDrag}) => {
   const [searchParams, setSearchParams] = useSearchParams();
   const [styleDrag, setStyleDrag] = useState({})
   const controls = useDragControls()
   const dispatch = useDispatch()
   const deleteTask = (id) => {
      dispatch(delTaskAction(id))
      setTasks(tasks_redux)
   }
   return (
      <AnimatePresence mode={"sync"}>
         {tasks.map((task, index) =>
            task.status === col ?
               <motion.div drag
                           key={task.id}
                           onDragStart={(event)=> {
                              setStyleDrag({pointerEvents: "none"});
                              // (event.target as HTMLInputElement).style.pointerEvents = "none";
                              setOnDrag(true)
                           }}
                           onDragEnd={(event)=> {
                              setStyleDrag({pointerEvents: "painted"});
                              // (event.target as HTMLInputElement).style.pointerEvents = "painted"
                              editStatusTask(index)
                              setOnDrag(false)
                           }}
                           // onDrop={}
                           dragControls={controls}
                           dragListener={true}
                           dragSnapToOrigin
                           style={styleDrag}>
                  <motion.div layout
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
                                               if (subtaskIndex === null) {
                                                  console.log("+++++++++++")
                                                  searchParams.delete('task')
                                                  setSearchParams(searchParams)
                                                  setSearchParams(searchParams + `&task=${index}`)
                                               } else {
                                                  console.log("------------", index)
                                                  searchParams.delete('subtask')
                                                  setSearchParams(searchParams)
                                                  setSearchParams(searchParams + `&subtask=${index}`)
                                               }

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
                     </div>
                  </motion.div>
               </motion.div> : null
         )}
      </AnimatePresence>
   );
};

export default TaskBlock;