import styles from './Login.module.css'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useContext, useRef, useState } from "react"
import UIContext from '../store/ui-context'
import { FcGoogle } from "react-icons/fc";
import Button from 'react-bootstrap/Button';
import { authApiClient } from '../api/client'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../store/auth-context';

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()

    const { dispatch: uiDispatch } = useContext(UIContext);
    const { dispatch: authDispatch } = useContext(AuthContext);


    async function loginApi(accessToken){
        try {
            const res = await authApiClient.get('/user/login',{
                headers: {
                    "access-token": accessToken,
                }
            })
    
            if (res.status === 200 && res.data.status === true) {
                return res.data
            } else {
                return Promise.reject({
                    message: res.data.message !== undefined ? res.data.message : null
                })
            }
        } catch (err) {
            console.log(err)
            return Promise.reject({
                message: err.response.message !== undefined ? err.response.message : 'Something Went Wrong!'
            })
        }
    }

    async function loginHandler(){
        const email = emailRef.current.value
        const password = passwordRef.current.value

        if(email !== '' && password !== ''){
            uiDispatch({ type: 'start_loader' })

            const authentication = getAuth();
            return signInWithEmailAndPassword(authentication, email, password)
                .then(async(response) => {
                    console.log(response)
                    
                    const loginResponse = await loginApi(response.user.stsTokenManager.accessToken)

                    console.log(loginResponse)

                    localStorage.setItem('authToken', response.user.stsTokenManager.accessToken)
                    localStorage.setItem('email', response.user.email)
                    localStorage.setItem('tokenExpiry', response.user.stsTokenManager.expirationTime)
                    localStorage.setItem('userId', loginResponse.data.id)

                    uiDispatch({ type: 'stop_loader' })
                    uiDispatch({ type: 'show_toast', payload: { severity: 'success', message: 'Login Successful!' } })

                    authDispatch({
                        type: 'login_success',
                        payload: {loginResponse: response, firebaseResponse: response}
                    })

                    navigate('/dashboard')
                })
                .catch(err => {
                    console.log(err)
                    let message = err?.message === undefined ? 'Login Failed' : err.message
                    if(err.code === 'auth/user-not-found'){
                        message = 'User not found'
                    }
                    else if(err.code === 'auth/wrong-password'){
                        message = 'Incorrect Password'
                    }
                    else if(err.code === 'auth/invalid-email'){
                        message = 'Invalid Email'
                    }
                    else if(err.code === 'auth/invalid-login-credentials'){
                        message = 'Invalid Credentials'
                    }
        
                    uiDispatch({ type: 'stop_loader' })
                    uiDispatch({ type: 'show_toast', payload: { severity: 'error', message: message } })
                })
        }
        else{
            uiDispatch({ type: 'show_toast', payload: { severity: 'error', message: 'Enter Credentials' } })
        }
    }

    async function googleLoginHandler(){
        uiDispatch({ type: 'start_loader' })

        const authentication = getAuth();
        return signInWithPopup(authentication, new GoogleAuthProvider())
            .then(async(response) => {
                console.log(response)
                
                const loginResponse = await loginApi(response.user.stsTokenManager.accessToken)

                localStorage.setItem('authToken', response.user.stsTokenManager.accessToken)
                localStorage.setItem('email', response.user.email)
                localStorage.setItem('tokenExpiry', response.user.stsTokenManager.expirationTime)
                localStorage.setItem('userId', loginResponse.data.id)

                uiDispatch({ type: 'stop_loader' })
                uiDispatch({ type: 'show_toast', payload: { severity: 'success', message: 'Login Successful!' } })

                authDispatch({
                    type: 'login_success',
                    payload: {loginResponse: response, firebaseResponse: response}
                })

                navigate('/dashboard')
            })
            .catch(err => {
                console.log(err)
                let message = err?.message === undefined ? 'Login Failed' : err.message
                if(err.code === 'auth/user-not-found'){
                    message = 'User not found'
                }
                else if(err.code === 'auth/wrong-password'){
                    message = 'Incorrect Password'
                }
                else if(err.code === 'auth/invalid-email'){
                    message = 'Invalid Email'
                }
    
                uiDispatch({ type: 'stop_loader' })
                uiDispatch({ type: 'show_toast', payload: { severity: 'error', message: message } })
            })
    }

    function registerHandler(){
        navigate('/register')
    }

    return (
        <div className={styles['page']+" d-flex vh-100"}>

            <div className="row justify-content-center w-100">

                <div className="col-xl-5 col-lg-12 col-md-5">

                    <div className="card o-hidden border-0 shadow-lg">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="p-5">
                                        <div>
                                            <h4 className="text-center mb-4" style={{'color':'var(--primary-fill)'}}>
                                                Login Page
                                            </h4>
                                        </div>
                                        <div className="user">
                                            <div className={styles['form-group']}>
                                                <div className='text-center w-25'><span>Email</span></div>
                                                <div className='w-75'>
                                                    <input type="email" className="form-control" placeholder="Enter Email Address" ref={emailRef} onChange={(e) => setEmail(e.target.value)}
                                                        onKeyDown={e => {
                                                            if (e.code === 'Enter')
                                                                loginHandler()
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles['form-group']}>
                                                <div className='text-center w-25'><span className='me-2'>Password</span></div>
                                                <div className='w-75'>
                                                    <input type="password" className="form-control" placeholder="Enter Password" ref={passwordRef} onChange={(e) => setPassword(e.target.value)}
                                                        onKeyDown={e => {
                                                            if (e.code === 'Enter')
                                                                loginHandler()
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='text-center'>
                                                <Button type='button' className="m-auto w-50" onClick={loginHandler} disabled={email === '' || password === ''}>Sign In</Button>
                                            </div>
                                            <div className='text-center mt-2'>
                                                <Button type='button' className="m-auto btn btn-light w-50" onClick={googleLoginHandler}>
                                                    <FcGoogle className="me-2" />
                                                    Sign In With Google
                                                </Button>
                                            </div>
                                            <div className='text-center'>
                                                <Button variant='link' type='button' className="m-auto" onClick={registerHandler}>Register</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Login