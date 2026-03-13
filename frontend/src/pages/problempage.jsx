import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { axiosClient } from "../utils/axiosClient"
import { useSelector } from "react-redux"
import LanguageSelectorFeild from "../components/LanguageSelector"
import Editor from "@monaco-editor/react";
import { languages } from "monaco-editor"
import monacoLanguageMap from "../utils/constants"
import Popup from "../components/Popup"

export default function ProblemPage(){
    const monacoMap=monacoLanguageMap

    const {languageArray,user}=useSelector((state)=>state.auth)
    const [visible,setVisible]=useState(true)
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
    const [activeTab,setActiveTab]=useState("Description")
    const [submissions,setSubmissions]=useState([])
    const [submissionsLoading,setSubmissionLoading]=useState(false)
    const [submissionsError,setSubmissionError]=useState(null)

    // console.log({submissions})

    

    useEffect(()=>{
        if(languageArray){
            setLanguage(languageArray[5].name.split(" ")[0])

            console.log({minimisedArray:getLatestLanguages(languageArray)})
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
      setVisible(true)
        setRunError(null)
        setRunLoading(true)
        console.log("handle run runned")
        
        try{
            const languageNameToSearch=language
            const codeLanguage=languageArray.find((language)=>{
                console.log({language})
                return language.name.split(" ")[0]==languageNameToSearch
            })
            const data={
                slug:slug,
                solution:{
                    language:codeLanguage.name,
                    code:userCode
                }
            }
            console.log({DATA_SUBMITTED_TO_RUN:data})
            const response=await axiosClient.post("/run",data)
            setRunLoading(false)
            setRunResponse(response?.data)
            console.log({runError,runLoading,runResponse})
        }
        catch(error){
            console.log({RUN_CODE_ERROR:error})
            setRunError(error?.response?.data)
            setRunLoading(false)
            console.log({runError,runLoading,runResponse})
            
        }
    }

    async function fetchSubmissions(problemId){
      try{
        setSubmissionLoading(true)
        const res=await axiosClient.get(`problems/getsubmissions/${problemId}`)

        const submissionArr=res?.data?.data
        setSubmissions(submissionArr)
        setSubmissionLoading(false)
        console.log({res,submissionArr,submissions})
      }
      catch(error){
        setSubmissionLoading(false)
        setSubmissionError(error?.response?.error)
      }
    }


    async function handleSubmit(){
      setVisible(true)
        setRunError(null)
        setRunLoading(true)
        console.log("handle run runned")
        
        try{
            const languageNameToSearch=language
            const codeLanguage=languageArray.find((language)=>{
                console.log({language})
                return language.name.split(" ")[0]==languageNameToSearch
            })
            const data={
                slug:slug,
                solution:{
                    language:codeLanguage.name,
                    code:userCode
                }
            }
            console.log({DATA_SUBMITTED_TO_RUN:data})
            const response=await axiosClient.post("/submit",data)
            setRunLoading(false)
            setRunResponse(response?.data)
            console.log("problem submitted sucessfully")
        }
        catch(error){
            console.log({RUN_CODE_ERROR:error})
            setRunError(error?.response?.data)
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
    return (
        <div className="flex flex-col h-screen bg-base-300 font-sans text-base-content">
      
      {/* TOP GLOBAL NAVBAR */}
      <div className="navbar bg-base-100 border-b border-base-content/10 px-4 min-h-[4rem]">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl font-bold tracking-tight">
            
          </a>
        </div>
        <div className="flex-none gap-3">
          <div 
            className={`btn btn-outline btn-sm md:btn-md ${runLoading ? 'loading' : ''}`}
            onClick={handleRun}
          >
            {/* {runError && <Popup message={runError.error} sucessflag={false} visible={visible} setVisible={setVisible}></Popup>}
            {runLoading && <Popup message={"Running Code"} sucessflag={true} visible={visible} setVisible={setVisible}></Popup>}
            {runResponse && <Popup message={runResponse.msg} sucessflag={true} visible={visible} setVisible={setVisible}></Popup>} */}
            {/* {!runLoading && 'Run'} */}
          </div>
          <button className="btn btn-primary btn-sm md:btn-md shadow-lg shadow-primary/20" onClick={handleSubmit}>
            Submit
          </button>
            <div className="bg-neutral text-neutral-content p-2 ml-3 w-min">
              {user?.username}
            </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANE: Description */}
        <div className="w-1/2 flex flex-col bg-base-200 border-r border-base-content/5">
          {/* Sub-Nav */}
          <div className="tabs tabs-boxed bg-transparent p-2 gap-2">
            <button className={`tab tab- ${activeTab == "Description" ? "tab-active" : ""}`} onClick={(e)=>{setActiveTab(e.target.innerHTML)}}>Description</button>
            <button className={`tab tab- ${activeTab == "Editorial" ? "tab-active" : ""}`} onClick={(e)=>{setActiveTab(e.target.innerHTML)}}>Editorial</button>
            <button className={`tab tab- ${activeTab == "Solutions" ? "tab-active" : ""}`} onClick={(e)=>{setActiveTab(e.target.innerHTML)}}>Solutions</button>
            <button className={`tab tab- ${activeTab == "Submissions" ? "tab-active" : ""}`} onClick={async (e)=>{setActiveTab(e.target.innerHTML);await fetchSubmissions(problem._id)}}>Submissions</button>
          </div>

         {
          (activeTab=="Description" &&  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* Title & Badge Row */}
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-3xl font-extrabold">{problem.title}</h1>
              <div className="badge badge-success badge-outline font-semibold">Easy</div>
              {problem.tags.map((tag, i) => (
                <div key={i} className="badge badge-secondary badge-ghost">{tag}</div>
              ))}
              {
                activeTab=="Submissions" && submissions.map((submissison))
              }
            </div>

            <article className="prose prose-sm lg:prose-base text-base-content/80 mb-10">
              <p>{problem.statement}</p>
            </article>

            {/* Examples with DaisyUI Cards */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Examples
              </h3>
              
              {/* Example 1 */}
              <div className="card bg-base-100 shadow-sm border border-base-content/5">
                <div className="card-body p-5 font-mono text-sm">
                  <span className="card-title text-sm opacity-60">Example 1</span>
                  <div className="mt-2 space-y-1">
                    <p><span className="text-primary">Input:</span> 2, 3</p>
                    <p><span className="text-secondary">Output:</span> 5</p>
                    <p className="italic text-base-content/50">Explanation: 2 + 3 equals 5.</p>
                  </div>
                </div>
              </div>

              {/* Constraints Section */}
              <div className="mt-10">
                <h3 className="text-lg font-bold mb-4 italic">Constraints:</h3>
                <ul className="list-none space-y-2">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm opacity-70">
                      <span className="text-primary">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>)
         }
         {activeTab == "Submissions" && submissions.map((submission)=><li><div className="flex justify-between"><span>{submission.language.split(" ")[0]}</span><span>{submission.code}</span><span>{submission.testCasesPassed}</span><span>{submission.timeForExecution}</span><span>{submission.status}</span></div></li>)} 
        </div>

        {/* RIGHT PANE: Code Editor */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          {/* Editor Controls */}
          <div className="flex justify-between items-center px-4 py-2 bg-base-100 border-b border-base-content/10">
            <div className="flex gap-1">
               {/* Language Selector could be a DaisyUI Select or Toggle Group */}
               <LanguageSelectorFeild language={language} setLanguage={setLanguage}></LanguageSelectorFeild>
            </div>
            <div className="badge badge-ghost badge-sm opacity-50 font-mono">UTF-8</div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative">
            <Editor
              options={{
                fontSize: 15,
                padding: { top: 20 },
                minimap: { enabled: false },
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                theme: "vs-dark"
              }}
              height="100%"
              width="100%"
              language={monacoMap[language] || "cpp"}
              value={userCode}
              onChange={(value) => setUserCode(value)}
            />
          </div>
        </div>

      </div>
    </div>
    )
}


//const languageMap=[]

            // languageArray.forEach((languageObj)=>{
            //     const Id=languageObj.id
            //     const language=languageObj.name
            //     const languageName=language.split(" ")[0]
            //     const [_,...vArray]=language.split(" ")
            //     let version=""
            //     const versionNumber=vArray.find((vrsn)=>Number(vrsn)==vrsn)
            //     vArray.forEach((v,index)=>{if(index==0)return version+=v;return version+=` ${v}`})
            //     console.log({languageName,version})
            //     const existingLanguage=languageMap.find((language)=>language.name==languageName)
            //     const [__,...versionArray]=language?.name?.split(" ") 
            //     const versionOfLanguage=versionArray?.find((vrsn)=>Number(vrsn)==vrsn)
            //     vArray.forEach((v,index)=>{if(index==0)return version+=v;return version+=` ${v}`})
            //     if(version){    if (!existingLanguage || versionOfLanguage<versionNumber){
            //             const name=languageName+" "+version;
            //             console.log({languageMapGoing:{id:Number(Id),name}})
            //             languageMap.push({id:Number(Id),name})
            //         }}
            // })
            // console.log({languageMap})

            function getLatestLanguages(languageArray) {
  // Helper: compare dotted version strings (e.g., "18.1.8" vs "19.1.7")
  const versionCompare = (a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aNum = aParts[i] || 0;
      const bNum = bParts[i] || 0;
      if (aNum > bNum) return 1;
      if (aNum < bNum) return -1;
    }
    return 0;
  };

  const latestMap = new Map();

  for (const item of languageArray) {
    // Extract base name and version from the item.name
    // Looks for a version number (digits and dots) at the very end, possibly inside parentheses
    const match = item.name.match(/(.+?)\s*([\d.]+)\)?$/);
    
    let base, version;
    if (match) {
      base = match[1].trim();   // e.g., "C (Clang", "Python (", "Java (JDK"
      version = match[2];       // e.g., "18.1.8", "3.14.0", "17.0.6"
    } else {
      // No version found – keep the whole name as base (e.g., "Executable", "Plain Text")
      base = item.name;
      version = "0";
    }

    const existing = latestMap.get(base);
    if (!existing || versionCompare(version, existing.version) > 0) {
      latestMap.set(base, { item, version });
    }
  }

  // Return only the original item objects, in the order they first appear
  return Array.from(latestMap.values()).map(entry => entry.item);
}