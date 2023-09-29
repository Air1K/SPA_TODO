import React, {useEffect, useState} from 'react';
import styles from './sub-task-style.module.scss'
import {Modal} from "react-bootstrap";
import {useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Root} from "../../models/root";
import moment from "moment";
const SubTask = () => {
   const [searchParams, setSearchParams] = useSearchParams();
   const dispatch = useDispatch()
   const [sec, setSec] = useState('')
   const task = useSelector((state: Root) => state.task.task[Number(searchParams.get('task'))])
   let timer
   function getTimeAtWork(){
      const date = new Date()
      const date2 = new Date(task.time_at_work)
      const a = moment(date);
      const b = moment(date2);
      let c = a.diff(b, 'seconds')
      timer = setInterval(()=>{
         c++;
         const day = Math.floor(c / (24*60*60))
         const hour = Math.floor((c - (day*24*60*60)) / (60*60))
         const min = Math.floor((c - ((hour*60*60) + (day*24*60*60)))/60)
         const sec = Math.floor((c - ((min*60) + (hour*60*60) + (day*24*60*60) )))
         setSec(`д: ${day},  ч: ${hour}, мин: ${min}, сек: ${sec}`)
      }, 1000)
   }
   useEffect(()=>{
      getTimeAtWork()
      return ()=>{
         clearInterval(timer)
      }
   })
   return (
      <div>
         <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" >
               Информация о задаче
            </Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <div className={`${styles.body_task}`}>
               <div><span>Номер задачи: </span> {task.id}</div>
               <div><span>Описание: </span> {task.body_task}</div>
               <div><span>Дата создания: </span> {`${new Date(task.date_of_creat).toLocaleString()}`}</div>
               <div><span>Время работы: </span> {sec}</div>
               <div><span>Приоритет: </span> {task.priority}</div>
               <div><span>Статус: </span> {task.status}</div>
               <div><span>Кол-во подзадачь: </span> {task.subtasks.length}</div>
            </div>
         </Modal.Body>
         <Modal.Footer>

         </Modal.Footer>

      </div>
   );
};

export default SubTask;