const UserModel = require('../models/UserModel');
const { getAuth } = require('firebase-admin/auth');

module.exports = async(req, res, next) => {
    try {
        if(!req.headers['access-token']){
            logging.info('Token not found')
            return res.status(401).json({
                "status": false,
                "message": "User Not Authenticated",
                "data": {}
            })
        }  
        else{
            const idToken = req.headers['access-token'];
            let payload = await getAuth().verifyIdToken(idToken);

            req.user = {
                user_id: payload.user_id,
                email: payload.email,
            }

            logging.info(`User ${payload.email} verified`)
            req.timestamp = Date.now()

            // fetch user from db and store userId in req.user object
            let user = await UserModel.getUserByEmail(payload.email)
            if(!user){
                return res.status(401).json({
                    "status": false,
                    "message": "User Not Registered",
                    "data": {}
                })
            }

            req.user.userId = user.id

            next()  // token verified
        }  
    }
    catch(err){
        logging.error('Token verification failed')
        console.log(err.message)

        let errorMessage = "User Not Authenticated"
        if(err?.code && err.code === 'auth/id-token-expired'){
            errorMessage = 'User Session Expired'
        }

        return res.status(401).json({
            "status": false,
            "message": errorMessage,
            "data": {}
        })
    }
};
