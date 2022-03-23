
const dataItems = [
    {
        name: 'rose',
        price: 100
    },
    {
        name: 'clover',
        price: 200
    },
    {
        name: 'gold egg',
        price: 250
    },
    {
        name: 'fortune cat',
        price: 400
    },
    {
        name: 'ohh balloon',
        price: 430
    },
    {
        name: 'heart value',
        price: 470
    },
    {
        name: 'snowflake',
        price: 500
    },
    {
        name: 'gold car',
        price: 800
    },
    {
        name: 'gold plane',
        price: 900
    },
    {
        name: 'romantic car',
        price: 1000
    },
    {
        name: 'gold cup',
        price: 1250
    },
    {
        name: 'romantic yacht',
        price: 2000
    }
]

const getDonateItems = () => {
    return dataItems.map((data, index) => {return {...data, image: require(`./images/item${index}.png`)}})
}

export default getDonateItems