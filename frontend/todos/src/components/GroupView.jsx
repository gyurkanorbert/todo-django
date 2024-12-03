import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Cookie from "js-cookie";

const GroupView = () => {

    const [groupDetails, setGroupDetails] = useState({})
    const [todos, setTodos] = useState([]);
    const {groupID} = useParams();
    const navigate = useNavigate()

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
        getDetails()
    }, []);

    return (
        <div>
            <p>Group Name: {groupDetails.name}</p>
            {todos && (
                todos.map((todo) => (
                    <div key={todo.uuid}>
                        <p>{todo.title}</p>
                        {/*jo lenne itt ha valami szinnel jelezned, hogy teljesitve van e vayg sem*/}
                        <p>Completed: {todo.completed ? 'true' : 'false'}</p>
                        <p>Author: {todo.user.name}</p>
                    </div>


                ))
            )}
        </div>
    );
};

export default GroupView;