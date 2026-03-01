import { useState } from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { axiosClient } from "../utils/axiosClient"
import { logout } from "../features/auth/authSlice"
import { Link, useNavigate } from "react-router"

export default function Homepage(){
    const {user}=useSelector((state)=>state.auth)
    const {username,email}=user
    const [data,setData]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState(null)
    const dispatch=useDispatch()
    const [showLogout,setShowLogout]=useState(false)
    const [searchUrl,setSearchUrl]=useState("/problems/all")
    const [filters,setFilters]=useState({
            tags:"all",
            difficulty:"all",
            status:"all"
    })

    console.log({searchUrl})

    async function handleLogout(){
        dispatch(logout())
    }

    useEffect(()=>{
            (async ()=>{
            try{
                const response=await axiosClient.get(searchUrl)
                console.log({data})
                setData(response.data)
                setLoading(false)
            }
            catch(error){
                setError(error)
                setLoading(false)
            }
        })()
    },[searchUrl])

    if(loading){
        return (
            <div className="w-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    else if(error){
        console.log(error)
        return (
            <p>An Error Occured</p>
        )
    }

    return (
        <>
        <div className="flex w-full justify-between p-8 pt-1 pb-1 items-center">
            <h1>Leetcode</h1>
            <p onClick={()=>{setShowLogout(!showLogout)}}>{username}</p>
            <div onClick={handleLogout} className={`btn btn-active block text-red-500 fixed right-1 top-10 ${showLogout ? "block" : "hidden"}`}>Logout</div>
        </div>

        {/* <div className="flex gap-2">
            <div>
                <details className="dropdown">
                    <summary className="btn m-1">All Problems</summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li onClick={()=>{setSearchUrl("/problems/solved")}}><a >Solved</a></li>
                        <li><a>Attempted</a></li>
                    </ul>
                </details>
            </div>
            <div>
                <details className="dropdown">
                    <summary className="btn m-1">Tags</summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><a>Array</a></li>
                        <li><a>Hashmap</a></li>
                    </ul>
                </details>
            </div>
            <div>
                <details className="dropdown">
                    <summary className="btn m-1">Difficulty</summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><a>Easy</a></li>
                        <li><a>Medium</a></li>
                        <li><a>Hard</a></li>
                    </ul>
                </details>
            </div>
        </div> */}
        
        <div className="flex justify-center pt-20">
            <div className="w-[70%]">
                {typeof data!="object" ? data : data?.data?.map((problem)=>{
                    console.log(problem)
                    
                    return (<Link to={`/problem/${problem.slug}`} key={problem._id} className="flex w-full justify-between p-8 pt-1 pb-2">
                            <span>{problem.title}</span>
                            <span className="bg-blue-500 text-white rounded-3xl p-1">{problem.difficulty}</span>
                        </Link>)
                } )}
            </div>
        </div>
        </>
    )
}