import React, {createContext, useEffect, useState} from 'react';
import Cookie from 'js-cookie'

const AuthContext = createContext();
const AuthProvider = ({children}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = Cookie.get('token');
        return !!token
    })

    useEffect(() => {
        const token = Cookie.get('token');
        if(token){
            setIsAuthenticated(true)
        }
    }, []);

    const login = (token) => {
        Cookie.set('token',token, {expires: 14, secure: true, sameSite: 'strict'})
        setIsAuthenticated(true)
    }

    const logout = () => {
        Cookie.remove('token')
        setIsAuthenticated(false)
    }

    return (
       <AuthContext.Provider value={{isAuthenticated, login, logout}} >
           {children}
       </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};