import styles from './sideBar.module.css'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabBox from '../TabBox'
import { useState, useCallback, useRef, memo, useEffect } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { userRoomSelector, tabSelector, curRoomIdSelector, roomSubscribedListSelector } from '../../redux/selector.js'
import { useSelector, useDispatch } from 'react-redux'
import tabSlice from '../../redux/Slice/tabSlice'
import roomsSlice from '../../redux/Slice/roomsSlice'
import darkThemeSlice from '../../redux/Slice/darkThemeSlice';
import { useNavigate } from 'react-router-dom'

function SideBar(){
    const [tabsList, setTabList] = useState(['home', 'info', 'new_room'])
    const [showAddTab, setShowAddTab] = useState(true)
    let tabValue = useSelector(tabSelector)
    let curRoomId = useSelector(curRoomIdSelector)
    const [tabIndex, setTabIndex] = useState(0)
    const addTab = useRef();
    const background = useRef();
    const userRoom = useSelector(userRoomSelector)
    const roomSubscribedList = useSelector(roomSubscribedListSelector)
    const nav = useNavigate();
    const dispatch = useDispatch();

    console.log('sidebar')

    const handleTabOnClickUserRoom = useCallback(async(value, id) => {
        if(value !== tabIndex){
            await dispatch(roomsSlice.actions.set_currentRoom(id))
            await dispatch(tabSlice.actions.set_tab(tabsList[value]))
            await setTabIndex(value)
            await nav(`room/${tabsList[value]}`)
        }
    })

    const handleTabOnClickMyRoom = useCallback(async(value, id) => {
        if(value !== tabIndex){
            await dispatch(roomsSlice.actions.set_currentRoom(id))
            await dispatch(tabSlice.actions.set_tab(tabsList[value]))
            await setTabIndex(value)
            await nav(`my_room`)
        }
    })

    const handleTabOnClick = useCallback((value) => {
        if(value !== tabIndex){
            dispatch(tabSlice.actions.set_tab(tabsList[value]))
            setTabIndex(value)
            nav(tabsList[value])
        }
    })

    useEffect(() =>{
        handleReRenderUserRoom()
    }
    , [userRoom])

    useEffect(() => {
        handleReRenderRoomSubscribedList()
    }
    , [roomSubscribedList])

    const handleReRenderUserRoom = async() => {
        if(userRoom != undefined) {
            await setTabList(prev => [...prev, userRoom.id])
            setShowAddTab(false)
        }
        else{
            await setTabList(prev => {
                return prev.filter(p => p != curRoomId)
            })
            await dispatch(roomsSlice.actions.set_currentRoom(''))
            setShowAddTab(true)
        }
    }

    const handleReRenderRoomSubscribedList = () => {
        const list = roomSubscribedList.map(r => r.id)
        setTabList(prev => [...prev, ...list])
    }

    useEffect(() => {
        if(tabValue === 'new_room'){
            dispatch(darkThemeSlice.actions.set_darkTheme(true))
            background.current.classList.add(styles.backgroundDarTheme)
            setTabIndex(tabsList.findIndex(tab => tabValue === tab))
        }
        else{
            dispatch(darkThemeSlice.actions.set_darkTheme(false))
            background.current.classList.remove(styles.backgroundDarTheme)
            setTabIndex(tabsList.findIndex(tab => tabValue === tab))
        }
    }, [tabValue])

    return (
        <div ref = {background} className = {styles.background}>
            <Tabs 
                sx = {{marginTop: '10px'}} 
                orientation="vertical" 
                variant="scrollable" 
                scrollButtons = 'auto' 
                value = {tabIndex}
                TabIndicatorProps = {{style: {display:'none'}}}
            >

                <TabBox value = {0} type = "home" onClick = {handleTabOnClick} isActive = {tabIndex}/>
                <TabBox value = {1} type = "info" onClick = {handleTabOnClick} isActive = {tabIndex}/>
                {   
                    showAddTab ? 
                    <Tab 
                        ref = {addTab}
                        value = {2} 
                        className = {styles.addWrapper} 
                        icon = {<AddCircleIcon className = {styles.addIcon} onClick = {() => {handleTabOnClick(2)}}/>}
                    />
                    :
                    <Tab value = {2} className = {styles.invisible}/>
                }
                {
                    userRoom && 
                        <TabBox
                            id = {userRoom.id} 
                            value = {tabsList.findIndex(val => val === userRoom.id)} 
                            type = "userTab" name = {userRoom.name} 
                            avatar = {userRoom.avatar} 
                            onClick = {handleTabOnClickMyRoom} 
                            isActive = {tabIndex}/>
                }
                {
                    roomSubscribedList && 
                    roomSubscribedList.map(room => (
                        <TabBox 
                            id = {room.id}
                            key = {tabsList.findIndex(val => val === room.id)}
                            value = {tabsList.findIndex(val => val === room.id)} 
                            type = "userTab" name = {room.name} 
                            avatar = {room.avatar} 
                            onClick = {handleTabOnClickUserRoom} 
                            isActive = {tabIndex}/>
                    ))
                        
                }
                
            </Tabs>    
        </div>
    )
}

export default memo(SideBar)