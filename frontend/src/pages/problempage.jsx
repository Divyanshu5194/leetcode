import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { axiosClient } from "../utils/axiosClient"
import { useSelector } from "react-redux"
import LanguageSelectorFeild from "../components/LanguageSelector"
import Editor from "@monaco-editor/react";
import { languages } from "monaco-editor"

export default function ProblemPage(){

    const {languageArray}=useSelector((state)=>state.auth)
    const {slug}=useParams()
    const [problem,setProblem]=useState(null)
    const [error,setError]=useState(null)
    const [loading,setLoading]=useState(true)
    const [userCode,setUserCode]=useState("")
    const [language,setLanguage]=useState(null)
    const [codeEditorTheme,setCodeEditorTheme]=useState("vs-dark")
    const [runResponse,setRunResponse]=useState(null)
    const [runLoading,setRunLoading]=useState(false)
    const [runError,setRunError]=useState(null)

    console.log({languageArray})

    

    useEffect(()=>{
        if(languageArray){
            setLanguage(languageArray[0])
            const languageMap=[]

            languageArray.forEach((languageObj)=>{
                const Id=languageObj.id
                const language=languageObj.name
                const languageName=language.split(" ")[0]
                const [_,...vArray]=language.split(" ")
                let version=""
                vArray.forEach((v,index)=>{if(index==0)return version+=v;return version+=` ${v}`})
                console.log({languageName,version})
                const existingLanguage=languageMap.find((language)=>language.name==languageName)
                if(version){    if (!languageMap.includes(languageName) || existingLanguage.name.replace(languageName,"")<version){
                        const name=languageName+" "+version;
                        console.log({languageMapGoing:{id:Number(Id),name}})
                        languageMap.push({id:Number(Id),name})
                    }}
            })
            console.log({languageMap})
        }
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
                <span>{problem.tags.map((tag,index)=><span className="bg-" key={index+373}>{`${tag} `}</span>)}</span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <p>
                {problem.statement}
            </p>

            <div>
                <h3>Constratins</h3>
                {problem.constraints.map((constraint,index)=><p key={index+89754}>{constraint}</p>)}
            </div>

            <div>
                <h3 className="text-bold">Follow Up Questions</h3>
                {
                    problem.followUpQuestions.map((followUp,index)=><div key={index+98}><p>{followUp}</p><br></br></div>)
                }
            </div>


            <LanguageSelectorFeild language={language} setLanguage={setLanguage}></LanguageSelectorFeild>


            {/* <div style={{ height: "500px", border: "1px solid #ccc" }}>
                <Editor
                options={{
                    fontSize: 20,
                    padding: { top: 16, bottom: 16 },
                }}
                height="30vh"
                width="60vw"
                theme={codeEditorTheme} // now a valid theme ("vs", "vs-dark", "hc-black")
                language={language.split(" ")[0] || "cpp"} // fallback to plaintext if unknown
                value={userCode}
                onChange={(value) => setUserCode(value)}
                />
            </div> */}





            <div>
                <button className="btn btn-accent" onClick={async ()=>{await handleRun()}} >Run</button>
                <button className="btn btn-accent">Submit</button>
            </div>


            {runLoading && <p className="text-red-500">running your code</p>}
            {runError && <p className="text-red-500">{runError.error}</p>}
            {runResponse && <p className="text-red-500">{runResponse.data}</p>}
        </>
    )
}