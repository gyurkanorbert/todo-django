// import {useEffect, useState} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import './index.css'
import {Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import TodoCreate from "./components/TodoCreate.jsx";
import LoginComponent from "./components/LoginComponent.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import {AuthProvider} from "./utils/AuthProvider.jsx";
import GroupView from "./components/GroupView.jsx";
import RegisterComponent from "./components/RegisterComponent.jsx";
function App() {

    return (
        <div>
        <AuthProvider>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                         <HomePage/>
                    </ProtectedRoute>
                }

                />
                <Route path="/todos/create" element={
                    <ProtectedRoute>
                        <TodoCreate/>
                    </ProtectedRoute>
                }/>
                <Route path="/login" element={<LoginComponent/>}/>
                <Route path="/groups/:groupID" element={
                    <ProtectedRoute>
                        <GroupView/>
                    </ProtectedRoute>

                }/>

                <Route path={"/register"} element={<RegisterComponent/>}/>
            </Routes>
        </AuthProvider>
        </div>
    )
}
export default App
