import React from 'react';
import {Badge} from "react-bootstrap";
import styles from './logo-style.module.scss'
const Logo = () => {
   return (
      <h1 className={`mx-auto my-3 text-center mb-4 ${styles.main}`}>
         Добро пожаловать в <Badge bg="secondary">SPA</Badge> {"Todo"}
         <hr/>
      </h1>
   );
};

export default Logo;