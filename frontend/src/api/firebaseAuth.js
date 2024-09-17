import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export const firebaseLoginApi = async(payload) => {
    try{
        console.log('firebaseLoginApi')
        const authentication = getAuth();
        return signInWithEmailAndPassword(authentication, payload.email, payload.password)
            .then(response => {
                console.log(response)
                return{
                    loading: false,
                    code: null,
                    status: true,
                    message: 'Login Success',
                    data: response,
                    error: null
                }
            })
            .catch(err => {
                console.log(err)
                let message = 'Login Failed'
                if(err.code === 'auth/user-not-found'){
                    message = 'User not found'
                }
                else if(err.code === 'auth/wrong-password'){
                    message = 'Incorrect Password'
                }
                else if(err.code === 'auth/invalid-email'){
                    message = 'Invalid Email'
                }
    
                return Promise.reject({
                    loading: false,
                    code: null,
                    status: true,
                    message: message,
                    data: null,
                    error: err
                })
            })
    }
    catch(err){
        console.log(err)
    }

}