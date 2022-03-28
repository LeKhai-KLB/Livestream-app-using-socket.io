import { memo, useState, useCallback, useEffect } from 'react'
import styles from './home.module.css'
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RoomCard from '../../components/RoomCard';
import { useSelector, useDispatch } from 'react-redux'
import { tagsSelector, remainingRoomsSelector, userSelector, curRoomIdSelector } from '../../redux/selector'
import filterSlice from '../../redux/Slice/filterSlice'
import roomsSlice from '../../redux/Slice/roomsSlice';
import tabSlice from '../../redux/Slice/tabSlice'
import { useNavigate } from 'react-router-dom'
import LoopIcon from '@mui/icons-material/Loop';
import { joinRoomRoute } from '../../APIRoutes'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

function Home({socket}){

    const dispatch = useDispatch();
    const nav = useNavigate();

    const [searchValue, setSearchValue] = useState('');
    const [tagValue, setTagValue] = useState('All tag')
    const [showLoad, setShowLoad] = useState(false)

    const tags = useSelector(tagsSelector)
    const rooms = useSelector(remainingRoomsSelector)
    const user = useSelector(userSelector)
    const curRoomId = useSelector(curRoomIdSelector)

    const handleChangeSeachValue = (value) => {
        dispatch(filterSlice.actions.set_text(value))
        setSearchValue(value)
    }

    const handleClearSearchValue = () => {
        dispatch(filterSlice.actions.set_text(''))
        setSearchValue('')
    }

    const handleOnClickTag = useCallback((value) => {
        if(value === 'All tag'){
            dispatch(filterSlice.actions.set_tag(''))
        }
        else
            dispatch(filterSlice.actions.set_tag(value))
        setTagValue(value)
    })

    const handleClickRoom = useCallback(async(id) => {
        setShowLoad(true)
        try{
            if(id !== user.id && id !== 'Unknow-id'){
                const {coins, ...userData} = user
                const { data } = await axios.post(joinRoomRoute, {roomId: id, userId: user.id})
                if(data.msg === "You are already in this room"){
                    console.log("You are already in this room")
                    await dispatch(roomsSlice.actions.set_currentRoom(id))
                    setTimeout(() => handleNavigate(id)
                    , 2000)
                }
                else{
                    if(data.status === false){
                        console.log(data.msg)
                        setShowLoad(false)
                        toast.error(data.msg)
                    }
                    else{
                        
                        console.log("ssuccess")
                        await dispatch(roomsSlice.actions.add_user_join_room({id: id, user: userData}))
                        await dispatch(roomsSlice.actions.add_roomSubscribedList({id: id, user: userData}))
                        await dispatch(roomsSlice.actions.set_currentRoom(id))
                        setTimeout(() => handleNavigate(id)
                        , 2000)
                    }
                }
            }
            else{
                console.log("bang nhau")
                await dispatch(roomsSlice.actions.set_currentRoom(id))
                setTimeout(() => handleNavigate(id)
                , 2000)
            }
        }
        catch(error){
            setShowLoad(false)
            toast.error("Can't connect to server")
        } 
        
    })

    const handleNavigate = async(id) => {
        await dispatch(tabSlice.actions.set_tab(id))
        if(id !== user.id && id !== 'Unknow-id'){
            nav(`../room/${id}`)
        }
        else{
            nav(`../my_room`)
        }
    }

    return(
        <div className = {styles.background}>
            <ToastContainer style = {{top: '90px'}}></ToastContainer>
            {
                showLoad && (
                    <div className = {styles.handleContainer}>
                        <div className = {styles.loadContainer}>
                            <LoopIcon className = {styles.loadIcon}/>
                            <h4 className = {styles.loadTitle}>Loading...</h4>
                        </div>
                        <div className = {styles.overlay}></div>
                    </div>
                )
            }
            <div className = {styles.searchContainer}>
                <div className = {styles.tagsContainer}>
                    <div 
                        className = {`${styles.tagsElement} ${tagValue === 'All tag' ? styles.activeTag:''}`}
                        onClick = {() => handleOnClickTag('All tag')} 
                        >All tags
                    </div>
                    {
                        tags && tags.map((tag, index) => <div 
                                onClick = {() => handleOnClickTag(tag)} 
                                key = {index} 
                                className = {`${styles.tagsElement} ${tag === tagValue ? styles.activeTag:''}`}>
                                {tag}
                            </div>)
                    }
                </div>
                <div className = {styles.searchBar}>
                    <input spellCheck = "false" onChange = {e => handleChangeSeachValue(e.target.value)} value = {searchValue} className = {styles.searchInput} placeholder = "Search for id, user name..."/>
                    <ClearIcon onClick = {handleClearSearchValue}  className = {styles.clearIcon}/>
                    <SearchIcon className = {styles.searchIcon}/>
                </div>
                
            </div>
            <div className = {styles.roomCardContainer}>
                {
                    rooms && rooms.map((room, index) =>
                        <div key = {index} className = {styles.roomCardElement}>
                            <RoomCard 
                                onClick = {handleClickRoom}
                                id = {room.id}
                                views = {room.views}
                                index = {index}
                                thumbnail = {room.thumbnail}
                                avatar = {room.avatar}
                                title = {room.title}
                                name = {room.name}
                                description = {room.description}
                                tags = {room.tags}
                                tagClick = {handleOnClickTag}
                            />
                        </div>    
                    )
                }
            </div>
        </div>
    )
}

export default memo(Home)