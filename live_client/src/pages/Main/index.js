import styles from './main.module.css'
import TopBar from '../../components/TopBar'
import SideBar from '../../components/SideBar'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {Outlet} from 'react-router-dom'
import { useEffect, memo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import LoopIcon from '@mui/icons-material/Loop';
import tabSlice from '../../redux/Slice/tabSlice'
import tagsSlice from '../../redux/Slice/tagsSlice'
import roomsSlice from '../../redux/Slice/roomsSlice'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { deleleUserRoute, getAllRoomRoute, deleteRoomRoute, deleteMessagesRoute } from '../../APIRoutes'
import { userSelector } from '../../redux/selector'
import { io } from 'socket.io-client'

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system', 
      'BlinkMacSystemFont', 
      'Segoe UI', 
      'Roboto', 
      'Oxygen', 
      'Ubuntu', 
      'Cantarell', 
      'Fira Sans', 
      'Droid Sans', 
      'Helvetica Neue', 
      'sans-serif'
    ].join(','),
  },
});

function Main({socket, host}){
  const user = useSelector(userSelector)
  const nav = useNavigate()
  const dispatch = useDispatch();
  const [showLoad, setShowLoad] = useState(false)

  const logOut = useCallback(async(check, roomSubscribedList) => {
    setShowLoad(true)
    
    try{
      await axios.post(deleleUserRoute, {id: user.id})
      let tags;
      if(check){
        const { data } = await axios.post(deleteRoomRoute, {id: user.id})
        await axios.post(deleteMessagesRoute, {id: user.id})
        tags = [...data.tags]
      }
      const followedRooms = roomSubscribedList.map(r => r.id)
      if(socket.current !== undefined){
        await socket.current.emit('log-out', {id: user.id, tags: tags, isHadRoom: check, followedRooms: followedRooms, user: user})
      }
      setTimeout(() =>{
        nav('../')
        socket.current = undefined
      }
      , 2000)
    }
    catch(err){
      setTimeout(() =>{
        nav('../')
      }
      , 2000)
    }
    
  }, [])

  const handleNavigate = async() => {
    try{
      const {data} = await axios.post(deleleUserRoute, {id: user.id})
      let tags;
      if(true){
        const { data } = await axios.post(deleteRoomRoute, {id: user.id})
        await axios.post(deleteMessagesRoute, {id: user.id})
        tags = [...data.tags]
      }
      if(socket.current !== undefined){
        await socket.current.emit('log-out', {id: user.id, tags: data.tags, isHadRoom: true})
      }
      setTimeout(() =>{
        nav('../')
        socket.current = undefined
      }
      , 2000)
    }
    catch(err){
      setTimeout(() =>{
        nav('../')
      }
      , 2000)
    }
  }

  useEffect(async() => { 
    window.addEventListener('popstate', handleNavigate)
    window.addEventListener('load', handleLoad)
    if(socket.current === undefined){
      socket.current = io(host, {reconnection: false})
    }
    try{
      const {data} = await axios.get(getAllRoomRoute)
      if(data.roomList.length !== 0){
        await dispatch(roomsSlice.actions.set_roomList(data.roomList))

        const arrayOfTags = data.roomList.map(r => r.tags)
        const tags = arrayOfTags.flat(Infinity)
        await dispatch(tagsSlice.actions.add_tags(tags))
      }
    }
    catch(error){
    }
    return () => {
          window.removeEventListener('load', handleLoad)
    }
  }, [])

  const handleLoad = () => {
    dispatch(tabSlice.actions.set_tab('home'))
    nav('home')
  }

  return (
    <ThemeProvider theme={theme}>
      <div className= {styles.background}>
        {
          showLoad && (
              <div className = {styles.handleContainer}>
                  <div className = {styles.loadContainer}>
                      <LoopIcon className = {styles.loadIcon}/>
                      <h4 className = {styles.loadTitle}>Log out...</h4>
                  </div>
                  <div className = {styles.overlay}></div>
              </div>
          )
        }
        <TopBar logOut = {logOut}/>
        <div className = {styles.container}>
          
          <SideBar socket = {socket}></SideBar>
          <Outlet/>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default memo(Main)