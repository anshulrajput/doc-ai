import React, { useReducer } from "react"

const initialState = {
    loader: false,
    loaderMessage: '',
    toast: {
        code: null,
        severity: null,
        message: null
    }
}

const reducer = (state, action) => {
    switch(action.type){
        case 'start_loader':
            console.log('start_loader')
            return {
                ...state,
                loader: true,
                loaderMessage: action.payload?.loaderMessage !== undefined ? action.payload.loaderMessage : ''
            }
        case 'stop_loader':
            console.log('stop_loader')
            return {
                ...state,
                loader: false,
                loaderMessage: ''
            }
        case 'show_toast':
            return {
                ...state,
                toast: {
                    code: action.payload.code === undefined ? null : action.payload.code,
                    severity: action.payload.severity,
                    message: action.payload.message
                }
            }
        default:
            return state;
    }
}

const UIContext = React.createContext(initialState);

function UIContextProvider(props){
    const [state, dispatch] = useReducer(reducer,initialState)
    return (
        <UIContext.Provider value={{state, dispatch}}>
            {props.children}
        </UIContext.Provider>
    )
}

export { UIContextProvider }

export default UIContext;