import { Navigate, Route, Routes } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth, fetchLanguages } from './features/auth/authSlice'
import Adminpage from './pages/adminpage'
import ProblemPage from './pages/problempage'
import CreateProblem from './pages/createProblem'
import EditPage from './pages/editProblemPage'

function App() {
  const {isAuthenticated,user}=useSelector((state)=>state.auth)
  console.log({user})
  const dispatch=useDispatch()
  console.log({isAuthenticated})

  useEffect(()=>{dispatch(checkAuth())},[])
  useEffect(()=>{dispatch(fetchLanguages())},[])
  //useEffect(()=>{dispatch(refresh())})
  return (
    <>
      <Routes>
        <Route path='/' element={ (isAuthenticated)?(user?.role=="Admin" ? <Navigate to={"/admin"}></Navigate> : <Homepage></Homepage>):(<Navigate to={"/signup"}></Navigate>)}></Route>
        <Route path='/login' element={ (isAuthenticated)?(<Navigate to={"/"}></Navigate>):(<Login></Login>)}></Route>
        <Route path='/signup' element={(isAuthenticated)?(<Navigate to={"/"}></Navigate>):(<Signup></Signup>)}></Route>
        <Route path='/signup' element={(isAuthenticated)?(<Navigate to={"/"}></Navigate>):(<Signup></Signup>)}></Route>
        <Route path='/problem/:slug' element={ (isAuthenticated)?(<ProblemPage></ProblemPage>):(<Navigate to={"/signup"}></Navigate>)}></Route>
        <Route path='/admin' element={(user && user?.role=="Admin") ? <Adminpage></Adminpage> : <Navigate to={"/"}></Navigate>}></Route>
        <Route path='/create' element={(user && user?.role=="Admin") ? <CreateProblem></CreateProblem> : <Navigate to={"/"}></Navigate>}></Route>
        <Route path='/problems/edit/:slug' element={(user && user?.role=="Admin") ? <EditPage></EditPage> : <Navigate to={"/"}></Navigate>}></Route>
      </Routes>
    </>
  )
}

export default App
