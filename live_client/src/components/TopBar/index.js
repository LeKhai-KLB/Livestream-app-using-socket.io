import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import styles from './topbar.module.css';
import { useSelector } from 'react-redux'
import {userSelector} from '../../redux/selector'
import {darkThemeSelector} from '../../redux/selector'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import logo from '../../assets/Logo/logo1.png'
import { memo, useEffect, useRef } from 'react'
import VideocamIcon from '@mui/icons-material/Videocam';
import imgPlaceholder from '../../assets/placeholder/imgPlaceholder.png'
import LogoutIcon from '@mui/icons-material/Logout';

function Topbar({logOut}){

    const curUser = useSelector(userSelector)
    const darkTheme = useSelector(darkThemeSelector)
    const appBar = useRef();
    console.log('top')

    useEffect(() => {
        if(darkTheme === true){
            appBar.current.classList.add(styles.appBarBlackTheme)
        }
        else
            appBar.current.classList.remove(styles.appBarBlackTheme)   
    }, [darkTheme])

    return (
        <div>
            <AppBar ref = {appBar} position="relative" className = {styles.appBar}>
                <Toolbar className = {styles.toolbar}>
                    <div className = {`${styles.flex_item} ${styles.flex_left}`}>
                        <img src = {logo} className = {styles.logo} alt = "Hapbee-live!"/>
                        <h3>Hapbee-live!!!</h3>
                    </div>
                    <div className = {`${styles.flex_item} ${styles.flex_center}`}>
                        <VideocamIcon className = {styles.watch_word_m}>SELL</VideocamIcon>
                        <h3 className = {styles.watch_word}>Livestream your Business</h3>
                    </div>
                    <div className = {styles.flex_item}>
                        
                        <div className = {styles.userInfo}>
                            <div className = {styles.coinInfo}>
                                <h5 className = {styles.coinValue}>{curUser.coins}</h5>
                                <MonetizationOnIcon className = {styles.coinIcon}/>
                            </div>
                            <div className = {styles.wrapper}>
                                <div className = {styles.logOutContainer}>
                                    <div onClick={() => logOut()} className = {styles.logOutblock}>
                                        Log out
                                        <LogoutIcon className = {styles.logOutIcon}/>
                                    </div>
                                </div>
                                <h4 className = {styles.userName}>{curUser.name || 'Unknow'}</h4>
                                <ArrowDropDownIcon className = {styles.arrowDown}/>
                                <img alt = "avatar" src = {curUser.image || imgPlaceholder} className = {styles.avatar}/>
                            </div>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default memo(Topbar)