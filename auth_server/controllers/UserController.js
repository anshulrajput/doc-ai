const UserModel = require('../models/UserModel');
const {getAuth} = require('firebase-admin/auth');
const responseUtils = require('../utils/response.utils');

module.exports = {
    userLogin: async (req, res, next) => {
        try {
            const idToken = req.headers['access-token'];
            let payload = await getAuth().verifyIdToken(idToken);

            req.user = {
                user_id: payload.user_id,
                email: payload.email
            }
            console.log(JSON.stringify(payload))

            logging.info(`User ${payload.email} verified`)

            let user = await UserModel.getUserByEmail(payload.email)
            if(user){
                return res.json(responseUtils.success(user, 'User Authenticated successfully'));
            }
            else{
                // check if sign in with google, then add user to db and return login success
                if(payload.firebase.sign_in_provider === 'google.com') {
                    // create user entry in db
                    let user = await UserModel.createUser({
                        email: payload.email,
                        name: payload.name !== undefined ? payload.name : payload.email,
                        firebaseUID: payload.uid
                    })
                    return res.json(responseUtils.success(user, 'User Authenticated successfully'));
                }


                return res.json(responseUtils.message(false, 'User not registered'));
            }
        }
        catch (err) {
          return next(err)
        }
    },
    getAuthenticatedUser: async (req, res, next) => {
        const {email} = req.user;
        try {
            let user = await UserModel.getUserByEmail(email)

            if (user) {
                return res.json(responseUtils.success(user, 'User Authenticated successfully'));
            } else {
                return res.json(responseUtils.message(false, 'User not found'));
            }
        } catch (err) {
            return next(err)
        }
    },
    createUser: async (req, res, next) => {
        const { email, password, name } = req.body;
        try {
            let payload;
            try {
                payload = await getAuth().createUser({
                    email: email,
                    password: password,
                });
            }
            catch (error) {
                logging.error(error.code)
                if (error.code === 'auth/email-already-exists') {
                    return res.json(responseUtils.message(false, 'Email Already Registered'));
                } else {
                    throw error
                }
            }

            // create user entry in db
            let user = await UserModel.createUser({
                email: payload.email,
                name: name,
                firebaseUID: payload.uid,
            })

            return res.json(responseUtils.success(user, 'User Created'));
        }
        catch (err) {
          return next(err)
        }
    }
}
