const User = require('../models/userModel')

module.exports.register = async(req, res, next) => {
    try{
        const {id, name, image} = req.body
        const idCheck = await User.findOne({ id })
        if(idCheck)
            return res.json({msg: 'id already used',  status: false})
        const user = await User.create({
            id, name, image
        })
        return res.json({status: true, user})
    }
    catch(ex){
        next(ex)
    }
}

module.exports.deleteUser = async(req, res, next) => {
    try{
        const {id} = req.body
        await User.deleteOne({ id })
        return res.json({status: true, msg: 'deleted'})
    }
    catch(ex){
        next(ex);
    }
}