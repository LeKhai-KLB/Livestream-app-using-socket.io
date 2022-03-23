const imgList = () => {
    const array = [];
    for(let i = 1; i <= 8; i++){
        array.push(require(`./Images/img${i}.jpg`))
    }
    return array
}

const aList = () => {
    const array = [];
    for(let i = 1; i <= 8; i++){
        array.push(require(`./Images/a${i}.png`))
    }
    return array
}

export {imgList, aList}