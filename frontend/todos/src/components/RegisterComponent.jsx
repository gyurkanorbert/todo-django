import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

const RegisterComponent = () => {

    const navigate = useNavigate()

    const [useerName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState('')

    const handleSubmit =  async () => {
        try {

        const res = await fetch('http://localhost:8000/signup/', {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json'
            }
            ,
            body: JSON.stringify({
                email,
                username: useerName,
                password,
                name: fullName

            })
        })

        if(res.ok){
            navigate('/login')
        }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            <input type="text" value={useerName} placeholder="Username" onChange={(e) => setUserName(e.target.value) }/>
            <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value) }/>
            <input type="text" value={fullName} placeholder="Full Name" onChange={(e) => setFullName(e.target.value) }/>
            <input type="button" value="register" onClick={handleSubmit}/>


        </div>
    );
};

export default RegisterComponent;