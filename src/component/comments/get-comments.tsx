import React from 'react';
import {memo} from "react";
import styles from './get-comments-style.module.scss'

const GetComments = ({comments}) => {
   console.log(comments)
   if (!comments.length) {
      return null;
   }
   return (
      <div className={`w-100`}>
         {comments.map((comm, index) =>
            <div key={index}>
               <div>{comm.name_user}</div>
               <div>{comm.comment}</div>
               <GetComments comments={comm.comments}/>
            </div>
         )}
      </div>);

};

export default memo(GetComments);