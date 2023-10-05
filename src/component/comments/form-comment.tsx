import React from 'react';
import {FloatingLabel, Form} from "react-bootstrap";
import {inspect} from "util";
import styles from './get-comments-style.module.scss'

const FormComment = ({commentTarget, setCommentTarget}) => {

   return (
      <div className={styles.border}>
         <FloatingLabel controlId="floatingTextarea2" label="Comments">
            <Form.Control
               value={commentTarget.comment} onChange={(event)=>setCommentTarget({...commentTarget, comment: event.target.value})}
               as="textarea"
               placeholder="Leave a comment here"
               style={{ height: '100px' }}
            />
         </FloatingLabel>

      </div>
   );
};

export default FormComment;