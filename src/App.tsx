import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from "react-bootstrap";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Project from "./component/project/project";
import Task from "./component/task/task";
import './app.scss'
function App() {
  return (
    <Container className="App">
      <BrowserRouter>

         <Routes>
            <Route path={"/"} element={<Project/>}/>
            <Route path={"/project"} element={<Task/>}/>
         </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
