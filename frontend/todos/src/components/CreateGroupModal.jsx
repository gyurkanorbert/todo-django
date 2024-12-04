import React, {useState} from 'react';
import {IoClose} from "react-icons/io5";
import Cookie from "js-cookie";
import {useNavigate} from "react-router-dom";


const CreateGroupModal = ({isOpen, onClose}) => {

    const navigate = useNavigate()
    const [groupName, setGroupName] = useState('');
    const [groupCode, setGroupCode] = useState('')
    const createGroup = async () => {
        const res = await fetch(`http://localhost:8000/api/groups/create/`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Token ${Cookie.get('token')}`
            },
            body: JSON.stringify({
                name: groupName
            })
        })

        if(res.ok){
            console.log('Group created')
            const data = await res.json()
            setGroupCode(data.group.id)


        }
    }


    return(
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 opacity-100">

          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Enter Group Name
                  </h2>
                  <div className="flex items-center justify-center">
                      <IoClose className="h-5 w-5" onClick={onClose} />
                  </div>

              </div>

              <input
                  type="text"
                  placeholder="Group Name"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
            />
            <div className="flex flex-col justify-end mt-4">
                <input type="button" value="Create!" className="text-center w-full bg-purple-200 rounded-xl p-2" onClick={createGroup}  />
                <p hidden={!groupCode} className="font-bold">Group code:  {groupCode}</p>
            </div>
          </div>
        </div>
  );
};

export default CreateGroupModal;