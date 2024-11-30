import {useEffect, useState} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import './index.css'

function HomePage() {

    const [todos, setTodos] = useState([]);



    useEffect(() => {
        (async () => {
            const res = await fetch('http://127.0.0.1:8000/api/todos/')
            const data = await res.json();
            setTodos(data)
        })()
    }, []);

    return (
    <>
        {todos.map((todo) => (
            <div key={todo.uuid}>
                <p className="font-black text-lg text-red-300">{todo.title}</p>
                <p >Status: <span className={`font-black text-md ${todo.completed ? 'text-red-500' : 'text-green-500'} `}>{todo.completed ? 'Completed' : 'Ongoing'}</span></p>
            </div>
        ))}
    </>
  )
}

export default HomePage
