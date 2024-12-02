import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";


const LoginComponent = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    const navigate = useNavigate();

    const submit = async (e) => {

      try {
          const res = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({email: username, password})

        })
          const data = await res.json();

          if(res.ok){
              navigate('/')
              localStorage.setItem('token',data.token)

          }
      } catch (e) {
          console.log(e)
          setError(e.message)
      }




    }

    return (
        <div>
            <input type="text"
                   value={username}
                   onChange={(event) => setUsername(event.target.value)}
                   placeholder="email"
            />

            <input type="password"
                   value={password}
                   onChange={(event) => setPassword(event.target.value)}
                   placeholder="password"
            />

            <input type="button"
                   value="Login"
                   onClick={submit}
            />

        </div>
    );
};

export default LoginComponent;