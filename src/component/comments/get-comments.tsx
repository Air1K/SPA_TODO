import React, {useEffect, useState} from 'react';
import {memo} from "react";
import styles from './get-comments-style.module.scss'
import {
   MdClose, MdAddComment
} from 'react-icons/md'
import {useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {addComment, addCommentSubtask, delComment} from "../../store/task";
import FormComment from "./form-comment";
import {Button} from "react-bootstrap";

const GetComments = ({comments, indexActive, setIndexActive}) => {
   const [searchParams, setSearchParams] = useSearchParams();
   const dispatch = useDispatch()
   const [commentTarget, setCommentTarget] = useState({name_user: 'default user', comment: ''})

   if (!comments?.length) {
      return null;
   }

   function closeComment(date) {
      if(searchParams.get("subtask")){
         dispatch(delComment({idTask: searchParams.get("task"), idSubtask: searchParams.get("subtask"), id: date}))
      } else {
         dispatch(delComment({idTask: searchParams.get("task"), idSubtask: null, id: date}))
      }
   }

   function editIndexActive(date) {

      setIndexActive(date)
   }
   function addComments(date){
      if(searchParams.get("subtask")){
         dispatch(addCommentSubtask({idTask: searchParams.get("task"), idSubtask: searchParams.get("subtask"), ...commentTarget, id: date}))
      } else {
         dispatch(addComment({idTask: searchParams.get("task"), ...commentTarget, id: date}))
      }
      setIndexActive(null)
   }

   return (
      <div className={`w-100`}>
         {comments.map((comm, index) =>
            <div key={index} className={`ms-2  ${styles.commentsBefore}`}>
               <div className={`d-flex justify-content-between`}><span className={styles.span_el}>{comm.name_user}</span> <span className={`transition_v2 ${styles.close}`} onClick={()=>closeComment(comm.date)}><MdClose/></span></div>
               <div>{comm.comment}</div>
               <span className={`transition_v2 ${styles.add_coments}`} onClick={()=>editIndexActive(comm.date)}><MdAddComment/></span>
               {indexActive===comm.date?<div>
                  <FormComment commentTarget={commentTarget} setCommentTarget={setCommentTarget}/>
                  <div className={`w-100 d-flex justify-content-end mt-0 p-1 ${styles.bottom}`}><Button size={'sm'} onClick={() => addComments(comm.date)}>Сохранить</Button></div>
               </div>:null}
               <hr/>
               {comm?.comment.length?
                  <GetComments comments={comm?.comments} indexActive={indexActive} setIndexActive={setIndexActive}/>
                  :null}
            </div>
         )}

      </div>);
};

export default GetComments;