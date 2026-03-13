import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../features/auth/authSlice';
import { axiosClient } from '../utils/axiosClient';
import Popup from '../components/Popup';
import { Link } from 'react-router';

const Adminpage = () => {
    const {user}=useSelector((state)=>state.auth)
    const navigate=useNavigate()
    const [problems,setProblems]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState(null)
    const dispatch=useDispatch()
    const [deleteProblemMsg,setDeleteProblemMsg]=useState(null)
    const [deleteProblemError,setDeleteProblemError]=useState(null)

    async function deleteProblem(problemSlug){
        if(window.confirm("are you sure you want to delete this problem")){try{
            const {data:response}=await axiosClient.delete(`problems/delete/${problemSlug}`)
            setDeleteProblemMsg(response.msg)
        }
        catch(error){
            setDeleteProblemError(error.message || "an error occured")
        }}
    }

    useEffect(()=>{
            (async ()=>{
            try{
                const response=await axiosClient.get("/problems/all")
                setProblems(response.data.data)
                setLoading(false)
            }
            catch(error){
                setError(error)
                setLoading(false)
            }
        })()
    },[deleteProblemMsg,deleteProblemError])
    console.log({deleteProblemError,deleteProblemMsg})
  return (
    <div className="drawer lg:drawer-open bg-base-200 min-h-screen">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {deleteProblemMsg && <Popup message={deleteProblemMsg} sucessflag={true}></Popup>}
      {deleteProblemError && <Popup message={deleteProblemError} sucessflag={false}></Popup>}
      
      {/* 1. MAIN CONTENT AREA */}
      <div className="drawer-content flex flex-col">
        
        {/* Mobile Navbar */}
        <div className="navbar bg-base-100 shadow-sm px-4 lg:hidden">
          <div className="flex-none">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost drawer-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">Admin Dashboard</a>
            <span>{user.username}</span>
            <button className='btn text-red-400 font-bold' onClick={()=>{
                dispatch(logout())
                navigate("/login")
            }}>Logout</button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10">
          
          {/* Header with Title, Search, and Add Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold">Manage Problems</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="form-control w-full sm:w-64">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search problems..." 
                    className="input input-bordered w-full pr-10" 
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-3 h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <button className="btn btn-primary whitespace-nowrap" onClick={()=>{
                navigate("/create")
              }}>
                + Add New Problem
              </button>
            </div>
          </div>

          {/* DaisyUI Table: Problem Management */}
          <div className="flex justify-center pt-20">
            <div className="w-[90%]">
                {problems?.length!=0 ? problems?.map((problem)=>                   
                    (<div key={problem._id} className="flex w-full justify-between p-8 pt-1 pb-1 items-center">
                            <span className="flex p-1 gap-2 items-center">
                                <span>{problem.title}</span>
                                <span className="bg-blue-500 text-white rounded-[4px] flex h-min justify-center p-2">{problem.difficulty}</span>
                            </span>
                            <span className='flex p-1 gap-1'>
                                <Link to={`/problems/edit/${problem.slug}`} className="btn btn-outline">Edit</Link>
                                <button className="btn btn-error" onClick={async ()=>{
                                    await deleteProblem(problem.slug)
                                }}>Delete</button>
                            </span>
                        </div> )  
                 ) : "No Problems Found"}
            </div>
        </div>
        </main>
      </div> 
      
      {/* 2. SIDEBAR (DRAWER) */}
      <div className="drawer-side z-50">
        <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-72 min-h-full bg-base-100 text-base-content border-r border-base-200">
          <li className="mb-4">
            <a className="text-2xl font-bold text-primary px-4">LeetClone Admin</a>
          </li>
          
          <li className="menu-title"><span>Menu</span></li>
          <li><a className="active">Manage Problems</a></li>
          <li><a>Submissions</a></li>
          <li><a>Test Cases</a></li>
          
          <li className="menu-title mt-4"><span>Settings</span></li>
          <li><a>General</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Adminpage;