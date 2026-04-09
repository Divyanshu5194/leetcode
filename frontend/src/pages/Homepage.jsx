import { useState } from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { axiosClient } from "../utils/axiosClient"
import { logout } from "../features/auth/authSlice"
import { Link } from "react-router"

export default function Homepage(){
    const {user}=useSelector((state)=>state.auth)
    const {username,email}=user
    const [data,setData]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState(null)
    const dispatch=useDispatch()
    const [showLogout,setShowLogout]=useState(false)
    const [skip,setSkip]=useState(0)
    const [endReached,setEndReached]=useState(false)
    const [filters,setFilters]=useState({
            tags:"all",
            difficulty:"all",
            status:"all"
    })

    async function handleLogout(){
        dispatch(logout())
    }

    useEffect(()=>{
            if(!endReached){(async ()=>{
                console.log({skip})
            try{
                const response=await axiosClient.get(`problems/all?limit=10&skip=${skip}`)
                console.log({data:response.data})
                setData((prev)=>{
                    if(prev.length!=skip+10 || prev.length==0){prev=[...prev,...response.data.data]}
                    if(response.data.data.length<10){setEndReached(true)}
                    return prev
                })
                setLoading(false)
            }
            catch(error){
                console.log("error in fetching problems",error)
                setError(error)
                setLoading(false)
            }
        })()}
    },[skip])

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

    console.log({data})

    return (
        <div className="h-screen w-full flex flex-col bg-[#1a1f26] text-white overflow-hidden">
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
        
        <div className="flex justify-center pt-20 overflow-y-auto" onScroll={(e)=>{
            const clientHeight=e.target.clientHeight;
            const scrollTop=e.target.scrollTop;
            const scrollHeight=e.target.scrollHeight;
            if(scrollHeight==clientHeight+scrollTop){
                setSkip((previousSkip)=>previousSkip+10)
            }
        }}>
            <div className={`grid justify-center p-4 w-[70%]`}>

                {typeof data!="object" ? data : data?.map((problem)=>{
                    console.log(problem)
                    
                    return (<Link to={`/problem/${problem.slug}`} key={problem._id} className="flex w-full  hover:bg-white/5 h-fit justify-between p-8 mt-1 mb-2 transition">
                            <span className="mr-60">{problem.title}</span>
                            <span className="bg-blue-500 text-white rounded-3xl p-1">{problem.difficulty}</span>
                        </Link>)
                } )}

                {
                    loading &&  <div class="flex items-center justify-center space-x-2">
                                    <div class="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                                    <div class="w-4 h-4 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]"></div>
                                    <div class="w-4 h-4 rounded-full bg-accent animate-bounce"></div>
                                </div>
                }
                
                {endReached && <p>You Have Reached The End</p>}
            </div>
        </div>
        </div>
    )
}