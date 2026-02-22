import { Navigate, Route, Routes } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './features/auth/authSlice'

function App() {
  const {isAuthenticated}=useSelector((state)=>state.auth)
  const dispatch=useDispatch()
  console.log({isAuthenticated})

  useEffect(()=>{dispatch(checkAuth())},[])
  //useEffect(()=>{dispatch(refresh())})
  return (
    <>
      <Routes>
        <Route path='/' element={ (isAuthenticated)?(<Homepage></Homepage>):(<Navigate to={"/signup"}></Navigate>)}></Route>
        <Route path='/login' element={ (isAuthenticated)?(<Navigate to={"/"}></Navigate>):(<Login></Login>)}></Route>
        <Route path='/signup' element={(isAuthenticated)?(<Navigate to={"/"}></Navigate>):(<Signup></Signup>)}></Route>
      </Routes>
    </>
  )
}

export default App
