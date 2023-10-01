import React, {useEffect, useState} from 'react';
import styles from './sub-task-style.module.scss'
import {Alert, Badge, Button, Col, ListGroup, Modal, Row} from "react-bootstrap";
import {useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Root} from "../../models/root";
import moment from "moment";
import {saveFile} from "../../service/saveFile";
import {BsLink45Deg} from "react-icons/bs";

const SubTask = ({subtaskIndex, setSubtaskIndex, setDetailsModal}) => {
   const [searchParams, setSearchParams] = useSearchParams();
   const dispatch = useDispatch()
   const [sec, setSec] = useState('');
   const task_redux = useSelector((state: Root) => state.task.task[Number(searchParams.get('task'))])
   const [task, setTask] = useState(task_redux)
   let timer

   function getTimeAtWork() {
      const date = new Date()
      const date2 = new Date(task.time_at_work)
      const a = moment(date);
      const b = moment(date2);
      let c = a.diff(b, 'seconds')
      timer = setInterval(() => {
         c++;
         const day = Math.floor(c / (24 * 60 * 60))
         const hour = Math.floor((c - (day * 24 * 60 * 60)) / (60 * 60))
         const min = Math.floor((c - ((hour * 60 * 60) + (day * 24 * 60 * 60))) / 60)
         const sec = Math.floor((c - ((min * 60) + (hour * 60 * 60) + (day * 24 * 60 * 60))))
         setSec(`д: ${day},  ч: ${hour}, мин: ${min}, сек: ${sec}`)
      }, 1000)
   }

   useEffect(() => {
      getTimeAtWork()
      return () => {
         clearInterval(timer)
      }
   },[])

   useEffect(()=>{
      if(subtaskIndex !== null){
         if(JSON.stringify(task_redux.subtasks[searchParams.get("subtask")]) !== JSON.stringify(task)){
            setTask(task_redux.subtasks[searchParams.get("subtask")])
         }
      }else{
         if(JSON.stringify(task_redux) !== JSON.stringify(task)){
            setTask(task_redux)
         }
      }
   }, [task_redux])

   useEffect(()=>{
      if(subtaskIndex !== null){
         setTask(task_redux.subtasks[searchParams.get("subtask")])
      }else{
         setTask(task_redux)
      }
   }, [searchParams])
   return (
      <div>
         <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
               Информация о задаче
            </Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <Row>
               <Col>
                  <div><h5>Сведения</h5></div>
                  <div className={`${styles.body_task}`}>
                     <div><span>Номер задачи: </span> {task.id}</div>
                     <div><span>Описание: </span> {task.body_task}</div>
                     <div><span>Дата создания: </span> {`${new Date(task.date_of_creat).toLocaleString()}`}</div>
                     <div><span>Время работы: </span> {sec}</div>
                     <div><span>Приоритет: </span> {task.priority}</div>
                     <div><span>Статус: </span> {task.status}</div>
                     <div><span>Вложенный файл: </span> {task.files_task?.name?<a href={'#'} className={'link-success text-decoration-underline'} download onClick={(event)=>saveFile(task.files_task, event)}><BsLink45Deg/>{task.files_task.name}</a>:"(пусто)"}</div>
                  </div>
               </Col>
               {!subtaskIndex ?
                  <Col className={`${styles.body_task}`}>
                     <div className={''}><h5>Подзадачи</h5></div>
                     <ListGroup variant="flush">
                        <ListGroup.Item className={`text-center ${styles.add_sub} transition_v2`}
                                        onClick={()=> {
                                           setSubtaskIndex(Number(searchParams.get('task'))+1)
                                           setDetailsModal(false)
                                        }}>Открыть деспетчер подзадач</ListGroup.Item>
                        {task.subtasks.length ? task.subtasks.map((tas, index) =>
                           <ListGroup.Item action href="#">{index + 1}. {tas.head_task} {tas.files_task.name}</ListGroup.Item>
                        ) : <Alert variant={"secondary"} className={`mt-1 ${styles.alert}`}>список пуст :(</Alert>}
                     </ListGroup>
                  </Col> :
                  null
               }

            </Row>
            <div>

            </div>
         </Modal.Body>
         <Modal.Footer>

         </Modal.Footer>
      </div>
   );
};

export default SubTask;