import styles from './Register.module.css'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useEffect, useContext, useRef, useState } from "react"
import UIContext from '../store/ui-context'
import { FcGoogle } from "react-icons/fc";
import Button from 'react-bootstrap/Button';
import { authApiClient } from '../api/client'
import { useNavigate } from 'react-router-dom'

function Register(){
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const emailRef = useRef()
    const nameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const navigate = useNavigate()

    const { dispatch: uiDispatch } = useContext(UIContext);

    function validateForm(){
        const email = emailRef.current.value
        const name = nameRef.current.value
        const password = passwordRef.current.value
        const confirmPassword = confirmPasswordRef.current.value

        if(password === '' || confirmPassword === '' || name === '' || email === ''){
            uiDispatch({ type: 'show_toast', payload: { severity: 'error', message: "Fill All The Details" } })
            return false
        }

        // check passwords match
        if(password !== '' && confirmPassword !== ''){
            if(password !== confirmPassword){
                uiDispatch({ type: 'show_toast', payload: { severity: 'error', message: "Passwords don't match" } })
                return false
            }
        }

        return true
    }

    function clearForm(){
        emailRef.current.value = ''
        nameRef.current.value = ''
        passwordRef.current.value = ''
        confirmPasswordRef.current.value = ''
    }

    async function registerApi(){
        try {
            const res = await authApiClient.put('/user/register', 
                {
                    name: name,
                    email: email,
                    password: password
                }
            )
    
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

    async function registerHandler(){
        const valid = validateForm()

        if(!valid){
            return
        }

        uiDispatch({ type: 'start_loader' })

        try {
            await registerApi()

            clearForm()

            uiDispatch({ type: 'stop_loader' })
            uiDispatch({ type: 'show_toast', payload: { severity: 'success', message: 'Registration Successful!' } })
        } catch (err) {
            let message = err?.message === undefined ? 'Registration Failed' : err.message
            uiDispatch({ type: 'stop_loader' })
            uiDispatch({ type: 'show_toast', payload: { severity: 'error', message: message } })
        }
    }

    function loginHandler(){
        navigate('/login')
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
                                            Registration Page
                                        </h4>
                                    </div>
                                    <div className="user">
                                        <div className={styles['form-group']}>
                                            <div className='text-center w-25'><span>Name</span></div>
                                            <div className='w-75'>
                                                <input type="email" className="form-control" placeholder="Enter Name" ref={nameRef} onChange={(e) => setName(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.code === 'Enter')
                                                            registerHandler()
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles['form-group']}>
                                            <div className='text-center w-25'><span>Email</span></div>
                                            <div className='w-75'>
                                                <input type="email" className="form-control" placeholder="Enter Email Address" ref={emailRef} onChange={(e) => setEmail(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.code === 'Enter')
                                                            registerHandler()
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
                                                            registerHandler()
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles['form-group']}>
                                            <div className='text-center w-25'><span className='me-2'>Confirm Password</span></div>
                                            <div className='w-75'>
                                                <input type="password" className="form-control" placeholder="Enter Password" ref={confirmPasswordRef} onChange={(e) => setConfirmPassword(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.code === 'Enter')
                                                            registerHandler()
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <Button type='button' className="m-auto w-50" onClick={registerHandler} disabled={email === '' || password === ''}>Register</Button>
                                        </div>
                                        <div className='text-center'>
                                            <Button variant='link' type='button' className="m-auto" onClick={loginHandler}>Login</Button>
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

export default Register