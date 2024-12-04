import {useEffect, useMemo, useState} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import './index.css'
import Cookie from "js-cookie";
import {useLocation, useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import CreateGroupModal from "./CreateGroupModal.jsx";
// import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

function HomePage() {

   const socket = useMemo(() => new WebSocket(`ws://127.0.0.1:8000/ws/group_actions/`), [])
   const navigate = useNavigate()

    const {logout} = useAuth()
    const [todos, setTodos] = useState([]);
    const [groupID, setGroupID] = useState('')
    const [error, setError] = useState('')
    const [createGroup, setCreateGroup] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [user,setUser] = useState({
        name: '',
        id: null,
        uuid: '',
    })

    const [groups, setGroups] = useState([]);


    useEffect(() => {
        socket.onopen = () => {
            console.log('Group Socket Connected')
        }
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if(data.type === "group_update"){
                setGroups((prev) => [...prev, data.group])
            }

        }

        return () => {
            socket.close()
        }
    }, [])


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




    return (
    <>
        {createGroup && (
            <CreateGroupModal
                isOpen={createGroup}
                onClose={() => setCreateGroup(() => !createGroup)}
                />
        )}


        {user && (
    <div className="container mx-auto p-4">
        <div className="mb-4 p-4 border rounded-md shadow-md bg-white">
            <p className="text-xl font-bold mb-2">Logged in as {user.name}</p>
            <input
                type="text"
                value={groupID}
                placeholder="Enter the ID of the group you want to join!"
                onChange={(e) => textChange(e.target.value)}
                className="w-full px-3 py-2 mb-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
            <input
                type="button"
                value="Join"
                onClick={joinGroup}
                className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            />
            {error && (
                <p className="text-red-500 mt-2">{error}</p>
            )}
        </div>

        <div className="mb-4 p-4 border rounded-md shadow-md bg-white">
            {groups.map((group) => (
                <p
                    key={group.id}
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="cursor-pointer text-blue-600 hover:underline"
                >
                    {group.name}
                </p>
            ))}
        </div>
        <div className="w-full ">
            <input
                type="button"
                value="Logout"
                onClick={() => logout()}
                className=" w-1/2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200 px-4 py-2"
            />
            <input
                type="button"
                value="Create Group"
                onClick={() => setCreateGroup(true)}
                className=" w-1/2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-200 px-4 py-2"
            />
        </div>

    </div>
        )}
    </>
    )


}

export default HomePage
