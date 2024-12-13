import { useState } from 'react'

import {BrowserRouter , Routes , Route } from 'react-router-dom';
import Signup from './signup';
import Login from './login';
import Home from './Home';
import Dashboard from './Dashboard';
function App() {
  
  return (
   <BrowserRouter>
       <Routes>
          <Route path='/register' element={<Signup/>}> </Route>
          <Route path='/' element={<Login/>}> </Route>
          <Route path='/home' element={<Home/>}> </Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
      </Routes>
   </BrowserRouter>
  )
}

export default App
