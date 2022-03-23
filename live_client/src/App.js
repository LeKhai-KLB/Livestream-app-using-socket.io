import React from 'react';
import Login from './pages/Login'
import Main from './pages/Main'
import NewRoom from './pages/NewRoom'
import Home from './pages/Home'
import Info from './pages/Info'
import MyRoom from './pages/MyRoom'
import Room from './pages/Room'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  IndexRoute
} from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route index element = {<Login/>} exact/>
        <Route path = "main"  element = {<Main/>}>
          <Route path = "home" element = {<Home/>}/>
          <Route path = "new_room" element = {<NewRoom/>}/>
          <Route path = "info" element = {<Info/>}/>
          <Route path = "my_room" element = {<MyRoom/>}/>
          <Route path = "room/:id" element = {<Room/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
