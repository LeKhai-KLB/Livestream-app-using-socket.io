import React, {useEffect, useRef} from 'react';
import Login from './pages/Login'
import Main from './pages/Main'
import NewRoom from './pages/NewRoom'
import Home from './pages/Home'
import Info from './pages/Info'
import MyRoom from './pages/MyRoom'
import Room from './pages/Room'
import {host} from './APIRoutes'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  let socket = useRef()
  return (
    <Router>
      <Routes>
        <Route index element = {<Login socket = {socket} host = {host}/>} exact/>
        <Route path = "main"  element = {<Main socket = {socket} host = {host}/>}>
          <Route path = "home" element = {<Home socket = {socket}/>}/>
          <Route path = "new_room" element = {<NewRoom socket = {socket}/>}/>
          <Route path = "info" element = {<Info/>}/>
          <Route path = "my_room" element = {<MyRoom socket = {socket}/>}/>
          <Route path = "room/:id" element = {<Room socket = {socket}/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
