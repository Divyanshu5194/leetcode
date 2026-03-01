import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { axiosClient } from "../utils/axiosClient"
import { useSelector } from "react-redux"

export default function ProblemPage(){

    const {languageArray}=useSelector((state)=>state.auth)
    const {slug}=useParams()
    const [problem,setProblem]=useState(null)
    const [error,setError]=useState(null)
    const [loading,setLoading]=useState(true)
    const [value,setValue]=useState("")
    const [language,setLanguage]=useState("select a language")

    const [runResponse,setRunResponse]=useState(null)
    const [runLoading,setRunLoading]=useState(false)
    const [runError,setRunError]=useState(null)

    console.log({languageArray})

    useEffect(()=>{
            (async ()=>{
            try{
                const response=await axiosClient.get(`/Problems/${slug}`)
                setProblem(response.data.data)
                setLoading(false)
            }
            catch(error){
                console.log({ERROR_IN_RUNNING_CODE:error})
                setError(error)
                setLoading(false)
            }
        })()
    },[slug])

    async function handleRun(){
        setRunError(null)
        setRunLoading(true)
        console.log("handle run runned")
        
        try{
            const data={
                slug:slug,
                solution:{
                    language:language,
                    code:value
                }
            }
            console.log({DATA_SUBMITTED_TO_RUN:data})
            const response=await axiosClient.post("/run",data)
            setRunLoading(false)
            setRunResponse(response.data)
            console.log({runError,runLoading,runResponse})
        }
        catch(error){
            setRunError(error.response.data)
            setRunLoading(false)
            console.log({runError,runLoading,runResponse})
            
        }
    }

    if(error){
        return (
            <>
            <p>Error Occured</p>
            </>
        )
    }
    if (loading){
        return (
            <>
            <div>Data Is Loading...</div>
            </>
        )
    }
    console.log({runError})
    return (
        <>
            <h2>{problem.title}</h2>
            <div>
                <span>{problem.tags.map((tag)=><span className="bg-">{`${tag} `}</span>)}</span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <p>
                {problem.statement}
            </p>

            <div>
                <h3>Constratins</h3>
                {problem.constraints.map((constraint)=><p>{constraint}</p>)}
            </div>

            <div>
                <h3 className="text-bold">Follow Up Questions</h3>
                {
                    problem.followUpQuestions.map((followUp)=><><p>{followUp}</p><br></br></>)
                }
            </div>


            <div>

                <select
                    className="select select-bordered w-full max-w-xs" value={language} onChange={(e) => setLanguage(e.target.value)}>
                        {
                            languageArray.map((language)=><option key={language.id}>{language.name}</option>)
                        }
                    </select>
            </div>


            <div>
                <p>Code</p>
                <p>To initialize a project, use the <textarea onChange={(e)=>{setValue(e.target.value)}} value={value}></textarea> command.</p>
            </div>





            <div>
                <button className="btn btn-accent" onClick={async ()=>{await handleRun()}} >Run</button>
                <button className="btn btn-accent">Submit</button>
            </div>


            {runLoading && <p className="text-red-500">running your code</p>}
            {runError && <p className="text-red-500">{runError.data}</p>}
        </>
    )
}