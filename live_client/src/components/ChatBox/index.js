import styles from './chatBox.module.css';
import {memo, useEffect, useState, useRef} from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CommentIcon from '@mui/icons-material/Comment';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import Picker from 'emoji-picker-react';
import imgPlaceholder from '../../assets/placeholder/imgPlaceholder.png'
import { userSelector, chatsDataSelector, curRoomIdSelector, donatesDataSelector } from '../../redux/selector'
import { useSelector, useDispatch} from 'react-redux'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import messagesDataSlice from '../../redux/Slice/messagesDataSlice';

function ChatBox({isAdmin}){
    const dispatch = useDispatch();
    const user = useSelector(userSelector)
    const currentRoomId = useSelector(curRoomIdSelector)
    const chatsData = useSelector(chatsDataSelector)
    const donatesData = useSelector(donatesDataSelector)
    const [showPicker, setShowPicker] = useState(false);
    const [showComment, setShowComment] = useState(true);
    const [chatText, setChatText] = useState('');
    const [showScrollBottom, setShowScrollBottom] = useState(false);
    const chatDisplay = useRef();
    const handleOnclickSend = async() => {
        if(chatText !== ''){
            if(showPicker === true){
                setShowPicker(false)
            }
            const chatData = {
                id: currentRoomId,
                data:{
                    isAdmin: isAdmin,
                    avatar: user.image,
                    name: user.name,
                    text: chatText
                }
            }
            await dispatch(messagesDataSlice.actions.add_chat(chatData))
            await setChatText('')
        }
    }

    console.log(donatesData)

    const emojiClick = (e, emojiObj) => {
        setChatText(prev => prev + emojiObj.emoji)
    }

    console.log('chatBox')

    useEffect(() => {
        chatDisplay.current.addEventListener("scroll", handleScroll)
    }, [])

    const handleScroll = () => {
        if(chatDisplay.current.scrollTop <= -40){
            setShowScrollBottom(true)
        }
        else{
            setShowScrollBottom(false)
        }
    }

    const handleScrollToBot = () => {
        chatDisplay.current.scrollTop = 0;
    }

    return (
        <div className = {styles.background}>
            <div className = {styles.header}>
                <div className = {styles.leftHeaderContainer}>
                    <div className = {styles.donatesContainer}>
                        <h5 className = {styles.donatesTitle}>Donates diary</h5>
                        <ArrowDropDownIcon className = {styles.donatesIcon}></ArrowDropDownIcon>
                    </div>
                    <div className = {styles.donatesDataPaddingTop}></div>
                    <div className = {styles.donatesData}>
                        {donatesData &&
                            donatesData.map((donate, index) => 
                            <div key = {index} className = {styles.donateLine}>
                                <img className = {styles.donateAvatar} src = {donate.avatar === '' ? imgPlaceholder:donate.avatar}/>
                                <h5 className = {styles.donateText}>
                                    {donate.name === '' ? 'unknow':donate.name} 
                                    <span className = {styles.subAction}>donated</span>
                                    <span className = {styles.subItem}>{donate.amount} {donate.itemName}</span>
                                </h5>
                                <img className = {styles.donateItemImage} src = {donate.itemImage}/>
                            </div>)
                        }
                        
                    </div>
                </div>
                <h4 className = {styles.headerTitle}>Chat Box</h4>
            </div>
            <div className = {styles.chatContainer}>
                <div className = {styles.chatDisplay} ref = {chatDisplay}>
                    {showScrollBottom === true &&
                        <ArrowDropDownCircleIcon onClick = {() => handleScrollToBot()} className = {styles.scrollBottomIcon}/>
                    }
                    {(chatsData !== undefined && showComment) && chatsData.map((c, index) =>
                        <div key = {index} className = {styles.chatLine}>
                            <h5 className = {styles.chatContent}>
                                <img className = {`${styles.chatAvatar} ${c.isAdmin && styles.orangeBorder}`} src = {c.avatar === '' ? imgPlaceholder:c.avatar}/>
                                <span className = {`${styles.chatName} ${c.isAdmin && styles.orangeName}`}>{c.name === '' ? 'unknow':c.name}:</span>
                                {c.text}
                            </h5>
                        </div> 
                    )}
                </div>
                <div className = {styles.chatControls}>
                    {showPicker && 
                        <div className = {styles.pickerContainer}>
                            <Picker onEmojiClick = {emojiClick}></Picker> 
                        </div>
                    }
                    <div className = {styles.inputContainer}>
                        <input value = {chatText} onChange = {(e) => setChatText(e.target.value)} spellCheck = "false" placeholder = "chat some message..." className = {styles.input}></input>
                        <EmojiEmotionsIcon onClick = {() => setShowPicker(!showPicker)}  className = {styles.emojiIcon}></EmojiEmotionsIcon>
                    </div>
                    <div className = {styles.buttonsContainer}>
                        <div className = {styles.leftButtons}>
                            {showComment === true ?
                                <CommentIcon onClick = {() => setShowComment(!showComment)} className = {styles.commentIcon}></CommentIcon>
                                :<CommentsDisabledIcon onClick = {() => setShowComment(!showComment)} className = {styles.commentIcon} />
                            }
                        </div>
                        <div onClick = {() => handleOnclickSend()} className = {styles.rightButtons}>Send</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(ChatBox)