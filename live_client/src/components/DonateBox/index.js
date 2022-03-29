import styles from './donateBox.module.css';
import {memo, useState, useRef, useEffect } from 'react'
import Tabs from '@mui/material/Tabs';
import getDonateItems from '../../assets/DonateItems'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useSelector, useDispatch } from 'react-redux'
import { userSelector, curRoomIdSelector } from '../../redux/selector'
import userSlice from '../../redux/Slice/userSlice'
import messagesDataSlice from '../../redux/Slice/messagesDataSlice'

const DonateItems = getDonateItems()

function DonateBox({isAdmin, socket}){
    const dispatch = useDispatch();
    const user = useSelector(userSelector)
    const currentRoomId = useSelector(curRoomIdSelector)
    const [tabIndex, setTabIndex] = useState(0)
    const [itemSelected, setItemSelected] = useState(null)
    const [amount, setAmount] = useState(1)
    const [showTabs, setShowTabs] = useState(false)
    const [buttonText, setButtonText] = useState("Donate now")
    const donateInfo = useRef()
    const tabsContainer = useRef()
    const indicatorBar = useRef()
    const donateButtonContainer = useRef()

    useEffect(() => {
        if(!isAdmin){
            if(itemSelected !== null){
                if(amount * itemSelected.price > user.coins){
                    donateButtonContainer.current.classList.add(styles.unActiveButton)
                    setButtonText("Not enough")
                }
                else{
                    donateButtonContainer.current.classList.remove(styles.unActiveButton)
                    setButtonText("Donate now")
                }
            }
        }
    }, [itemSelected])

    useEffect(() => {
        if(!isAdmin){
            if(itemSelected !== null){
                if(amount * itemSelected.price > user.coins){
                    donateButtonContainer.current.classList.add(styles.unActiveButton)
                    setButtonText("Not enough")
                }
                else{
                    donateButtonContainer.current.classList.remove(styles.unActiveButton)
                    setButtonText("Donate now")
                }
            }
        }
    }, [amount])

    const handleClickTab = (index) => {
        if(DonateItems[index] !== itemSelected){
            setItemSelected(DonateItems[index]) 
            setAmount(1)
        }
        else{
            donateInfo.current.classList.add(styles.slideOut)
            setTimeout(()=> setItemSelected(null), 300)
            setAmount(1)
        }
    }

    const handleOnClickShowTabs = () => {
        if(showTabs === false){
            indicatorBar.current.classList.remove(styles.slideUpIndicator)
            indicatorBar.current.classList.add(styles.slideDownIndicator)
            setShowTabs(true)
            setItemSelected(null)
        }
        else{
            tabsContainer.current.classList.add(styles.slideUp)
            indicatorBar.current.classList.add(styles.slideUpIndicator)
            indicatorBar.current.classList.remove(styles.slideDownIndicator)
            setItemSelected(null)
            setTimeout(() => {
                setShowTabs(false)
                }
            , 300)
        }
    }

    const handleClickDonateButton = async() => {
        const data = {
            id: currentRoomId,
            donateData: {
                avatar: user.image,
                name: user.name,
                itemImage: itemSelected.image,
                itemName: itemSelected.name,
                amount: amount,
                price: itemSelected.price
            }
        }
        try{
            if(socket.current !== undefined){
                await socket.current.emit('send-donate', {id: data.id, donateData: data.donateData});
            }
            await dispatch(userSlice.actions.update_coin(user.coins - (amount * itemSelected.price)))
            await dispatch(messagesDataSlice.actions.add_donate(data))
            await handleOnClickShowTabs()
        }
        catch(err){
        }
        
    }
    
    return (
        <div className = {styles.background}>
            {showTabs &&
                <div ref = {tabsContainer} className = {styles.tabsContainer}>
                    <Tabs 
                        value = {tabIndex} 
                        variant = "scrollable" 
                        scrollButtons = "auto" 
                        TabIndicatorProps={{
                            style: {transition: 'none', backgroundColor: 'transparent'}
                          }}
                        >
                        {
                            DonateItems.map((item, index) => (
                                <div 
                                    key = {index} 
                                    value = {index} 
                                    className = {`${styles.itemContainer} ${itemSelected === item && styles.activeItem}`}
                                    onClick = {() => handleClickTab(index)}
                                    >
                                    <img className = {styles.itemImage} src = {item.image} alt = {item.name}/>
                                </div>
                            ))
                        }
                    </Tabs>
                </div>
            }
            {itemSelected !== null &&
                <div ref = {donateInfo} className = {styles.donateItemInfo}>
                    <div className = {styles.topInfo}>
                        <img className = {styles.imageInfo} src = {itemSelected.image} alt = {itemSelected.name}></img>
                        <div className = {styles.textInfo}>
                            <div className = {styles.nameInfo}>{itemSelected.name}</div>
                            <div className = {styles.priceInfo}>
                                <h5 className = {styles.coinValue}>{itemSelected.price}</h5>
                                <MonetizationOnIcon className = {styles.coinIcon}/>
                            </div>
                        </div> 
                    </div>
                    {isAdmin === false &&
                        <div className = {styles.botInfo}>
                            <div className = {styles.amountBoxContainer}>
                                <div 
                                    className = {`${styles.amountBox} ${amount === 1 && styles.activeAmountBox}`}
                                    onClick = {() => setAmount(1)}>
                                    1
                                </div>
                                <div 
                                    className = {`${styles.amountBox} ${amount === 10 && styles.activeAmountBox}`}
                                    onClick = {() => setAmount(10)}>
                                    10
                                </div>
                                <div 
                                    className = {`${styles.amountBox} ${amount === 99 && styles.activeAmountBox}`}
                                    onClick = {() => setAmount(99)}>
                                    99
                                </div>
                            </div>
                            <div className = {styles.handleDonateContainer}>
                                <div className = {styles.inputContainer}>
                                    <input value = {amount} onChange = {(e) => setAmount(e.target.value)} placeholder = "Other" type = "number" className = {styles.input}></input>
                                </div>
                                <div ref = {donateButtonContainer} className = {styles.buttonContainer}>
                                    <button onClick = {handleClickDonateButton} className = {styles.button}>{buttonText}</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
            
            <div ref = {indicatorBar} onClick = {handleOnClickShowTabs} className = {styles.indicatorBar}>
                <ArrowDropDownIcon className = {styles.indicatorIcon}></ArrowDropDownIcon>
            </div>
        </div>
    )
}

export default memo(DonateBox)