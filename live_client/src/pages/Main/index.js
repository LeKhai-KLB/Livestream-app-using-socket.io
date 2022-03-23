import styles from './main.module.css'
import TopBar from '../../components/TopBar'
import SideBar from '../../components/SideBar'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {Outlet} from 'react-router-dom'
import { useEffect, memo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import LoopIcon from '@mui/icons-material/Loop';
import tabSlice from '../../redux/Slice/tabSlice'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { deleleUserRoute } from '../../APIRoutes'
import 'react-toastify/dist/ReactToastify.css';
import { userSelector } from '../../redux/selector'

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


function Main(){
  const user = useSelector(userSelector)
  const nav = useNavigate()
  const dispatch = useDispatch();
  const [showLoad, setShowLoad] = useState(false)

  const logOut = useCallback(async() => {
    setShowLoad(true)
    try{
      const body = {
        id: user.id,
      }
      const {data} = await axios.post(deleleUserRoute, {...body})
      setTimeout(() =>{
        nav('../')
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
    await nav('../')
  }

  useEffect(() => { 
    window.addEventListener('popstate', handleNavigate)
  }, [])

  const handleLoad = () => {
    dispatch(tabSlice.actions.set_tab('home'))
    nav('home')
  }

  useEffect(() => {
      window.addEventListener('load', handleLoad)
      return () => {
          window.removeEventListener('load', handleLoad)
      }
  }, [])

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
          <SideBar></SideBar>
          <Outlet/>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default memo(Main)