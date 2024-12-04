import React, {useState} from 'react';
import {IoClose} from "react-icons/io5";
import Cookie from "js-cookie";

const TodoCreateModal = ({onClose, groupID}) => {


    const [title, setTitle] = useState('')


    const submit =  async () => {
        const res = await fetch(`http://localhost:8000/api/tdo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${Cookie.get('token')}`
            },
            body: JSON.stringify({
                "title": title,
                "group_id": groupID
            })



        })

        if(res.ok){
            console.log('Todo created successfully')
        }
    }

       return(
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 opacity-100">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Create New Todo
                  </h2>
                  <div className="flex items-center justify-center">
                      <IoClose className="h-5 w-5 cursor-pointer" onClick={onClose} />
                  </div>
              </div>

              <div className="space-y-4">
                  <input
                      type="text"
                      placeholder="Todo Title"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                  />



              </div>

              <div className="flex flex-col justify-end mt-6">
                  <input
                      type="button"
                      value="Create Todo"
                      className="text-center w-full bg-purple-200 hover:bg-purple-300 transition-colors duration-200 rounded-xl p-2 cursor-pointer"
                      onClick={submit}
                      disabled={title.length < 1 || title.includes(' ',0)}
                  />
              </div>
          </div>
        </div>
    );
};

export default TodoCreateModal;