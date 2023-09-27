import React from 'react';
import {Modal} from "react-bootstrap";

const Modal1 = (props) => {
   return (
      <Modal {...props}
             size="lg"
             aria-labelledby="contained-modal-title-vcenter"
             centered>
         {props.children}
      </Modal>
   );
};

export default Modal1;