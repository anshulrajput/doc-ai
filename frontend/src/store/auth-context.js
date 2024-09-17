import React, { useReducer } from "react"
import { getAuthenticatedUserApi } from '../api/UserService'

const initialState = {
    isLoggedIn: false,
    authToken: localStorage.getItem('authToken') ? localStorage.getItem('authToken') : null,
    tokenExpiry: localStorage.getItem('tokenExpiry') ? localStorage.getItem('tokenExpiry') : null,
    email: localStorage.getItem('email') ? localStorage.getItem('email') : null,
    data: {
        get_authenticated_user: {
            loading: false,
            code: null,
            status: null,
            message: null,
            data: null,
            error: null
        }
    }
}

// set the isLoggedIn status accordingly
if(initialState.authToken && initialState.tokenExpiry){
    let currentTimeStamp = new Date().getTime()
    if(initialState.tokenExpiry > currentTimeStamp){
        initialState.isLoggedIn = true
    }
}

const reducer = (state, action) => {
    switch(action.type){
        case 'login_success':
            console.log(action.payload)
            return {
                ...state,
                isLoggedIn: true,
                authToken: action.payload.firebaseResponse.user.stsTokenManager.accessToken,
                tokenExpiry: action.payload.firebaseResponse.user.stsTokenManager.expirationTime,
                email: action.payload.firebaseResponse.user.email,
                data: {
                    ...state.data,
                }
            }
        case 'get_authenticated_user_init':
            return {
                ...state,
                data: {
                    ...state.data,
                    get_authenticated_user: {
                        loading: true,
                        code: null,
                        status: null,
                        message: null,
                        data: null,
                        error: null
                    }
                }
            }
        case 'get_authenticated_user_success':
            console.log(action.payload)
            return {
                ...state,
                data: {
                    ...state.data,
                    get_authenticated_user: action.payload
                }
            }
        case 'get_authenticated_user_error':
            return {
                ...state,
                data: {
                    ...state.data,
                    get_authenticated_user: action.payload
                }
            }
        case 'user_logout':
            console.log('logout')
            localStorage.removeItem('authToken')
            localStorage.removeItem('email')
            localStorage.removeItem('tokenExpiry')
            localStorage.removeItem('userId')
            return {
                ...state,
                isLoggedIn: false,
                authToken: null,
                tokenExpiry: null,
                email: null,
                data: {
                    ...state.data,
                }
            }
        default:
            return state;
    }
}

const AuthContext = React.createContext(initialState);

function AuthContextProvider(props){
    const [state, dispatch] = useReducer(reducer,initialState)

    async function getAuthenticatedUser(){
        dispatch({
            type: 'get_authenticated_user_init',
        })

        try{
            let response = await getAuthenticatedUserApi()
            dispatch({
                type: 'get_authenticated_user_success',
                payload: response
            })
        }
        catch(err){
            dispatch({
                type: 'get_authenticated_user_error',
                payload: err
            })
        }
    }

    function userLogout(){
        dispatch({
            type: 'user_logout',
        })
    }

    return (
        <AuthContext.Provider value={{
            state, dispatch,
            getAuthenticatedUser,
            userLogout
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContextProvider }

export default AuthContext;