import styles from './myRoom.module.css';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { curRoomSelector, currentDonateSelector } from '../../redux/selector';
import tabSlice from '../../redux/Slice/tabSlice'
import roomsSlice from '../../redux/Slice/roomsSlice';
import tagsSlice from '../../redux/Slice/tagsSlice';
import messagesDataSlice from '../../redux/Slice/messagesDataSlice'
import {memo, useState, useRef, useEffect } from 'react'
import ReplayIcon from '@mui/icons-material/Replay';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Slider from '@mui/material/Slider';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import imgPlaceholder from '../../assets/placeholder/imgPlaceholder.png'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBox from '../../components/ChatBox'
import DonateBox from '../../components/DonateBox';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoopIcon from '@mui/icons-material/Loop';

function MyRoom(){
    const currentDonate = useSelector(currentDonateSelector)
    const curRoom = useSelector(curRoomSelector);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [stream, setStream] = useState(null)
    const [isPause, setIsPause] = useState(false)
    const [showCam, setShowCam] = useState(true)
    const [muted, setMuted] = useState(true)
    const [volumeValue, setVolumeValue] = useState(50)
    const [timeStamp, setTimeStamp] = useState('')
    const [isOnline, setIsOnline] = useState(false)
    const [showLoad, setShowLoad] = useState(false)
    const [showNoti, setShowNoti] = useState(false)
    const video = useRef();
    const timeLine = useRef();
    let timerIdNoti = undefined;
    
    let timerId;

    console.log('room')

    const handleOut = async() => {
        setShowLoad(true)
        await dispatch(tabSlice.actions.set_tab('home'))    
        await dispatch(messagesDataSlice.actions.remove_messSageRoomData((curRoom.id)))
        await dispatch(roomsSlice.actions.remove_room(curRoom.id))
        await dispatch(roomsSlice.actions.set_currentRoom(''))
        await dispatch(tagsSlice.actions.remove_tags(curRoom.tags))
        await setTimeout(() => nav('../home'), 1000)
    }

    const showError = () => {
        if(timerId !== undefined){
            clearInterval(timerId)
        }
        video.current.srcObject = null;
        setStream(null)
        setIsOnline(false)
    }

    const setMediaDevices = () => {
        navigator.mediaDevices.getUserMedia({video:true, audio:true})
            .then((currentStream) => {
                setStream(currentStream)
                video.current.srcObject = currentStream
                video.current.srcObject.getVideoTracks()[0].addEventListener('ended', showError)
                setIsOnline(true)
                setIsPause(false)
                setShowCam(true)
                if(timeLine.current !== undefined){
                    timeLine.current.addEventListener('mouseover', handleChangeTimeStamp)
                    timeLine.current.addEventListener('mouseout', handleRemoveTimerId)
                }
            })
            .catch(()=>{
                if(stream !== null){
                    video.current.srcObject = null
                    setStream(null)
                }
            })
    }

    useEffect(() => {
        if(currentDonate !== undefined){
            if(!currentDonate.isShow){
                if(timerIdNoti !== undefined){
                    clearTimeout(timerIdNoti)
                }
                setShowNoti(false)
                setShowNoti(true)
                timerIdNoti = setTimeout(() => setShowNoti(false), 8000)
                dispatch(messagesDataSlice.actions.set_isShowCurrentDonate(curRoom.id))
            }
        }
    }
    , [currentDonate])

    useEffect(() => 
        setMediaDevices()
    , [])

    const handleChangeTimeStamp = () => {
        timerId = setInterval(() => {
            setTimeStamp(prev => {
                const date = new Date()
                const newTimeStamp = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
                return newTimeStamp 
            })
        }, 1000)
    }

    const handleRemoveTimerId = () => {
        clearInterval(timerId)
    }

    const toggleCam = () => {
        video.current.srcObject.getVideoTracks()[0].enabled = !video.current.srcObject.getVideoTracks()[0].enabled
        setShowCam(!showCam)
    }

    const pauseStream = () => {
        setMediaControlsContainer(true)
        video.current.pause()
        setIsPause(true)
    }

    const setMediaControlsContainer = (val) => {
        const mediaControlsContainer = document.getElementById('mediaControls')
        val === true  ? mediaControlsContainer.classList.add(styles.showLinear):
        mediaControlsContainer.classList.remove(styles.showLinear)
    }

    const playStream = () => {
        setMediaControlsContainer(false)
        video.current.play()
        setIsPause(false)
    }

    const toggleVolumn = () => {
        setMuted(!muted)
        setVolumeValue(prev => {
            const val = (muted === true ? 0:30)
            video.current.volume = val /100
            return val
        })
    }

    const handleChangeVolume = (value) => {
        setVolumeValue(value)
        video.current.volume = value / 100
    }

    return (
        <div className = {styles.background}>
            {
                showLoad && (
                    <div className = {styles.handleContainer}>
                        <div className = {styles.loadContainer}>
                            <LoopIcon className = {styles.loadIcon}/>
                            <h4 className = {styles.loadTitle}>Leaving room...</h4>
                        </div>
                        <div className = {styles.overlay}></div>
                    </div>
                )
            }
            <div className = {styles.streamContainer}>
                <div className = {styles.videoContainer}>
                    {isOnline &&
                        <div className = {styles.donateBox}>
                            <DonateBox isAdmin = {true}/>
                        </div>
                    }
                    {showNoti &&    
                        <div className = {styles.donateNotiContainer}>
                            <div className={styles.wrapper_bg_bubbles}>
                                <ul className={styles.bg_bubbles}>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                </ul>
                            </div>
                            <h2 className = {styles.donateNotiText}>{currentDonate.name === '' ? 'unknow':currentDonate.name} <span>sent you {currentDonate.amount} {currentDonate.itemName}</span></h2>
                            <img className = {styles.donateNotiImage} src = {currentDonate.itemImage} alt = "donate">
                            </img>
                        </div>
                    }
                    <video autoPlay playsInline muted = {false} ref = {video} className = {styles.videoScreen}/>
                    {stream === null ?
                        <div id = "mediaControls" className = {`${styles.mediaControlsContainer} ${styles.showLinear}`}>
                            <ReplayIcon onClick = {() => setMediaDevices()} className = {styles.mediaButton_big}></ReplayIcon> 
                            <h3 className = {styles.ctaReload}>Your device is not connected, please connect before reloading!</h3>   
                        </div>
                        :
                        <div id = "mediaControls" className = {styles.mediaControlsContainer}>
                            <div className = {styles.topControlsContainer}>
                                <div className = {styles.halfContainerLeft}>
                                    {showCam === true ?
                                        <VideocamIcon onClick = {() => toggleCam()} className = {styles.mediaButton_small}></VideocamIcon>
                                        :<VideocamOffIcon onClick = {() => toggleCam()} className = {styles.mediaButton_small}></VideocamOffIcon>
                                    }
                                </div>
                                <div className = {styles.halfContainerRight}>
                                    <div className = {styles.viewsContainer}>
                                        <div className = {styles.viewsNumber}>
                                            { curRoom && (curRoom.views >= 1000 ? `${curRoom.views/1000} N`.replace('.', ','):curRoom.views)}
                                        </div>
                                        <VisibilityIcon className = {styles.viewsIcon}></VisibilityIcon>
                                    </div>
                                    <div className = {styles.liveState}>Live</div>
                                </div>
                            </div>
                            {isPause &&
                                <PlayArrowIcon onClick = {() => playStream()} className = {styles.mediaButton_big}></PlayArrowIcon>
                            }    
                            <div className = {styles.botControlsContainer}>
                                <div ref = {timeLine} className = {styles.hoverLay}>
                                    <div className = {styles.timeLine}>
                                        <div className = {styles.timeRoller}></div>
                                        <h5 className = {styles.timeStamp}>{timeStamp}</h5>
                                    </div>
                                </div>
                                <div className = {styles.smallButtonContainer}>
                                    <div className = {styles.halfContainerLeft}>
                                        {isPause === true ?
                                            <PlayArrowIcon onClick = {() => playStream()} className = {`${styles.mediaButton_small} ${styles.margin_right}`}></PlayArrowIcon>
                                            :<PauseIcon onClick = {() => pauseStream()} className = {`${styles.mediaButton_small} ${styles.margin_right}`}></PauseIcon>
                                        }
                                        <div className = {styles.volumnBox}>
                                            {muted === true ?
                                                <VolumeDownIcon onClick = {() => toggleVolumn()} className = {`${styles.mediaButton_small} ${styles.margin_right}`}></VolumeDownIcon>
                                                :<VolumeOffIcon onClick = {() => toggleVolumn()} className = {`${styles.mediaButton_small} ${styles.margin_right}`}></VolumeOffIcon>
                                            }
                                            <Slider value = {volumeValue} onChange = {e => handleChangeVolume(e.target.value)} size = "small" className = {styles.volumnSlider}></Slider>
                                        </div>
                                    </div>
                                    <div className = {styles.halfContainerRight}>
                                        <FullscreenIcon className = {styles.mediaButton_small}></FullscreenIcon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className = {styles.infoContainer}>
                    <div className = {styles.avatarContainer}>
                        <img alt = {curRoom !== undefined ? curRoom.name:"unknow"} className = {styles.avatar} src = {curRoom !== undefined ? curRoom.avatar:imgPlaceholder}/>
                        {isOnline ? 
                            <div className = {styles.liveBox}>Live</div>
                            :<div className = {styles.offBox}>Off</div>
                        }
                    </div>

                    <div className = {styles.textContainer}>
                        <div className = {styles.infoName}>{curRoom !== undefined ? curRoom.name:"unknow"}</div>
                        <h4 title = {curRoom !== undefined ? curRoom.description:"So...there is any description"}
                            className = {styles.infoDesc}>{curRoom !== undefined ? curRoom.description:"So...there is any description"}
                        </h4>
                        <div className = {styles.tagContainer}>   
                            {
                                curRoom && 
                                curRoom.tags.map((r, index) => (
                                    <div key = {index} className = {styles.tag}>{r}</div>
                                ))
                            }
                        </div>
                    </div>

                    <div className = {styles.threeDotContainer}>
                        
                        <div className = {styles.hoverThreeDot}>
                            <MoreVertIcon className = {styles.threeDotIcon}>
                            </MoreVertIcon>
                            <div className = {styles.outRoomContainer}>
                                <div onClick = {() => handleOut()} className = {styles.outRoomBlock}>
                                    <MeetingRoomIcon className = {styles.outRoomIcon}/>
                                    Out
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className = {styles.chatContainer}>
                {isOnline &&
                    <ChatBox isAdmin = {true} ></ChatBox>
                }
            </div>
        </div>
    )
}

export default memo(MyRoom)