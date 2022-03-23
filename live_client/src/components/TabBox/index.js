import styles from './tabBox.module.css'
import HomeIcon from '@mui/icons-material/Home';
import { memo, useRef } from 'react'
import InfoIcon from '@mui/icons-material/Info';

function TabBox(props){
    
    const div = useRef()
    
    const val = props.value

    return (
        <div ref = {div} 
            className={`${styles.wrapper} ${val === props.isActive ? styles.wrapper_active:''}`} 
            onClick= {() => {props.onClick(val, props.id)}}>
                {props.type === 'home' &&
                    <>
                        <HomeIcon className = {styles.icon}></HomeIcon>
                        <p className={styles.title}>Home</p>
                    </>
                }
                {props.type === 'info' &&
                    <>
                        <InfoIcon className = {styles.icon}></InfoIcon>
                        <p className={styles.title}>Info</p>
                    </>
                }
                {props.type === 'userTab' &&
                    <>
                        <img className = {styles.userImage} alt = {props.name} title = {props.name} src = {props.avatar}></img>
                    </>
                }
        </div>
    )
}

export default memo(TabBox)