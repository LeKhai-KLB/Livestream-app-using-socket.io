const Avatars = () => {
    const array = []
    for(let i = 1; i <= 10; i++){
        array.push(require(`./images/a${i}.png`))
    }
    return array
}

export default Avatars