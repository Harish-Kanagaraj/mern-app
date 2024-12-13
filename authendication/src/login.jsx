import React, { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
   const [email,setEmail]=useState()
   const [password,setPassword]=useState()
   const Navigate = useNavigate();
   const [showModal, setShowModal] = useState(false);  
  const [modalMessage, setModalMessage] = useState('');
  
   axios.defaults.withCredentials=true;
   const handleSubmit=(e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/login',{email,password})
    .then(result=>{ 
      console.log(result)
      if(result.data .Login){
        Navigate('/dashboard');
      }
      else {
        setModalMessage('Invalid Email or Password. Please try again.');
        setShowModal(true);
      }
    })
    .catch((err) => {
      console.log(err);
      setModalMessage('An error occurred. Please try again later.');
      setShowModal(true);
    });
};
const closeModal = () => {
  setShowModal(false);
};
      
  //     else{
  //      alert('Invalid Email or Password.Please try again')
  //     }
     
  //   })
  //   .catch(err=>console.log(err))
  //  }
  return (
    <>
     {/* Modal for alert */}
     {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md w-80">
          <div className=" flex justify-end">
              <button onClick={closeModal} className='text-red-500 text-md font-bold'>X</button>
            </div>
            <h3 className="text-lg font-semibold">{modalMessage}</h3>
            
          </div>
        </div>
      )}
    <div className='flex justify-center	align-center border w-80  m-auto p-4 mt-32 shadow-md rounded-md'>
      <div className='bg-white p-3 rounded w-25'>
          <h2 className='text-3xl font-semibold text-center'>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3 mt-6'>
                <label htmlFor='email'>
                    <strong className='mr-8'>Email</strong>
                </label><br/>
                 <input type='email' required placeholder='Enter Email' autoComplete='off' name='email' className='form-control rounded-md border w-full mt-1 p-1' onChange={(e)=>setEmail(e.target.value)}></input>
            </div>

            <div className='mb-3 mt-4'>
                <label htmlFor='email'>
                    <strong className=''>Password</strong>
                </label><br/>
                 <input type='password' required placeholder='Enter Password' autoComplete='off' name='email' className='form-control rounded-md border w-full mt-1 p-1' onChange={(e)=>setPassword(e.target.value)}></input>
            </div>
            <button type='submit' className='bg-green-600 hover:bg-green-400 text-white border px-4 mt-4 py-1 rounded-md w-full'>Login</button>
            </form>
              <p className='mt-6'>Don't have an account?<Link to="/register" className='text-green-600 mr-2'>Sign up</Link></p>
      </div>
    </div>
 </>
  )
}
