import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './toast.module.css';
import {memo} from 'react'

function Toast({props}){

    const toast = styles.toast

    return(
        <div className = {props.type === 'Error' ? `${toast} ${styles.__error}`:`${toast} ${styles.__success}`}>
            {props.type === 'Error' ?
                <ErrorIcon className = {styles.errorIcon}/> :
                <CheckCircleIcon className = {styles.successIcon}/>
            }
            <div>
            <h3 className = {styles.titleToast}>{props.type}</h3>
            <p className = {styles.pToast}>{props.content}</p>
            </div>
        </div>
    )
}

export default memo(Toast)