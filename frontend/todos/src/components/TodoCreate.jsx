import React, {useState} from 'react';
// import {Input} from "postcss";

const TodoCreate = () => {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState(false)




    return (
        <div>
            <input
                type="text"
                value={title}
                placeholder="Todo Title"
            />
            <input
                type="button"

            />

        </div>
    );
};

export default TodoCreate;