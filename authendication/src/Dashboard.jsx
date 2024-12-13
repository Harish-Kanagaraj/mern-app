import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Set default credentials for cross-origin requests
  axios.defaults.withCredentials = true;

  useEffect(() => {
   
    axios.get('http://localhost:3001/dashboard')
      .then(res => {
        if (res.data.valid) {
          setMessage(res.data.message);
        } else {
          
          navigate('/');
        }
      })
      .catch(err => {
        console.log(err);
        navigate('/');
      });
  }, [navigate]);

   const  handleSubmit=()=>{
      navigate('/')
   }

  return (
    <div className="flex flex-col justify-center items-center">
    <h1 className='text-center text-2xl font-bold mb-4'>Dashboard {message}</h1> 
    <button onClick={handleSubmit} className='text-center border p-2 px-4 rounded-md bg-blue-600 text-white'>
        Sign Out
    </button>
</div>

  );
}
