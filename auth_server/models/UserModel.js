const User = require('../db/models/User.model')

module.exports = {
    createUser: async (obj) => {
        try {
            let user = await User.create(obj);
            return user
        }
        catch (err) {
            return Promise.reject(err)
        }
    },
    getUserByEmail: async (emailId) => {
        try{
            let user = await User.findOne({
                where: {
                    'email': emailId
                }
            })

            return user
        }
        catch(err){
            return Promise.reject(err)
        }
        
    },
    getUserById: async (id) => {
        try{
            let user = await User.findOne({
                where: { 'id': id }
            });
            return user
        }
        catch(err){
            return Promise.reject(err)
        }
    },
    updateUserByEmail: async (email, obj) => {
        try{
            let user = await User.updateOne({ 'email': email }, obj);
            return user[0]    // return update count
        }
        catch(err){
            return Promise.reject(err)
        }
    },
    updateUserById: async (userId, obj) => {
        try{
            let user = await User.update(obj, {
                'where': { 'id': userId }
            });
            return user[0]    // return update count
        }
        catch(err){
            return Promise.reject(err)
        }
    }
}