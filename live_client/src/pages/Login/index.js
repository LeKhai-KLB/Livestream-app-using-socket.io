import styles from './login.module.css';
import { Button } from '@mui/material'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import Avatars from '../../assets/Avatars'
import {useState, useRef, useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { v4 } from 'uuid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import darkThemeSlice from '../../redux/Slice/darkThemeSlice'
import filterSlice from '../../redux/Slice/filterSlice'
import roomsSlice from "../../redux/Slice/roomsSlice";
import tagsSlice from "../../redux/Slice/tagsSlice"
import tabSlice from "../../redux/Slice/tabSlice";
import userSlice from "../../redux/Slice/userSlice"
import messagesDataSlice from '../../redux/Slice/messagesDataSlice';
import axios from 'axios';
import { registerRoute } from '../../APIRoutes'

const avars = Avatars()
let loadingId;

const button = {
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)',
  mt: '28px',
  backgroundColor: '#9147FF',
  width: '350px',
  borderRadius: '8px',
  '&:hover':{
    opacity: .9,
    backgroundColor: '#9147FF',
  }
}

function Login() {
  const dispatch = useDispatch();
  const mainAvatar = useRef()
  const inp = useRef()
  const btn = useRef()
  const [avatarId, setAvatarId] = useState(0);
  const [userName, setUserName] = useState('');
  const his = useNavigate()

  const handleClick = index => {
    if(index !== avatarId){
      const prevSelectedAvatar = document.getElementById(avatarId)
      const selectedAvatar = document.getElementById(index)
      prevSelectedAvatar.classList.toggle(styles.smallAvatarActive)
      selectedAvatar.classList.toggle(styles.smallAvatarActive)
      setAvatarId(index)
      mainAvatar.current.src = avars[index]
    }
  }

  const resetAll = () => {
    dispatch(darkThemeSlice.actions.reset_darkTheme(true))
    dispatch(filterSlice.actions.reset_filter(true))
    dispatch(roomsSlice.actions.reset_rooms(true))
    dispatch(tagsSlice.actions.reset_tags(true))
    dispatch(tabSlice.actions.reset_tab(true))
    dispatch(userSlice.actions.reset_user(true))
    dispatch(messagesDataSlice.actions.reset_messages(true))
  }

  useEffect(() =>
    resetAll()
  , [])

  const handleSubmit = async (e) => {
      e.preventDefault()
      if(userName === ''){
        await toast.error('Do not leave the input field blank')
        inp.current.focus()
        return;
      }
      else{
        btn.current.disabled = true;
        loadingId = toast.loading('Loading')
        await setUserInStore()
      }
  }

  const setUserInStore = async() => {
    const user = {
      name: userName,
      id: v4(),
      image: mainAvatar.current.src
    }
    try{
      const { data } = await axios.post(registerRoute, {...user}) 
      if(data.status === false){
        toast.dismiss(loadingId)
        toast.error(data.msg)
        btn.current.disabled = false
      }
      else{
      toast.dismiss(loadingId)
        toast.success('Ready to start...')
        await dispatch(userSlice.actions.set_user(data.user))
        await setTimeout(() => {
          his(`main/home`)
        }, 2000)
      }
    }
    catch(err){
      toast.dismiss(loadingId)
      toast.error("Can't connect to server")
      btn.current.disabled = false
    }
  }

  useEffect(() => {
    const firstSelectedAvatar = document.getElementById(avatarId)
    firstSelectedAvatar.classList.add(styles.smallAvatarActive)
  }, [])

  return (
    <div className={styles.background}>
      <ToastContainer></ToastContainer>
      <form className={styles.container}> 
        <h2 className = "welcome">Welcome guest!</h2>
        <img ref = {mainAvatar} alt = "avatar" className={styles.avatar} src = {avars[0]}></img>
        <input ref = {inp} placeholder="Type your name..." className={styles.input} value = {userName} 
          onChange={e => {setUserName(e.target.value)}}>
        </input>
        <div className = {styles.image_container}>
          {avars.map((img, index) => 
            <img 
              id = {index}
              value = {avatarId}
              key = {index} 
              alt = "avatar" 
              className={`${styles.avatar} ${styles.smallAvatar}`} 
              src = {img}
              onClick = {() => handleClick(index)}>
            </img>
          )}
        </div>
        <Button ref = {btn} onClick = {e => handleSubmit(e)} variant = "contained" sx = {button} endIcon = {<RadioButtonCheckedIcon sx = {{color: '#e94f69', ml:'5px'}}/>}>Let's start!</Button>
      </form>
    </div>
  );
}

export default memo(Login);
