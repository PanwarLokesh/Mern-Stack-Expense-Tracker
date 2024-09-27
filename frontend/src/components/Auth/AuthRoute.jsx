import React from 'react'
import { getUserFromStorage } from '../../utils/getUserFromStorage'
import { Navigate, useNavigate } from 'react-router-dom';

const AuthRoute = ({children}) => {
    const user = getUserFromStorage();
    const token =user.token;
    if(token){
        return children
    }
    else{
        return <Navigate to={'/login'}/>
    }
}

export default AuthRoute
