import {useEffect, useMemo, useState} from 'react'
import Cookie from "js-cookie";
import {useLocation, useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
// import {WebSocket} from "vite";
// import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
//
function HomePage() {
//
   const socket = useMemo(() => new WebSocket('ws://localhost:8000/ws/counter/'), [])
   const groupSocket = useMemo(() => new WebSocket('ws://localhost:8000/ws/group_actions/'), [])
   const navigate = useNavigate()

    const {logout} = useAuth()
    const [todos, setTodos] = useState([]);
    const [online, setOnline] = useState(0)
    const [status, setStatus] = useState('')
    const [groupID, setGroupID] = useState('')
    const [error, setError] = useState('')
    const [user,setUser] = useState({
        name: '',
        id: null,
        uuid: '',
    })

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        socket.onopen = () => {
            console.log('Connected');
            setStatus('Connected');
        };



        socket.onmessage = (e) => {
           const data = JSON.parse(e.data)
            console.log('Received:', data);
            if(data.type === 'user_count') {
                setOnline(data.count);
            }
        };

        socket.onclose = () => {
            console.log('Disconnected');
            setStatus('Disconnected');
            setOnline(count => count - 1)
        };

        socket.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

        return () => {
            if(socket) {
                socket.close();
            }
        };
    }, [socket]);


    useEffect(() => {
        groupSocket.onopen = () => {
            console.log('Group Socket Online')
        }

        groupSocket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(data)
            if(data.type === 'group_update'){
                setGroups((prev) => [...prev, data.group])
                console.log(data.group)
            }
        }

        return () => {
            groupSocket.close()
        }
    }, [groupSocket]);

    const textChange = (value) => {
        setError(null)
        setGroupID(value)

    }

    const joinGroup = async() => {

        try{
            const res = await fetch(`http://localhost:8000/api/join/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookie.get('token')}`

            }     ,
            body: JSON.stringify({
                user: user.id,
                group: groupID
            })





        })
            if(res.ok){
                console.log(await res.json())
                // navigate(`/groups/${groupID}`)
            } else {
                setError('Error joining group! You are either already part of the group or the ID is invalid')

            }
        } catch (e) {
            setError(e.message)
        }

        }





    useEffect(() => {

        (async () => {

         const res = await fetch('http://127.0.0.1:8000/me', {
             method: "GET",
             headers: {
                 "Authorization": `Token ${Cookie.get('token')}`
             }
         })
             const data = await res.json()
            console.log(data)
            setUser({
                name: data.user.name,
                uuid: data.user.uuid,
                id: data.user.id
            })

            // console.log(data)


    })();

        (async () => {

         const res = await fetch('http://127.0.0.1:8000/api/collabs/', {
             method: "GET",
             headers: {
                 "Authorization": `Token ${Cookie.get('token')}`
             }
         })
             const data = await res.json();
            setGroups(data)



            console.log(data)


    })()



    }, []);



//
//
    return (
    <>
        <p>Current online users {online}</p>
        <p>{status}</p>

        {user && (
            <div>
                <p>Logged in as {user.name }</p>
                <input type="text" value={groupID} placeholder="Enter the ID of the group you want to join!" onChange={(e) => textChange(e.target.value)} />
                <input type="button" value="Join" onClick={joinGroup}/>
                {error && (
                    <p>{error}</p>
                )}

            </div>


        )}


        {
            user && (
                groups.map((group) => (
                    <p onClick={() => navigate(`/groups/${group.id}`)} key={group.id}>{group.name}</p>
                ))
            )
        }

        {user && (
            <input type="button" value="Logout" onClick={() => logout()}/>
        )}

        {/*{*/}
        {/*    user && (*/}
        {/*        user.groups.map((group)  => (*/}
        {/*            <p key={group}>{group}</p>*/}
        {/*        ))*/}
        {/*    )*/}
        {/*}*/}



        {/*{todos.map((todo) => (*/}
        {/*    <div key={todo.uuid}>*/}
        {/*        <p className="font-black text-lg text-red-300">{todo.title}</p>*/}
        {/*        <p >Status: <span className={`font-black text-md ${todo.completed ? 'text-red-500' : 'text-green-500'} `}>{todo.completed ? 'Completed' : 'Ongoing'}</span></p>*/}
        {/*    </div>*/}
        {/*))}*/}
    </>
  )


}

export default HomePage
