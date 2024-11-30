// import {useEffect, useState} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import './index.css'
import {Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import TodoCreate from "./components/TodoCreate.jsx";
function App() {

    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/todos/create" element={<TodoCreate/>}/>
            </Routes>
        </div>
    )
}
export default App
