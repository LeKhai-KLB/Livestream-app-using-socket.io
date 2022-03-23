import styles from './previewRoomCard.module.css'
import { memo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import imgPlaceholder_crop from '../../assets/placeholder/imgPlaceholder_crop.png'
import imgPlaceholder from '../../assets/placeholder/imgPlaceholder.png'
import Avatar from '@mui/material/Avatar';
import { userSelector } from '../../redux/selector.js'

function RoomCard(props){

    const user = useSelector(userSelector)

    return (
        <div className = {styles.container}>
            <div className = {styles.thumbnailContainer}>
                <div className = {styles.stateBox}>
                    <div className = {styles.stateText}>Live</div>
                </div>
                <img alt = {props.title} className = {styles.thumbnailImg} src = {props.previewThumbnail || imgPlaceholder_crop}></img>
            </div>
            <div className = {styles.infoContainer}>
                <div className = {styles.leftInfo}>
                    <Avatar alt = "avatar" src = {user.image || imgPlaceholder} className = {styles.avatar}/>
                </div>
                <div className = {styles.rightInfo}>
                    <div className = {styles.title}>
                        {props.title === '' ? 'This guy too lazy to leave some title...':props.title}
                    </div>
                    <p className = {styles.pTag}>{user.name || 'Unknow'}</p>
                    <p className = {styles.pTag}>
                        {props.desc === '' ? 'This guy too lazy to leave some description...':props.desc}
                    </p>
                    <div className = {styles.tagsContainer}>
                        {
                            props.tags.map((tag) => (
                                <div key = {tag.i} type="text" className = {styles.tagDiv}>
                                    {tag.value}
                                </div>
                            ))
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(RoomCard)

