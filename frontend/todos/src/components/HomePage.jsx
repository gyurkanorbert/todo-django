import {useEffect, useState} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import './index.css'
import Cookie from "js-cookie";
import {useLocation, useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
// import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

function HomePage() {

   const navigate = useNavigate()

    const {logout} = useAuth()
    const [todos, setTodos] = useState([]);
    const [groupID, setGroupID] = useState('')
    const [error, setError] = useState('')
    const [user,setUser] = useState({
        name: '',
        id: null,
        uuid: '',
    })

    const [groups, setGroups] = useState([]);



    // const checkIfGroupExists = async (id) => {
    //     const res = await fetch(`http://localhost:8000/api/group/${id}`)
    //     if(!res.ok){
    //         setError(`Error joining group with ID ${groupID}! Group might not exist`)
    //         return false
    //
    //     }
    //     return true
    // }

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
                navigate(`/groups/${groupID}`)
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
