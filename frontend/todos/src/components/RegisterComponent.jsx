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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Register</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={useerName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Username"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
                        >
                            Register
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring focus:ring-indigo-200"
                        >
                            Go to login!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterComponent;