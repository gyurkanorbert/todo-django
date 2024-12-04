import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Cookie from "js-cookie";
import {GoPlus} from "react-icons/go";
import TodoCreateModal from "./TodoCreateModal.jsx";

const GroupView = () => {

    const [groupDetails, setGroupDetails] = useState({})
    const [todos, setTodos] = useState([]);
    const {groupID} = useParams();
    const navigate = useNavigate()
    const [createVisible, setCreateVisible] = useState(true)

    const socket = useMemo(() => new WebSocket(`ws://localhost:8000/ws/groups/${groupID}/`), [])


    const getDetails = async () => {
        const res = await fetch(`http://localhost:8000/api/group/${groupID}`, {
             method: "GET",
             headers: {
                 "Authorization": `Token ${Cookie.get('token')}`
             }

         })

        if(!res.ok){
            navigate('/')
        }

        const data = await res.json();
        console.log(Cookie.get('token'))
        console.log(data.group)
        console.log(data.todos)
        setGroupDetails(data.group)
        setTodos(data.todos)
    }

    useEffect(() => {
        socket.onopen = () => {
            console.log(`todo socket running: ${socket} `)
        }

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(data.todo)
            setTodos((todos) => [...todos, data.todo])

        }

        return () => {
            socket.close();
        }

    }, [socket])

    useEffect(() => {
        getDetails()
    }, []);

        const toggleComplete = (todoId) => {
        // Update local state
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.uuid === todoId
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );

        // implement this
        // socket.send(JSON.stringify({
        //     type: 'todo_update',
        //     todo_id: todoId,
        //     action: 'toggle_complete'
        // }));
    };


  return (
    <div>
        {createVisible && (
            <TodoCreateModal onClose={(prev) => setCreateVisible(!prev)} groupID={groupID}/>
        )}
        <div className="fixed bottom-5 right-5 rounded-3xl p-10 bg-purple-500 hover:cursor-pointer" onClick={() => setCreateVisible(true)}>
            <GoPlus className="h-[1.5rem] w-[1.5rem]"/>
        </div>
      <div className="container mx-auto p-4">
        <p className="text-2xl font-bold mb-4">Group Name: {groupDetails.name}</p>
        {todos && (
          todos.map((todo) => (
            <div
              key={todo.uuid}
              className={`p-4 border rounded-md shadow-md mb-4 ${
                todo.completed ? 'bg-green-300' : 'bg-red-300'
              } cursor-pointer`}
              onClick={() => toggleComplete(todo.uuid)}
            >
              <p className="text-xl font-semibold">{todo.title}</p>
              <p className="text-sm">
                Completed:{' '}
                <span
                  className={`font-bold ${
                    todo.completed ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {todo.completed ? 'true' : 'false'}
                </span>
              </p>
              <p className="text-sm">Author: {todo.user.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

};

export default GroupView;