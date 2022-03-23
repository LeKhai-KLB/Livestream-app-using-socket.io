import styles from './roomCard.module.css'
import { memo } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';

function RoomCard(props){
    return (
        <div key = {props.index} className = {styles.background}>
            <div className = {styles.thumbnailContainer}>
                <img onClick = {() => props.onClick(props.id)} className = {styles.thumbnailImg} src = {props.thumbnail}></img>
                <div className = {styles.stateBox}>Live</div>
                <div className = {styles.viewsBox}>
                    <h5 className = {styles.viewsNumber}>{
                        props.views >= 1000 ? `${props.views/1000} N`.replace('.', ','):props.views
                    }</h5>
                    <VisibilityIcon className = {styles.viewsIcon}/> 
                </div>
            </div>
            <div className = {styles.infoContainer}>
                <img className = {styles.avatar} src = {props.avatar} alt = {props.title}/>
                <div className = {styles.textInfoContainer}>
                    <h5 title = {props.title} className = {styles.title}>{props.title}</h5>
                    <h6 title = {props.name} className = {styles.name}>{props.name}</h6>
                    <h6 title = {props.description} className = {styles.desc}>{props.description}</h6>
                    <div className = {styles.tagsContainer}>
                        {
                            props.tags.map((tag, index) => (
                                <div 
                                    key = {index} 
                                    className = {styles.tag}
                                    onClick = {() => props.tagClick(tag)}>
                                        {tag}
                                    </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(RoomCard);