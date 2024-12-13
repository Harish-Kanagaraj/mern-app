import React, { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
   const [name,setName]=useState()
   const [email,setEmail]=useState()
   const [password,setPassword]=useState()
    const Navigate = useNavigate();

   const handleSubmit=(e)=>{
    e.preventDefault()
    console.log(name,email,password)
    axios.post('http://localhost:3001/register', {name,email,password})
    .then(result=>{ console.log(result)
      Navigate('/');
    })
    .catch(err=>console.log(err))
   }
  return (
    <>
    <div className='flex justify-center	align-center border w-96  m-auto p-2 pt-2 pb-2 mt-32 shadow-md rounded-md'>
      <div className='bg-white p-2 rounded w-25'>
          <h2 className='text-3xl font-semibold text-center'>Sign Up</h2>
          <form onSubmit={handleSubmit} >
            <div className='mb-3 mt-4 '>
                <label htmlFor='email'>
                    <strong >Name</strong>
                </label><br/>
                 <input type='text' required placeholder='Enter Name' autoComplete='off' name='email' className='form-control rounded-md border w-full p-1 mt-1' onChange={(e)=>setName(e.target.value)}></input>
            </div>

            <div className='mb-3 mt-2'>
                <label htmlFor='email'>
                    <strong>Email</strong>
                </label><br/>
                 <input type='email' required placeholder='Enter Email' autoComplete='off' name='email' className='form-control rounded-md border w-full p-1 mt-1' onChange={(e)=>setEmail(e.target.value)}></input>
            </div>

            <div className='mb-3 mt-2'>
                <label htmlFor='email'>
                    <strong  >Password</strong>
                </label><br/>
                 <input type='password' required placeholder='Enter Password' autoComplete='off' name='email' className='form-control rounded-md border w-full p-1 mt-1' onChange={(e)=>setPassword(e.target.value)}></input>
            </div>
            <button type='submit' className='bg-green-600 hover:bg-green-400 border px-4 mt-4  py-1 rounded-md w-full text-white'> Register</button>
            </form>
            <p className='mt-6'>Already Have an Account? <Link to="/" className='text-green-600 mr-2'>Sign in</Link></p>
        
         
      </div>
    </div>
 </>
  )
}
