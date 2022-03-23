import styles from './tagsBox.module.css';
import {useState, useRef, useEffect, memo} from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

function TagsBox(props){

    const [tags, setTags] = useState([])
    const [count, setCount] = useState(1)
    const addBtn = useRef()

    const handleClick = async() =>{
        if(count <= 3){
            await setCount(count + 1)
            await setTags(prev => [...prev, {i: `${prev.length}`, value: ''}])
        }
    }

    useEffect(async() => {
        await props.callback(tags)
    }, [tags])

    useEffect(() => {
        if(count === 4)
            addBtn.current.classList.add(styles.inactive)
        else
            addBtn.current.classList.remove(styles.inactive)
    },[count])

    const handleOncancelClick = (index) => {
        setTags(prev => {
            const newPrev = [...prev]
            newPrev.splice(index,1)
            return newPrev
        })
        setCount(count - 1)
    }

    const handleOnChange = (index, value) => {
        setTags(prev => {
            return prev.map(p => 
                p.i == index ? {...p, value:value}:p
            )
        })
    }

    return (
        <div className = {styles.container}>
            {
                tags.map((tag, index) => (
                    <div key={index} className = {styles.tagContainer}>
                        <input 
                            value = {tag.value}
                            spellCheck = "false" 
                            className = {styles.tagInput}
                            onChange = {(e) => handleOnChange(index, e.target.value)}>               
                        </input>
                        <CancelIcon className = {styles.cancelIcon} onClick = {() => handleOncancelClick(index)}/>
                    </div>
                ))
            }
            <div ref = {addBtn} className = {styles.createTagbtn} onClick = {handleClick}>
                <AddIcon className = {styles.addIcon}/>
            </div>
        </div>
    )
}

export default memo(TagsBox)