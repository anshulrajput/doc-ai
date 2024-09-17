import {useEffect, useRef, useContext} from 'react';
// import client from './client';
import axios from 'axios';
import UIContext from '../store/ui-context'
import AuthContext from '../store/auth-context'

const ResponseInterceptor = () => {
    const { dispatch: uiDispatch } = useContext(UIContext);
    const { userLogout } = useContext(AuthContext);

    const interceptorId = useRef(null);

    useEffect(() => {
        interceptorId.current = axios.interceptors.response.use(undefined, (error) => {
            console.log(error)
            if (axios.isCancel(error)){
                return Promise.reject(error)
            }
            switch (error.response.status) {
                case 0:
                    {
                        let message = error.response?.data?.message ? error.response.data.message : 'Something Went Wrong!'
                        let code = error.response?.data?.message ? 0 : 500
                        uiDispatch({ type: 'show_toast', payload: { code: code, severity: 'error', message: message } })
                    }
                    break;
                case 401: 
                    {
                        let message = error.response?.data?.message ? error.response.data.message : 'Something Went Wrong!'
                        let code = error.response?.data?.message ? 401 : 500
                        uiDispatch({ type: 'show_toast', payload: { code: code, severity: 'error', message: message } })
                    }
                    userLogout()
                    break;
                case 403: 
                    {
                        let message = error.response?.data?.message ? error.response.data.message : 'Something Went Wrong!'
                        let code = error.response?.data?.message ? 403 : 500
                        uiDispatch({ type: 'show_toast', payload: { code: code, severity: 'error', message: message } })
                    }
                    uiDispatch({ type: 'stop_loader' })
                    userLogout()
                    break;
                case 410:   // error in api input
                    {
                        let message = error.response?.data?.message ? error.response.data.message : 'Something Went Wrong!'
                        let code = error.response?.data?.message ? 410 : 500
                        uiDispatch({ type: 'show_toast', payload: { code: code, severity: 'error', message: message } })
                    }
                    break;
                default:
                    {
                        let message = error.response?.data?.message ? error.response.data.message : 'Something Went Wrong!'
                        let code = error.response?.data?.message ? 500 : 500
                        uiDispatch({ type: 'show_toast', payload: { code: code, severity: 'error', message: message } })
                    }
                    break;
            }

            return Promise.reject(error)
        });

        return() => {
            axios.interceptors.response.eject(interceptorId.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default ResponseInterceptor
