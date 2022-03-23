import {memo, useEffect, useState, useCallback} from 'react'
import styles from './newRoom.module.css'
import TagsBox from '../../components/TagsBox'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import imgPlaceholder from '../../assets/placeholder/imgPlaceholder_crop.png'
import userPlaceholder from '../../assets/placeholder/imgPlaceholder.png'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import tabSlice from '../../redux/Slice/tabSlice';
import roomsSlice from '../../redux/Slice/roomsSlice';
import tagsSlice from '../../redux/Slice/tagsSlice'
import PreviewRoomCard from '../../components/PreviewRoomCard'
import { userSelector } from '../../redux/selector.js'
import ErrorIcon from '@mui/icons-material/Error';
import LoopIcon from '@mui/icons-material/Loop';

function NewRoom(){
    const user = useSelector(userSelector)
    const nav = useNavigate();
    const dispatch = useDispatch();
    console.log('new_room')
    const [thumbUpload, setThumbUpload] = useState();
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [tags, setTags] = useState([])
    const [showWarning, setShowWarning] = useState(false)
    const [showLoad, setShowLoad] = useState(false)

    const handleSetTagInRoot = useCallback((value) => {
        setTags(value)
    })

    useEffect(() => {
        return () => {
            thumbUpload && URL.revokeObjectURL(thumbUpload.preview)
        }
    }, [thumbUpload])

    const handleChangeThumb = (e) => {
        const file = e.target.files[0]
        file.preview = URL.createObjectURL(file)
        setThumbUpload(file.preview)
    }

    const handleOnchangeTitle = (value) => {
        setTitle(value)
    }

    const handleOnchangeDesc = (value) => {
        setDesc(value)
    }

    const handleCancel = async () => {
        await dispatch(tabSlice.actions.set_tab('home'))
        await nav('../home')
    }

    const handleNavigate = async () => {
        await dispatch(tabSlice.actions.set_tab(user.id === '' ? 'Unknow-id' : user.id))
        await nav(`../my_room`)
    }

    const handleWarning = () => {
        if(title === '' || desc === '' || tags == []) {
            setShowWarning(true)
        }
        else{
            setShowWarning(false)
            handleCreateRoom()
        }
    }

    const handleOnCancelWarning = () => {
        setShowWarning(false)
    }

    const handleOnCountinue = () => {
        setShowWarning(false)
        handleCreateRoom()
    }

    const handleCreateRoom = async() => {
        setShowLoad(true)
        await setTimeout(async() => {
            await dispatch(roomsSlice.actions.set_userRoom(user.id === '' ? 'Unknow-id' : user.id))
            const roomData = {
                id: user.id === '' ? 'Unknow-id' : user.id,
                name: user.name === '' ? 'Unknow': user.name,
                avatar: user.image === '' ? userPlaceholder : user.image,
                title: title === '' ? 'This guy too lazy to leave some words...' : title,
                description: desc === '' ? 'So... There is no words' : desc,
                tags: tags.length === 0  ? ['No tag']:(tags.map(tag => tag.value)),
                thumbnail: thumbUpload === undefined ? imgPlaceholder:thumbUpload,
                views: 0
            }
            await dispatch(tagsSlice.actions.add_tags(tags.length === 0  ? ['No tag']:(tags.map(tag => tag.value))))
            await dispatch(roomsSlice.actions.add_roomList(roomData))
            await dispatch(roomsSlice.actions.set_currentRoom(roomData.id))
        }, 2000)
        await setTimeout(() => handleNavigate(), 3000)
    }

    const handleOnClickCreateRoom = () => {
        handleWarning()
    }

    return (
        <div className = {styles.background}>

            {
                showWarning && (
                    <div className = {styles.handleContainer}>
                        <div className = {styles.warningBox}>
                            <ErrorIcon className = {styles.warningIcon}/>
                            <h3 className = {styles.warningText}>Some fields were not filled! Do you still want to continue?</h3>
                            <div className = {styles.btnContainer}>
                                <Button className = {styles.btnNo} onClick = {handleOnCancelWarning}>No</Button>
                                <Button className = {styles.btnYes} onClick = {handleOnCountinue}>Yes</Button>
                            </div>
                        </div>
                        <div className = {styles.overlay} onClick = {handleOnCancelWarning}></div>
                    </div>
                )
            }

            {
                showLoad && (
                    <div className = {styles.handleContainer}>
                        <div className = {styles.loadContainer}>
                            <LoopIcon className = {styles.loadIcon}/>
                            <h4 className = {styles.loadTitle}>Creating...</h4>
                        </div>
                        <div className = {styles.overlay} onClick = {handleOnCancelWarning}></div>
                    </div>
                )
            }

            <form className = {styles.form}>
                <div className = {styles.colForm}>
                    <div className = {styles.top_ColForm_1}>
                        <h2>Edit your room</h2>
                    </div>
                    <div className = {styles.bot_ColForm_1}>
                        <div>
                            <label className = {styles.label}>Title </label><span className = {styles.note}>  (120)</span>
                            <p className = {`${styles.note} ${styles.wrapNote}`}>Let's create a catchy title</p>
                        </div>
                        <div>
                            <textarea onChange = {e => handleOnchangeTitle(e.target.value)} spellCheck = "false" placeholder = "Type your title..." className = {`${styles.textArea} ${styles.titleArea}`}/>
                        </div>
                        <div>
                            <label className = {styles.label}>Description </label><span className = {styles.note}>  (120)</span>
                            <p className = {`${styles.note} ${styles.wrapNote}`}>Don't be lazy, pls type a few words</p>
                        </div>
                        <div>
                            <textarea onChange = {e => handleOnchangeDesc(e.target.value)} spellCheck = "false" placeholder = "Type your description..." className = {`${styles.textArea} ${styles.descArea}`}/>
                        </div>
                        <div>
                            <label className = {styles.label}>Tags </label><span className = {styles.note}>  (3)</span>
                        </div>
                        <div>
                            <TagsBox callback = {handleSetTagInRoot}/>
                            <span className = {styles.note}>Tags help viewers search your room by topic</span>
                        </div>
                    </div>
                </div>

                <div className = {styles.colForm}>
                    <div className = {styles.top_ColForm_2}>
                    </div>
                    
                    <div className = {styles.mid_ColForm_2}>
                        <div className = {styles.mid_left_ColForm_2}>
                            <label className = {styles.label}>Thumbnail</label>
                            <p className = {`${styles.note} ${styles.wrapNote}`}>Thumbnail needed to decorate your room card, express your individuality</p>
                        </div>
                        <div className = {styles.mid_right_ColForm_2}>
                            <div className = {styles.chooseFileBtn} onChange = {e => handleChangeThumb(e)}>
                                <input type = "file" className = {styles.fileUpload}/>
                                <div className = {styles.containAddIcon}>
                                    <AddCircleIcon className = {styles.addFileIcon}/>
                                </div>
                                <img className = {styles.previewImg} alt = "preview image" src = {thumbUpload || imgPlaceholder}/>
                            </div>
                        </div>
                    </div>

                    <div className = {styles.bot_ColForm_2}>
                        <div className = {styles.bot_left_ColForm_2}>
                            <label className = {styles.label}>Preview card room</label>
                            <p className = {`${styles.note} ${styles.wrapNote}`}>See how your room card after creation will look like, great or boring?</p>
                        </div>
                        <div className = {styles.bot_right_ColForm_2}>
                            <div className = {styles.wrapRoomPreview}>
                                <PreviewRoomCard previewThumbnail = {thumbUpload} title = {title} desc = {desc} tags = {tags}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className = {styles.rowForm}>
                    <Button className = {styles.buttonCancel} onClick = {handleCancel}>Cancel</Button>
                    <Button className = {styles.buttonSubmit} onClick = {handleOnClickCreateRoom}>Create room</Button>
                </div>
            </form>

        </div>
    )
}

export default  memo(NewRoom)